import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {EffectsModule} from '@ngrx/effects';
import * as fromRouter from '@ngrx/router-store';
import {RouterStateSerializer} from '@ngrx/router-store';
import {StoreModule} from '@ngrx/store';

import {AppComponent} from './app.component';
import {AppRouterModule} from './app.routing.module';
import {CoreModule} from './core/core.module';
import {FlightEffects} from './ngrx/flight.effect';
import {flightReducer, IFlightState} from './ngrx/flight.reducer';
import {FlightModule} from './pages/flight/flight.module';
import {HomeModule} from './pages/home/home.module';
import {CustomSerializer, IRouterStateUrl} from './ngrx/router-state.serializer';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

export interface IDB {
  flightPage: IFlightState
  routerReducer: fromRouter.RouterReducerState<IRouterStateUrl>
}

const reducer = {
  flightPage: flightReducer,
  routerReducer: fromRouter.routerReducer
}

export const config = {}

const effects = [FlightEffects]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRouterModule,
    CoreModule.forRoot(),
    HomeModule,
    FlightModule.forRoot(),
    StoreModule.forRoot(reducer),
    StoreDevtoolsModule.instrument({
      maxAge: 10 //  Retains last 10 states
    }),
    EffectsModule.forRoot(effects),
    fromRouter.StoreRouterConnectingModule
  ],
  providers: [
    {provide: RouterStateSerializer, useClass: CustomSerializer}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
