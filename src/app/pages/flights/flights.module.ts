import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {reducer as flightReducer} from '@app/pages/flights/+state/flight.reducer';
import {SharedModule} from '@app/shared/shared.module';
import {StoreFeatureModule, StoreModule} from '@ngrx/store';
import {FlightBookingsComponent} from './flight-bookings/flight-bookings.component';
import {FlightEditComponent} from './flight-edit/flight-edit.component';
import {FlightEditResolveService} from './flight-edit/resolver/flight-edit-resolve.service';
import {FlightSearchComponent} from './flight-search/flight-search.component';

import {FlightsRoutingModule} from './flights-routing.module';
import {FlightsComponent} from './flights.component';
import {FlightService} from './services/flight.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    FlightsRoutingModule,
    StoreModule.forFeature('flightsBooking', flightReducer)
  ],
  declarations: [
    FlightSearchComponent,
    FlightEditComponent,
    FlightsComponent,
    FlightBookingsComponent
  ],
  providers: [
    FlightEditResolveService,
    FlightService
  ]
})
export class FlightsModule {
}
