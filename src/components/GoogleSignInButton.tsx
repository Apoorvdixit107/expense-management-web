"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { api } from "@/lib/api";
import { toast } from "@/components/toast";
import { saveSession } from "@/lib/auth";
import { postAuthPath } from "@/lib/navigation";

type GoogleSignInButtonProps = {
  mode: "signin" | "signup";
  redirectTo?: string;
};

export function GoogleSignInButton({ mode, redirectTo }: GoogleSignInButtonProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

  useEffect(() => {
    const width = containerRef.current?.offsetWidth;
    if (width) setButtonWidth(Math.floor(width));
  }, []);

  async function handleSuccess(response: CredentialResponse) {
    if (!response.credential) {
      toast.error("Google sign in failed");
      return;
    }

    setLoading(true);
    try {
      const auth = await api.googleLogin(response.credential);
      saveSession(auth);
      router.push(redirectTo || postAuthPath());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign in failed");
    } finally {
      setLoading(false);
    }
  }

  if (!clientId) {
    return (
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
        Add <code className="font-mono">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> to enable Google sign in.
      </p>
    );
  }

  return (
    <div ref={containerRef} className="w-full">
      {loading ? (
        <div className="flex h-10 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-500">
          Signing in with Google...
        </div>
      ) : buttonWidth === null ? (
        <div className="h-10 rounded-lg border border-slate-200 bg-slate-50" />
      ) : (
        <div className="flex justify-center [&>div]:w-full">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => toast.error("Google sign in failed")}
            theme="outline"
            size="large"
            width={buttonWidth}
            text={mode === "signup" ? "signup_with" : "signin_with"}
            shape="rectangular"
          />
        </div>
      )}
    </div>
  );
}

export function AuthDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-surface px-3 text-xs font-medium uppercase tracking-wider text-muted">or</span>
      </div>
    </div>
  );
}
