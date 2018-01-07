import { NgModule } from '@angular/core';

import { FlightsRoutingModule } from './flights-routing.module';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { FlightEditComponent } from './flight-edit/flight-edit.component';
import { FlightsComponent } from './flights.component';
import { FlightBookingsComponent } from './flight-bookings/flight-bookings.component';
import { SharedModule } from '@app/shared/shared.module';
import { FlightEditResolveService } from './flight-edit/resolver/flight-edit-resolve.service';
import { FlightService } from './services/flight.service';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FlightsRoutingModule
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
export class FlightsModule { }
