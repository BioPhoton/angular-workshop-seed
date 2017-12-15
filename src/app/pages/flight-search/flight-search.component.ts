import {Component, QueryList, ViewChildren} from '@angular/core';
import {Flight} from '../../core/api/models/flight';
import {FlightResource} from '../../core/api/resources/flight.resource';
import {FlightCardComponent} from './components/flight-card/flight-card.component';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html'
})
export class FlightSearchComponent {


  testFlight: Flight = {
    id: '1',
    from: 'sadf',
    to: 'asdf',
    date: Date.now().toString()
  };

  from = 'Vienna';
  to = '';

  selectedFlightIds: { [key: string]: boolean } = {};
  flights: Flight[] = [];

  fr: FlightResource;

  @ViewChildren(FlightCardComponent)
  flightCards: QueryList<FlightCardComponent>;

  constructor(fr: FlightResource) {
    this.fr = fr;
    this.searchFlights('', '');

  }

  selectAll(): void {
    this.flightCards.forEach((card) => {
      card.toggleSelect();
    });
  }

  createNewReference() {
    this.testFlight = {...this.testFlight};
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

  deleteBasket() {
    this.selectedFlightIds = {};
  }

}
