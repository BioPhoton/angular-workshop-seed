import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {FlightSearchComponent} from './pages/flight-search/flight-search.component';
import {HomeComponent} from './pages/home/home.component';
import {SharedModule} from './shared/shared.module';
import { FlightEditComponent } from './pages/flight-edit/flight-edit.component';
import {RouterModule} from "@angular/router";
import {AuthGuard} from "./core/auth.guard";


@NgModule({
  declarations: [
    // Components
    // Directives
    // Pipes
    AppComponent,
    HomeComponent,
    FlightSearchComponent,
    FlightEditComponent
  ],
  exports: [
    // Modules
    // Components
    // Directives
  ],
  imports: [
    // Modules
    BrowserModule,
    CoreModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'search'
      },
      {
        path: 'search',
        component: FlightSearchComponent
      },
      {
        path: 'edit/:idodaso',
        component: FlightEditComponent,
        canActivate: [AuthGuard]
      },
      {
        path: '**',
        redirectTo: 'search'
      }
    ], {
      enableTracing: false,
      useHash: true,
      initialNavigation: false
    })
  ],
  providers: [
    // Services
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
