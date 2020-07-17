import {Component} from '@angular/core';
import {FlightSearchAdapter} from "./flight-search.adapter";
import {SearchFlightViewModel} from "./search-flight.view-model";
import {map, switchMap, withLatestFrom} from "rxjs/operators";
import {combineLatest} from "rxjs";

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  providers: [SearchFlightViewModel, FlightSearchAdapter]
})
export class FlightSearchComponent {

  constructor(private fa: FlightSearchAdapter,
              public vm: SearchFlightViewModel
  ) {
    vm.connect('flights', this.fa.flights$);

    const from$ = this.vm.select('from');
    const to$ = this.vm.select('to');

    const searchParams$ = vm.searchTrigger.pipe(
      withLatestFrom(combineLatest([from$, to$])),
      map((r) => r[1])
    );
    vm.hold(searchParams$, ([from ,to]) => fa.search(from ,to));

  }


}
