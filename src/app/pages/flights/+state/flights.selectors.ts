import {createFeatureSelector, createSelector} from '@ngrx/store';
import {FlightState} from '@app/pages/flights/+state/flight.reducer';

export const getFlightBookingState = createFeatureSelector<FlightState>('flightsBooking');

export const getFlights = createSelector(
  getFlightBookingState,
  (state: FlightState) => state.flights
);
