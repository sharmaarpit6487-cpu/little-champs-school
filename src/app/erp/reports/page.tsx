"use client";

import { BarChart3, Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ERPPageHeader } from "@/components/erp/page-header";

const REPORTS = [
  {
    id: "students",
    title: "Student List",
    description: "Complete list of all active students",
    format: "Excel" as const,
  },
  {
    id: "pending-fees",
    title: "Pending Fees Report",
    description: "Students with outstanding fees",
    format: "Excel" as const,
  },
  {
    id: "admissions",
    title: "Admission Report",
    description: "Admission applications and status",
    format: "Excel" as const,
  },
  {
    id: "fee-collection",
    title: "Fee Collection Report",
    description: "Monthly fee collection summary",
    format: "PDF" as const,
    disabled: true,
  },
  {
    id: "attendance",
    title: "Attendance Report",
    description: "Monthly attendance summary by class",
    format: "PDF" as const,
    disabled: true,
  },
  {
    id: "revenue",
    title: "Revenue Analysis",
    description: "Annual revenue breakdown by fee type",
    format: "PDF" as const,
    disabled: true,
  },
];

export default function ReportsPage() {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (reportId: string, format: string) => {
    if (format === "PDF") {
      toast.info("PDF export coming soon. Excel reports are available now.");
      return;
    }

    setExporting(reportId);
    try {
      const res = await fetch(`/api/reports/${reportId}`, { credentials: "same-origin" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Export failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportId}-report.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Report downloaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Export failed");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="space-y-6">
      <ERPPageHeader
        title="Reports"
        description="Generate and export reports"
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REPORTS.map((report) => (
          <Card key={report.id} className="rounded-2xl border-0 shadow-soft card-hover">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {report.format === "Excel" ? (
                  <FileSpreadsheet className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <BarChart3 className="h-5 w-5 text-brand-yellow dark:text-amber-400" />
                )}
                {report.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
              <Button
                variant="outline"
                className="gap-2 w-full"
                disabled={!!report.disabled || exporting === report.id}
                onClick={() => handleExport(report.id, report.format)}
              >
                {exporting === report.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export {report.format}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
