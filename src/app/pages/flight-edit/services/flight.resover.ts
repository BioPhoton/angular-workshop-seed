import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Flight} from '../../../core/api/models/flight';
import {FlightResource} from '../../../core/api/resources/flight.resource';

@Injectable()
export class FlightResolver implements Resolve<Flight> {

  constructor(private fr: FlightResource) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Flight> | Promise<Flight> | Flight {
    return this.fr.findById(route.params.id);
  }

}
