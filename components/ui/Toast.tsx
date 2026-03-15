"use client";
import { useEffect, useState } from "react";

type ToastType = "success" | "error" | "warning";
interface ToastItem { id: string; message: string; type: ToastType; }

export function toast(message: string, type: ToastType = "success") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("toast", { detail: { message, type, id: crypto.randomUUID() } }));
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  useEffect(() => {
    function handler(e: Event) {
      const item = (e as CustomEvent).detail as ToastItem;
      setToasts((p) => [...p, item]);
      setTimeout(() => setToasts((p) => p.filter((t) => t.id !== item.id)), 4000);
    }
    window.addEventListener("toast", handler);
    return () => window.removeEventListener("toast", handler);
  }, []);

  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-2xl shadow-black/10 min-w-[280px] max-w-sm backdrop-blur-sm animate-in slide-in-from-bottom-2 fade-in duration-300 ${
          t.type === "success" ? "bg-background border-border" :
          t.type === "error" ? "bg-destructive/5 border-destructive/20" :
          "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800/30"
        }`}>
          {/* Icon */}
          <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
            t.type === "success" ? "bg-emerald-500" :
            t.type === "error" ? "bg-destructive" : "bg-amber-500"
          }`}>
            {t.type === "success" ? (
              <svg viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2" className="h-2.5 w-2.5">
                <path d="M1.5 5l2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : t.type === "error" ? (
              <svg viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2" className="h-2.5 w-2.5">
                <path d="M1 1l8 8M9 1L1 9" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2" className="h-2.5 w-2.5">
                <path d="M5 2v4M5 7.5v.5" strokeLinecap="round" />
              </svg>
            )}
          </span>
          <p className={`flex-1 text-sm font-medium ${
            t.type === "error" ? "text-destructive" :
            t.type === "warning" ? "text-amber-700 dark:text-amber-400" :
            "text-foreground"
          }`}>{t.message}</p>
          <button onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}
            className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-3 w-3">
              <path d="M1 1l8 8M9 1L1 9" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
