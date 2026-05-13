"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const income = payload[0].value;
    const expense = payload[1].value;
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-bold text-gray-900 mb-1">{payload[0].payload.month}</p>
        <p className="text-green-600">Income: ₹{income.toLocaleString()}</p>
        <p className="text-red-600">Expense: ₹{expense.toLocaleString()}</p>
        <div className="border-t mt-1 pt-1 font-medium text-gray-700">
          Net: ₹{(income - expense).toLocaleString()}
        </div>
      </div>
    );
  }
  return null;
};

export default function MonthlyBarChart({ data }) {

  return (
    <Card className="rounded-2xl shadow-sm border">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Income vs Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          {data.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <p>No data for this period</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} />
                <Bar dataKey="income" fill="#16a34a" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
