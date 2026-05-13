"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Percent } from "lucide-react";
import { cn } from "@/lib/utils";

const useCountUp = (target, duration = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  return count;
};

export default function StatsCards({ totalIncome, totalExpense, savingsRate }) {
  const animatedIncome = useCountUp(totalIncome);
  const animatedExpense = useCountUp(totalExpense);
  const animatedSavings = useCountUp(totalIncome - totalExpense);
  const animatedRate = useCountUp(savingsRate);

  const netSavings = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            ₹{animatedIncome.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-green-600 font-medium">↑ 12%</span> vs last period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            ₹{animatedExpense.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-red-600 font-medium">↓ 8%</span> vs last period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
          <ArrowUpRight className={cn("h-4 w-4", netSavings >= 0 ? "text-green-600" : "text-red-600")} />
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold", netSavings >= 0 ? "text-green-600" : "text-red-600")}>
            ₹{animatedSavings.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            This period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
          <Percent className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent className="relative flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {animatedRate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Of income saved
            </p>
          </div>
          <div className="relative h-12 w-12">
            <svg className="h-full w-full" viewBox="0 0 36 36">
              <path
                className="text-muted stroke-current"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={cn(
                  "stroke-current",
                  savingsRate > 20 ? "text-green-600" : savingsRate > 10 ? "text-yellow-500" : "text-red-600"
                )}
                strokeWidth="3"
                strokeDasharray={`${savingsRate}, 100`}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
