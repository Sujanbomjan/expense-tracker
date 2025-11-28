import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Budget } from "@/types";

const initialState: Budget = {};

const budgetSlice = createSlice({
  name: "budgets",
  initialState,
  reducers: {
    setBudget: (
      state,
      action: PayloadAction<{ category: string; amount: number }>
    ) => {
      const { category, amount } = action.payload;
      state[category] = amount;
    },
    setBudgets: (state, action: PayloadAction<Budget>) => {
      console.log(state);
      return action.payload;
    },
  },
});

export const { setBudget, setBudgets } = budgetSlice.actions;
export default budgetSlice.reducer;
