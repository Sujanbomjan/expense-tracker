import { Trash2 } from "lucide-react";

import { useAppDispatch } from "@/store/store";
import { deleteTransaction } from "@/store/transactionsSlice";
import type { Transaction } from "@/types";
import { CURRENCIES } from "@/utils/currency";
import { CATEGORIES } from "@/utils/categories";
import { convertAmount } from "@/utils/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TransactionsListProps {
  transactions: Transaction[];
  base: string;
  display: string;
  rates: { [key: string]: number };
}

export default function TransactionsList({
  transactions,
  base,
  display,
  rates,
}: TransactionsListProps) {
  const dispatch = useAppDispatch();

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">No transactions found</p>
        </CardContent>
      </Card>
    );
  }

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-2">
      {sortedTransactions.map((tx) => {
        const category = CATEGORIES.find((c) => c.name === tx.category);
        const currency = CURRENCIES.find((c) => c.code === tx.currency);
        const converted = convertAmount(
          tx.amount,
          tx.currency || base,
          display,
          rates
        );
        const displayCurrency = CURRENCIES.find((c) => c.code === display);

        return (
          <Card key={tx.id} className="transition-all hover:shadow-md">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4 flex-1">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${category?.color}20` }}
                >
                  {category?.icon || "📦"}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">
                      {tx.description || tx.category}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {tx.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{new Date(tx.date).toLocaleDateString()}</span>
                    {tx.currency && tx.currency !== display && (
                      <>
                        <span>•</span>
                        <span>
                          Original: {currency?.symbol}
                          {tx.amount} {tx.currency}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "text-lg font-bold",
                    tx.type === "income" ? "text-green-600" : "text-red-600"
                  )}
                >
                  {tx.type === "income" ? "+" : "-"} {displayCurrency?.symbol}
                  {converted.toFixed(2)}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => dispatch(deleteTransaction(tx.id))}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
