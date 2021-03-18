import {Component} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Flight} from '../../core/api/models/flight';
import {GlobalFlightStateService} from '../../shared/state/global-flight-state.service';
import {RxState} from "@rx-angular/state";

/*
* Global
- flights
- loading

* Local

// SQL: Table vs Query
// Component: Model vs ViewModel

// Class vs Template
** Model
- from
- to
- selectedFlights
- flights
- loading

** ViewModel
- flightsCount (derived from flights)
*/

interface FlightSearchState {
  flights: Flight[],
  loading: boolean,
  from: string,
  to: string,
  selectedFlights: {[id:string]: boolean}
}

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  providers: [RxState]
})
export class FlightSearchComponent  {
  readonly from$ = this.state.select('from');
  readonly to$ = this.state.select('to');
  readonly selectedFlightIds$ = this.state.select('selectedFlights');
  readonly resultCount$ = this.state.select(map(({flights}) => flights.length));
  readonly refresh$ = new Subject();
  readonly loading$ = this.flightState.loading$;
  readonly filteredFlights$: Observable<Flight[]> = this.state.select(
    map(({from, to, flights}) => {
      let filteredFlights = flights;
      if (from) {
        filteredFlights = filteredFlights.filter(f => f.from.toLowerCase().indexOf(from.toLowerCase()) !== -1)
      }
      if (to) {
        filteredFlights = filteredFlights.filter(f => f.to.toLowerCase().indexOf(to.toLowerCase()) !== -1)
      }
      return filteredFlights;
    }));

  constructor(
    public flightState: GlobalFlightStateService,
    public state: RxState<FlightSearchState>
  ) {
    this.state.set({
      from: '',
      to: '',
      selectedFlights: {}
    });
    this.state.connect('flights', this.flightState.flights$)
    this.state.connect('loading', this.flightState.loading$)

    this.state.hold(this.refresh$, () => this.flightState.load());
  }

  selectedGive(): number {
    return Object.keys(this.state.get().selectedFlights).length;
  }

  selectFlight(id: string) {
    this.state.set((oldState) => ({
      selectedFlights: {
        ...oldState.selectedFlights,
        [id]: !oldState.selectedFlights[id]
      }
    }))
  }

}
