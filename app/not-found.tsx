import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <p className="text-7xl font-black text-[hsl(var(--primary))]">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-foreground">Sayfa bulunamadı</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        Aradığın sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        ← Ana Sayfaya Dön
      </Link>
    </div>
  );
}
