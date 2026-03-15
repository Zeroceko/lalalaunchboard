"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/shared/ToastProvider";

const roles = [
  { key: "Founder", label: "Founder / CEO", desc: "Şirketi kuruyor veya yönetiyorum" },
  { key: "Growth", label: "Growth / Marketing", desc: "Büyüme ve pazarlamayı yönetiyorum" },
  { key: "Product", label: "Product Manager", desc: "Ürün stratejisine odaklanıyorum" },
  { key: "Marketing", label: "Pazarlama Uzmanı", desc: "Marka ve içerik üretiyorum" },
] as const;

const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all";

interface Props { initialName: string; initialRole: string; email: string; }

export function ProfileForm({ initialName, initialRole, email }: Props) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [fullName, setFullName] = useState(initialName);
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) {
      pushToast({ title: "Ad Soyad zorunludur", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, role_in_company: role || undefined }),
      });
      const data = await res.json();
      if (!data.ok) {
        pushToast({ title: data.message ?? "Bir hata oluştu", variant: "destructive" });
        return;
      }
      pushToast({ title: "Profil kaydedildi", description: "Değişiklikler hemen geçerli oldu.", variant: "success" });
      router.refresh();
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSave}>
      {/* Ad Soyad */}
      <div className="grid gap-2 sm:grid-cols-[200px_1fr] sm:items-start sm:gap-6 py-5 border-b border-border">
        <div className="pt-0.5">
          <p className="text-sm font-semibold text-foreground">Ad Soyad <span className="text-destructive">*</span></p>
          <p className="mt-0.5 text-xs text-muted-foreground">AI sana bu adla hitap eder</p>
        </div>
        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ayşe Yılmaz" className={inputCls} />
      </div>

      {/* E-posta */}
      <div className="grid gap-2 sm:grid-cols-[200px_1fr] sm:items-start sm:gap-6 py-5 border-b border-border">
        <div className="pt-0.5">
          <p className="text-sm font-semibold text-foreground">E-posta</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Değiştirme yakında eklenecek</p>
        </div>
        <input type="email" value={email} disabled className={`${inputCls} opacity-50 cursor-not-allowed`} />
      </div>

      {/* Pozisyon */}
      <div className="grid gap-2 sm:grid-cols-[200px_1fr] sm:items-start sm:gap-6 py-5 border-b border-border">
        <div className="pt-0.5">
          <p className="text-sm font-semibold text-foreground">Pozisyon</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Rolün AI yanıtlarını kişiselleştirir</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {roles.map((r) => {
            const active = role === r.key;
            return (
              <button key={r.key} type="button" onClick={() => setRole(active ? "" : r.key)}
                className={`relative flex flex-col gap-0.5 rounded-xl border-2 p-3.5 text-left transition-all ${
                  active ? "border-primary bg-primary/5" : "border-border bg-background hover:bg-muted/30"
                }`}>
                {active && (
                  <span className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                    <svg viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2" className="h-2.5 w-2.5">
                      <path d="M1.5 5l2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
                <span className={`text-sm font-semibold leading-snug ${active ? "text-primary" : "text-foreground"}`}>{r.label}</span>
                <span className="text-xs text-muted-foreground leading-snug">{r.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end pt-5">
        <button type="submit" disabled={loading}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60">
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  );
}
