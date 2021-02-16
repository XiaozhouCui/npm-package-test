import { Dispatch } from "redux";
import { RootState } from "../reducers";
import { Action } from "../actions";
import { ActionType } from "../action-types";
import { saveCells } from "../action-creators";

// Call saveCells() in useEffect, but DON'T trigger it too frequently - limit the triggering actions
// This middleware will be wired up in store.ts and added in front of redux-thunk
// The outer most arg is "store" (store.dispatch, store.getState)
export const persistMiddleware = ({
  dispatch,
  getState,
}: {
  dispatch: Dispatch<Action>;
  getState: () => RootState;
}) => {
  let timer: any;

  return (next: (action: Action) => void) => {
    return (action: Action) => {
      next(action);
      if (
        [
          ActionType.MOVE_CELL,
          ActionType.UPDATE_CELL,
          ActionType.INSERT_CELL_AFTER,
          ActionType.DELETE_CELL,
        ].includes(action.type)
      ) {
        // debounding logic: prevent calling api too frequently
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          // saveCells() returns a function, need to invoke again
          saveCells()(dispatch, getState);
        }, 1000);
      }
    };
  };
};
