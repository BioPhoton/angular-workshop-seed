import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import {Observable} from 'rxjs';
import {FlightService} from '../../services/flight.service';
import {Flight} from 'flight-api/src/lib/models/flight';

@Injectable()
export class FlightEditResolveService implements Resolve<Flight> {

  constructor(private flightService: FlightService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Flight> | Promise<Flight> | Flight {
    const id = (route.params as {id: string}).id || '0';
    return this.flightService.findById(id);
  }

}
