import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  exports: [],
  imports: [
    CommonModule,
    BrowserModule,
  ],
  providers: [  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
