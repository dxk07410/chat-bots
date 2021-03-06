import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService , Message} from '../../chat.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/scan';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { SpeechRecognitionService } from './speech-recognition.service ';
//import {TNSTextToSpeech,SpeakOptions} from 'nativescript-texttospeech';

@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css']
})
export class ChatDialogComponent implements OnInit ,OnDestroy {

  messages: Observable<Message[]> = null ;
  formValue: string;

  //subscription : Subscription;
  speechData: string;
  showSearchButton: boolean;
  //ttsOptions : SpeakOptions;
    //$: any;
  constructor(public chat: ChatService,private speechRecognitionService: SpeechRecognitionService) {
    this.speechData = "";
    
    this.messages = null;
    this.showSearchButton = true;
  }

  ngOnInit() {
    // to array after each new message is added to chat box.
    this.initMessage();
  }
  ngOnDestroy(){
   // console.log("destroy");
    this.messages = null;
    this.chat.conversation = new BehaviorSubject<Message[]>([]);
    this.speechRecognitionService.DestroySpeechObject();
  }

  initMessage(){
    
    //console.log(Object.keys(this.chat.conversation.asObservable));
    //console.log(this.messages)
   
    this.messages = this.chat.conversation.asObservable()
    .scan((acc,val) => {
      return acc.concat(val)
    });
  }
  sendMessage() {
    if(this.formValue==null || this.formValue== ''){
      return;
    }
    if( this.messages == null){
      this.initMessage();
    }
    //console.log(this.formValue);
    this.chat.sendOrRecieveMessages(this.formValue);
    this.formValue = '';
  }
  activateSpeechSearchMovie(): void {
    this.showSearchButton = false;

    this.speechRecognitionService.record()
        .subscribe(
        //listener
        (value) => {//get the text from voice.
            this.speechData = value;
            this.chat.sendOrRecieveMessages(value);
            //this.chat.conversation.next([new Message(value,'user',"")])
            console.log("I was here"+value);
        },
        //errror
        (err) => {
            console.log(err);
            if (err.error == "no-speech") {
                console.log("--restatring service--");
                this.activateSpeechSearchMovie();
            }
        },
        //completion
        () => {
            this.showSearchButton = true;
            console.log("--complete--");
            this.activateSpeechSearchMovie();
        });
}
  endChat() {

    this.messages = null;

   
     
  }
}
