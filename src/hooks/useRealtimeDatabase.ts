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
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setIsInitialLoadComplete(true);
      return;
    }

    const userRef = ref(db, `users/${user.uid}`);
    let isInitialLoad = true;

    const unsubscribe = onValue(
      userRef,
      (snapshot) => {
        const data = snapshot.val();

        try {
          if (data && typeof data === "object") {
            const transactions = data.transactions
              ? (Object.values(data.transactions) as any[])
              : [];

            dispatch(setTransactions(transactions));
            dispatch(setBudgets(data.budgets || {}));

            if (data.currency) {
              dispatch(setBaseCurrency(data.currency.base || "NPR"));
              dispatch(setDisplayCurrency(data.currency.display || "NPR"));
            }

            setError(null);
          } else if (isInitialLoad) {
            const initialData = {
              email: user.email,
              displayName: user.displayName,
              createdAt: new Date().toISOString(),
              transactions: {},
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
          setIsInitialLoadComplete(true);
          isInitialLoad = false;
        } catch (err: any) {
          console.error("Error processing data:", err);
          setError("Failed to load data");
          setLoading(false);
          setIsInitialLoadComplete(true);
        }
      },
      (err) => {
        console.error("Firebase listener error:", err);

        if (err.cause === "PERMISSION_DENIED") {
          setError("Permission denied. Check Firebase rules.");
        } else {
          setError("Network/Firebase connection error.");
        }

        setLoading(false);
        setIsInitialLoadComplete(true);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user, dispatch]);

  return { loading, error, isInitialLoadComplete };
}
