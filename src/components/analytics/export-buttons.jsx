"use client";

import { useState } from "react";
import { FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { downloadAnalyticsPDF } from "@/lib/pdf/analytics-report";

export default function ExportButtons({ data, filters }) {
  const [pdfLoading, setPdfLoading] = useState(false);

  // ── PDF Export ──────────────────────────────────────
  const handlePDFExport = async () => {
    if (!data?.transactions?.length) {
      toast.error("No data to export");
      return;
    }
    try {
      setPdfLoading(true);
      toast.loading("Generating PDF...", { id: "pdf-export" });
      await downloadAnalyticsPDF(data, filters);
      toast.success("PDF downloaded!", { id: "pdf-export" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF", { id: "pdf-export" });
    } finally {
      setPdfLoading(false);
    }
  };

  // ── CSV Export ──────────────────────────────────────
  const handleCSVExport = () => {
    if (!data?.transactions?.length) {
      toast.error("No data to export");
      return;
    }

    try {
      const headers = [
        "Date", "Description", "Category",
        "Type", "Amount", "Currency", "Account",
      ];

      const rows = data.transactions.map((t) => [
        new Date(t.date).toLocaleDateString("en-IN"),
        `"${(t.description || "").replace(/"/g, '""')}"`,
        t.category,
        t.type,
        Number(t.amount).toFixed(2),
        t.currency ?? "INR",
        `"${(t.account?.name ?? "").replace(/"/g, '""')}"`,
      ]);

      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `transactions-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(
        `Exported ${data.transactions.length} transactions as CSV`
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to export CSV");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* CSV Button */}
      <Button
        variant="outline"
        onClick={handleCSVExport}
        className="gap-2 border-green-200 hover:border-green-400 
                   hover:bg-green-50 dark:hover:bg-green-950"
      >
        <Download className="w-4 h-4" />
        Export CSV
      </Button>

      {/* PDF Button */}
      <Button
        onClick={handlePDFExport}
        disabled={pdfLoading}
        className="gap-2 bg-green-600 hover:bg-green-700 text-white"
      >
        {pdfLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        {pdfLoading ? "Generating..." : "Download PDF"}
      </Button>
    </div>
  );
}
