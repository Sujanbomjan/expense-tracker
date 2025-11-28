import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { CurrencyState } from "@/types";

interface FetchRatesResponse {
  rates: { [key: string]: number };
  lastUpdated: string | null;
}

export const fetchRatesAsync = createAsyncThunk<FetchRatesResponse, string>(
  "currency/fetchRates",
  async (base = "NPR") => {
    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${base}`
      );
      const data = await response.json();

      const lastUpdated = data.time_last_updated
        ? new Date(data.time_last_updated * 1000).toISOString()
        : new Date().toISOString();
      return {
        rates: data.rates || {},
        lastUpdated,
      };
    } catch (error) {
      return { rates: {}, lastUpdated: null };
    }
  }
);

const initialState: CurrencyState = {
  base: "NPR",
  display: "NPR",
  rates: {},
  lastUpdated: null,
  loading: false,
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setBaseCurrency: (state, action: PayloadAction<string>) => {
      state.base = action.payload;
    },
    setDisplayCurrency: (state, action: PayloadAction<string>) => {
      state.display = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRatesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRatesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.rates = action.payload.rates;
        state.lastUpdated = action.payload.lastUpdated;
      })
      .addCase(fetchRatesAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setBaseCurrency, setDisplayCurrency } = currencySlice.actions;
export default currencySlice.reducer;
