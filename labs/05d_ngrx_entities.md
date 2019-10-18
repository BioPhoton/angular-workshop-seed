# @ngrx/entity and @ngrx/schematics

- [@ngrx/entity and @ngrx/schematics](#ngrxentity-and-ngrxschematics)
    - [Managing Passengers](#managing-passengers)
    - [Bonus: Loading passengers **](#bonus-loading-passengers)

## Managing Passengers

In this exercise, you will leverage ``@ngrx/entity`` and ``@ngrx/schematics`` to manage ``Passenger`` entities with the store. For this, you will create an separate PassengerModule with a PassengerComponent.

2. Use the CLI to generate a new ``PassengersModule`` with the boilerplate for ``@ngrx/entity``. For this, switch into the folder ``projects\flight-app\src\app`` and use the following commands:

    ```
    ng g module passengers
    ng g entity passengers/+state/Passenger --module passengers/passengers.module.ts 
    ```

    If you use Linux or MacOS replace the backslashes with forward slashes.

3. Discover the generated files in the ``+state`` folder.

4. Open the file ``passenger.model`` and add a ``name`` property to the ``Passenger`` class. Also, **make the id a number**:

    ```TypeScript
    export interface Passenger {
        id: number;    // <-- Modify (number)
        name: string;  // <-- Add this
    }
    ```

4. In the new ``+state`` folder, create a new file ``passenger.selectors.ts``:

    ```typescript
    import * as fromPassanger from './passenger.reducer';
    import { createSelector } from '@ngrx/store';

    // Parent node pointing to passenger state
    export class PassengerState {
        passenger: fromPassanger.State;
    }

    // Selector pointing to passenger state in store
    const base = (s:PassengerState) => s.passenger;

    // Selector pointing to all passenger entities
    export const selectAllPassengers = createSelector(base, fromPassanger.selectAll);
    ```

4. In the ``passengers`` folder, create a new ``PassengerComponent``. In its ``ngOnInit`` method, send an ``AddPassengers`` action with an hard coded array of passengers to the store and query all the passengers using the above mentioned ``selectAllPassengers`` selector. Display the passengers in the template.

    <details>
    <summary>Show code (TypeScript)</summary>
    <p>

    ```TypeScript
    @Component({
        selector: 'passengers',
        templateUrl: './passengers.component.html',
        styleUrls: ['./passengers.component.css']
    })
    export class PassengersComponent implements OnInit {

        constructor(private store: Store<PassengerState>) { }

        passengers$: Observable<Passenger[]>;

        ngOnInit() {
            this.store.dispatch(new AddPassengers({ passengers: [{id: 1, name: 'Max'}, {id:2, name: 'Susi'}]}));
            this.passengers$ = this.store.select(selectAllPassengers);
        }

    }
    ```

    </p>
    </details>

    <details>
    <summary>Show code (HTML)</summary>
    <p>
    
    ```html
    <div class="card">
    <div class="header">
        <h2 class="title">Latest Passengers</h2>
    </div>
    <div class="content">
        <pre>{{ passengers$ | async | json}}</pre>
    </div>
    </div>
    ```
    
    </p>
    </details>

5. Make sure, the ``PassengerComponent`` is declared with the ``PassengerModule``.

5. Make sure, the ``PassengerModule`` is imported into the ``AppModule``.

6. Call the ``PassengerComponent`` within the ``HomeComponent`` to try it out.

    ```html
    <passengers></passengers>
    ```

7. Test your application.

## Bonus: Loading passengers **

Extend your solution to load passengers using a search form and an effect. You can use the following Web API for this:

    http://angular.at/api/passenger?name=Muster

Please note that this Web API is using PascalCase to display attributes with XML but camelCase for JSON to respect the respective usual conventions.