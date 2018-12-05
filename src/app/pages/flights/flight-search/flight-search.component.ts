import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FlightsLoaded} from '@app/pages/flights/+state/flight.actions';
import {getFlights} from '@app/pages/flights/+state/flights.selectors';
import {select, Store} from '@ngrx/store';
import {Flight} from 'flight-api/src/lib/models/flight';
import {BehaviorSubject, Observable} from 'rxjs';
import {FlightService} from '../services/flight.service';

@Component({
  selector: 'flight-search',
  templateUrl: './flight-search.component.html'
})
export class FlightSearchComponent {

  selectedFlightIds: { [id: string]: boolean } = {};

  private _flights$: BehaviorSubject<Flight[]> = new BehaviorSubject([]);
  get flights$(): Observable<Flight[]> {
    return this._flights$.asObservable();
  }

  set flights(flights: Flight[]) {
    this._flights$.next(flights);
  }

  searchForm: FormGroup;

  constructor(
    private fs: FlightService,
    private fb: FormBuilder,
    private store: Store<FlightState>
  ) {
    this.search('', '');
    this.searchForm = this.fb.group({
      from: [''],
      to: ['']
    });
    this.store.pipe(
      select(getFlights)
    )
      .subscribe((flights: Flight) => {
        this.flights = flights;
      });
  }

  search(from, to) {
    this.fs
      .find(from, to)
      .subscribe((v) => this.store.dispatch(new FlightsLoaded({flights: v})));
  }

  toggleAll() {
    if (Object.keys(this.selectedFlightIds).length > 0) {
      this.deselectAll();
    } else {
      this.selectAll();
    }
  }

  deselectAll() {
    this.selectedFlightIds = {};
  }

  selectAll() {
    this.flights$.subscribe(
      flights => {
        this.selectedFlightIds = flights.reduce((state, flight) => {
          state[flight.id] = true;
          return state;
        }, {});
      }
    );
  }

  toggleSelected(id) {
    const newSelectedState = !this.selectedFlightIds[id];

    delete this.selectedFlightIds[id];
    if (newSelectedState) {
      this.selectedFlightIds[id] = true;
    }

  }

}
