import { Injectable } from '@angular/core';
import {FloraService} from "../../core/flora.service";
import {Flight} from "../../core/api/models/flight";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AuthService} from "../../core/api/auth.service";


export interface FlightSearchResult {
  id: number;
  from: string;
  to: string;
  date: Date
}

@Injectable({
  providedIn: 'root'
})
export class FlightSearchAdapter {

  flights$: Observable<FlightSearchResult[]>  = this.fs.flights$.pipe(toLocalFlight);

  constructor(private fs: FloraService, private auth: AuthService) { }

  search(from: string, to: string) {
    this.fs.searchFlights(from, to);
  }

}

function toLocalFlight(o: Observable<Flight[]>): Observable<FlightSearchResult[]> {
  return o.pipe(
    map(arr => arr.map(({id, from, to, date}) => ({id, from, to, date: new Date(date)})))
  );
}
