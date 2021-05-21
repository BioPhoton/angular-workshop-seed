import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Flight} from "../../core/api/models/flight";
import {FlightResource} from "../../core/api/resources/flight.resource";
import {BehaviorSubject, Observable, of, Subject, Subscription} from "rxjs";
import {
  catchError,
  distinctUntilChanged,
  endWith,
  filter,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap
} from "rxjs/operators";
import {RxState} from "@rx-angular/state";

interface FlightState {
  flights: Flight[],
  loading: boolean
}

// State Selectors
const selectFlights = (s: FlightState): Flight[] => s.flights;
const selectLoading = (s: FlightState): boolean => s.loading;

// Reducer/ in java collector  {flights: []}, {loading:true}  => {flights:[], loading: true}
const reduceFlights = <T>(oldState: T, slice: Partial<T>): T => {
  // override/replace slices
  // creates immutable change => new instance
  return {...oldState, ...slice};
  /*return {
    ...oldState,
    flights: [...oldState.flights, ...slice.flights]
  };*/
}

type Commands = {
  name: string,
  payload: { from: string, to: string } | { id: string } | void
}

@Injectable({
  providedIn: "root"
})
export class FlightFacade extends RxState<FlightState> {

  // State
  initState: FlightState = {
    flights:[],
    loading:false
  };

   // State Derivation                      //   pipe()
  readonly flights$: Observable<Flight[]> = this.select(
    map(selectFlights),
    // filter(f => f !== undefined),
    // true, true, false, true, ture
    // distinctUntilChanged(),
    // true,       false, true
    // shareReplay(1)
  )
  readonly loading$: Observable<boolean> = this.select("loading");

  // Effect
  private readonly searchEffect: (params: {from: string, to: string}) => Observable<Partial<FlightState>> = (params: {from: string, to: string}): Observable<Partial<FlightState>> =>
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

  // Commands as subject => handle async logic
  private readonly command = new Subject<Commands>();

  constructor(private fr: FlightResource) {
    super();

    this.set(this.initState);

    this.connect(this.command.pipe(
      filter(command => ["search", "refresh"].includes(command.name)),
      switchMap((command) => this.searchEffect(command.payload as any)))
    );

  }

  // bridge from imperative to reactive
  searchFlights(from: string, to: string): void {
    this.command.next({name:"search", payload: {from: from || "", to: to || ""}})
  }

  refreshFlights(): void {
    this.command.next({name:"refresh", payload: {from:"", to: ""}})
  }

  selectFlight(id: string): void {
    this.command.next({name:"select", payload: {id} })
  }

}
