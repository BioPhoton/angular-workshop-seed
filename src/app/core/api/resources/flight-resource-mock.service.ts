import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../../environments/environment';
import {Flight} from '../models/flight';
import {IFlightResource} from './flight-resource.interface';

import 'rxjs/add/observable/of';

@Injectable()
export class FlightResourceMockService implements IFlightResource {
  baseUrl: string;
  resourceName = 'flight';
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
    this.baseUrl = [environment.baseUrl, this.resourceName].join('/');
  }

  findById(id: string): Observable<Flight> {
    const params: HttpParams = new URLSearchParams() as HttpParams;
    params.set('id', id);

    return this.http
      .get(this.baseUrl, {params: params});
  }

  find(from: string, to: string): Observable<Flight[]> {

    return Observable.of([
      {
        id: '12',
        from: 'Vienna',
        to: 'Bern',
        date: Date.now().toString()
      }
    ]);
  }

  post(flight: Flight): Observable<Flight> {
    return undefined;
  }

}
