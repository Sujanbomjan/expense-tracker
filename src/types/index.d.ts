export interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  currency: string;
}

export interface Category {
  name: string;
  color: string;
  icon: string;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface Budget {
  [category: string]: number;
}

export interface CurrencyState {
  base: string;
  display: string;
  rates: { [key: string]: number };
  lastUpdated: string | null;
  loading: boolean;
}

export interface RootState {
  transactions: Transaction[];
  budgets: Budget;
  currency: CurrencyState;
}
export default interface PieChartData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}
export interface MonthlyData {
  month: string;
  expenses: number;
  income: number;
}
