import {Component} from '@angular/core';
import {Flight} from '../../core/api/models/flight';
import {FlightResource} from '../../core/api/resources/flight.resource';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html'
})
export class FlightSearchComponent {

  from = 'Wien';
  to = 'Berlin';

  selectedFlightIds: { [key: string]: boolean } = {};
  flights: Flight[] = [];

  constructor(public fr: FlightResource) {
    this.searchFlights('', '');
  }

  searchFlights(from, to) {
   this.fr.find(from, to).subscribe(
     newFlights => {
       this.flights = newFlights;
     }
   );
  }

  selectFlight(id) {
    this.selectedFlightIds[id] = !this.selectedFlightIds[id];
  }

}
