import React, { Suspense } from "react";
import { Plus } from "lucide-react";
import { getDashboardData } from "@/actions/dashboard";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { AccountCard } from "@/components/account-card";
import { TransactionTable } from "@/components/transaction-table";
import { BudgetProgress } from "@/components/budget-progress";
import { DashboardCharts } from "@/components/dashboard-charts";
import { FinancialInsights } from "@/components/financial-insights";
import { AiChat } from "@/components/ai-chat";
import { checkUser } from "@/lib/checkUser";
import Image from "next/image";

export default async function DashboardPage() {
  await checkUser(); // Ensure user is synced
  
  const res = await getDashboardData();
  
  if (!res.success) {
    return <div className="p-8 text-red-500">Error loading dashboard: {res.error}</div>;
  }

  const { accounts, transactions, budget, allTransactions } = res.data;
  
  // Calculate current month expenses
  const currentMonthExpenses = allTransactions
    .filter(t => t.type === "EXPENSE")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Title with Gradient */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl md:text-6xl gradient-title leading-tight">Dashboard</h1>
      </div>

      {/* Full Width Budget Progress */}
      <div className="mb-10">
        <BudgetProgress initialBudget={budget} currentMonthExpenses={currentMonthExpenses} />
      </div>

      {/* Transactions and Breakdown Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <TransactionTable transactions={transactions} accounts={accounts} />
        <DashboardCharts transactions={transactions} />
      </div>


      {/* Account Cards at Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <CreateAccountDrawer>
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:bg-gray-50 transition-all cursor-pointer group h-full min-h-[200px]">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-green-100 transition-all">
              <Plus className="h-6 w-6 text-gray-400 group-hover:text-green-600 transition-all" />
            </div>
            <p className="font-semibold text-gray-500 group-hover:text-green-600">Add New Account</p>
          </div>
        </CreateAccountDrawer>
        {accounts.map(account => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>

      {/* Floating AI Chat Assistant */}
      <AiChat />
    </div>
  );

}
