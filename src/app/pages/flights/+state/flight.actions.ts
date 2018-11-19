import { Action } from '@ngrx/store';
import {Flight} from 'flight-api/src/lib/models/flight';

export enum FlightActionTypes {
  LoadFlights = '[Flight] Load Flights',
  FlightsLoaded = '[Flight] Flights Loaded'
}

export class LoadFlights implements Action {
  readonly type = FlightActionTypes.LoadFlights;
}

export class FlightsLoaded implements Action {
  readonly type = FlightActionTypes.FlightsLoaded;
  constructor(readonly payload: {flights: Flight[]}) {}
}

export type FlightActions = LoadFlights | FlightsLoaded;
