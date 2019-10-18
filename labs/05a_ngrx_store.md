# Manage state with @ngrx/store

- [Manage state with @ngrx/store](#manage-state-with-ngrxstore)
  - [Prerequisites](#prerequisites)
  - [Setup the store](#setup-the-store)
  - [Setup State Management for a Feature Module](#setup-state-management-for-a-feature-module)
  - [Update a Flight](#update-a-flight)
  - [Bonus: Connecting the Router to the Store **](#bonus-connecting-the-router-to-the-store)
  - [Bonus: Using Mutables with ngrx-etc *](#bonus-using-mutables-with-ngrx-etc)

## Prerequisites

**If** you don't have installed the Angular CLI do it now:

  ```
  npm i -g @angular/cli
  ```

Aldo install:
```
npm i @ngrx/schematics -D
npm i @ngrx/store -S
npm i @ngrx/effects -S
```
**If and only if** you don't have installed the CLI and the last command didn't work (e. g. b/c of your firewall) you can use the project-local CLI installation here. In this case, you have to execute the CLI with ``npm run``. The next snipped shows this by requesting the CLI's version:

  ```
  npm run ng -- -v
  ```

  Please note, that you need those two dashes to tell npm that the parameters are not indented for npm but ng.

  If you have a newer version of npm, you could also use ``npx``:

  ```
  npx ng -v
  ```

## Setup the store

1. Open your ``package.json`` and find out, that some libraries from the ``@ngrx/*`` scope have been installed. One of them is ``@ngrx/schematics`` which extends the CLI by additional commands we are using in the next steps to generate boilerplate code.

2. Open your ``angular.json`` and search for  ``@ngrx/schematics``. Find out the the entry ``defaultCollection`` points to this package. Hence, we can use its CLI extensions directly.

3. To setup the ``StoreModule`` and all the needed imports, switch into the folder ``projects\flight-app\src\app`` and run the following command.
  
    `` ng generate @ngrx/schematics:store AppState --root --statePath=+state --module=app.module.ts --project=angular-workshop-seed``
 
4. Open the new `+state` folder and its ``index.ts`` file.

5. Open the ``app.module.ts`` file and inspect the current changes. You should find some additional imported modules.

    Check whether all ``import`` statements in this file work. If not, correct them (sometimes the generated code has some minor issues).

6. Also import the ``EffectsModule`` into the ``AppModule``. Even though we will use it only later, we have to import it now to make the generated code run.

    ```typescript
    import { EffectsModule } from '@ngrx/effects';

    [...]
    
    imports: [
        [...],
        EffectsModule.forRoot([])
    ];
    ```

## Setup State Management for a Feature Module

1. To setup the ``StoreModule`` for a feature module, switch into the folder ``projects\flight-app\src\app`` and use the following command:
  
    `ng generate feature flight-booking/+state/FlightBooking --module=flight-booking/flight-booking.module.ts --spec=false --creators`
    
    Open the new `+state` folder and inspect the files.
      
    Inspect all of them and take a look at the `flight-booking.module.ts` where everything is imported.
    See that the `.forFeature` method is called here.

2. Open the file ``flight-booking.effects.ts`` and remove the body of the class ``FlightBookingEffects`` as well as all unnecessary imports. Will will come back to this file in a later exercise.

    ```TypeScript
    import {Injectable} from '@angular/core';
    // No other imports, for now

    @Injectable()
    export class FlightBookingEffects {
      // No body, for now
    }
    ```

3. Open the file ``flights-booking.reducer.ts``. Extend the interface ``State`` by a property ``flights`` with the type ``Flight[]``.

    <details>
    <summary>Show code</summary>
    <p>

    ```typescript
    export interface State {
      flights: Flight[]
    }
    ```

    </p>
    </details>

4. Below, define an empty array as the initial state for the new property ``initialState``.
    <details>
    <summary>Show code</summary>
    <p>

    ```typescript

    export const initialState: State = {
      flights: []
    };

    ```

    </p>
    </details>

5. In the same file, insert an interface ``FlightBookingAppState`` that represents the root nodes view to our State:

    ```typescript
    export interface FlightBookingAppState {
      flightBooking: State
    }
    ```

6. Open the file `flight-booking.actions.ts` and setup a ``flightsLoaded`` action creator.

    <details>
    <summary>Show code</summary>
    <p>
    You can replace the whole file with the following content:

    ```typescript
    [...]

    export const flightsLoaded = createAction(
      '[FlightBooking] FlightsLoaded',
      props<{flights: Flight[]}>()
    );
    ```

    </p>
    </details>


7. Open the file ``flight-booking.reducer.ts`` and extend the reducer function so that it handles the ``flightsLoaded`` action.

    <details>
    <summary>Show code</summary>
    <p>

    ```TypeScript
    export const flightBookingReducer = createReducer(
      initialState,

      on(flightsLoaded, (state, action) => {
        const flights = action.flights;
        return { ...state, flights };
      })
    )
    ```

    </p>
    </details>

8. Open the file ``flight-search.component.ts``. Inject the Store into the constructor. Introduce a property ``flights$`` (``Observable<Flight[]>``) which points to the flights in the store.

    <details>
    <summary>Show code</summary>
    <p>

    ```typescript
    export class FlightSearchComponent implements OnInit {

      [...]

      flights$: Observable<Flight[]>;

      constructor(
        [...]
        private store: Store<FlightBookingAppState>
      ) { }

      ngOnInit() {
        this.flights$ = this.store.select(s => s.flightBooking.flights);
      }

      [...]
    }
    ```
    </p>
    </details>

9. Modify the component's ``search`` method so that the loaded flights are send to the store. For this, use the ``FlightService``'s ``find`` method instead of the ``load`` method and dispatch a ``flightsLoaded`` action.

    <details>
    <summary>Show code</summary>
    <p>

    ```TypeScript
    search(): void {
      if (!this.from || !this.to) return;

      // old:
      // this.flightService.load(...)

      // new:
      this.flightService
          .find(this.from, this.to, this.urgent)
          .subscribe(
            flights => { 
              this.store.dispatch(flightsLoaded({flights}));
            },
            error => {
              console.error('error', error);
            } 
          );
    }
    ```

    </p>
    </details>

10. Open the component's template, ``flight-search.component.html``, and use the observable ``flights$`` together with the ``async`` pipe instead of the array ``flights``.

    <details>
    <summary>Show code</summary>
    <p>

    ```html
    <div *ngFor="let f of flights$ | async">
      <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <flight-card [...]></flight-card>
      </div>
    </div>
    ```

    </p>
    </details>

11. Test your solution

12. Install the Chrome plugin ``Redux DevTools`` and use it to trace the dispatched actions.

## Update a Flight

In this exercise you will write an action for updating a flight. You will use it to delay the first flight by 15 minutes.

This exercise shows that working with immutables in JavaScript is not always as straight we would like it to be.

1. Open the file ``flight-booking.actions.ts`` and add a ``updateFlight`` action creator for updating a changed flight in the store.

    <details>
    <summary>Show code</summary>
    <p>

    ```TypeScript
    [...]

    export const updateFlight = createAction(
      '[FlightBooking] Update Flight',
      props<{flight: Flight}>()
    );
    ```

    </p>
    </details>

2. Open the file ``flight-booking.reducer.ts`` and update the reducer to handle the ``FlightUpdateAction``. 

    <details>
    <summary>Show code</summary>
    <p>

    ```TypeScript
    [...]
    const flightBookingReducer = createReducer(
      initialState,

      on(flightsLoaded, (state, action) => {
        const flights = action.flights;
        return { ...state, flights };
      }),

      // New:
      on(updateFlight, (state, action) => {
        const flight = action.flight;
        const flights = state.flights.map(f => f.id === flight.id? flight: f);
        return { ...state, flights };
      })
    );
    [...]
    ```

    </p>
    </details>

3. Open the ``flight-search.component.ts``. Within the ``delay`` method, dispatch a ``FlightUpdateAction`` that delays the first found flight for 15 minutes. As the flight is immutable, you have to create a new one.

    <details>
    <summary>Show code</summary>
    <p>

    ```TypeScript
    delay(): void {
      
      this.flights$.pipe(take(1)).subscribe(flights => {
        let flight = flights[0];

        let oldDate = new Date(flight.date);
        let newDate = new Date(oldDate.getTime() + 15 * 60 * 1000);
        let newFlight = { ...flight, date: newDate.toISOString() };
        
        this.store.dispatch(updateFlight({flight: newFlight}));
      });
    }
    ```

    </p>
    </details>

4. Open the ``flight-search.component.html`` file and make sure that the the ``Delay`` button uses the ``flights$`` observable instead of the flights array. A very simple way to accomplish this is using the ``async`` pipe:

    ```html
    <button *ngIf="(flights$ | async).length > 0" class="btn btn-default"
      (click)="delay()">
      Delay 1st Flight
    </button>
    ```

    If there is time, your instructor will discuss alternatives for this with you.

5. Test your solution.


## Bonus: Connecting the Router to the Store **

The ``StoreRouterConnectingModule`` helps to sync your router with the store. This exercise shows how to use it.

1. Open your file ``projects/flight-app/src/app/+state/index.ts``, import the ``routerReducer`` from ``@ngrx/router-store`` and register it:

    ```typescript
    import { routerReducer } from '@ngrx/router-store';
    [...]

    export const reducers: ActionReducerMap<State> = {
      router: routerReducer
    };
    ```

2. In your ``app.module``, configure the ``StoreRouterConnectingModule`` as shown below:

    ```typescript
    @NgModule({
      imports: [
        [...]
        StoreRouterConnectingModule.forRoot({stateKey: 'router'})
      ],
      [...]
    })
    export class AppModule {
    }
    ```

3. Start your application and navigate between the menu points. Open the Redux Devtools and replay all actions. Your should see, that the visited routes are replayed too.

## Bonus: Using Mutables with ngrx-etc *

The project ngrx-etc uses the library immer to allow mutating the state. At least, it looks like this. However, your mutations are only recorded and replayed in an immutable way. As a result, you can write your code as you are used to and although you get the benefits of immutables.

You can quickly try this out:

1. Install ngrx-etc: ``npm i ngrx-etc --save``
2. Lookup its readme: https://www.npmjs.com/package/ngrx-etc
3. Update your reducer so that it uses ``mutableOn`` instead of ``on`` as shown in the readme file

