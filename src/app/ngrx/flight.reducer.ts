import {createSelector} from '@ngrx/store';
import {IDB} from '../app.module';
import {Flight} from '../core/api/models/flight';
import * as flight from './flight.action';

export interface IFlightState {
  flights?: Flight[]
  findPending?: boolean
}

export const initialFlightPage: IFlightState = {
  flights: [],
  findPending: false
}

// Reducers are our DB tables
export function flightReducer(state = initialFlightPage, action: flight.Actions): any {
  switch (action.type) {
    case flight.FIND_FLIGHTS:
      console.log('FIND', state, action);
      return {
        ...state,
        findPending: true
      }
    case flight.FIND_FLIGHTS_SUCCESS:
      console.log('FIND_SUCCESS', state, action);
      return {
        ...state,
        flights: action.payload,
        findPending: false
      }
    case flight.FIND_FLIGHTS_FAIL:
      console.log('FIND_FLIGHTS_FAIL', state, action);
      return {
        ...state,
        findPending: false
      }
    default:
      return state
  }

}

// Selectors are our queries
// we import access it under the name formFlight. Like we would query something...
// import * as fromFlight from '../../../ngrx/flight.reducer'
// fromFlight.getFlights
function getFlightState(db: IDB): IFlightState {
  return db.flightPage
}

export const getFlights = createSelector(
  getFlightState,
  (state: IFlightState) => state.flights
)


export const getFindPending = createSelector(
  getFlightState,
  (state: IFlightState) => state.findPending
)
