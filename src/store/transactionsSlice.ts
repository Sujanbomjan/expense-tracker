import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Transaction } from "@/types";

const initialState: Transaction[] = [];

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.push(action.payload);
    },
    deleteTransaction: (state, action: PayloadAction<number>) => {
      return state.filter((t) => t.id !== action.payload);
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      return action.payload;
    },
  },
});

export const { addTransaction, deleteTransaction, setTransactions } =
  transactionsSlice.actions;
export default transactionsSlice.reducer;
