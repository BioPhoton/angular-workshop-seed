import {Observable} from 'rxjs/Observable';
import {Flight} from '../models/flight';

export interface IFlightResource {

  baseUrl: string;
  resourceName: string;

  findById(id: string): Observable<Flight>;

  find(from: string, to: string): Observable<Flight[]>;
  post(flight: Flight): Observable<Flight>;

}
