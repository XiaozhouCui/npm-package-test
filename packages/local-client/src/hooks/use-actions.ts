import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";

// wrap useDispatch and action creators
export const useActions = () => {
  const dispatch = useDispatch();
  // bindActionCreators returns different results everytime, triggering useEffect re-run indefinitely
  // need useMemo() to help: only run bindActionCreators() when dispatch changes
  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch);
  }, [dispatch]);
};
