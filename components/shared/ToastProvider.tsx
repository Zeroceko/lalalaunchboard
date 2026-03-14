"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";

import { cn } from "@/lib/utils";

type ToastVariant = "info" | "success" | "destructive";

interface ToastInput {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastRecord extends ToastInput {
  id: string;
}

interface ToastContextValue {
  pushToast: (toast: ToastInput) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function getToastId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getToastClasses(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-950";
    case "destructive":
      return "border-destructive/20 bg-destructive/5 text-destructive";
    case "info":
    default:
      return "border-foreground/10 bg-white/95 text-foreground";
  }
}

export function ToastProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    ({ duration = 4200, variant = "info", ...toast }: ToastInput) => {
      const id = getToastId();

      setToasts((current) => [...current, { id, variant, duration, ...toast }]);

      window.setTimeout(() => {
        dismissToast(id);
      }, duration);
    },
    [dismissToast]
  );

  const value = useMemo(
    () => ({
      pushToast,
      dismissToast
    }),
    [dismissToast, pushToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[120] flex justify-center px-4 sm:justify-end">
        <div className="flex w-full max-w-sm flex-col gap-3">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={cn(
                "pointer-events-auto rounded-[1.25rem] border p-4 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur",
                getToastClasses(toast.variant ?? "info")
              )}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{toast.title}</p>
                  {toast.description ? (
                    <p className="mt-1 text-sm leading-6 opacity-85">
                      {toast.description}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => dismissToast(toast.id)}
                  className="rounded-full border border-current/10 px-2 py-1 text-xs font-medium opacity-80 transition hover:opacity-100"
                >
                  Kapat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
