import { useEffect } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useAppDispatch } from "@/store/store";
import { addTransaction } from "@/store/transactionsSlice";
import { CATEGORIES } from "@/utils/categories";
import { CURRENCIES } from "@/utils/currency";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface FormValues {
  type: "income" | "expense";
  amount: number;
  category: string;
  description?: string;
  date: Date;
  currency: string;
}

const schema: yup.ObjectSchema<FormValues> = yup.object({
  type: yup.string().oneOf(["income", "expense"]).required() as yup.Schema<
    "income" | "expense"
  >,
  amount: yup.number().positive().required("Amount is required"),
  category: yup.string().required("Category is required"),
  description: yup.string().optional(),
  date: yup.date().required("Date is required"),
  currency: yup.string().required("Currency is required"),
});

interface AddTransactionDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddTransactionDialog({
  open,
  onClose,
}: AddTransactionDialogProps) {
  const dispatch = useAppDispatch();

  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      type: "expense",
      amount: 0,
      category: "",
      description: "",
      date: new Date(),
      currency: "NPR",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset({
        type: "expense",
        amount: 0,
        category: "",
        description: "",
        date: new Date(),
        currency: "NPR",
      });
    }
  }, [open, form]);

  const handleSubmit = (data: FormValues) => {
    dispatch(
      addTransaction({
        id: Date.now(),
        type: data.type,
        amount: data.amount,
        category: data.category,
        description: data.description || "",
        date: data.date.toISOString(),
        currency: data.currency,
      })
    );
    onClose();
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <div className="space-y-4">
            {/* TYPE (Tabs) */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Tabs value={field.value} onValueChange={field.onChange}>
                      <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="expense">Expense</TabsTrigger>
                        <TabsTrigger value="income">Income</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* AMOUNT + CURRENCY */}
            <div className="grid grid-cols-2 gap-4">
              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="0.00"
                        value={field.value || ""}
                        onChange={(e) => {
                          const v = e.target.value
                            .replace(/[^0-9.]/g, "")
                            .replace(/(\..*)\./g, "$1");
                          field.onChange(v === "" ? 0 : Number(v));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Currency */}
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.symbol} {c.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* CATEGORY */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c.name} value={c.name}>
                            <span className="flex items-center gap-2">
                              {c.icon}
                              {c.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DATE */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString().slice(0, 10)
                          : ""
                      }
                      onChange={(e) => {
                        const dateValue = e.target.value;
                        if (dateValue) {
                          field.onChange(new Date(dateValue));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="button" onClick={form.handleSubmit(handleSubmit)}>
                Add Transaction
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
