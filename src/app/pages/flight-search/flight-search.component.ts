import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';
import { delay, exhaustMap, switchMap } from 'rxjs/operators';
import { Flight } from '../../core/api/models/flight';
import { FlightResource } from '../../core/api/resources/flight.resource';
import { GlobalFlightStateService } from '../../shared/state/global-flight-state.service';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html'
})
export class FlightSearchComponent {

  private fromTo$ = new BehaviorSubject<{
    from: string;
    to: string;
  }>({
    from: '',
    to: ''
  });


  private from$ = new BehaviorSubject('');

  get from(): string {
    return this.from$.getValue();
  }
  set from(from: string) {
    this.from$.next(from);
  }

  private to$ = new BehaviorSubject('');

  get to(): string {
    return this.to$.getValue();
  }
  set to(to: string) {
    this.to$.next(to);
  }

  selectedFlightIds: { [id: string]: boolean } = {};
  flights: Flight[] = [];

  readonly refresh$ = new Subject();

  flights$: Observable<Flight[]> = this.flightState.flights$;

  constructor(
    public flightState: GlobalFlightStateService
  ) {
    combineLatest([
      this.from$,
      this.to$
    ]).subscribe(([from, to]) => {
      this.flightState.load(from, to);
    });
    this.refresh$.subscribe(() => {
      this.flightState.refresh(this.from, this.to)
    });
  }

  selectedGive(): number {
    return Object.keys(this.selectedFlightIds).length;
  }

  selectFlight(id: string) {
    this.selectedFlightIds[id] = !this.selectedFlightIds[id];
  }

}
