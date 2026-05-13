"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SavingsDonut({ income, expense, savingsRate }) {
  const savedAmount = Math.max(0, income - expense);
  const data = [
    { name: "Saved", value: savedAmount, color: "#16a34a" },
    { name: "Spent", value: expense, color: "#ef4444" },
  ];

  return (
    <Card className="rounded-2xl shadow-sm border">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Savings Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full relative">
          {income === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <p>No income data</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border rounded shadow-sm text-sm">
                            <p className="font-medium">{payload[0].name}: ₹{payload[0].value.toLocaleString()}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-gray-900">{savingsRate}%</span>
                <span className="text-xs text-muted-foreground">Saved</span>
              </div>
            </>
          )}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            ₹{savedAmount.toLocaleString()} saved out of ₹{income.toLocaleString()} income
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
