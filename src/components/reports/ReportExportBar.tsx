"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/toast";
import { showApiError } from "@/lib/apiErrors";
import {
  downloadReportExcel,
  downloadReportPdf,
  shareReportEmail,
  shareReportWhatsApp,
} from "@/lib/report-export";
import type { OrganizationReport, OrganizationReportType } from "@/lib/reports";

type ReportExportBarProps = {
  organizationId: number;
  reportType: OrganizationReportType;
  fromDate: string;
  toDate: string;
  report: OrganizationReport | null;
};

export function ReportExportBar({
  organizationId,
  reportType,
  fromDate,
  toDate,
  report,
}: ReportExportBarProps) {
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showShare, setShowShare] = useState(false);

  async function handlePdf() {
    setLoadingPdf(true);
    try {
      await downloadReportPdf(organizationId, reportType, fromDate, toDate);
      toast.success("PDF downloaded.");
    } catch (err) {
      showApiError(err, "PDF download failed");
    } finally {
      setLoadingPdf(false);
    }
  }

  function handleExcel() {
    if (!report) return;
    downloadReportExcel(report);
    toast.success("Excel file downloaded.");
  }

  function handleEmail() {
    if (!report) return;
    shareReportEmail(report, email || undefined);
    toast.success("Opening email app...");
  }

  function handleWhatsApp() {
    if (!report) return;
    shareReportWhatsApp(report, phone || undefined);
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={() => void handlePdf()} disabled={loadingPdf}>
          {loadingPdf ? "Generating..." : "Download PDF"}
        </Button>
        <Button type="button" variant="secondary" onClick={handleExcel} disabled={!report}>
          Download Excel
        </Button>
        <Button type="button" variant="outline" onClick={() => setShowShare((v) => !v)}>
          Share report
        </Button>
      </div>

      {showShare ? (
        <div className="mt-4 grid gap-4 border-t border-border pt-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Share via email</label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="recipient@email.com (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-paper px-3 text-sm"
              />
              <Button type="button" variant="secondary" onClick={handleEmail} disabled={!report}>
                Email
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Share via WhatsApp</label>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="91XXXXXXXXXX (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-paper px-3 text-sm"
              />
              <Button type="button" variant="secondary" onClick={handleWhatsApp} disabled={!report}>
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
