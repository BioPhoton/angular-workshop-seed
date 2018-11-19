import {Flight} from 'flight-api/src/lib/models/flight';
import {
  FlightActions,
  FlightActionTypes,
  FlightsLoaded
} from './flight.actions';

export interface FlightState {
  flights: Flight[];
}

export const initialState: FlightState = {
  flights: []
};

export function reducer(state = initialState, action: FlightActions): FlightState {
  switch (action.type) {

    case FlightActionTypes.LoadFlights:
      return state;

    case FlightActionTypes.FlightsLoaded:
      return {
        ...state,
        flights: (action as FlightsLoaded).payload.flights
      };

    default:
      return state;
  }
}
