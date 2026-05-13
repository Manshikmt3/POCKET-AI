"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Pencil, X } from "lucide-react";
import { updateBudget } from "@/actions/budget";
import { getCurrencySymbol } from "@/lib/currencies";

export function BudgetProgress({ initialBudget, currentMonthExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState(initialBudget?.amount || 0);
  const [isLoading, setIsLoading] = useState(false);

  const budgetAmount = parseFloat(initialBudget?.amount || 0);
  const percentage =
    budgetAmount > 0 ? (currentMonthExpenses / budgetAmount) * 100 : 0;

  // Choose color based on percentage: green < 75%, yellow 75-90%, red > 90%
  const progressColor =
    percentage >= 90
      ? "bg-red-500"
      : percentage >= 75
      ? "bg-yellow-500"
      : "bg-green-500";

  const handleSave = async () => {
    const amountFloat = parseFloat(amount);
    if (isNaN(amountFloat) || amountFloat <= 0) return;

    setIsLoading(true);
    try {
      const res = await updateBudget(amountFloat);
      if (res.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update budget:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setAmount(initialBudget?.amount || 0);
    setIsEditing(false);
  };

  return (
    <Card className="rounded-2xl shadow-sm border-gray-100 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-sm font-bold text-gray-800">
              Monthly Budget (Default Account)
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              {initialBudget ? (
                <span className="text-gray-400 text-sm font-medium">
                  {getCurrencySymbol("INR")}
                  {currentMonthExpenses.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}{" "}
                  of {getCurrencySymbol("INR")}
                  {budgetAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}{" "}
                  spent
                </span>
              ) : (
                <span className="text-gray-400 text-sm font-medium">
                  No budget set
                </span>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-gray-600"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </div>
          </div>
          {isEditing && (
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-8 w-24 text-sm"
                disabled={isLoading}
                placeholder="Amount"
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-green-600"
                onClick={handleSave}
                disabled={isLoading}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-red-400"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-6">
        {initialBudget ? (
          <>
            <div className="relative pt-1">
              <Progress
                value={Math.min(percentage, 100)}
                className="h-1 bg-emerald-100"
                indicatorColor={progressColor}
              />
            </div>
            <div className="flex justify-end">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {percentage.toFixed(1)}% used
              </span>
            </div>
          </>
        ) : (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-bold text-green-600 border-green-200 hover:bg-green-50"
              onClick={() => setIsEditing(true)}
            >
              Set a budget
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
