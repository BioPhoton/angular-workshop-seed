import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import {Observable} from 'rxjs/Observable';

import {environment} from '../../../../environments/environment';
import {Flight} from '../models/Flight';


@Injectable()
export class FlightResource {

  private baseUrl: string;
  private resourceName = 'flight';

  constructor(private http: HttpClient) {
    this.baseUrl = [environment.baseUrl, this.resourceName].join('/');
  }

  findById(id: string): Observable<Flight> {
    const reqObj = {params: null};
    const params = new HttpParams().set('id', id);
    reqObj.params = params;

    return this.http
      .get<Flight>(this.baseUrl, reqObj);
  }

  find(from: string, to: string): Observable<Flight[]> {
    const reqObj = {
      params: new HttpParams()
        .set('from', from || '')
        .set('to', to || '')
    };

    return this
      .http
      .get<Flight[]>(this.baseUrl, reqObj);
  }

  create(flight: Flight): Observable<Flight> {
    return this
      .http
      .post<Flight>(this.baseUrl, flight);
  }

}
