import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {FlightSearchComponent} from './pages/flight-search/flight-search.component';
import {HomeComponent} from './pages/home/home.component';
import {SharedModule} from './shared/shared.module';
import {RouterModule} from "@angular/router";
import {ROUTES} from "./routes";
import { EditComponent } from './pages/edit/edit.component';


@NgModule({
  declarations: [
    // Components
    // Directives
    // Pipes
    AppComponent,
    HomeComponent,
    FlightSearchComponent,
    EditComponent
  ],
  exports: [
    // Modules
    // Components
    // Directives
  ],
  imports: [
    // Modules
    RouterModule.forRoot(ROUTES, { useHash: true }),
    BrowserModule,
    CoreModule,
    SharedModule,
    FormsModule
  ],
  providers: [
    // Services
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
