"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ExpenseForm } from "@/components/ExpenseForm";
import { PageHeader } from "@/components/ui/PageHeader";
import type { ExpenseType } from "@/lib/types";

function NewExpenseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type: ExpenseType = searchParams.get("type") === "IN" ? "IN" : "OUT";

  return (
    <div className="space-y-8">
      <PageHeader
        title={type === "IN" ? "Record income" : "Record expense"}
        subtitle={type === "IN" ? "Add money coming in" : "Add money going out"}
        action={
          <Link
            href="/expenses"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-ink transition hover:bg-paper"
          >
            Back to transactions
          </Link>
        }
      />
      <ExpenseForm
        mode="api"
        defaultType={type}
        onCreated={() => router.push("/expenses")}
      />
    </div>
  );
}

export default function NewExpensePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted">Loading...</div>}>
      <NewExpenseContent />
    </Suspense>
  );
}
