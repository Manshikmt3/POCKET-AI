import React, { Suspense } from "react";
import { getAnalyticsData } from "@/actions/analytics";
import AnalyticsFilters from "@/components/analytics/analytics-filters";
import StatsCards from "@/components/analytics/stats-cards";
import MonthlyBarChart from "@/components/analytics/monthly-bar-chart";
import SpendingTrendChart from "@/components/analytics/spending-trend-chart";
import CategoryChart from "@/components/analytics/category-chart";
import NetWorthChart from "@/components/analytics/net-worth-chart";
import SavingsDonut from "@/components/analytics/savings-donut";
import ExportButtons from "@/components/analytics/export-buttons";
import { startOfMonth, endOfMonth } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default async function AnalyticsPage({ searchParams }) {
  const { from, to, account } = await searchParams;

  const filters = {
    startDate: from || startOfMonth(new Date()).toISOString(),
    endDate: to || endOfMonth(new Date()).toISOString(),
    accountId: account || "all",
    currency: "INR",
  };

  const data = await getAnalyticsData(filters);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-green-600 tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track your financial patterns and insights
          </p>
        </div>
        <ExportButtons data={data} filters={filters} />
      </div>

      {/* Sticky Filters */}
      <AnalyticsFilters accounts={data.accounts} />

      {/* Stats Row */}
      <StatsCards
        totalIncome={data.totalIncome}
        totalExpense={data.totalExpense}
        savingsRate={data.savingsRate}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyBarChart data={data.monthlyData} />
        <SavingsDonut
          income={data.totalIncome}
          expense={data.totalExpense}
          savingsRate={data.savingsRate}
        />
        <SpendingTrendChart
          data={data.dailyData}
          budgetLimit={data.budget?.amount}
        />
        <CategoryChart data={data.categoryData} />
      </div>

      {/* Full width net worth chart */}
      <NetWorthChart transactions={data.transactions} />

    </div>
  );
}
