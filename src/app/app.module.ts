import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { CommonModule } from '@angular/common';
import {CoreModule} from './core/core.module';
import { FlightSearchComponent } from './pages/flight-search/flight-search.component';
import {SharedModule} from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FlightSearchComponent,
  ],
  exports: [],
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule
  ],
  providers: [  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
