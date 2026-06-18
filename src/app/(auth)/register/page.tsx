"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthDivider, GoogleSignInButton } from "@/components/GoogleSignInButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/toast";
import { api } from "@/lib/api";
import { showAuthError } from "@/lib/authErrors";
import { saveSession } from "@/lib/auth";
import { postAuthPath } from "@/lib/navigation";
import { clearReferralCode, getReferralCode } from "@/lib/referral";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    setReferralCode(getReferralCode());
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const auth = await api.register({
        fullName,
        email,
        password,
        referralCode: referralCode ?? undefined,
      });
      clearReferralCode();
      saveSession(auth);
      router.push(postAuthPath());
    } catch (err) {
      showAuthError(err, "register");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="!shadow-[var(--shadow-elevated)]" padding="lg">
      <h1 className="text-[28px] font-bold text-ink">Create account</h1>
      <p className="mt-2 text-sm text-muted">Create your account to access ExpenseKit</p>

      {referralCode ? (
        <p className="mt-4 rounded-lg border border-brand/20 bg-brand-light px-3 py-2 text-sm text-ink">
          You were referred! Subscribe to a plan and get{" "}
          <span className="font-semibold text-brand">₹25</span> wallet credit.
        </p>
      ) : null}

      <div className="mt-8">
        <GoogleSignInButton mode="signup" />
      </div>

      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full name"
          name="fullName"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          minLength={6}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand hover:text-brand-hover">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
