import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {FlightSearchComponent} from './pages/flight-search/flight-search.component';
import { PLANE_SERVICE } from './shared/plane-selector/plane-selector.component';
import {SharedModule} from './shared/shared.module';
import {FlightTileComponent} from './pages/flight-search/flight-tile/flight-tile.component';
import {RouterModule} from "@angular/router";
import {Error404Component} from './pages/error404/error404.component';
import {FlightComponent} from './pages/flight/flight.component';
import {PassengerComponent} from './pages/flight/passenger/passenger.component';
import { GlobalFlightStateService } from './shared/state/global-flight-state.service';


@NgModule({
  declarations: [
    // Components
    // Directives
    // Pipes
    AppComponent,
    FlightSearchComponent,
    FlightTileComponent,
    Error404Component,
    FlightComponent,
    PassengerComponent
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
        redirectTo: 'home'
      },
      {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'flight',
        component: FlightComponent,
        children: [
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
            path: 'passenger',
            component: PassengerComponent
          },
          {
            path: 'edit',
            loadChildren: () => import('./pages/flight-edit/flight-edit.module').then(m => m.FlightEditModule)
          },
        ]
      },
      {
        path: 'error',
        component: Error404Component
      },
      {
        path: '**',
        redirectTo: 'error'
      }
    ])
  ],
  providers: [
    // Services
    {
      provide: PLANE_SERVICE,
      useExisting: GlobalFlightStateService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
