import {Component} from '@angular/core';
import {Flight} from '../../core/api/models/flight';
import {FlightResource} from '../../core/api/resources/flight.resource';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html'
})
export class FlightSearchComponent {

  selectedFlightIds: { [key: string]: boolean } = {};
  flights: Flight[] = [];

  fr: FlightResource;

  constructor(fr: FlightResource) {
    this.fr = fr;
    this.searchFlights('', '');
  }

  searchFlights(f, t) {
    this.fr.find(f, t)
      .subscribe(
        newFlights => {
          this.flights = newFlights;
        }
      );
  }

  selectFlight(id: string) {
    this.selectedFlightIds[id] = !this.selectedFlightIds[id];
  }

}
