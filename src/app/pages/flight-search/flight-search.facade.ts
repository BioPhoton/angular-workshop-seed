import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Flight} from "../../core/api/models/flight";
import {FlightResource} from "../../core/api/resources/flight.resource";
import {BehaviorSubject, Observable, of, Subject, Subscription} from "rxjs";
import {catchError, endWith, map, startWith, switchMap, tap} from "rxjs/operators";

interface FlightState {
  flights: Flight[],
  loading: boolean
}

// State Selectors
const selectFlights = (s: FlightState): Flight[] => s.flights;
const selectLoading = (s: FlightState): boolean => s.loading;

// Reducer/ in java collector  {flights: []}, {loading:true}  => {flights:[], loading: true}
const reduceFlights = (oldState: FlightState, slice: Partial<FlightState>): FlightState => {
  // override/replace slices
  // creates immutable change => new instance
  return {...oldState, ...slice};
  /*return {
    ...oldState,
    flights: [...oldState.flights, ...slice.flights]
  };*/
}

@Injectable({
  providedIn: "root"
})
export class FlightSearchFacade implements OnDestroy {

  // State
  subscription = new Subscription();

  initState: FlightState = {
    flights:[],
    loading:false
  };
  // Internal storage
  private readonly _state = new BehaviorSubject<FlightState>(this.initState);

  // State Derivation
  readonly flights$: Observable<Flight[]> = this._state.asObservable()
    .pipe(map(selectFlights));
  readonly loading$: Observable<boolean> = this._state.asObservable()
    .pipe(map(selectLoading));

  // Effect
  private readonly searchEffect: () => Observable<Partial<FlightState>> = (params: {from: string, to: string}): Observable<Partial<FlightState>> =>
      this.fr.find(params.from, params.to)
    .pipe(
      // map to partial state for reducer
      map(flights => ({flights: flights})),
      // start loading
      startWith({loading:true}),
      // error handling
      catchError(e => of({loading:false})),
      // success handling
      endWith({loading:false})
    );

  // Trigger as subject => handle async logic
  private readonly searchTrigger = new Subject<{from: string, to: string}>();

  constructor(private fr: FlightResource) {
    this.subscription.add(
      this.searchTrigger
      .pipe(
        // listen to trigger and run effect. forward result
        switchMap(p => this.searchEffect(p)),
        // update state
        tap((slice: Partial<FlightState>) => this._state.next(reduceFlights(this._state.getValue(), slice)))
      )
      .subscribe()
    );

    this.searchFlights("", "");
  }

  ngOnDestroy(): void {
    // teardown logic
     this.subscription.unsubscribe();
  }

    // bridge from imperative to reactive
  searchFlights(from: string, to: string): void {
    this.searchTrigger.next({from, to})
  }

}
