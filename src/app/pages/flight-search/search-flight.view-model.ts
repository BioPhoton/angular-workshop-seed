import { Injectable } from '@angular/core';
import {FlightSearchResult} from "./flight-search.adapter";
import {RxState} from "@rx-angular/state";
import {Subject} from "rxjs";

interface SearchFlightState {
  selectedFlightIds: { [key: string]: boolean };
  from: string;
  to: string;
  isLoggedIn: boolean;
  flights: FlightSearchResult[]
}

@Injectable()
export class SearchFlightViewModel extends RxState<SearchFlightState>{

  logInTrigger = new Subject();
  logOutTrigger = new Subject();
  searchTrigger = new Subject();
  selectTrigger = new Subject<number>();
  fromChange = new Subject<string>();
  toChange = new Subject<string>();

  m$ = this.select();

  constructor() {
    super();

    this.connect('selectedFlightIds', this.selectTrigger, (oldState, newId) => {
      return {selectedFlightIds: !oldState.selectedFlightIds[newId]}
    })

  }

}
