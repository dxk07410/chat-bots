import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { ApiAiClient } from 'api-ai-javascript';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import { ApiChatClinetService} from './apichatclient';
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
  constructor(public content: string, public sentBy: string) {}
}

@Injectable()
export class ChatService {

  readonly token = environment.dialogflow.angularBot;
  readonly client = new ApiAiClient({ accessToken: this.token });

  conversation = new BehaviorSubject<Message[]>([]);
  
  public chatId ;
  
  
  private count : any;
  private http: Http;
  constructor(private noderestclient: ApiChatClinetService) {
    this.count = 0;
   // this.noderestclient = new ApiChatClinetService(this.http);
  }

  // Sends and receives messages via DialogFlow
  converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    return this.client.textRequest(msg) //  textRequest is dialouge flow method
      .then(res => {
        const speech = res.result.fulfillment.speech;
        const botMessage = new Message(speech, 'bot');
        this.update(botMessage);
      });
  }



  // Adds message to source
  update(msg: Message) {
    console.log('in update');
    this.conversation.next([msg]);
   
     //let count = 0;
     if(msg.sentBy == 'bot' && msg.content == 'Hello , May i know your name please ?'){
      this.count = 1;
      return;
    }
    if(msg.sentBy == 'user' && this.count == 1){
       this.count = 0 ;
       this.noderestclient.post('http://localhost:3000/chat/',{username:msg.content})
      .subscribe(
        (resp) =>  {
          console.log(resp);
         // let strArray = resp.split(":");
         // strArray.forEach(element => {
         //   if(element == "insertId"){
              this.chatId = resp;
         //   }
          //});  
          
          return resp;
        },
        (err) => console.log(err)
      );

        
    }else if(null != this.chatId){
      let params = {
        chatId:this.chatId,
        sender:msg.sentBy,
        message:msg.content
      }
       this.noderestclient.post('http://localhost:3000/chat/message/', params)
       . subscribe(
        (res) =>  {
          console.log(res);
        },
        (err) => console.log(err)
      );
    }
    
  }


  

}
