import { Action } from '@ngrx/store';
import { FlightActions, FlightActionTypes } from './flight.actions';

export interface State {

}

export const initialState: State = {

};

export function reducer(state = initialState, action: FlightActions): State {
  switch (action.type) {

    case FlightActionTypes.LoadFlights:
      return state;


    default:
      return state;
  }
}
