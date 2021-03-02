import { Action } from 'umi';
import { AnyAction } from 'redux';

declare global {
  export type Reducer<S = any, A extends Action = AnyAction> = (
    state: S,
    action: A,
  ) => S;
}
