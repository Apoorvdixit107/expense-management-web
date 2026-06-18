"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/toast";
import { showApiError } from "@/lib/apiErrors";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { formatPaise } from "@/lib/referral";
import type { PayoutMethod } from "@/lib/types";

type WalletWithdrawModalProps = {
  open: boolean;
  onClose: () => void;
  walletBalancePaise: number;
  onSuccess: () => void;
};

export function WalletWithdrawModal({
  open,
  onClose,
  walletBalancePaise,
  onSuccess,
}: WalletWithdrawModalProps) {
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>("UPI");
  const [upiId, setUpiId] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setPayoutMethod("UPI");
    setUpiId("");
    setAccountHolderName("");
    setBankName("");
    setAccountNumber("");
    setIfscCode("");
  }

  function handleClose() {
    if (submitting) return;
    reset();
    onClose();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await api.withdrawWallet(
        payoutMethod === "UPI"
          ? { payoutMethod, upiId: upiId.trim() }
          : {
              payoutMethod,
              accountHolderName: accountHolderName.trim(),
              bankName: bankName.trim(),
              accountNumber: accountNumber.trim(),
              ifscCode: ifscCode.trim().toUpperCase(),
            }
      );
      toast.success("Withdrawal request submitted. We will pay you within 3–5 business days.");
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      showApiError(err, "Failed to submit withdrawal");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Withdraw wallet balance"
      subtitle={`Request payout of ${formatCurrency(formatPaise(walletBalancePaise))} to your UPI or bank account.`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex rounded-xl border border-border bg-paper p-1">
          <button
            type="button"
            onClick={() => setPayoutMethod("UPI")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              payoutMethod === "UPI" ? "bg-surface text-brand shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            UPI
          </button>
          <button
            type="button"
            onClick={() => setPayoutMethod("BANK")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              payoutMethod === "BANK" ? "bg-surface text-brand shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            Bank account
          </button>
        </div>

        {payoutMethod === "UPI" ? (
          <Input
            label="UPI ID"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="yourname@upi"
            required
            disabled={submitting}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Account holder name"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              required
              disabled={submitting}
              className="sm:col-span-2"
            />
            <Input
              label="Bank name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. HDFC Bank"
              required
              disabled={submitting}
            />
            <Input
              label="IFSC code"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
              required
              disabled={submitting}
            />
            <Input
              label="Account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
              required
              disabled={submitting}
              className="sm:col-span-2"
            />
          </div>
        )}

        <p className="text-sm text-muted">
          We review withdrawal requests manually. Your full wallet balance will be transferred to the
          details above. Minimum withdrawal is ₹50.
        </p>

        <div className="flex flex-wrap justify-end gap-3">
          <Button type="button" variant="secondary" disabled={submitting} onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit withdrawal request"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
