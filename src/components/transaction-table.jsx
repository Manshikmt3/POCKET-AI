"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/currencies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";

export function TransactionTable({ transactions, accounts }) {
  const [selectedAccountId, setSelectedAccountId] = useState("all");

  const filteredTransactions = (
    selectedAccountId === "all"
      ? transactions
      : transactions.filter((t) => t.accountId === selectedAccountId)
  ).slice(0, 5);

  return (
    <Card className="rounded-2xl shadow-sm border-gray-100 overflow-hidden h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-bold text-gray-800">
          Recent Transactions
        </CardTitle>
        {accounts && accounts.length > 0 && (
          <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
            <SelectTrigger className="w-[180px] h-9 border-gray-200 rounded-lg text-gray-500 text-left">
              {selectedAccountId === "all" 
                ? "All Accounts" 
                : accounts.find(a => a.id === selectedAccountId)?.name}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              {accounts.map((acc) => (
                <SelectItem key={acc.id} value={acc.id}>
                  {acc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground h-24"
                  >
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {format(new Date(transaction.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {transaction.category}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-bold ${
                        transaction.type === "INCOME"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
                          {transaction.currency}
                        </span>
                        <div className="flex items-center gap-1">
                          {transaction.type === "INCOME" ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4" />
                          )}
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {filteredTransactions.length > 0 && (
            <div className="flex justify-center pt-2">
              <Link
                href={
                  selectedAccountId === "all"
                    ? accounts && accounts.length > 0 ? `/account/${accounts[0].id}` : "/dashboard"
                    : `/account/${selectedAccountId}`
                }
                className="text-sm font-bold text-gray-400 hover:text-green-600 transition-colors"
              >
                View All
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
