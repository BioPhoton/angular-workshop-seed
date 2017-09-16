import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {IDB} from '../../../app.module';
import {Flight} from '../../../core/api/models/flight';
import {FlightResource} from '../../../core/api/resources/flight.resource';
import * as flight from '../../../ngrx/flight.action';
import * as fromFlight from '../../../ngrx/flight.reducer';
@Injectable()
export class FlightService {

  // private _flights$: BehaviorSubject<Flight[]> = new BehaviorSubject([])
  readonly flights$: Observable<Flight[]>

  // private _isFindPending$: Subject<boolean> = new Subject()
  readonly isFindPending$: Observable<boolean>

  constructor(
    private fr: FlightResource,
    // inject store
    private store: Store<IDB>
  ) {
    // implement selector function
    // this.flights$ = this.store.select<IFlightState>(state => state.flightPage).select<Flight[]>(state => state.flights)
    this.flights$ = this.store.select(fromFlight.getFlights)

    // this.isFindPending$ = this._isFindPending$.asObservable()
    this.isFindPending$ = this.store.select(fromFlight.getFindPending)

    this.store.select(s => s.routerReducer).subscribe(console.log);

  }

  // replaced with store.dispatch
  // private setFlights(flights: Flight[]) {
  //  this._flights$.next(flights);
  // }

  find(from?: string, to?: string) {
    // this._isFindPending$.next(true)
    this.store.dispatch(new flight.FindAction({from, to}))
    /*this.fr.find(from, to)
      .subscribe(
        n => {
          // this.setFlights(n)
          this.store.dispatch(new flight.FindSuccessAction(n))
          // this._isFindPending$.next(false)
        },
        e => {
          // this._isFindPending$.next(false)
          this.store.dispatch(new flight.FindFailAction(e))
        })*/
  }

  edit(flight: Flight) {
    return this.fr.post(flight)
  }

}
