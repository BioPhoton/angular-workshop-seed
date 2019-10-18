# Selectors

## Adding a first selector

In this part of the lab, you'll add a selector that queries all the flights that are not on a defined negative list.

1. Open the file ``flight-booking.reducer.ts`` and add a property ``negativeList`` to your ``State``:

    ```typescript
    export interface State {
        flights: Flight[];
        negativeList: number[]
    }

    export const initialState: State = {
        flights: [],
        negativeList: [3]
    };
    ```

    For the sake of simplicity, this example defines a default value for the negative list to filter the flight with the id 3.

2. In your ``+state`` folder, create a file ``flight-booking.selectors.ts``:

    ```typescript
    import { createSelector } from "@ngrx/store";
    import { FlightBookingAppState } from "./flight-booking.reducer";

    export const selectFlights = (s: FlightBookingAppState) => s.flightBooking.flights;
    export const negativeList = (s: FlightBookingAppState) => s.flightBooking.negativeList;

    export const selectedFilteredFlights = createSelector(
        selectFlights,
        negativeList,
        (flights, negativeList) => flights.filter(f => !negativeList.includes(f.id))
    );
    ```

3. In your ``flight-search.component.ts``, use the selector when fetching data from the store:

    ```typescript
    this.flights$ = this.store.select(selectedFilteredFlights);
    ```

4. Test your application.

## Bonus: Using feature selectors *

To get rid of your FlightBookingAppState type, you can use a feature selector pointing to the branch of your feature:

```TypeScript
// Create feature selector
export const selectFlightBooking = createFeatureSelector<FlightBookingState>('flightBooking');

// Use feature selector to get data from feature branch
export const selectFlights = createSelector(selectFlightBooking, s => s.flights);

export const negativeList = createSelector(selectFlightBooking, s => s.negativeList);

[...]
```

## Bonus: Using parameterized selectors *

You can pass a property object to a selector when calling it. This object is assigned to a further parameter in your selectors projection function.

1. In your ``flight-booking.selectors.ts`` file, add the following selector:

    ```typescript
    export const selectFlightsWithProps = createSelector(
        (a: FlightBookingAppState) => a.flightBooking.flights,
        (flights, props) => flights.filter(f => !props.blackList.includes(f.id))
    );
    ```

    Please note that the projector get an additional ``props`` parameter. It points to a dynamic object.

2. Open the file ``flight-search.component.ts`` and fetch data with this selector:

    ```typescript
    this.flights$ = this.store.select(selectFlightsWithProps, { blackList: [3]});
    ```

3. Test your solution.