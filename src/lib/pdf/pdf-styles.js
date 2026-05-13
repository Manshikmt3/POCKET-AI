import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({

  // PAGE
  page: {
    padding: 48,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111827",
  },

  // HEADER SECTION
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#16a34a",
  },
  headerLeft: { flexDirection: "column" },
  brandName: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: "#16a34a",
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 2,
  },
  headerRight: { alignItems: "flex-end" },
  reportTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  reportPeriod: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 3,
  },
  generatedOn: {
    fontSize: 8,
    color: "#9ca3af",
    marginTop: 2,
  },

  // SUMMARY STATS ROW
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 14,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderLeftWidth: 3,
  },
  statCardIncome: { borderLeftColor: "#16a34a" },
  statCardExpense: { borderLeftColor: "#ef4444" },
  statCardSavings: { borderLeftColor: "#3b82f6" },
  statCardRate: { borderLeftColor: "#f59e0b" },
  statLabel: {
    fontSize: 8,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 17,
    fontFamily: "Helvetica-Bold",
    marginTop: 4,
  },
  statValueIncome: { color: "#16a34a" },
  statValueExpense: { color: "#ef4444" },
  statValueSavings: { color: "#3b82f6" },
  statValueRate: { color: "#f59e0b" },
  statSub: {
    fontSize: 8,
    color: "#9ca3af",
    marginTop: 2,
  },

  // SECTION HEADERS
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 20,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#16a34a",
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },

  // CATEGORY TABLE
  table: { width: "100%", marginBottom: 8 },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  tableRowAlt: { backgroundColor: "#fafafa" },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  tableCell: { fontSize: 9, color: "#374151" },
  colCategory: { flex: 2.5 },
  colCount: { flex: 1, textAlign: "center" },
  colAmount: { flex: 1.5, textAlign: "right" },
  colPercent: { flex: 1, textAlign: "right" },

  // CATEGORY COLOR BADGE
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  colorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  // TRANSACTION TABLE
  txDate: { flex: 1.2 },
  txDesc: { flex: 2.5 },
  txCategory: { flex: 1.5 },
  txType: { flex: 1, textAlign: "center" },
  txAmount: { flex: 1.2, textAlign: "right" },
  incomeText: { color: "#16a34a", fontFamily: "Helvetica-Bold" },
  expenseText: { color: "#ef4444", fontFamily: "Helvetica-Bold" },

  // MONTHLY SUMMARY TABLE
  monthCol: { flex: 2 },
  monthIncome: { flex: 1.5, textAlign: "right" },
  monthExpense: { flex: 1.5, textAlign: "right" },
  monthNet: { flex: 1.5, textAlign: "right" },

  // DIVIDER
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 16,
  },

  // FOOTER
  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: "#9ca3af",
  },
  footerBrand: {
    fontSize: 8,
    color: "#16a34a",
    fontFamily: "Helvetica-Bold",
  },

  // PAGE NUMBER
  pageNumber: {
    fontSize: 8,
    color: "#9ca3af",
    textAlign: "center",
  },
});

// Category color map
export const CATEGORY_COLORS = {
  housing: "#6366f1",
  transportation: "#3b82f6",
  "food & dining": "#f59e0b",
  groceries: "#84cc16",
  utilities: "#06b6d4",
  entertainment: "#ec4899",
  healthcare: "#14b8a6",
  shopping: "#8b5cf6",
  education: "#0ea5e9",
  "personal care": "#f97316",
  travel: "#10b981",
  insurance: "#64748b",
  "gifts & donations": "#e879f9",
  bills: "#fb923c",
  salary: "#22c55e",
  freelance: "#4ade80",
  investments: "#34d399",
  other: "#94a3b8",
};
