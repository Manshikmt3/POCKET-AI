"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ReceiptScanner } from "@/components/receipt-scanner";
import { createTransaction } from "@/actions/transactions";
import { CURRENCIES, getCurrencySymbol } from "@/lib/currencies";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.string().min(1, "Amount is required"),
  accountId: z.string().min(1, "Account is required"),
  category: z.string().min(1, "Category is required"),
  date: z.date({ required_error: "Date is required" }),
  description: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurringInterval: z
    .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
    .nullable()
    .optional(),
  currency: z.string().min(1, "Please select a currency"),
}).refine((data) => {
  if (data.isRecurring && !data.recurringInterval) {
    return false;
  }
  return true;
}, {
  message: "Recurring interval is required when recurring is enabled",
  path: ["recurringInterval"],
});

export function AddTransactionForm({ accounts }) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "EXPENSE",
      amount: "",
      accountId: accounts.find((a) => a.isDefault)?.id || accounts[0]?.id || "",
      category: "",
      date: new Date(),
      description: "",
      isRecurring: false,
      recurringInterval: null,
      currency: "INR",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = form;

  const isRecurring = watch("isRecurring");
  const type = watch("type");
  const selectedCurrency = watch("currency");
  const accountId = watch("accountId");
  const category = watch("category");
  const date = watch("date");
  const recurringInterval = watch("recurringInterval");
  const currencySymbol = getCurrencySymbol(selectedCurrency);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      amount: parseFloat(data.amount),
    };

    try {
      const res = await createTransaction(payload);
      if (res.success) {
        toast.success("Transaction created successfully");
        router.push(`/account/${data.accountId}`);
      } else {
        toast.error(res.error || "Failed to create transaction");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create transaction");
      console.error("Failed to create transaction:", error);
    }
  };

  const handleScanComplete = (scannedData) => {
    if (scannedData.amount) setValue("amount", scannedData.amount.toString());
    if (scannedData.date) setValue("date", new Date(scannedData.date));
    if (scannedData.description) {
      const desc = scannedData.merchantName
        ? `${scannedData.merchantName} - ${scannedData.description}`
        : scannedData.description;
      setValue("description", desc);
    }
    if (scannedData.category) {
      // Find matching category from list
      const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
      const match = allCategories.find(c => c.id.toLowerCase() === scannedData.category.toLowerCase());
      if (match) setValue("category", match.id);
    }
    if (scannedData.currency) setValue("currency", scannedData.currency);
    setValue("type", "EXPENSE");
  };

  return (
    <div className="space-y-8">
      <Card className="max-w-md mx-auto border-none shadow-none bg-transparent">
        <ReceiptScanner onScanComplete={handleScanComplete} />
      </Card>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100"
      >
        <div className="space-y-6">
          {/* Type Toggle */}
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">Transaction Type</Label>
            <div className="grid grid-cols-2 gap-4 p-1 bg-gray-100 rounded-xl">
              <Button
                type="button"
                variant={type === "INCOME" ? "default" : "ghost"}
                className={cn(
                  "h-10 rounded-lg font-bold transition-all",
                  type === "INCOME" ? "bg-green-600 hover:bg-green-700 text-white" : "text-gray-500"
                )}
                onClick={() => setValue("type", "INCOME")}
              >
                INCOME
              </Button>
              <Button
                type="button"
                variant={type === "EXPENSE" ? "default" : "ghost"}
                className={cn(
                  "h-10 rounded-lg font-bold transition-all",
                  type === "EXPENSE" ? "bg-red-500 hover:bg-red-600 text-white" : "text-gray-500"
                )}
                onClick={() => setValue("type", "EXPENSE")}
              >
                EXPENSE
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-bold text-gray-700">Amount</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{currencySymbol}</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("amount")}
                  className="h-12 pl-8 border-gray-200 rounded-xl"
                />
              </div>
              {errors.amount && <p className="text-xs text-red-500 font-medium">{errors.amount.message}</p>}
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">Currency</Label>
              <Select onValueChange={(val) => setValue("currency", val)} value={selectedCurrency}>
                <SelectTrigger className="h-12 border-gray-200 rounded-xl text-left">
                  {selectedCurrency ? (
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                        {selectedCurrency}
                      </span>
                      <span>{getCurrencySymbol(selectedCurrency)}</span>
                    </span>
                  ) : (
                    "Select currency"
                  )}
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                          {currency.code}
                        </span>
                        <span>{currency.symbol}</span>
                        <span className="text-muted-foreground text-xs">
                          {currency.name}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.currency && <p className="text-xs text-red-500 font-medium">{errors.currency.message}</p>}
            </div>

            {/* Account */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">Account</Label>
              <Select onValueChange={(val) => setValue("accountId", val)} value={accountId}>
                <SelectTrigger className="h-12 border-gray-200 rounded-xl text-left">
                  {accountId 
                    ? accounts.find(a => a.id === accountId)?.name 
                    : "Select account"}
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name} (${parseFloat(acc.balance).toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.accountId && <p className="text-xs text-red-500 font-medium">{errors.accountId.message}</p>}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">Category</Label>
              <Select onValueChange={(val) => setValue("category", val)} value={category}>
                <SelectTrigger className="h-12 border-gray-200 rounded-xl text-left">
                  {category ? (
                    [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].find(c => c.id === category)?.name
                  ) : (
                    "Select category"
                  )}
                </SelectTrigger>
                <SelectContent>
                  {(type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-red-500 font-medium">{errors.category.message}</p>}
            </div>

            {/* Date */}
            <div className="space-y-2 flex flex-col">
              <Label className="text-sm font-bold text-gray-700">Date</Label>
              <Popover>
                <PopoverTrigger
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full h-12 justify-start text-left font-normal border-gray-200 rounded-xl",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => setValue("date", date)}
                    initialFocus
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-xs text-red-500 font-medium">{errors.date.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-bold text-gray-700">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Enter description"
              {...register("description")}
              className="h-12 border-gray-200 rounded-xl"
            />
          </div>

          {/* Recurring Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="space-y-0.5">
              <Label htmlFor="isRecurring" className="text-sm font-bold text-gray-800">Recurring Transaction</Label>
              <p className="text-xs text-gray-500">Automatically repeat this transaction</p>
            </div>
            <Switch
              id="isRecurring"
              checked={isRecurring}
              onCheckedChange={(val) => setValue("isRecurring", val)}
            />
          </div>

          {isRecurring && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <Label className="text-sm font-bold text-gray-700">Interval</Label>
              <Select onValueChange={(val) => setValue("recurringInterval", val)} value={recurringInterval || ""}>
                <SelectTrigger className="h-12 border-gray-200 rounded-xl text-left">
                  {recurringInterval ? (
                    recurringInterval.charAt(0) + recurringInterval.slice(1).toLowerCase()
                  ) : (
                    "Select interval"
                  )}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAILY">Daily</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                </SelectContent>
              </Select>
              {errors.recurringInterval && (
                <p className="text-xs text-red-500 font-medium">{errors.recurringInterval.message}</p>
              )}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 rounded-xl border-gray-200 font-bold"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-green-800 hover:bg-green-900 text-white font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Transaction"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

const INCOME_CATEGORIES = [
  { id: "Salary", name: "Salary" },
  { id: "Freelance", name: "Freelance" },
  { id: "Investments", name: "Investments" },
  { id: "Business", name: "Business" },
  { id: "Rental", name: "Rental" },
  { id: "Other Income", name: "Other Income" },
];

const EXPENSE_CATEGORIES = [
  { id: "Housing", name: "Housing" },
  { id: "Transportation", name: "Transportation" },
  { id: "Groceries", name: "Groceries" },
  { id: "Utilities", name: "Utilities" },
  { id: "Entertainment", name: "Entertainment" },
  { id: "Food & Dining", name: "Food & Dining" },
  { id: "Shopping", name: "Shopping" },
  { id: "Healthcare", name: "Healthcare" },
  { id: "Education", name: "Education" },
  { id: "Personal Care", name: "Personal Care" },
  { id: "Travel", name: "Travel" },
  { id: "Insurance", name: "Insurance" },
  { id: "Gifts & Donations", name: "Gifts & Donations" },
  { id: "Bills", name: "Bills" },
  { id: "Other Expense", name: "Other Expense" },
];
