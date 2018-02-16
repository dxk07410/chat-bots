import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { BodyComponent } from './body/body.component';
import { FooterComponent } from './footer/footer.component';
import { NewsComponent } from './menu/news/news.component';
import { AcademicsComponent } from './menu/academics/academics.component';
import { AdmissionsComponent } from './menu/admissions/admissions.component';
import { CampuslifeComponent } from './menu/campuslife/campuslife.component';

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
    CampuslifeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
