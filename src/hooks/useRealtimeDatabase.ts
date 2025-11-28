import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/store";
import { useAuth } from "@/context/AuthContext";
import { ref, set, onValue } from "firebase/database";
import { db } from "@/config/firebase";
import { setTransactions } from "@/store/transactionsSlice";
import { setBudgets } from "@/store/budgetSlice";
import { setBaseCurrency, setDisplayCurrency } from "@/store/currencySlice";

export function useRealtimeDatabase() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const userRef = ref(db, `users/${user.uid}`);
    let isInitialLoad = true;

    const unsubscribe = onValue(
      userRef,
      (snapshot) => {
        const data = snapshot.val();

        if (isInitialLoad) {
          isInitialLoad = false;
        }

        try {
          if (data) {
            const transactions = Array.isArray(data.transactions)
              ? data.transactions
              : [];

            dispatch(setTransactions(transactions));
            dispatch(setBudgets(data.budgets || {}));

            if (data.currency) {
              dispatch(setBaseCurrency(data.currency.base || "NPR"));
              dispatch(setDisplayCurrency(data.currency.display || "NPR"));
            }
          } else {
            const initialData = {
              email: user.email,
              displayName: user.displayName,
              createdAt: new Date().toISOString(),
              transactions: [],
              budgets: {},
              currency: {
                base: "NPR",
                display: "NPR",
              },
            };

            set(userRef, initialData).catch((err) => {
              console.error("Error creating initial data:", err);
            });
          }

          setLoading(false);
          setError(null);
        } catch (err: any) {
          console.error("Error processing data:", err);
          setError("Failed to load data");
          setLoading(false);
        }
      },
      (err) => {
        console.error("Firebase listener error:", err);

        let errorMessage = "Connection error";

        if (err.cause === "PERMISSION_DENIED") {
          errorMessage = "Permission denied. Check database rules.";
        } else if (err.message?.includes("network")) {
          errorMessage = "Network error. Check your connection.";
        }

        setError(errorMessage);
        setLoading(false);
      }
    );

    return () => {
      console.log("Cleaning up Firebase listener");
      unsubscribe();
    };
  }, [user, dispatch]);

  return { loading, error };
}
