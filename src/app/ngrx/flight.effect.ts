import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Action} from '@ngrx/store';

import {Observable} from 'rxjs/Observable';
import {FlightResource} from '../core/api/resources/flight.resource';
import * as flight from './flight.action';

@Injectable()
export class FlightEffects {

  @Effect()
  // effects listen for actions
  find$: Observable<Action> = this.actions$.ofType<flight.FindAction>(flight.FIND_FLIGHTS)
    .switchMap((action) => {
      // handle side effects
      return this.fr.find(action.payload.from, action.payload.to)
      // and trigger another action by return a observable of action
        .map(flights => new flight.FindSuccessAction(flights))
        .catch((error) => {
          return Observable.of(new flight.FindFailAction(error))
        })
    });

  @Effect()
  // handle location update
  locationUpdate$: Observable<Action> = this.actions$.ofType('ROUTER_NAVIGATION')
    .filter((n: any) => {
      return n.payload.event.url.indexOf('flight')
    })
    .switchMap((action: any) => {
      // const rS = action.payload.routerState
      // const searchParams = rS.root.firstChild.params
      const searchParams = action.payload.routerState.params
      return Observable.of(new flight.FindAction(searchParams))
    });

  constructor(
    private actions$: Actions,
    private fr: FlightResource
  ) {}
}
