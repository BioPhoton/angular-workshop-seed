import {Injectable} from "@angular/core";
import {FlightResource} from "../../core/api/resources/flight.resource";
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {Flight} from "../../core/api/models/flight";
import {exhaustMap, map, switchMap} from "rxjs/operators";

// Global
export interface GlobalState {
  flights: Flight[];
  // selectedFlight: Flight | null;
}


// Facade

// 1. Abstract technique of handling state
// 2. REST API (remote source)
// 3. Easy to use interface


// Action => signal to mutate state
// Reducer => transition from state1 => state2
// Selector => `subscribe` to slices of state

// Fragen:
// Vor-/ Nachteile von extends vs. state = new RxState()

@Injectable({
  providedIn: "root"
})
export class GlobalFlightStateService {

  // actions
  private load$ = new Subject<{from: string, to: string}>();
  private refresh$ = new Subject<{from: string, to: string}>();

  private _state = new BehaviorSubject<GlobalState>({
    flights: [],
    // selectedFlight: null
  });

  // select state / derive state
  flights$: Observable<Flight[]> = this._state.pipe(
    map(state => state.flights)
  );

  constructor(private fr: FlightResource) {
    // load and search flights
    this.load$.pipe(
      switchMap(({from, to}) => this.fr.find(from, to))
    )
      .subscribe(flights => this._reducerFn({ flights }));
    // refresh flights
    this.refresh$.pipe(
      exhaustMap(({from, to}) => this.fr.find(from, to))
    )
      .subscribe(flights => this._reducerFn({ flights }));
  }

  refresh(from: string, to: string): void {
    this.refresh$.next({from, to});
  }

  load(from: string, to: string): void {
    this.load$.next({from, to});
  }

  // reducer logic: transition from state1 => state2
  _reducerFn = (slice: Partial<GlobalState>) => {
    this._state.next({
      // old state
      ...this._state.getValue(),
      // override
      ...slice
    })
  }

}
