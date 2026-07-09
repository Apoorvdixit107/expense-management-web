"use client";

import { PremiumStarIcon } from "@/components/ExpensesSubNav";
import { AssistantChat } from "@/components/AssistantChat";
import { SubscriberGuard } from "@/components/SubscriberGuard";
import { PageHeader } from "@/components/ui/PageHeader";
import { FeatureGuideTrigger } from "@/components/FeatureGuide";
import { Card } from "@/components/ui/Card";

export default function AssistantPage() {
  return (
    <SubscriberGuard featureName="Ask finance">
      <div className="space-y-8">
        <PageHeader
          title="AI Assistant"
          subtitle="Ask questions about your expenses, balance, and budgeting — powered by Gemini."
          action={<FeatureGuideTrigger guideId="assistant" />}
        />

        <Card className="flex items-start gap-3 border-amber-200 bg-amber-50/80 dark:border-amber-900/40 dark:bg-amber-950/20">
          <PremiumStarIcon className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold text-ink">Premium — ExpenseKit AI</p>
            <p className="mt-1 text-sm text-muted">
              The assistant reads your organization balance and recent transactions to give
              personalized answers. It does not move money or create transactions for you.
            </p>
          </div>
        </Card>

        <AssistantChat />
      </div>
    </SubscriberGuard>
  );
}
