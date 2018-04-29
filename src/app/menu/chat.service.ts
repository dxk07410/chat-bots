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
import * as EmailValidator from 'email-validator';


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
  private adminEmailMessages : string[];
  private previousBotQuestion: string ;
  private secondChanceForToEnterEmail:any = 0;
  private allowedtoEnterForSecondTime:any  = 0;
  private emailIdList: string[];
  private emailAddressExistInList: any = 0;
  private askUserToEnterEmailIdFromList: any = 0;
  private newEmailId: string ;
  private updateEmailIdCount: any = 0;
  private firstEmailId: string ;
  private registerdEmailIdCount: any = 0;
  private isThisFirstTimeChating: any = 0;
  private firstTimechating : boolean = true;
  //private http: Http;

  constructor(private noderestclient: ApiChatClinetService) {
    this.nameCount = 0;
    this.validateEmailIdCount = 0;
    this.emailSendCount = 0;
    this.emailAddressAlreadyExistCount = 0;
    this.conversation = new BehaviorSubject<Message[]>([]);
    this.adminEmailMessages = [];
    this.previousBotQuestion = "";
  
  }

 // Sends and receives messages via DialogFlow
 sendOrRecieveMessages(msg: string) {
  //console.log('converse');
  const userMessage = new Message(msg, 'user', "");
  if (userMessage.sentBy == 'user' && (this.validateEmailIdCount == 1) || this.askUserToEnterEmailIdFromList == 1) {

    //replace at by @
    if(msg.includes(" at ")){
      msg = msg.replace(" at ","@");
    }

    // replace at the rate by @
    if(msg.includes(" at the rate ")){
      msg = msg.replace(" at the rate ","@");
    }

    var concatEmail = "";
    var msgArray = msg.split("");
    for (var i = 0; i < msgArray.length; i++) {
      if (msgArray[i] != " ") {
        concatEmail = concatEmail + msg[i];
      }
    }
    //this.emailAddress = concatEmail;
    const userMessage = new Message(concatEmail, 'user', "");
    this.addMessageToChatWindow(userMessage);
    msg = concatEmail;
  }else{
    this.addMessageToChatWindow(userMessage);
  }
   // adds user response to chat window.

  //if user enter valid email , store it in a variable emailAddress
  if (userMessage.sentBy == 'user' && this.validateEmailIdCount == 1 && this.secondChanceForToEnterEmail == 0) {
    //this.validateEmailIdCount = 0;
    //check for last 3 char as com only
    //make array list of email exensions look for extentions.
   // var extractLastThreeCharFromEmail =  this.emailAddress.substr( this.emailAddress.length - 3,  this.emailAddress.length);
    

    if (!EmailValidator.validate(msg)) {
      const userMessage = new Message("Invalid Email Id, please enter again", 'bot', "");
      this.addMessageToChatWindow(userMessage);  // adds user response to chat window.
      return ;
    }
    if(this.allowedtoEnterForSecondTime == 0){
      this.secondChanceForToEnterEmail  = 1;
      this.firstEmailId = msg;
    }
    //2nd chance for email
    if(this.secondChanceForToEnterEmail  == 1){
      this.secondChanceForToEnterEmail = 0;
      this.allowedtoEnterForSecondTime = 1;
      const userMessage = new Message("Please enter email id again for verification", 'bot', "");
      this.addMessageToChatWindow(userMessage);
      return;
    }
    this.emailAddress = msg;
  }

  if(null != this.firstEmailId && ''!= this.firstEmailId && this.firstEmailId != msg){
     this.allowedtoEnterForSecondTime = 0;
    // this.secondChanceForToEnterEmail  = 1;
     const userMessage = new Message("Email id you entered does not match.Please enter your email id again", 'bot', "");
     this.addMessageToChatWindow(userMessage);
     return ;
   }else{
    this.firstEmailId = null;
   }

  if(this.emailAddressExistInList == 1 && userMessage.sentBy == 'user' && msg.toUpperCase() == 'YES'){
      this.emailAddressExistInList = 0;
      const userMessage = new Message("Please enter email id from list.", 'bot', "");
      this.addMessageToChatWindow(userMessage);
      return;
  }else if(this.emailAddressExistInList == 1 && userMessage.sentBy == 'user' && msg.toUpperCase() == 'NO'){
    this.emailAddressExistInList = 0;
    this.updateEmailIdCount = 0;
    const userMessage = new Message( "Do you want to register new entered email id?" , 'bot', "");
    this.addMessageToChatWindow(userMessage);
    return ;
  }else if(this.emailAddressExistInList == 1 && userMessage.sentBy == 'user' && (msg.toUpperCase() != 'YES' || msg.toUpperCase() != 'NO')){
    const userMessage = new Message("Please enter either YES/NO.", 'bot', "");
    this.addMessageToChatWindow(userMessage);
    return ;
  }
  var emailCountExit = 0;
  if(this.askUserToEnterEmailIdFromList == 1 && userMessage.sentBy == 'user' ){
    for(var i = 0 ; i < this.emailIdList.length ; i++){
      if(msg == this.emailIdList[i]){
        emailCountExit++;
      }
    }
    if(emailCountExit <= 0){
      emailCountExit = 0;
      const userMessage = new Message("Please enter valid email id from above list", 'bot', "");
      this.addMessageToChatWindow(userMessage);
      return ;
    }

    this.askUserToEnterEmailIdFromList = 0;
    this.newEmailId = msg ;
    const userMessage = new Message("Do you want to update "+this.newEmailId+ " by new emailid "+this.emailAddress, 'bot', "");
    this.addMessageToChatWindow(userMessage);
    return ;
  }

  if(this.updateEmailIdCount == 1 && userMessage.sentBy == 'user' && msg.toUpperCase() =='YES'){
      this.updateEmailIdCount = 0;
      this.updateEmailId(this.newEmailId,this.emailAddress);
      this.botResponseAfterSuccessfulEmailId = "We have updated your email id. I can assist you with below options :select any one from below options :1)Admissions Eligibility " +
      " 2) Scholarships 3)Cost of Attending 4)Housing and dining information";
      const userMessage = new Message( this.botResponseAfterSuccessfulEmailId , 'bot', "");
      this.addMessageToChatWindow(userMessage);
      return ;
  }else if(this.updateEmailIdCount == 1 && userMessage.sentBy == 'user' && msg.toUpperCase() =='NO'){
    this.updateEmailIdCount = 0;
    this.botResponseAfterSuccessfulEmailId = "I can assist you with below options :select any one from below options :1)Admissions Eligibility " +
    " 2) Scholarships 3)Cost of Attending 4)Housing and dining information";
    const userMessage = new Message( this.botResponseAfterSuccessfulEmailId , 'bot', "");
    this.addMessageToChatWindow(userMessage);
    return ;
  }else if(this.updateEmailIdCount == 1 && userMessage.sentBy == 'user' && (msg.toUpperCase() != 'YES' || msg.toUpperCase() != 'NO')){
    const userMessage = new Message("Please enter either YES/NO.", 'bot', "");
    this.addMessageToChatWindow(userMessage);
    return ;
  }

  if(this.registerdEmailIdCount == 1 && userMessage.sentBy == 'user' && msg.toUpperCase() == 'YES' ){
    this.registerdEmailIdCount = 0; 
    this.createchat_noCondition(this.username, this.emailAddress);
      this.botResponseAfterSuccessfulEmailId = "Thank you for registration. I can assist you with below options :select any one from below options :1)Admissions Eligibility " +
      " 2) Scholarships 3)Cost of Attending 4)Housing and dining information";
      const userMessage = new Message( this.botResponseAfterSuccessfulEmailId , 'bot', "");
      this.addMessageToChatWindow(userMessage);
      return ;
  }else if(this.registerdEmailIdCount == 1 && userMessage.sentBy == 'user' && msg.toUpperCase() == 'NO'){
    this.registerdEmailIdCount = 0;
    this.botResponseAfterSuccessfulEmailId = "We are unable to process your request at the moment. Please contact admin at deek.khadsare@gmail.com for further queries. Thank you for chating with me.";
    const userMessage = new Message( this.botResponseAfterSuccessfulEmailId , 'bot', "");
    this.addMessageToChatWindow(userMessage);
    return ;
  }else if(this.registerdEmailIdCount == 1 && userMessage.sentBy == 'user' && (msg.toUpperCase() != 'YES' || msg.toUpperCase() != 'NO')){
     // this.registerdEmailIdCount = 0;
      const userMessage = new Message("Please enter either YES/NO.", 'bot', "");
      this.addMessageToChatWindow(userMessage);
      return ;
  }

  //if email id already exit and user says yes , get chat history.
  if(userMessage.sentBy == 'user' && this.emailAddressAlreadyExistCount == 1 && msg.toUpperCase() == 'YES') {
    this.emailAddressAlreadyExistCount = 0;
    this.getChatHistory();
    return;
  }

  //if email id already exit and user says no , do not fetch chat histroy.
  if (userMessage.sentBy == 'user' && this.emailAddressAlreadyExistCount == 1 && msg.toUpperCase() == 'NO') {
    this.emailAddressAlreadyExistCount = 0;
    msg = this.emailAddress;
  }

  if(this.isThisFirstTimeChating == 1 && userMessage.sentBy == 'user' && msg.toUpperCase() == 'NO'){
     this.firstTimechating = false;
  }

  //call dialog flow method with user response  and recieve response from DF
  // and call method addMessageToChatWindow to append response to chat widnow.
  return this.client.textRequest(msg) //  textRequest is dialouge flow method
    .then(res => {
      const speech = res.result.fulfillment.speech;
      console.log(speech);
      var botMsg = speech.substr(0, 24);
      if (botMsg == "Thank you for your email" && this.validateEmailIdCount == 1) {
        this.validateEmailIdCount = 0;
        this.verfiyEmailExisitOrNot(this.username, this.emailAddress);
        //const botMessage = new Message(speech, 'bot');
        //this.addMessageToChatWindow(botMessage);
        this.botResponseAfterSuccessfulEmailId = "I can assist you with below options :select any one from below options :1)Admissions Eligibility " +
          " 2) Scholarships 3)Cost of Attending 4)Housing and dining information";
        return;
      }
      const botMessage = new Message(speech, 'bot', "");
      this.addMessageToChatWindow(botMessage);
    });
}

updateEmailId(previousEmailId,newEmailId){
  var params = {
    preemailid : previousEmailId,
    newemailid : newEmailId
  }
  this.noderestclient.post('http://localhost:3000/chat/updateemail', params)
    .subscribe(
      (resp) => {
        console.log(resp);
        this.chatId = JSON.parse(JSON.stringify(resp))._body;
        // return this.client.textRequest(newEmailId) //  textRequest is dialouge flow method
       // .then(res => {
        //  const speech = res.result.fulfillment.speech;
        //  const botMessage = new Message(speech, 'bot',"");
        //  this.addMessageToChatWindow(botMessage);
        //});
          return;
      },
      (err) => console.log(err)
    );
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
          }else if(this.firstTimechating){
            return this.createchat(username,emailAddress);
          } else {
            this.noderestclient.get('http://localhost:3000/chat/emails?username='+ username )
            .subscribe(
              (resp) =>{
                let result = JSON.stringify(resp)
                let body = JSON.parse(result)._body; 
                let parsedBody = JSON.parse(body)
                if(parsedBody.length > 0 ){
                  var emailIdList = parsedBody || null;
                  this.emailIdList = [] ;
                  var userMessage = new Message("This email id you entered does not exist.But we found below matching emails with your name.", 'bot',"");
                  this.addMessageToChatWindow(userMessage);
                  for(var i = 0 ; i < emailIdList.length; i++){
                    this.emailIdList.push(emailIdList[i].email_id);
                    const userMessage = new Message(emailIdList[i].email_id, 'bot',"");
                    this.addMessageToChatWindow(userMessage);
                  }
                    userMessage = new Message("Is you email id present in the above list?", 'bot',"");
                    return this.addMessageToChatWindow(userMessage);     
                }
               // else{
                //    return this.createchat(username,emailAddress);
                //}
              }
            )
          }
        },
        (err) => console.log(err)
      )
  }

  createchat_noCondition(username,emailAddress){
    var params = {
      username : username,
      email : emailAddress
    }
    this.noderestclient.post('http://localhost:3000/chat/', params)
      .subscribe(
        (resp) => {
          console.log(resp);
          this.chatId = JSON.parse(JSON.stringify(resp))._body;
           //return this.client.textRequest(emailAddress) //  textRequest is dialouge flow method
         // .then(res => {
         //   const speech = res.result.fulfillment.speech;
         //   const botMessage = new Message(speech, 'bot',"");
         //   this.addMessageToChatWindow(botMessage);
         // });
    
        },
        (err) => console.log(err)
      );
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
    if(msg.sentBy == 'bot' && msg.content == 'Is you email id present in the above list?'){
      this.emailAddressExistInList = 1;
    }
    if(msg.sentBy == 'bot'&& msg.content == 'Please enter email id from list.'){
        this.askUserToEnterEmailIdFromList = 1;
    }
    if(msg.sentBy == 'bot' && msg.content == "Do you want to update "+this.newEmailId+ " by new emailid "+this.emailAddress){
        this.updateEmailIdCount = 1;
    }
    if(msg.sentBy == 'bot' && msg.content == "Do you want to register new entered email id?"){
        this.registerdEmailIdCount = 1;
    }
    if(msg.sentBy == 'bot' && msg.content.includes("Is this the first time you are chatting with me")){
        this.isThisFirstTimeChating = 1;
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
/*
  sendEmailTOAdmin(adminEmailMessages){
    let params= {
      messages : adminEmailMessages
    }
    this.noderestclient.post('http://localhost:3000/chat/sendmail/admin', params)
    .subscribe(
      (res) => {
        console.log(res);
      },
      (err) => console.log(err)
    );

  }
*/
  verfiyAndSendMail(msg, chatId, emailSendCount) {

    if (msg.sentBy == 'bot' && msg.content == 'Do you want to send this conversation on your email ? => YES/NO') {

      this.emailSendCount = 1;
      let params = {
        chatId: chatId,
        sendMailToAdmin:true
        //emailId: this.emailAddress
      }
      //send mail to admin
      if(this.adminEmailMessages.length > 0){
         // this.sendEmailTOAdmin(this.adminEmailMessages);
         this.noderestclient.post('http://localhost:3000/chat/sendmail', params)
         .subscribe(
           (res) => {
             console.log(res);
           },
           (err) => console.log(err)
         );
      }
      
    }
   
    //send mail to user when user says yes
    if (this.emailSendCount == 1 && msg.sentBy == 'user' && msg.content.trim().toUpperCase() == "YES") {
      this.emailSendCount = 0;
      let params = {
        chatId: chatId,
        sendMailToAdmin:false
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
