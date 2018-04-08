import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {Routes, RouterModule} from '@angular/router';
import { NgxCarouselModule } from 'ngx-carousel';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { BodyComponent } from './body/body.component';
import { FooterComponent } from './footer/footer.component';
import { NewsComponent } from './menu/news/news.component';
import { AcademicsComponent } from './menu/academics/academics.component';
import { AdmissionsComponent } from './menu/admissions/admissions.component';
import { CampuslifeComponent } from './menu/campuslife/campuslife.component';
import { HomeComponent } from './menu/home/home.component';
import { ChatModule } from './chat/chat.module';
import {ChatDialogComponent} from './menu/chat/chat-dialog/chat-dialog.component';
//import {HttpClientModule} from '@angular/common/http';
//import { AngularFireModule } from 'angularfire2';

// New imports to update based on AngularFire2 version 4
/*import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';*/

import { ApiChatClinetService} from './menu/apichatclient';
const appRoutes: Routes = [
  {path : '', component : HomeComponent },
  {path : 'news', component : NewsComponent } ,
  {path : 'academics', component : AcademicsComponent } ,
  {path : 'admissions', component : AdmissionsComponent } ,
  {path : 'campuslife', component : CampuslifeComponent } ,
  {path : 'chat', component : ChatDialogComponent },
  ];

export const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  storageBucket: '',
  messagingSenderId: ''
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    BodyComponent,
    FooterComponent,
    NewsComponent,
    AcademicsComponent,
    AdmissionsComponent,
    CampuslifeComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgxCarouselModule,
    RouterModule.forRoot(appRoutes),
    /*AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,*/
    ChatModule,
    
  ],
  providers: [ApiChatClinetService],
  bootstrap: [AppComponent]
})
export class AppModule { }
