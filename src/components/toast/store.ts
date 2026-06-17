import type { Toast, ToastInput } from "./types";

type ToastListener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
const listeners = new Set<ToastListener>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function emit() {
  listeners.forEach((listener) => listener([...toasts]));
}

function scheduleDismiss(id: string, duration: number) {
  const existing = timers.get(id);
  if (existing) clearTimeout(existing);

  const timer = setTimeout(() => {
    timers.delete(id);
    dismissToast(id);
  }, duration);

  timers.set(id, timer);
}

export function subscribe(listener: ToastListener) {
  listeners.add(listener);
  listener([...toasts]);

  return () => {
    listeners.delete(listener);
  };
}

export function dismissToast(id: string) {
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }

  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
}

export function addToast(input: ToastInput) {
  const id = crypto.randomUUID();
  const toast: Toast = { ...input, id };

  toasts = [...toasts, toast];
  emit();
  scheduleDismiss(id, input.duration ?? 4000);

  return id;
}
