import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { FlightActionTypes } from './flight.actions';

@Injectable()
export class FlightEffects {

  @Effect()
  loadFoos$ = this.actions$.pipe(ofType(FlightActionTypes.LoadFlights));

  constructor(private actions$: Actions) {}
}
