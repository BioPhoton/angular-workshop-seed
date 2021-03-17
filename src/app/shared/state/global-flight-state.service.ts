import {Injectable} from "@angular/core";
import {FlightResource} from "../../core/api/resources/flight.resource";
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {Flight} from "../../core/api/models/flight";
import { delay, exhaustMap, map, startWith, switchMap } from 'rxjs/operators';

// Global
export interface GlobalState {
  flights: Flight[];
  loading: boolean;
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
    loading: false
  });

  // select state / derive state
  flights$: Observable<Flight[]> = this._state.pipe(
    map(state => state.flights)
  );

  loading$: Observable<boolean> = this._state.pipe(
    map(state => state.loading)
  );

  constructor(private fr: FlightResource) {
    // load and search flights
    this.load$.pipe(
      switchMap(({from, to}) => {
        return this.fr.find(from, to).pipe(
          delay(2500),
          map(flights => ({ flights, loading: false })),
          startWith({ loading: true })
        )
      })
    )
      .subscribe(this._reducerFn);
    // refresh flights
    this.refresh$.pipe(
      exhaustMap(({from, to}) => {
        return this.fr.find(from, to).pipe(
          delay(2500),
          map(flights => ({ flights, loading: false })),
          startWith({ loading: true })
        )
      })
    )
      .subscribe(this._reducerFn);
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
