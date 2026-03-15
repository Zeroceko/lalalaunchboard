"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <p className="text-7xl font-black text-destructive">500</p>
      <h1 className="mt-4 text-2xl font-semibold text-foreground">Bir şeyler ters gitti</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        Beklenmedik bir hata oluştu. Tekrar deneyebilir ya da ana sayfaya dönebilirsin.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-[hsl(var(--surface-inset))]"
        >
          Tekrar Dene
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
      {error.digest && (
        <p className="mt-6 text-xs text-muted-foreground">Hata kodu: {error.digest}</p>
      )}
    </div>
  );
}
