import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HomeComponent} from './pages/home/home.component';
import {SharedModule} from './shared/shared.module';
import {FlightApiModule} from 'flight-api/src/lib/flight-api.module';
import {RouterModule} from '@angular/router';
import {APP_ROUTES, ROUTER_OPTIONS} from '@app/app.routing';
import {environment} from '../environments/environment';
import {OverlaySpinnerModule} from '@app/modules/overlay-spinner/overlay-spinner.module';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './+state';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './+state/app.effects';

const flightApiConfig = {baseUrl: environment.baseUrl};

@NgModule({
  declarations: [
    // Components
    // Directives
    // Pipes
    AppComponent,
    HomeComponent
  ],
  exports: [
    // Modules
    // Components
    // Directives
  ],
  imports: [
    // Modules
    BrowserModule,
    RouterModule.forRoot(APP_ROUTES, ROUTER_OPTIONS),
    FlightApiModule.forRoot(flightApiConfig),
    OverlaySpinnerModule.forRoot(),
    SharedModule,
    FormsModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([AppEffects]),
  ],
  providers: [
    // Services
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor() {
  }

}
