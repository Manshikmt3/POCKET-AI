"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { generateFinancialInsights } from "@/actions/gemini";
import { Loader2, Lightbulb } from "lucide-react";

export function FinancialInsights({ transactions }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      if (!transactions || transactions.length === 0) {
        setLoading(false);
        return;
      }
      
      const res = await generateFinancialInsights(transactions);
      if (res.success) {
        setInsights(res.data);
      }
      setLoading(false);
    }

    fetchInsights();
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
          AI Financial Insights
        </CardTitle>
        <CardDescription>Based on your recent transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center text-muted-foreground text-sm">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing your spending patterns...
          </div>
        ) : insights.length > 0 ? (
          <ul className="space-y-4">
            {insights.map((insight, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2 mt-1 h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                <span className="text-sm">{insight}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-muted-foreground">
            Not enough data to generate insights. Add more transactions!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
