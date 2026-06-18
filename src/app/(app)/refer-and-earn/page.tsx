"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { WalletWithdrawModal } from "@/components/WalletWithdrawModal";
import { toast } from "@/components/toast";
import { showApiError } from "@/lib/apiErrors";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { formatPaise } from "@/lib/referral";
import type { ReferralProfile } from "@/lib/types";

export default function ReferAndEarnPage() {
  const [profile, setProfile] = useState<ReferralProfile | null>(null);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const loadProfile = useCallback(() => {
    api
      .getReferralProfile()
      .then(setProfile)
      .catch((err) => showApiError(err, "Failed to load referral profile"));
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function copyLink() {
    if (!profile) return;
    try {
      await navigator.clipboard.writeText(profile.shareUrl);
      toast.success("Referral link copied!");
    } catch {
      toast.error("Could not copy link");
    }
  }

  async function copyCode() {
    if (!profile) return;
    try {
      await navigator.clipboard.writeText(profile.referralCode);
      toast.success("Referral code copied!");
    } catch {
      toast.error("Could not copy code");
    }
  }

  if (!profile) {
    return <div className="py-20 text-center text-muted">Loading...</div>;
  }

  const minWithdrawal = profile.minWithdrawalPaise ?? 5000;
  const canWithdraw =
    profile.canWithdraw ??
    (profile.walletBalancePaise >= minWithdrawal && profile.pendingWithdrawalPaise === 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Refer & earn"
        subtitle="Invite friends to ExpenseKit. When they subscribe, you earn ₹50 and they get ₹25 wallet credit."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-bold text-ink">Your referral link</h2>
          <p className="mt-1 text-sm text-muted">
            Share this link. Rewards apply when your friend subscribes to a paid plan for the first time.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Referral code</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="rounded-lg bg-paper px-4 py-2 font-mono text-lg font-bold text-ink">
                  {profile.referralCode}
                </span>
                <Button type="button" variant="secondary" onClick={copyCode}>
                  Copy code
                </Button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Share link</p>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input
                  readOnly
                  value={profile.shareUrl}
                  className="min-w-0 flex-1 rounded-lg border border-border bg-paper px-3 py-2 text-sm text-ink"
                />
                <Button type="button" onClick={copyLink}>
                  Copy link
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-sm font-medium text-muted">Wallet balance</p>
          <p className="mt-2 text-3xl font-bold text-brand">
            {formatCurrency(formatPaise(profile.walletBalancePaise))}
          </p>
          <p className="mt-4 text-sm text-muted">
            Total earned from referrals:{" "}
            <span className="font-semibold text-ink">
              {formatCurrency(formatPaise(profile.totalEarnedPaise))}
            </span>
          </p>

          {profile.pendingWithdrawalPaise > 0 ? (
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
              Withdrawal of {formatCurrency(formatPaise(profile.pendingWithdrawalPaise))} is being
              processed.
            </p>
          ) : null}

          {canWithdraw ? (
            <Button type="button" className="mt-4 w-full" onClick={() => setWithdrawOpen(true)}>
              Withdraw
            </Button>
          ) : profile.walletBalancePaise > 0 && profile.walletBalancePaise < minWithdrawal ? (
            <p className="mt-4 text-sm text-muted">
              Withdraw when your balance reaches {formatCurrency(formatPaise(minWithdrawal))} or more.
            </p>
          ) : null}
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">You earn</p>
          <p className="mt-2 text-2xl font-bold text-ink">
            {formatCurrency(formatPaise(profile.referrerRewardPaise))}
          </p>
          <p className="mt-2 text-sm text-muted">per friend who subscribes</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Your friend gets</p>
          <p className="mt-2 text-2xl font-bold text-ink">
            {formatCurrency(formatPaise(profile.refereeRewardPaise))}
          </p>
          <p className="mt-2 text-sm text-muted">on their first subscription</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Referrals</p>
          <p className="mt-2 text-2xl font-bold text-ink">{profile.rewardedReferrals}</p>
          <p className="mt-2 text-sm text-muted">
            rewarded · {profile.pendingReferrals} pending
          </p>
        </Card>
      </div>

      <WalletWithdrawModal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        walletBalancePaise={profile.walletBalancePaise}
        onSuccess={loadProfile}
      />
    </div>
  );
}
