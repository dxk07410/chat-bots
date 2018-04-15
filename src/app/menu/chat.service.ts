import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

import {ApiAiClient} from 'api-ai-javascript';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {ApiChatClinetService} from './apichatclient';
import {
  Http,
  Headers,
  Response
} from '@angular/http';

import 'rxjs/add/observable/from'
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/map'
import {forEach} from "@angular/router/src/utils/collection";


// Message class for displaying messages in the component
export class Message {

  
  constructor(public content: string, public sentBy: string, public date:String) {
    if(null == this.date || '' == this.date){
      this.date = new Date().toLocaleDateString()+" "+ new Date().toLocaleTimeString();
    }
    
    
  }
}

@Injectable()
export class ChatService {

  readonly token = environment.dialogflow.angularBot;
  readonly client = new ApiAiClient({accessToken: this.token});

  conversation ;

  public chatId;
  private nameCount: any;
  private validateEmailIdCount: any;
  private emailSendCount: any;
  private username: string;
  private emailAddress: string;
  private emailAddressAlreadyExistCount :any ;
  private botResponseAfterSuccessfulEmailId : string;
  

  //private http: Http;

  constructor(private noderestclient: ApiChatClinetService) {
    this.nameCount = 0;
    this.validateEmailIdCount = 0;
    this.emailSendCount = 0;
    this.emailAddressAlreadyExistCount = 0;
    this.conversation = new BehaviorSubject<Message[]>([]);
    

  }

  // Sends and receives messages via DialogFlow
  sendOrRecieveMessages(msg: string) {
    //console.log('converse');
    const userMessage = new Message(msg, 'user',"");
    this.addMessageToChatWindow(userMessage);  // adds user response to chat window.
    
    //if user enter valid email , store it in a variable emailAddress
    if (userMessage.sentBy == 'user' && this.validateEmailIdCount == 1) {
      //this.validateEmailIdCount = 0;
      this.emailAddress = msg;

    }

    //if email id already exit and user says yes , get chat history.
    if(userMessage.sentBy == 'user' && this.emailAddressAlreadyExistCount == 1 && msg.toUpperCase() == 'YES'){
        this.emailAddressAlreadyExistCount = 0;
        this.getChatHistory();
        return ;
    }

    //if email id already exit and user says no , do not fetch chat histroy.
    if(userMessage.sentBy == 'user' && this.emailAddressAlreadyExistCount == 1 && msg.toUpperCase() == 'NO'){
      this.emailAddressAlreadyExistCount = 0;
      msg = this.emailAddress;
    }

    //call dialog flow method with user response  and recieve response from DF
    // and call method addMessageToChatWindow to append response to chat widnow.
    return this.client.textRequest(msg) //  textRequest is dialouge flow method
      .then(res => {
        const speech = res.result.fulfillment.speech;

        var botMsg = speech.substr(0,24);
        if(botMsg == "Thank you for your email" && this.validateEmailIdCount == 1){
          this.validateEmailIdCount = 0 ;
          this.verfiyEmailExisitOrNot(this.username, this.emailAddress);
          //const botMessage = new Message(speech, 'bot');
          //this.addMessageToChatWindow(botMessage);
          this.botResponseAfterSuccessfulEmailId = "I can assist you with below options :select any one from below options :1)Admissions Eligibility " +
                                                    " 2) Scholarships 3)Cost of Attending 4)Housing and dining information";
          return ;
        }
        const botMessage = new Message(speech, 'bot',"");
        this.addMessageToChatWindow(botMessage);
      });
  }

  verfiyEmailExisitOrNot(username, emailAddress) {
       this.noderestclient.get('http://localhost:3000/chat?username='+ username + '&emailAddress=' +emailAddress)
      .subscribe(
        (resp) => {
          console.log(resp);
          let result = JSON.stringify(resp)
          let body = JSON.parse(result)._body; 
          let parsedBody = JSON.parse(body)
          if(parsedBody.length > 0 ){
            this.chatId = parsedBody[0].chat_id || null;
          }
          if (null != this.chatId) {
            const userMessage = new Message("This email id already exist. Do you want to see your previous chat history.", 'bot',"");
            return this.addMessageToChatWindow(userMessage);
          } else {
              return this.createchat(username,emailAddress);
          }
        },
        (err) => console.log(err)
      )
  }

  createchat(username,emailAddress){
    var params = {
      username : username,
      email : emailAddress
    }
    this.noderestclient.post('http://localhost:3000/chat/', params)
      .subscribe(
        (resp) => {
          console.log(resp);
          this.chatId = JSON.parse(JSON.stringify(resp))._body;
           return this.client.textRequest(emailAddress) //  textRequest is dialouge flow method
          .then(res => {
            const speech = res.result.fulfillment.speech;
            const botMessage = new Message(speech, 'bot',"");
            this.addMessageToChatWindow(botMessage);
          });
    
        },
        (err) => console.log(err)
      );
  }


  // Adds message to source
  addMessageToChatWindow(msg: Message) {
    //console.log('in update');
    //this is responsible to dislay messages in chat window.
    this.conversation.next([msg]);

    //when bot ask user to enter name
    if (msg.sentBy == 'bot' && msg.content == 'Hello , May i know your name please ?') {
      this.nameCount = 1;
      return;
    }
    //when user enter name , store name in username variable.
    if (msg.sentBy == 'user' && this.nameCount == 1) {
      this.nameCount = 0;
      this.username = msg.content;
      console.log("chat table entry" + this.username);

      //this.chatId = 12; // harcoded for now
    }
    // when bot ask user to enter email address
    if (msg.sentBy == 'bot' && msg.content == 'Please enter your Email address') {

      this.validateEmailIdCount = 1;

    }

    if (null != this.chatId) {
        this.sendMessage(msg); // insert messages into db
    }

    if(msg.sentBy == 'bot' && msg.content == 'This email id already exist. Do you want to see your previous chat history.'){
        this.emailAddressAlreadyExistCount = 1;
    }
    
  }
  
  getChatHistory(){
    this.noderestclient.get('http://localhost:3000/chat/message/'+this.chatId)
        .subscribe(
          (res) => {
            var body = JSON.parse(JSON.stringify(res))._body;
            var messages = JSON.parse(body);
           for(var i = 0 ; i < messages.length ; i++){
              var sender = 'bot';
              if(messages[i].sender_name != 'bot'){
                sender = 'user'
              }
            var date = new Date(messages[i].created_date).toLocaleDateString() + " " + new Date(messages[i].created_date).toLocaleTimeString();
              const userMessage = new Message(messages[i].message, sender,date);
              this.conversation.next([userMessage]);
            } 
            console.log(res);
            const botMessage = new Message(this.botResponseAfterSuccessfulEmailId, 'bot',"");
            this.addMessageToChatWindow(botMessage);
          },
          (err) => console.log(err)
        );
  }

  sendMessage(msg){
    // insert messges in to chat_message table
    let params = {
      chatId: this.chatId,
      sender: msg.sentBy,
      message: msg.content
    }


    if (msg.sentBy == 'user') {
      params.sender = this.username || msg.sentBy;
    }
    console.log("Message send = " + JSON.stringify(params));
    this.noderestclient.post('http://localhost:3000/chat/message/', params)
      .subscribe(
        (res) => {
          console.log(res);
        },
        (err) => console.log(err)
      );
    this.verfiyAndSendMail(msg, this.chatId, this.emailSendCount);
  }

  verfiyAndSendMail(msg, chatId, emailSendCount) {

    if (msg.sentBy == 'bot' && msg.content == 'Do you want to send this conversation on your email ? => YES/NO') {

      this.emailSendCount = 1;
    }

    if (this.emailSendCount == 1 && msg.sentBy == 'user' && msg.content.toUpperCase() == "YES") {
      this.emailSendCount = 0;
      let params = {
        chatId: chatId
        //emailId: this.emailAddress
      }
      console.log("Email send = " + JSON.stringify(params));
      this.noderestclient.post('http://localhost:3000/chat/sendmail', params)
        .subscribe(
          (res) => {
            console.log(res);
          },
          (err) => console.log(err)
        );

    }

  }

}
