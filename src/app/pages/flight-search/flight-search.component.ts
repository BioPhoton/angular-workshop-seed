import {Component} from '@angular/core';
import {Flight} from '../../core/api/models/flight';
import {FlightResource} from '../../core/api/resources/flight.resource';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html'
})
export class FlightSearchComponent {

  public selectedFlightIds: { [key: string]: boolean } = {};
  public flights: Flight[] = [];

  from: string;
  to: string

  constructor(private fr: FlightResource) {
    this.searchFlights('', '');
  }

  searchFlights(from: string, to: string): void {
    this.fr.find(from, to)
      .subscribe(
        newFlights => {
          this.flights = newFlights;
        }
      );
  }
  toggleFlight(id: string): void {
    this.selectedFlightIds[id] = !this.selectedFlightIds[id];
  }

}
