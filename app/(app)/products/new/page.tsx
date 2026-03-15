import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { requireSessionContext } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { getProductCreationState } from "@/lib/products/service";
import { NewProductForm } from "@/components/products/NewProductForm";

export default async function NewProductPage() {
  const { user } = await requireSessionContext();
  const supabase = createClient();

  const { limit } = await getProductCreationState(supabase, user.id);

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Header */}
      <div className="border-b border-[hsl(var(--border)/0.5)] bg-[hsl(var(--card)/0.4)] px-6 py-5">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/dashboard"
            className="mb-3 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={12} /> Dashboard
          </Link>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">
            Yeni Ürün
          </p>
          <h1 className="mt-1 text-[1.4rem] font-black tracking-[-0.04em] text-foreground">
            Ürün oluştur
          </h1>
          <p className="mt-1 text-[12.5px] text-muted-foreground">
            Ürününü ekle, pre-launch checklistini otomatik oluştursun.
          </p>
        </div>
      </div>

      {limit ? (
        <NewProductForm limit={limit} />
      ) : (
        <div className="mx-auto max-w-2xl px-6 py-10 text-center text-muted-foreground text-[13px]">
          Profil yüklenemedi. Lütfen sayfayı yenile.
        </div>
      )}
    </div>
  );
}
