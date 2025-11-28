import { useEffect } from "react";
import { useAppSelector } from "@/store/store";
import { useAuth } from "@/context/AuthContext";
import { ref, update } from "firebase/database";
import { db } from "@/config/firebase";

export function useFirebaseSync() {
  const { user } = useAuth();
  const transactions = useAppSelector((s) => s.transactions);
  const budgets = useAppSelector((s) => s.budgets);
  const currency = useAppSelector((s) => s.currency);
  useEffect(() => {
    if (!user) return;

    const syncData = async () => {
      try {
        const userRef = ref(db, `users/${user.uid}`);
        await update(userRef, {
          transactions,
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
    const timeoutId = setTimeout(syncData, 500);

    return () => clearTimeout(timeoutId);
  }, [user, transactions, budgets, currency]);
}
