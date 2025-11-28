import type { Currency } from "@/types";

export const CURRENCIES: Currency[] = [
  { code: "NPR", symbol: "रू", name: "Nepalese Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
];

export const convertAmount = (
  amount: number,
  from: string,
  to: string,
  rates: { [key: string]: number }
): number => {
  if (from === to) return amount;
  if (!rates || Object.keys(rates).length === 0) return amount;

  const fromRate = rates[from] || 1;
  const toRate = rates[to] || 1;
  const amountInBase = from === "NPR" ? amount : amount / fromRate;
  return to === "NPR" ? amountInBase : amountInBase * toRate;
};
