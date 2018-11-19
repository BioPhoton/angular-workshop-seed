
import {AppState} from '@app/+state/app.reducer';
import {createSelector} from '@ngrx/store';
import {State} from '@app/+state';
export function getAppState(s: State): AppState {
  return s.app;
}

export const getCount = createSelector(
  getAppState,
  (state: AppState) => state.count
);
