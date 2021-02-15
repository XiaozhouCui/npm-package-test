import produce from "immer";
import { Action } from "../actions/index";
import { ActionType } from "../action-types";

// returned state from reducer
interface BundlesState {
  // key: current cell ID
  [key: string]:
    | {
        loading: boolean;
        code: string;
        err: string;
      }
    | undefined;
}

const initialState: BundlesState = {};

// produce() will make the state mutable
const reducer = produce(
  (state: BundlesState = initialState, action: Action): BundlesState => {
    switch (action.type) {
      case ActionType.BUNDLE_START:
        // lookup current cell
        state[action.payload.cellId] = {
          loading: true,
          code: "",
          err: "",
        };
        // return mutated state
        return state;
      case ActionType.BUNDLE_COMPLETE:
        state[action.payload.cellId] = {
          loading: false,
          code: action.payload.bundle.code,
          err: action.payload.bundle.err,
        };
        return state;
      default:
        return state;
    }
  }
);

export default reducer;
