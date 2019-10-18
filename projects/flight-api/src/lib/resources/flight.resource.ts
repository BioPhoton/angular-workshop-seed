import {HttpClient, HttpParams} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Flight} from '../models/Flight';
import {FLIGHT_API_CONFIG_TOKEN} from '../tokens/flight-api-config.token';
import {flightData} from "flight-api/src/lib/fake.data";


@Injectable()
export class FlightResource {

  private data = flightData;
  private offline = true;
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

    if (this.offline) {
      return of(flightData[0]);
    }
    return this.http
      .get<Flight>(this.baseUrl, reqObj);
  }

  find(from: string, to: string): Observable<Flight[]> {
    const reqObj = {
      params: new HttpParams()
        .set('from', from || '')
        .set('to', to || '')
    };

    if (this.offline) {
      return of(flightData);
    }

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
