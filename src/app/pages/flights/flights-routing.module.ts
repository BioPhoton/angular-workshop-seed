import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { FlightEditComponent } from './flight-edit/flight-edit.component';
import { FlightsComponent } from './flights.component';
import { FlightBookingsComponent } from './flight-bookings/flight-bookings.component';
import { FlightEditResolveService } from './flight-edit/resolver/flight-edit-resolve.service';

const routes: Routes = [
  {
    path: '',
    component: FlightsComponent,
    children: [
      {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
      },
      {
        path: 'search',
        component: FlightSearchComponent
      },
      {
        path: 'edit/:id',
        component: FlightEditComponent,
        resolve : {
          flight: FlightEditResolveService
        }
      },
      {
        path: 'bookings',
        component: FlightBookingsComponent,
      }
    ],

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlightsRoutingModule {
}
