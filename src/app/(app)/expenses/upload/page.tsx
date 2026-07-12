"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpensesSubNav } from "@/components/ExpensesSubNav";
import { PremiumStarIcon } from "@/components/ExpensesSubNav";
import { SubscriberGuard } from "@/components/SubscriberGuard";
import { useOrganization } from "@/components/OrganizationProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { FeatureGuideTrigger } from "@/components/FeatureGuide";
import { toast } from "@/components/toast";
import { showApiError } from "@/lib/apiErrors";
import { api } from "@/lib/api";
import { prepareBillFile, stripDataUrlPrefix, type PreparedBillFile } from "@/lib/bill-image";
import { formatCurrency } from "@/lib/format";
import type { BillScanPrefill, ScanBillResponse } from "@/lib/types";

export default function UploadBillPage() {
  const router = useRouter();
  const { currentOrg, currentOrgId } = useOrganization();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preparedFile, setPreparedFile] = useState<PreparedBillFile | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanBillResponse | null>(null);
  const [prefill, setPrefill] = useState<BillScanPrefill | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const prepared = await prepareBillFile(file);
      setPreparedFile(prepared);
      setScanResult(null);
      setPrefill(null);
    } catch (err) {
      showApiError(err, "Failed to read bill");
    } finally {
      event.target.value = "";
    }
  }

  async function scanBill() {
    if (!currentOrgId || !preparedFile) {
      toast.error("Select an entity and upload a bill first.");
      return;
    }
    setScanning(true);
    try {
      const result = await api.scanBill({
        organizationId: currentOrgId,
        type: "OUT",
        fileName: preparedFile.fileName,
        mimeType: preparedFile.mimeType,
        contentBase64: stripDataUrlPrefix(preparedFile.contentBase64),
      });
      setScanResult(result);
      setPrefill({
        amount: result.amount != null ? String(result.amount) : "",
        spentAt: result.spentAt ?? undefined,
        description: result.description ?? result.merchant ?? "",
        categoryId: result.categoryId ?? undefined,
        suggestedCategory: result.suggestedCategory ?? undefined,
        confidence: result.confidence,
        notes: result.notes,
        mock: result.mock,
      });
      if (result.mock) {
        toast.info("Demo scan — AI preview mode is on.");
      } else {
        toast.success("Bill scanned — verify details below.");
      }
    } catch (err) {
      showApiError(err, "Bill scan failed");
    } finally {
      setScanning(false);
    }
  }

  function resetFlow() {
    setPreparedFile(null);
    setScanResult(null);
    setPrefill(null);
  }

  return (
    <SubscriberGuard featureName="Capture receipt">
      <div className="space-y-8">
        <PageHeader
          title="Capture receipt"
          subtitle={
            currentOrg
              ? `AI reads your receipt for ${currentOrg.name} — printed or handwritten`
              : "Select an entity first"
          }
          action={<FeatureGuideTrigger guideId="capture-receipt" />}
        />

        <ExpensesSubNav />

        <Card className="border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-surface dark:from-amber-950/20">
          <div className="flex items-start gap-3">
            <PremiumStarIcon className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold text-ink">Premium — Smart receipt scan</p>
              <p className="mt-1 text-sm text-muted">
                Upload a photo or PDF. Gemini Flash extracts amount, date, and category. You verify
                before saving as spend.
              </p>
            </div>
          </div>
        </Card>

        {!prefill ? (
          <Card className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-ink">1. Upload receipt (image or PDF)</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf,.pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-paper px-6 py-10 text-center transition hover:border-brand hover:bg-brand-light/20"
              >
                {preparedFile?.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preparedFile.previewUrl}
                    alt="Receipt preview"
                    className="mb-4 max-h-48 rounded-lg object-contain"
                  />
                ) : (
                  <div className="mb-3 text-4xl text-muted">📄</div>
                )}
                <p className="font-semibold text-ink">
                  {preparedFile ? preparedFile.fileName : "Tap to choose receipt"}
                </p>
                <p className="mt-1 text-sm text-muted">JPG, PNG, WEBP, or PDF · printed or handwritten</p>
              </button>
            </div>

            <Button
              className="w-full sm:w-auto"
              disabled={!preparedFile || !currentOrgId || scanning}
              onClick={() => void scanBill()}
            >
              {scanning ? "Scanning receipt..." : "Scan receipt with AI"}
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {scanResult ? (
              <Card className="space-y-3 border-brand/20 bg-brand-light/10">
                <p className="text-sm font-semibold uppercase tracking-wide text-brand">Detected from receipt</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <ScanField label="Amount" value={scanResult.amount != null ? formatCurrency(scanResult.amount) : "—"} />
                  <ScanField label="Date" value={scanResult.spentAt ?? "—"} />
                  <ScanField label="Merchant" value={scanResult.merchant ?? "—"} />
                  <ScanField label="Category" value={scanResult.suggestedCategory ?? "—"} />
                </div>
                {scanResult.notes ? <p className="text-sm text-muted">{scanResult.notes}</p> : null}
                {scanResult.confidence ? (
                  <p className="text-xs text-muted">Confidence: {scanResult.confidence}</p>
                ) : null}
              </Card>
            ) : null}

            <ExpenseForm
              mode="api"
              billPrefill={prefill}
              onCreated={() => router.push("/expenses")}
            />

            <Button variant="secondary" onClick={resetFlow}>
              Scan another receipt
            </Button>
          </div>
        )}
      </div>
    </SubscriberGuard>
  );
}

function ScanField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}
