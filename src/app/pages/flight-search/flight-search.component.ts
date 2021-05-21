import {Component, OnDestroy} from '@angular/core';
import {Flight} from '../../core/api/models/flight';
import {FlightResource} from '../../core/api/resources/flight.resource';
import {FlightSearchFacade} from "./flight-search.facade";
import {FlightFacade} from "./flight.facade";

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',

})
export class FlightSearchComponent implements OnDestroy {

  // global
  flights$ = this.fsf.flights$;
  loading$ = this.fsf.loading$;

  // local
  selectedFlightIds: { [key: string]: boolean } = {};
  from: string;
  to: string

  constructor(
    private fsf: FlightFacade
  ) {

  }

  ngOnDestroy(): void {
        console.log("search destroy");
    }

  searchFlights(from: string, to: string): void {
    this.fsf.searchFlights(from, to);
  }

  toggleFlight(id: string): void {
    this.selectedFlightIds[id] = !this.selectedFlightIds[id];
  }

}
