"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthDivider, GoogleSignInButton } from "@/components/GoogleSignInButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { saveSession } from "@/lib/auth";
import { postAuthPath } from "@/lib/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const auth = await api.login({ email, password });
      saveSession(auth);
      router.push(postAuthPath());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="!shadow-[var(--shadow-elevated)]" padding="lg">
      <h1 className="text-[28px] font-bold text-ink">Welcome back</h1>
      <p className="mt-2 text-sm text-muted">Sign in to continue to ExpenseKit</p>

      <div className="mt-8">
        <GoogleSignInButton mode="signin" onError={setError} />
      </div>

      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-4">
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
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error ? <p className="text-sm text-error">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-muted">
        New here?{" "}
        <Link href="/expenses" className="font-semibold text-brand hover:text-brand-hover">
          Start free trial
        </Link>
      </p>
    </Card>
  );
}
