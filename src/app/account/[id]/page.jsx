import React from "react";
import { getAccountWithTransactions } from "@/actions/accounts";
import { TransactionTable } from "@/components/transaction-table";
import { DashboardCharts } from "@/components/dashboard-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currencies";
import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DeleteAccountButton } from "@/components/delete-account-button";

export default async function AccountPage({ params }) {
  const { id } = await params;
  const res = await getAccountWithTransactions(id);

  if (!res.success) {
    return <div className="p-8 text-red-500">Error loading account: {res.error}</div>;
  }

  const account = res.data;
  const transactions = account.transactions;

  // Calculate stats grouped by currency
  const statsByCurrency = transactions.reduce((acc, t) => {
    const curr = t.currency || "INR";
    if (!acc[curr]) acc[curr] = { income: 0, expense: 0 };
    if (t.type === "INCOME") acc[curr].income += parseFloat(t.amount);
    else acc[curr].expense += parseFloat(t.amount);
    return acc;
  }, {});

  const formatStats = (type) => {
    return Object.entries(statsByCurrency)
      .map(([curr, stats]) => formatCurrency(stats[type], curr))
      .join(" · ");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{account.name}</h1>
          <p className="text-muted-foreground capitalize">{account.type.toLowerCase()} Account</p>
        </div>
        <div className="flex space-x-2">
          <Link href="/transaction/create">
            <Button>Add Transaction</Button>
          </Link>
          <DeleteAccountButton accountId={id} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(account.balance, "INR")}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{formatStats("income") || "₹0.00"}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              -{formatStats("expense") || "₹0.00"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <DashboardCharts transactions={transactions} />
        </div>
        
        <div className="lg:col-span-2">
          <TransactionTable transactions={transactions} accounts={[]} />
        </div>
      </div>
    </div>
  );
}
