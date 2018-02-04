import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';

import {MatSliderModule} from '@angular/material';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    MatSliderModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCRWZpAA2BZadxfiuk2yKQ2GDXwbUrtKu0'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
