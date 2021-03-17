import {Injectable} from "@angular/core";
import {FlightResource} from "../../core/api/resources/flight.resource";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {map} from "rxjs/operators";

// Local
interface LocalState {
  from: string;
  to: string;
  selectedFlightIds: Record<string, boolean>;
}

// ?????


// Pros
// - Sub handling abstracted
// - Testing
// - Architecture => MVP


// Cons extra service
// overhead => Handmade vs RxState
// kow-how = >time

@Injectable()
export class LocalStateService {

  readonly refresh$ = new Subject<EventTarget>();

  private _state = new BehaviorSubject<LocalState>({
    from: '',
    to: '',
    selectedFlightIds: {} as Record<string, boolean>
  });

  // =======

  searchCredentials$ = this._state.asObservable();

  // select state / derive state
  from$: Observable<string> = this._state.pipe(
    map(state => state.from)
  )

  to$: Observable<string> = this._state.pipe(
    map(state => state.to)
  )

  set selectFlight(id: string) {
    this._reducerFn({
      selectedFlightIds: {
        ...this._state.getValue().selectedFlightIds,
        [id]: !this._state.getValue()[id]
      }
    });
  }

  isFlightSelect(id: string) {
    return this._state.getValue()[id];
  }

  set from(from: string) {
    this._reducerFn({from});
  }

  set to(to: string) {
    this._reducerFn({to});
  }

  get selectedGive(): boolean {
    return Object.values(this._state.getValue().selectedFlightIds).some(v => v == true);
  }

  constructor(private fr: FlightResource) {

  }

  _reducerFn = (slice: Partial<LocalState>) => {
    this._state.next({...this._state.getValue(), ...slice})
  }

}
