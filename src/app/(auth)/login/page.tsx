"use client";

import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center text-sm text-muted">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
