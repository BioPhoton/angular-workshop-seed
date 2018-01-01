import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import 'rxjs/add/observable/of';
import {Observable} from 'rxjs/Observable';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {environment} from '../../../../environments/environment';
import {Flight} from '../../../core/api/models/flight';


@Injectable()
export class FlightService {

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
      .get<Flight>(this.baseUrl, reqObj)
      .catch(error => Observable.throw(error.json()));
  }

  find(from: string, to: string): Observable<Flight[]> {
    const reqObj = {
      params: new HttpParams()
        .set('from', from || '')
        .set('to', to || '')
    };

    return this
      .http
      .get<Flight[]>(this.baseUrl, reqObj)
      .catch(error => Observable.throw(error.json()));
  }

  create(flight: Flight): Observable<Flight> {
    return this
      .http
      .post<Flight>(this.baseUrl, flight)
      .catch((e: HttpErrorResponse) => {
          let errMsg: string = 'Client Error or Network Error' + e.error.message;
          if (e instanceof HttpErrorResponse) {
            switch (e.status) {
              case 400:
                errMsg = e.error;
                break;
              case 500:
                errMsg = 'You got a 500! :-(';
                break;
              default:
                errMsg = 'Server Error';
            }
            return ErrorObservable.create({message: errMsg} as { message: string });
          }
        });
  }

}
