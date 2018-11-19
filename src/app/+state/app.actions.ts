import { Action } from '@ngrx/store';

export enum AppActionTypes {
  IncrementCount = '[App] Increment Count'
}

export class IncrementCount implements Action {
  readonly type = AppActionTypes.IncrementCount;
  constructor(readonly payload: {amount: number}) {}
}

export type AppActions = IncrementCount;
