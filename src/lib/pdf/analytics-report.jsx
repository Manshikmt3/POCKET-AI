"use client";

import {
  Document,
  Page,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import { styles, CATEGORY_COLORS } from "./pdf-styles";

// ─── Helper ────────────────────────────────────────────
function formatAmount(amount, currency = "INR") {
  const symbols = {
    INR: "₹", USD: "$", EUR: "€", GBP: "£",
    JPY: "¥", AUD: "A$", CAD: "C$",
  };
  const symbol = symbols[currency] ?? currency + " ";
  return `${symbol}${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

// ─── Section: Stats Row ────────────────────────────────
function StatsSection({ totalIncome, totalExpense, savingsRate, currency }) {
  const netSavings = totalIncome - totalExpense;

  return (
    <View style={styles.statsRow}>
      <View style={[styles.statCard, styles.statCardIncome]}>
        <Text style={styles.statLabel}>Total Income</Text>
        <Text style={[styles.statValue, styles.statValueIncome]}>
          {formatAmount(totalIncome, currency)}
        </Text>
        <Text style={styles.statSub}>This period</Text>
      </View>

      <View style={[styles.statCard, styles.statCardExpense]}>
        <Text style={styles.statLabel}>Total Expenses</Text>
        <Text style={[styles.statValue, styles.statValueExpense]}>
          {formatAmount(totalExpense, currency)}
        </Text>
        <Text style={styles.statSub}>This period</Text>
      </View>

      <View style={[styles.statCard, styles.statCardSavings]}>
        <Text style={styles.statLabel}>Net Savings</Text>
        <Text style={[styles.statValue, styles.statValueSavings]}>
          {formatAmount(netSavings, currency)}
        </Text>
        <Text style={styles.statSub}>
          {netSavings >= 0 ? "Saved" : "Deficit"}
        </Text>
      </View>

      <View style={[styles.statCard, styles.statCardRate]}>
        <Text style={styles.statLabel}>Savings Rate</Text>
        <Text style={[styles.statValue, styles.statValueRate]}>
          {savingsRate}%
        </Text>
        <Text style={styles.statSub}>Of income</Text>
      </View>
    </View>
  );
}

// ─── Section: Category Breakdown ──────────────────────
function CategorySection({ categoryData, currency }) {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionDot} />
        <Text style={styles.sectionTitle}>Spending by Category</Text>
      </View>

      <View style={styles.table}>
        {/* Header */}
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableHeaderText, styles.colCategory]}>
            Category
          </Text>
          <Text style={[styles.tableHeaderText, styles.colCount]}>
            Txns
          </Text>
          <Text style={[styles.tableHeaderText, styles.colAmount]}>
            Amount
          </Text>
          <Text style={[styles.tableHeaderText, styles.colPercent]}>
            % of Total
          </Text>
        </View>

        {/* Rows */}
        {categoryData.map((cat, index) => (
          <View
            key={cat.category}
            style={[
              styles.tableRow,
              index % 2 === 1 && styles.tableRowAlt,
            ]}
          >
            <View style={[styles.colCategory, styles.categoryBadge]}>
              <View
                style={[
                  styles.colorDot,
                  {
                    backgroundColor:
                      CATEGORY_COLORS[cat.category.toLowerCase()] ??
                      "#94a3b8",
                  },
                ]}
              />
              <Text style={styles.tableCell}>
                {cat.category.charAt(0).toUpperCase() +
                  cat.category.slice(1)}
              </Text>
            </View>
            <Text style={[styles.tableCell, styles.colCount]}>
              {cat.count}
            </Text>
            <Text style={[styles.tableCell, styles.colAmount]}>
              {formatAmount(cat.amount, currency)}
            </Text>
            <Text style={[styles.tableCell, styles.colPercent]}>
              {cat.percentage}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Section: Monthly Summary ─────────────────────────
function MonthlySection({ monthlyData, currency }) {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionDot} />
        <Text style={styles.sectionTitle}>Monthly Summary</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableHeaderText, styles.monthCol]}>Month</Text>
          <Text style={[styles.tableHeaderText, styles.monthIncome]}>Income</Text>
          <Text style={[styles.tableHeaderText, styles.monthExpense]}>Expense</Text>
          <Text style={[styles.tableHeaderText, styles.monthNet]}>Net</Text>
        </View>

        {monthlyData.map((month, index) => {
          const net = month.income - month.expense;
          return (
            <View
              key={month.month}
              style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}
            >
              <Text style={[styles.tableCell, styles.monthCol]}>
                {month.month}
              </Text>
              <Text style={[styles.tableCell, styles.monthIncome, 
                styles.incomeText]}>
                {formatAmount(month.income, currency)}
              </Text>
              <Text style={[styles.tableCell, styles.monthExpense, 
                styles.expenseText]}>
                {formatAmount(month.expense, currency)}
              </Text>
              <Text style={[
                styles.tableCell,
                styles.monthNet,
                net >= 0 ? styles.incomeText : styles.expenseText,
              ]}>
                {net >= 0 ? "+" : ""}
                {formatAmount(net, currency)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ─── Section: Transaction List ────────────────────────
function TransactionSection({ transactions, currency }) {
  // Show max 100 transactions in PDF
  const txList = transactions.slice(0, 100);

  return (
    <View>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionDot} />
        <Text style={styles.sectionTitle}>
          Transaction Details
          {transactions.length > 100
            ? ` (showing 100 of ${transactions.length})`
            : ` (${transactions.length} total)`}
        </Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableHeaderText, styles.txDate]}>Date</Text>
          <Text style={[styles.tableHeaderText, styles.txDesc]}>Description</Text>
          <Text style={[styles.tableHeaderText, styles.txCategory]}>Category</Text>
          <Text style={[styles.tableHeaderText, styles.txType]}>Type</Text>
          <Text style={[styles.tableHeaderText, styles.txAmount]}>Amount</Text>
        </View>

        {txList.map((t, index) => (
          <View
            key={t.id}
            style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}
          >
            <Text style={[styles.tableCell, styles.txDate]}>
              {formatDate(t.date)}
            </Text>
            <Text style={[styles.tableCell, styles.txDesc]} numberOfLines={1}>
              {t.description || t.category || "—"}
            </Text>
            <Text style={[styles.tableCell, styles.txCategory]}>
              {t.category}
            </Text>
            <Text style={[
              styles.tableCell,
              styles.txType,
              t.type === "INCOME" ? styles.incomeText : styles.expenseText,
            ]}>
              {t.type === "INCOME" ? "IN" : "OUT"}
            </Text>
            <Text style={[
              styles.tableCell,
              styles.txAmount,
              t.type === "INCOME" ? styles.incomeText : styles.expenseText,
            ]}>
              {t.type === "INCOME" ? "+" : "-"}
              {formatAmount(t.amount, t.currency ?? currency)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── MAIN PDF DOCUMENT ────────────────────────────────
export function AnalyticsPDF({ data, filters }) {
  const {
    totalIncome,
    totalExpense,
    savingsRate,
    categoryData,
    monthlyData,
    transactions,
  } = data;

  const currency = filters.currency ?? "INR";

  const periodLabel = `${formatDate(filters.startDate)} — ${formatDate(
    filters.endDate
  )}`;

  return (
    <Document
      title="Pocket AI Financial Report"
      author="Pocket AI"
      subject="Financial Analytics Report"
    >
      {/* PAGE 1 — Summary + Categories */}
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.brandName}>Pocket AI</Text>
            <Text style={styles.brandTagline}>
              Intelligent Financial Management
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.reportTitle}>Financial Report</Text>
            <Text style={styles.reportPeriod}>{periodLabel}</Text>
            <Text style={styles.generatedOn}>
              Generated: {formatDate(new Date())}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <StatsSection
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          savingsRate={savingsRate}
          currency={currency}
        />

        <View style={styles.divider} />

        {/* Category breakdown */}
        <CategorySection categoryData={categoryData} currency={currency} />

        <View style={styles.divider} />

        {/* Monthly Summary */}
        <MonthlySection monthlyData={monthlyData} currency={currency} />

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Confidential — For personal use only
          </Text>
          <Text style={styles.footerBrand}>Pocket AI</Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>

      {/* PAGE 2 — Full Transaction List */}
      <Page size="A4" style={styles.page}>
        
        {/* Compact header on page 2 */}
        <View style={[styles.header, { marginBottom: 16 }]}>
          <Text style={styles.brandName}>Pocket AI</Text>
          <Text style={styles.reportPeriod}>{periodLabel}</Text>
        </View>

        <TransactionSection
          transactions={transactions}
          currency={currency}
        />

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Confidential — For personal use only
          </Text>
          <Text style={styles.footerBrand}>Pocket AI</Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

// ─── EXPORT FUNCTION (call this from button) ──────────
export async function downloadAnalyticsPDF(data, filters) {
  const blob = await pdf(
    <AnalyticsPDF data={data} filters={filters} />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `pocket-ai-report-${new Date()
    .toISOString()
    .slice(0, 10)}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
