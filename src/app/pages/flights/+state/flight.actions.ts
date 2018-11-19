import { Action } from '@ngrx/store';

export enum FlightActionTypes {
  LoadFlights = '[Flight] Load Flights'
}

export class LoadFlights implements Action {
  readonly type = FlightActionTypes.LoadFlights;
}

export type FlightActions = LoadFlights;
