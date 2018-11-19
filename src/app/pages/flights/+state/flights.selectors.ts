import {createFeatureSelector, createSelector} from '@ngrx/store';
import {FlightState} from '@app/pages/flights/+state/flight.reducer';
import {State} from '@app/+state';

export const getFlightBookingState = createFeatureSelector<State>('flightsBooking');

export const getFlights = createSelector(
  getFlightBookingState,
  (state: FlightState) => state.flights
);
