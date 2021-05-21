import {Injectable, OnInit} from '@angular/core';
import {Flight} from "../../core/api/models/flight";
import {FlightResource} from "../../core/api/resources/flight.resource";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FlightSearchFacade {

  // emitted immer letzten wert
  private _state = new BehaviorSubject<Flight[]>([]);
  flights$: Observable<Flight[]> = this._state.asObservable();

  constructor(private fr: FlightResource) {
    this.searchFlights("", "")
  }

  searchFlights(from: string, to: string): void {
    this.fr.find(from, to)
      .subscribe(
        newFlights => {
          console.log("newFlights", newFlights);
          this._state.next(newFlights)
        }
      );
  }

}
