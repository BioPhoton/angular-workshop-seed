import {Component} from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, delay, exhaustMap, mergeMap, startWith, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import {Flight} from '../../core/api/models/flight';
import {FlightResource} from '../../core/api/resources/flight.resource';
import {GlobalStateService} from "./global.state.service";
import {LocalStateService} from "./locat.state.service";

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  providers: [LocalStateService]
})
export class FlightSearchComponent {

  readonly refresh$ = this.ls.refresh$;
  flights$ = this.gs.flights$;

  constructor(
    private gs: GlobalStateService,
    private ls: LocalStateService
  ) {
    const inputChanges$ = this.ls.searchCredentials$.pipe(
      tap(({from, to}) => this.gs.load(from, to))
    );
  }

  isFlightSelect(id: string) {
    this.ls.isFlightSelect(id) ;
  }
  selectFlight(id: string) {
    this.ls.selectFlight = id;
  }

}
