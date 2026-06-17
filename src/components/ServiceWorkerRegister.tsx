"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/pwa";

export function ServiceWorkerRegister() {
  useEffect(() => {
    void registerServiceWorker();
  }, []);

  return null;
}
