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


// Message class for displaying messages in the component
export class Message {
  constructor(public content: string, public sentBy: string) {
  }
}

@Injectable()
export class ChatService {

  readonly token = environment.dialogflow.angularBot;
  readonly client = new ApiAiClient({accessToken: this.token});

  conversation = new BehaviorSubject<Message[]>([]);

  public chatId;
  private nameCount: any;
  private validateEmailIdCount: any;
  private emailSendCount: any;
  private username: string;
  private emailAddress: string;
  private emailAddressAlreadyExistCount :any ;

  //private http: Http;

  constructor(private noderestclient: ApiChatClinetService) {
    this.nameCount = 0;
    this.validateEmailIdCount = 0;
    this.emailSendCount = 0;
    this.emailAddressAlreadyExistCount = 0;
    // this.noderestclient = new ApiChatClinetService(this.http);
  }

  // Sends and receives messages via DialogFlow
  converse(msg: string) {
    //console.log('converse');
    const userMessage = new Message(msg, 'user');
    this.addMessageToChatWindow(userMessage);
    if (userMessage.sentBy == 'user' && this.validateEmailIdCount == 1) {
      this.validateEmailIdCount = 0;
      this.emailAddress = userMessage.content;
      this.verfiyEmailExisitOrNot(userMessage, this.emailAddress);
      return ;
    }

    return this.client.textRequest(msg) //  textRequest is dialouge flow method
      .then(res => {
        const speech = res.result.fulfillment.speech;
        const botMessage = new Message(speech, 'bot');
        this.addMessageToChatWindow(botMessage);
      });
  }

  verfiyEmailExisitOrNot(username, emailAddress) {

    return this.noderestclient.get('http://localhost:3000/chat/' + this.username + '/' + this.emailAddress)
      .subscribe(
        (resp) => {
          console.log(resp);
          this.chatId = resp;
          if (null != this.chatId) {
            const userMessage = new Message("This email id already exist. Do you want to see your previous chat history.", 'bot');
            return this.addMessageToChatWindow(userMessage);
          } else {
              return this.createchat(username,emailAddress);
          }
        },
        (err) => console.log(err)
      )
  }

  createchat(username,emailAddress){
    let params = {
      username : username,
      emailAddress : emailAddress
    }
    this.noderestclient.post('http://localhost:3000/chat/', params)
      .subscribe(
        (resp) => {
          console.log(resp);
          this.chatId = resp;
          return resp;
        },
        (err) => console.log(err)
      );
  }


  // Adds message to source
  addMessageToChatWindow(msg: Message) {
    //console.log('in update');
    this.conversation.next([msg]);

    //let count = 0;
    if (msg.sentBy == 'bot' && msg.content == 'Hello , May i know your name please ?') {
      this.nameCount = 1;
      return;
    }
    if (msg.sentBy == 'user' && this.nameCount == 1) {
      this.nameCount = 0;
      this.username = msg.content;
      console.log("chat table entry" + this.username);

      //this.chatId = 12; // harcoded for now
    }

    if (msg.sentBy == 'bot' && msg.content == 'Please, enter your email address.') {

      this.validateEmailIdCount = 1;

    }

    if (null != this.chatId) {
        this.sendMessage(msg);
    }

    if(msg.sentBy == 'bot' && msg.content == 'This email id already exist. Do you want to see your previous chat history.'){
        this.emailAddressAlreadyExistCount = 1;
    }

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

    if (this.emailSendCount == 1 && msg.sentBy == 'user' && msg.content == "YES") {
      this.emailSendCount = 0;
      let params = {
        chatId: chatId,
        emailId: this.emailAddress
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
