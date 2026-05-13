"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default function NetWorthChart({ transactions }) {
  // Calculate running balance
  const calculateNetWorthData = () => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let currentBalance = 0;
    const data = sorted.map(t => {
      if (t.type === "INCOME") currentBalance += t.amount;
      else currentBalance -= t.amount;
      
      return {
        date: format(new Date(t.date), "MMM dd"),
        balance: currentBalance,
      };
    });

    // Group by date to show last balance of the day
    const grouped = data.reduce((acc, curr) => {
      acc[curr.date] = curr.balance;
      return acc;
    }, {});

    return Object.keys(grouped).map(date => ({
      date,
      balance: grouped[date],
    }));
  };

  const chartData = calculateNetWorthData();

  return (
    <Card className="rounded-2xl shadow-sm border col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Net Worth Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <p>No transactions found</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-bold text-gray-900 mb-1">{payload[0].payload.date}</p>
                          <p className="text-green-600">Balance: ₹{payload[0].value.toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#16a34a" 
                  fillOpacity={1} 
                  fill="url(#colorBalance)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
