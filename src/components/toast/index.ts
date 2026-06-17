import { addToast } from "./store";
import type { ToastInput } from "./types";

type ToastOptions = Pick<ToastInput, "duration">;

function createToast(type: ToastInput["type"], message: string, options?: ToastOptions) {
  return addToast({ type, message, duration: options?.duration });
}

export const toast = {
  success: (message: string, options?: ToastOptions) => createToast("success", message, options),
  error: (message: string, options?: ToastOptions) => createToast("error", message, options),
  warning: (message: string, options?: ToastOptions) => createToast("warning", message, options),
  info: (message: string, options?: ToastOptions) => createToast("info", message, options)
};

export { ToastProvider } from "./ToastProvider";
export type { Toast, ToastType } from "./types";
