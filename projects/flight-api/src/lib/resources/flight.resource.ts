import {HttpClient, HttpParams} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Flight} from '../models/Flight';
import {FLIGHT_API_CONFIG_TOKEN} from '../tokens/flight-api-config.token';


@Injectable()
export class FlightResource {

  private baseUrl: string;
  private resourceName = 'flight';

  constructor(private http: HttpClient,
              @Inject(FLIGHT_API_CONFIG_TOKEN) private flightApiConfig
  ) {
    this.baseUrl = [flightApiConfig.baseUrl, this.resourceName].join('/');
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
