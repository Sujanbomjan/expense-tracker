import { useState } from "react";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { setBudget } from "@/store/budgetSlice";
import { CATEGORIES } from "@/utils/categories";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface BudgetDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function BudgetDialog({ open, onClose }: BudgetDialogProps) {
  const dispatch = useAppDispatch();
  const budgets = useAppSelector((s) => s.budgets);
  const [localBudgets, setLocalBudgets] = useState<{ [key: string]: string }>(
    Object.fromEntries(
      Object.entries(budgets).map(([k, v]) => [k, v.toString()])
    )
  );

  const handleSave = () => {
    Object.entries(localBudgets).forEach(([category, amount]) => {
      if (amount && Number(amount) > 0) {
        dispatch(setBudget({ category, amount: Number(amount) }));
      }
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Set Monthly Budgets</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {CATEGORIES.map((category) => (
            <Card key={category.name}>
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  {category.icon}
                </div>

                <div className="flex-1">
                  <Label htmlFor={`budget-${category.name}`}>
                    {category.name}
                  </Label>
                </div>

                <Input
                  id={`budget-${category.name}`}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={localBudgets[category.name] || ""}
                  onChange={(e) =>
                    setLocalBudgets((prev) => ({
                      ...prev,
                      [category.name]: e.target.value,
                    }))
                  }
                  className="w-32"
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Budgets</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
