import { useEffect, useRef } from "react";
import { useAppSelector } from "@/store/store";
import { useAuth } from "@/context/AuthContext";
import { ref, update } from "firebase/database";
import { db } from "@/config/firebase";

export function useFirebaseSync(isInitialLoadComplete: boolean) {
  const { user } = useAuth();
  const transactions = useAppSelector((s) => s.transactions);
  const budgets = useAppSelector((s) => s.budgets);
  const currency = useAppSelector((s) => s.currency);

  const prevDataRef = useRef<string>("");
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!user || !isInitialLoadComplete) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevDataRef.current = JSON.stringify({
        transactions,
        budgets,
        currency,
      });
      return;
    }

    const currentData = JSON.stringify({
      transactions,
      budgets,
      currency,
    });

    if (prevDataRef.current === currentData) return;
    prevDataRef.current = currentData;

    const syncData = async () => {
      try {
        const userRef = ref(db, `users/${user.uid}`);
        await update(userRef, {
          transactions: Object.fromEntries(
            transactions.map((tx) => [tx.id, tx])
          ),
          budgets,
          currency: {
            base: currency.base,
            display: currency.display,
          },
          lastUpdated: new Date().toISOString(),
        });
        console.log("Data synced to Firebase");
      } catch (error) {
        console.error("Error syncing to Firebase:", error);
      }
    };

    const timeoutId = setTimeout(syncData, 1200);
    return () => clearTimeout(timeoutId);
  }, [user, transactions, budgets, currency, isInitialLoadComplete]);
}
