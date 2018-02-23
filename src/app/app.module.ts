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

const appRoutes: Routes = [
  {path : '', component : HomeComponent },
  {path : 'news', component : NewsComponent } ,
  {path : 'academics', component : AcademicsComponent } ,
  {path : 'admissions', component : AdmissionsComponent } ,
  {path : 'campuslife', component : CampuslifeComponent } ,
  ];
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
    NgxCarouselModule,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
