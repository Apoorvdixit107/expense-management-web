"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { subscribe } from "./store";
import { Toaster } from "./Toaster";
import type { Toast } from "./types";

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => subscribe(setToasts), []);

  return (
    <>
      {children}
      <Toaster toasts={toasts} />
    </>
  );
}
