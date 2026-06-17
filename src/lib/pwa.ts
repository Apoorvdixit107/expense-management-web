const INSTALL_DISMISS_KEY = "ems_pwa_install_dismissed";

export function isStandaloneApp(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    // iOS Safari
    ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isInstallDismissed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(INSTALL_DISMISS_KEY) === "true";
}

export function dismissInstallPrompt(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(INSTALL_DISMISS_KEY, "true");
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null;

  try {
    return await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  } catch {
    return null;
  }
}
