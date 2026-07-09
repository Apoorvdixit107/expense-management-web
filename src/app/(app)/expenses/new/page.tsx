"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExpenseForm } from "@/components/ExpenseForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { withFeatureGuideAction } from "@/components/FeatureGuide";

export default function NewExpensePage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Record spend"
        subtitle="Add an outbound payment for your entity"
        action={withFeatureGuideAction(
          "record-spend",
          <Link
            href="/expenses"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-ink transition hover:bg-paper"
          >
            Back to Spend
          </Link>
        )}
      />
      <ExpenseForm mode="api" onCreated={() => router.push("/expenses")} />
    </div>
  );
}
