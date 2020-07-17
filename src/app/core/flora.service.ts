import { Injectable } from '@angular/core';
import {FlightResource} from "./api/resources/flight.resource";
import {Flight} from "./api/models/flight";
import {BehaviorSubject, Observable} from "rxjs";
import {map, tap} from "rxjs/operators";


interface GlobalState {
  flights: Flight[]
}

@Injectable({
  providedIn: 'root'
})
export class FloraService {

  state$ = new BehaviorSubject<GlobalState>({flights: []});

  flights$ = this.state$.pipe(mapToFlights, tap(v => console.log('push')));

  private _flights: Flight[];
  get flights(): Flight[] {
    console.log('pull');
    return this._flights
  }

  constructor(private fr: FlightResource) {

  }

  searchFlights(f, t) {
    console.log('searchFlights: ', f, t);
    this.fr.find(f, t)
      .subscribe(
        flights => {
          console.log(flights);
          this.state$.next({flights});
        }
      );
  }

}

function mapToFlights(o: Observable<GlobalState>): Observable<Flight[]> {
  return o.pipe(map(s => s.flights));
}
