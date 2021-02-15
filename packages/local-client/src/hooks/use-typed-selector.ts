import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "../state";

// RootState is the return type of reducers type
// useTypedSelector function is the typed version of useSelector, it will understand the type of data in store
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
