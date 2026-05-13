"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CATEGORY_COLORS = {
  housing: "#6366f1",
  food: "#f59e0b",
  transport: "#3b82f6",
  entertainment: "#ec4899",
  healthcare: "#14b8a6",
  shopping: "#8b5cf6",
  education: "#06b6d4",
  other: "#94a3b8",
};

export default function CategoryChart({ data }) {
  const chartData = data.slice(0, 8);
  if (data.length > 8) {
    const otherAmount = data.slice(8).reduce((sum, item) => sum + item.amount, 0);
    const otherCount = data.slice(8).reduce((sum, item) => sum + item.count, 0);
    const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
    chartData.push({
      category: "other",
      amount: otherAmount,
      count: otherCount,
      percentage: totalAmount > 0 ? Math.round((otherAmount / totalAmount) * 100) : 0,
    });
  }

  return (
    <Card className="rounded-2xl shadow-sm border">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          {data.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <p>No data for this period</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="category" 
                  type="category" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  width={100}
                  tickFormatter={(val) => val.charAt(0).toUpperCase() + val.slice(1)}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-bold text-gray-900 mb-1">{item.category.toUpperCase()}</p>
                          <p className="text-red-600">Amount: ₹{item.amount.toLocaleString()}</p>
                          <p className="text-gray-600">Transactions: {item.count}</p>
                          <p className="text-gray-600">Share: {item.percentage}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={20}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CATEGORY_COLORS[entry.category.toLowerCase()] || CATEGORY_COLORS.other} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
