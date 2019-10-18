# Managing side effects with @ngrx/effects

In this exercise you will create an effect for loading flights.

1. Open your ``flight-booking.actions.ts`` file and add a ``loadFlights`` action creator:

    <details>
    <summary>Show code</summary>
    <p>

    ```TypeScript
    [...]

    export const loadFlights = createAction(
        '[FlightBooking] LoadFlights',
        props<{from: string, to: string, urgent: boolean}>()
    );
    ```

    </p>
    </details>


2. Open the file ``flight-booking.effects.ts`` and add an effect that takes a ``FlightsLoadAction``, loads the requested flights and returns a ``FlightsLoadedAction``.

    <details>
    <summary>Show code</summary>
    <p>

    ```TypeScript
    @Injectable()
    export class FlightBookingEffects {

      loadFlights = createEffect(() => 
          this.actions$.pipe(
          ofType(loadFlights), 
          switchMap(a => this.flightService.find(a.from, a.to, a.urgent)),
          map(flights => flightsLoaded({flights}))));

      constructor(
          private actions$: Actions,
          private flightService: FlightService) {}
    }
    ```

    </p>
    </details>

    **Tipp:** Import the ``Actions`` type from the module ``@ngrx/effects``: 
    
    ``import {Effect, Actions} from '@ngrx/effects';``


3. Open the file ``flight-search.component.ts``. Change the ``search`` method so that it just dispatches a ``loadFlights`` action.

    <details>
    <summary>Show code</summary>
    <p>

    ```TypeScript
    search(): void {
      if (!this.from || !this.to) return;

      // New:
      this.store.dispatch(loadFlights({
          from: this.from, 
          to: this.to, 
          urgent: this.urgent
        }));
      
      // Old:
      /*
      this.flightService
          .find(this.from, this.to, this.urgent)
          .subscribe(
            flights => { 
              this.store.dispatch(new flightsLoaded({flights}));
            },
            error => {
              console.error('error', error);
            } 
          );
      */
    }

    ```

    </p>
    </details>

4. Test the application.

5. Use the ``Redux DevTools`` Chrome plugin to find out which actions are dispatched.

## Bonus: Error Handling

1. Open your ``flight-booking.actions.ts`` file and add an LoadFlightsError Action without a payload:

  ```typescript
  export const loadFlightsError = createAction(
    '[FlightBooking] Load Flights Error'
  );
  ```

2. In your ``flight-booking.effects.ts``, add an error handler to the switchMap. This error handler should return the ``loadFlightError`` action.

    <details>
    <summary>Show code</summary>
    <p>
    
    ```typescript
      loadFlightBookings$ = createEffect(() => this.actions$.pipe(
        ofType(loadFlights),
        switchMap(a => this.flightService.find(a.from, a.to, a.urgent).pipe(
          map(flights => flightsLoaded({flights})),
          catchError(err => of(loadFlightsError()))
        )),
      ));
    ```
    
    </p>  
    </details>

3. Test your solution. You can simulate an error with the Browser's dev tools by activating offline module in the ``Network`` tab.
   
4. Use the Redux Dev Tools to make sure, that the ``loadFlightsError`` action is send to the store.