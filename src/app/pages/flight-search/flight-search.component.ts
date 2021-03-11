import {Component} from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, delay, exhaustMap, mergeMap, startWith, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import {Flight} from '../../core/api/models/flight';
import {FlightResource} from '../../core/api/resources/flight.resource';

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
    return this.to$.getValue()
  }
  set to(to: string) {
    this.to$.next(to);
  }

  selectedFlightIds: { [id: string]: boolean } = {};
  flights: Flight[] = [];

  readonly refresh$ = new Subject();

  flights$: Observable<Flight[]>;

  constructor(private fr: FlightResource) {
    const inputChanges$ = combineLatest([
      this.from$,
      this.to$
    ]).pipe(
      // debounceTime(500),
      switchMap(([from, to]) => {
        return this.fr.find(from, to).pipe(
          delay(2000)
        )
      })
    );
    const refreshChanges$ = this.refresh$.pipe(
      exhaustMap(() => this.fr.find(this.from, this.to)),
    );
    this.flights$ = merge(
      inputChanges$,
      refreshChanges$
    );
    /*const fetchFlights$ = this.fromTo$.pipe(
      // debounceTime(500),
      switchMap(({ from, to }) => {
        /!*resultOfCombineLatest[0] // from
         resultOfCombineLatest[1] // to*!/
        return this.fr.find(from, to).pipe(
          delay(2000)
        )
      })
    );*/

    /*this.refresh$.pipe(
      startWith('42'),
      exhaustMap(() => this.fr.find(this.from, this.to)),
    ).subscribe(flights => {
      console.log('refreshed flights');
      this.flights = flights;
    });*/
    // this.refresh$.next();
  }

  findFlights$(from, to): Observable<Flight[]> {
    return this.fr.find(from, to).pipe(
      delay(2000)
    )
  }

  selectedGive(): number {
    return Object.keys(this.selectedFlightIds).length;
  }

  searchFlights(from: string, to: string) {
    this.fr.find(from, to)
      .subscribe(
        newFlights => {
          this.flights = newFlights;
        }
      );
  }

  selectFlight(id: string) {
    this.selectedFlightIds[id] = !this.selectedFlightIds[id];
  }

}
