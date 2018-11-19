import {
  AppActions,
  AppActionTypes,
  IncrementCount
} from '@app/+state/app.actions';


export interface AppState {
  count: number;
}

export const initialState: AppState = {
  count: 0
};

export function reducer(state = initialState, action: AppActions): AppState {
  switch (action.type) {

    case AppActionTypes.IncrementCount:
      return {
        ...state,
        count: state.count + (action as IncrementCount).payload.amount
      };

    default:
      return state;
  }
}
