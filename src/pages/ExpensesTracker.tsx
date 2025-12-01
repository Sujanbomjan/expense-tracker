import { useEffect, useState } from "react";

import {
  fetchRatesAsync,
  setBaseCurrency,
  setDisplayCurrency,
} from "@/store/currencySlice";
import { CATEGORIES } from "@/utils/categories";
import { CURRENCIES } from "@/utils/currency";
import { convertAmount } from "@/utils/currency";
import type { MonthlyData } from "@/types";
import AddTransactionDialog from "@/components/transactions/AddTransactionDialog";
import TransactionsList from "@/components/transactions/TransactionsList";
import BudgetDialog from "@/components/budgets/BudgetDialog";
import CategoryPieChart from "@/components/charts/CategoryPieChart";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart";
import CurrencySelector from "@/components/common/CurrencySelector";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/store";

import {
  Wallet,
  PlusCircle,
  RefreshCw,
  Globe,
  TrendingUp,
  TrendingDown,
  DollarSign,
  LogOut,
  Loader2,
  User,
} from "lucide-react";
import type PieChartData from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useRealtimeDatabase } from "@/hooks/useRealtimeDatabase";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFirebaseSync } from "@/hooks/useFirebaseSync";

export default function ExpenseTracker() {
  const dispatch = useAppDispatch();
  const { base, display, rates, lastUpdated, loading } = useAppSelector(
    (s) => s.currency
  );
  const transactions = useAppSelector((s) => s.transactions);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const { user, logout } = useAuth();
  const {
    loading: dbLoading,
    error: dbError,
    isInitialLoadComplete,
  } = useRealtimeDatabase();

  useFirebaseSync(isInitialLoadComplete);

  useEffect(() => {
    dispatch(fetchRatesAsync(base));
  }, [dispatch, base]);

  if (dbLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-muted-foreground">Loading your data...</p>
      </div>
    );
  }

  if (dbError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{dbError}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const filteredTransactions = transactions.filter((t) =>
    t.date.startsWith(filterMonth)
  );

  const stats = filteredTransactions.reduce(
    (acc, t) => {
      const amt = convertAmount(t.amount, t.currency || base, display, rates);

      if (t.type === "expense") {
        acc.totalExpenses += amt;
        acc.byCategory[t.category] = (acc.byCategory[t.category] || 0) + amt;
      } else {
        acc.totalIncome += amt;
      }
      return acc;
    },
    {
      totalExpenses: 0,
      totalIncome: 0,
      byCategory: {} as { [key: string]: number },
    }
  );

  const pieData: PieChartData[] = Object.entries(stats.byCategory).map(
    ([name, value]) => ({
      name,
      value,
      color: CATEGORIES.find((c) => c.name === name)?.color || "#6b7280",
    })
  );

  const monthlyData: MonthlyData[] = [
    ...new Set(transactions.map((t) => t.date.slice(0, 7))),
  ]
    .sort()
    .slice(-6)
    .map((month) => {
      const monthTx = transactions.filter((t) => t.date.startsWith(month));

      const expenses = monthTx
        .filter((t) => t.type === "expense")
        .reduce(
          (s, t) =>
            s + convertAmount(t.amount, t.currency || base, display, rates),
          0
        );

      const income = monthTx
        .filter((t) => t.type === "income")
        .reduce(
          (s, t) =>
            s + convertAmount(t.amount, t.currency || base, display, rates),
          0
        );

      return { month, expenses, income };
    });

  const currencySymbol =
    CURRENCIES.find((c) => c.code === display)?.symbol || display;

  const handleRefreshRates = () => {
    dispatch(fetchRatesAsync(base));
  };

  const handleBaseCurrencyChange = (value: string) => {
    dispatch(setBaseCurrency(value));
    dispatch(fetchRatesAsync(value));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Expense Tracker Pro
              </h1>
              <p className="text-slate-600 mt-1">
                Track your finances with multi-currency support
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-gray-700">
                  {user?.displayName || user?.email}
                </span>
              </div>

              <div className="w-px h-6 bg-gray-300"></div>

              <Button
                variant="outline"
                onClick={() => logout()}
                className="gap-2 !px-3 !py-1.5 text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setIsBudgetOpen(true)}
              className="gap-2 cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              Budgets
            </Button>

            <Button
              onClick={() => setIsAddOpen(true)}
              className="gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Add Transaction
            </Button>
          </div>
        </header>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Multi-Currency Settings</div>
                  <div className="text-xs text-muted-foreground">
                    {lastUpdated
                      ? `Last updated: ${new Date(
                          lastUpdated
                        ).toLocaleString()}`
                      : loading
                      ? "Loading rates..."
                      : "No rates loaded"}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-end gap-3">
                <CurrencySelector
                  value={base}
                  onChange={handleBaseCurrencyChange}
                  label="Base Currency"
                />

                <CurrencySelector
                  value={display}
                  onChange={(v) => dispatch(setDisplayCurrency(v))}
                  label="Display Currency"
                />

                <Button
                  variant="outline"
                  onClick={handleRefreshRates}
                  disabled={loading}
                  className="gap-2"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Total Income"
            value={`${currencySymbol} ${stats.totalIncome.toFixed(2)}`}
            icon={TrendingUp}
            trend="up"
          />
          <StatsCard
            title="Total Expenses"
            value={`${currencySymbol} ${stats.totalExpenses.toFixed(2)}`}
            icon={TrendingDown}
            trend="down"
          />
          <StatsCard
            title="Net Balance"
            value={`${currencySymbol} ${(
              stats.totalIncome - stats.totalExpenses
            ).toFixed(2)}`}
            icon={DollarSign}
            trend="neutral"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Transactions</CardTitle>
                  <Input
                    type="month"
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="w-auto"
                  />
                </div>
              </CardHeader>

              <CardContent>
                <TransactionsList
                  transactions={filteredTransactions}
                  base={base}
                  display={display}
                  rates={rates}
                />
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryPieChart
                  data={pieData}
                  currencySymbol={currencySymbol}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <MonthlyBarChart
                  data={monthlyData}
                  currencySymbol={currencySymbol}
                />
              </CardContent>
            </Card>
          </aside>
        </div>

        <AddTransactionDialog
          open={isAddOpen}
          onClose={() => setIsAddOpen(false)}
        />
        <BudgetDialog
          open={isBudgetOpen}
          onClose={() => setIsBudgetOpen(false)}
        />
      </div>
    </div>
  );
}
