import {Component} from '@angular/core';
import {Flight} from '../../core/api/models/flight';
import {FlightResource} from '../../core/api/resources/flight.resource';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html'
})
export class FlightSearchComponent {

  from = 'test';
  to = '';

  selectedFlightIds: { [id: string]: boolean } = {};
  flights: Flight[] = [];

  constructor(private fr: FlightResource) {
    this.searchFlights('', '');
  }

  selectedGive(): number {
    return Object.keys(this.selectedFlightIds).length;
  }

  searchFlights(from: string, to: string) {
    this.fr.find(from, to)
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
