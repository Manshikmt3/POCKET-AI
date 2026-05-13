"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { startOfMonth, endOfMonth, subMonths, format, isWithinInterval, startOfDay, endOfDay } from "date-fns";

const serializeDecimal = (obj) => {
  const serialized = { ...obj };
  if (obj.amount && typeof obj.amount.toNumber === "function") {
    serialized.amount = obj.amount.toNumber();
  }
  if (obj.balance && typeof obj.balance.toNumber === "function") {
    serialized.balance = obj.balance.toNumber();
  }
  return serialized;
};

export async function getAnalyticsData(filters) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const { startDate, endDate, accountId } = filters;

  const whereClause = {
    userId: user.id,
    date: {
      gte: startOfDay(new Date(startDate)),
      lte: endOfDay(new Date(endDate)),
    },
    ...(accountId !== "all" && { accountId }),
  };

  const [transactions, accounts, budget] = await Promise.all([
    db.transaction.findMany({
      where: whereClause,
      orderBy: { date: "asc" },
      include: {
        account: true,
      },
    }),
    db.account.findMany({ where: { userId: user.id } }),
    db.budget.findUnique({ where: { userId: user.id } }),
  ]);

  const serializedTransactions = transactions.map(t => ({
    ...serializeDecimal(t),
    account: serializeDecimal(t.account)
  }));

  const monthlyData = getLast6MonthsData(serializedTransactions);
  const categoryData = getCategoryBreakdown(serializedTransactions);
  const dailyData = getDailySpending(serializedTransactions, startDate, endDate);

  const totalIncome = serializedTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = serializedTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsRate = totalIncome > 0
    ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
    : 0;

  return {
    transactions: serializedTransactions,
    accounts: accounts.map(serializeDecimal),
    budget: budget ? serializeDecimal(budget) : null,
    monthlyData,
    categoryData,
    dailyData,
    totalIncome,
    totalExpense,
    savingsRate,
  };
}

function getLast6MonthsData(transactions) {
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(new Date(), i);
    last6Months.push({
      month: format(monthDate, "MMM yy"),
      income: 0,
      expense: 0,
      fullDate: monthDate,
    });
  }

  transactions.forEach((t) => {
    const tMonth = format(new Date(t.date), "MMM yy");
    const month = last6Months.find((m) => m.month === tMonth);
    if (month) {
      if (t.type === "INCOME") month.income += t.amount;
      else month.expense += t.amount;
    }
  });

  return last6Months;
}

function getCategoryBreakdown(transactions) {
  const expenses = transactions.filter((t) => t.type === "EXPENSE");
  const categories = {};

  expenses.forEach((t) => {
    if (!categories[t.category]) {
      categories[t.category] = { category: t.category, amount: 0, count: 0 };
    }
    categories[t.category].amount += t.amount;
    categories[t.category].count += 1;
  });

  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

  return Object.values(categories)
    .map((cat) => ({
      ...cat,
      percentage: totalExpense > 0 ? Math.round((cat.amount / totalExpense) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

function getDailySpending(transactions, start, end) {
  const daily = {};
  const startDate = startOfDay(new Date(start));
  const endDate = endOfDay(new Date(end));

  transactions.filter(t => t.type === "EXPENSE").forEach((t) => {
    const dateStr = format(new Date(t.date), "MMM dd");
    if (!daily[dateStr]) daily[dateStr] = 0;
    daily[dateStr] += t.amount;
  });

  // Convert to cumulative
  const sortedDays = Object.keys(daily).sort((a, b) => new Date(a) - new Date(b));
  let cumulative = 0;
  return sortedDays.map(day => {
    cumulative += daily[day];
    return { date: day, amount: cumulative };
  });
}
