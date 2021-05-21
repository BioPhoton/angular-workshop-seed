import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Flight} from "../../core/api/models/flight";
import {FlightResource} from "../../core/api/resources/flight.resource";
import {BehaviorSubject, Observable, of, Subject, Subscription} from "rxjs";
import {catchError, endWith, map, startWith, switchMap, tap} from "rxjs/operators";

interface FlightSearchState {
  flights: Flight[],
  loading: boolean
}

// Select
const selectFlights = (s: FlightSearchState): Flight[] => s.flights;
const selectLoading = (s: FlightSearchState): boolean => s.loading;

// Reducer
const reduceFlights = (oldState: FlightSearchState, slice: Partial<FlightSearchState>): FlightSearchState => {
  return {...oldState, ...slice};
}


@Injectable({
  providedIn: 'root'
})
export class FlightSearchFacade implements OnDestroy {

  // State
  subscription = new Subscription();

  // Internal storage
  private readonly _state = new BehaviorSubject<FlightSearchState>({
    flights:[], loading:false
  });

  // State Slices => State Derivation
  readonly flights$: Observable<Flight[]> = this._state.asObservable()
    .pipe(map(selectFlights));
  readonly loading$: Observable<boolean> = this._state.asObservable()
    .pipe(map(selectLoading));

  // Effect
  private readonly searchEffect = (p: {from: string, to: string}) => this.fr.find(p.from, p.to)
    .pipe(
      map(flights => ({flights})),
      startWith({loading:true}),
      catchError(e => of({loading:false})),
      endWith({loading:false})
    );

  // Trigger
  private readonly searchTrigger = new Subject<{from: string, to: string}>();

  constructor(private fr: FlightResource) {
    this.subscription.add(
      this.searchTrigger
      .pipe(
        switchMap(p => this.searchEffect(p)),
        tap((slice: Partial<FlightSearchState>) => this._state.next(reduceFlights(this._state.getValue(), slice)))
      )
      .subscribe()
    );

    this.searchFlights("", "");
  }

  ngOnDestroy(): void {
       this.subscription.unsubscribe();
    }

  searchFlights(from: string, to: string): void {
    this.searchTrigger.next({from, to})
  }

}
