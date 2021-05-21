import {Component} from '@angular/core';
import {Flight} from '../../core/api/models/flight';
import {FlightResource} from '../../core/api/resources/flight.resource';
import {FlightSearchFacade} from "./flight-search.facade";

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html'
})
export class FlightSearchComponent {

  // global
  flights$ = this.fsf.flights$;

  // local
  selectedFlightIds: { [key: string]: boolean } = {};
  from: string;
  to: string

  constructor(
    private fsf: FlightSearchFacade
  ) {

  }

  searchFlights(from: string, to: string): void {
    this.fsf.searchFlights(from, to);
  }

  toggleFlight(id: string): void {
    this.selectedFlightIds[id] = !this.selectedFlightIds[id];
  }

}
