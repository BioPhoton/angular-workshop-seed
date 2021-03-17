import {Injectable} from "@angular/core";
import {FlightResource} from "../../core/api/resources/flight.resource";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Flight} from "../../core/api/models/flight";
import {exhaustMap, map, switchMap} from "rxjs/operators";

// Global
interface GlobalState {
  flights: Flight[],
  names: string[],
  isLoading: boolean
}


// Facade

// 1. Abstract technique of handling state
// 2. REST API (remote source)
// 3. Easey to use interface

@Injectable({
  providedIn: "root"
})
export class GlobalStateService {

  load$ = new Subject<any>();
  fetch$ = new Subject<any>();

  private _state = new BehaviorSubject<GlobalState>({
    flights: [],
    names: [],
    isLoading: false
  });

  // select state / derive state
  flights$: Observable<Flight[]> = this._state.pipe(
    map(state => state.flights)
  )

  constructor(private fr: FlightResource) {

    this.load$.pipe(
      switchMap(({from, to}) => this.fr.find(from, to)),
      map(flights => ({flights}))
    )
      .subscribe(this._reducerFn)
    this.fetch$.pipe(
      exhaustMap(({from, to}) => this.fr.find(from, to)),
      map(flights => ({flights}))
    )
      .subscribe(this._reducerFn)

  }

  fetch(from: string, to: string): void {
    this.fetch$.next({from, to});
  }

  load(from: string, to: string): void {
    this.load$.next({from, to});
  }

  _reducerFn = (slice: Partial<GlobalState>) => {
    this._state.next({
      // old state
      ...this._state.getValue(),
      // override
      ...slice
    })
  }


}
