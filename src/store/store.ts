import { configureStore } from "@reduxjs/toolkit";
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import transactionsReducer from "./transactionsSlice";
import budgetsReducer from "./budgetSlice";
import currencyReducer from "./currencySlice";

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    budgets: budgetsReducer,
    currency: currencyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
