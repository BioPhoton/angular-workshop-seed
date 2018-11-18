import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import {Observable} from 'rxjs';
import {Flight} from '../../../../core/api/models/flight';
import {FlightService} from '../../services/flight.service';

@Injectable()
export class FlightEditResolveService implements Resolve<Flight> {

  constructor(private flightService: FlightService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Flight> | Promise<Flight> | Flight {
    const id = route.params.id || 0;
    return this.flightService.findById(id);
  }

}
