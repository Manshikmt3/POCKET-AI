"use client";

import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Landmark, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/currencies";
import { DeleteAccountButton } from "@/components/delete-account-button";

export function AccountCard({ account }) {
  const router = useRouter();
  const isCurrent = account.type === "CURRENT";
  const Icon = isCurrent ? CreditCard : Landmark;

  return (
    <Card 
      onClick={() => router.push(`/account/${account.id}`)}
      className="hover:shadow-md transition-all cursor-pointer group border-gray-100 rounded-2xl overflow-hidden relative p-6 h-full flex flex-col"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold text-gray-800">
            {account.name}
          </CardTitle>
          <Badge
            variant="secondary"
            className="bg-gray-100 text-gray-500 font-bold text-[10px] uppercase tracking-wider"
          >
            {account.type}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {account.isDefault && (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-bold border-green-200">
              Default
            </Badge>
          )}
          <div onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}>
            <DeleteAccountButton accountId={account.id} />
          </div>
        </div>
      </div>

      <CardContent className="p-0 space-y-6 mt-auto">
        <div>
          <div className="text-4xl font-black text-gray-900 tracking-tight">
            {formatCurrency(account.balance, account.currency || "INR")}
          </div>
          <p className="text-xs text-gray-400 font-bold mt-1">
            Current Balance
          </p>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
            <ArrowUpRight className="h-4 w-4" />
            <span>Income</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-500 font-bold text-xs">
            <ArrowDownRight className="h-4 w-4" />
            <span>Expense</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
