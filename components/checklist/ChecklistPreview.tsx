import {
  LaunchBadge,
  LaunchMiniStat,
  LaunchPanel
} from "@/components/ui/LaunchKit";

const checklistItems = [
  {
    title: "Store metadata paketini tamamla",
    category: "Store prep",
    status: "Done",
    detail: "Subtitle, keyword seti ve kisa aciklama tamamlandi.",
    tone: "success" as const
  },
  {
    title: "Kreatif setin son turu",
    category: "Creative",
    status: "Review",
    detail: "App Store ekran goruntuleri ve launch gorselleri kontrol bekliyor.",
    tone: "warning" as const
  },
  {
    title: "Launch day paylasim sirasi",
    category: "Ops",
    status: "Next",
    detail: "Topluluk postlari, e-posta ve changelog akisi siraya alinacak.",
    tone: "brand" as const
  }
];

export function ChecklistPreview() {
  return (
    <LaunchPanel tone="brand" className="space-y-7">
      <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_310px]">
        <div className="space-y-6">
          <div className="space-y-3">
            <LaunchBadge tone="brand">Checklist preview</LaunchBadge>
            <div className="space-y-2">
              <h3 className="text-3xl font-semibold tracking-tight text-foreground">
                Checklist ekrani da ayni UI kit ile buyuyecek.
              </h3>
              <p className="max-w-2xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">
                Dashboard ve setup ekranlarinda kullanilan kart, status badge,
                inset panel ve action yuzeyi ayni gorsel sistem icinde checklist
                tarafina tasinacak.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <LaunchMiniStat
              label="Tamamlanan"
              value="18"
              detail="Hazir gorev"
              tone="success"
            />
            <LaunchMiniStat
              label="Aktif"
              value="07"
              detail="Su an uzerinde calisilan is"
              tone="warning"
            />
            <LaunchMiniStat
              label="Launch tarihi"
              value="4 Nisan"
              detail="Countdown merkezi"
              tone="brand"
            />
          </div>

          <div className="space-y-4">
            {checklistItems.map((item) => (
              <div
                key={item.title}
                data-tone={item.tone}
                className="launch-glass-widget rounded-[1.55rem] border border-[hsl(var(--border))/0.58] bg-[hsl(var(--card))/0.9] px-5 py-[1.125rem] shadow-[0_12px_28px_hsl(var(--shadow-color)/0.07)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <LaunchBadge tone="neutral">{item.category}</LaunchBadge>
                      <LaunchBadge tone={item.tone}>{item.status}</LaunchBadge>
                    </div>
                    <h4 className="text-lg font-semibold tracking-tight text-foreground">
                      {item.title}
                    </h4>
                    <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                      {item.detail}
                    </p>
                  </div>
                  <button
                    type="button"
                    data-tone="secondary"
                    className="launch-glass-widget rounded-full border border-[hsl(var(--border))/0.52] bg-[hsl(var(--card))/0.88] px-3.5 py-2 text-sm font-semibold text-[hsl(var(--muted-foreground))]"
                  >
                    Ac
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <LaunchPanel tone="default" className="space-y-3 p-5">
            <LaunchBadge tone="info">Detail rail</LaunchBadge>
            <h4 className="text-2xl font-semibold tracking-tight text-foreground">
              Gorev detay paneli
            </h4>
            <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
              Aciklama, deliverable ve yardimci linkler ayri route hissi vermeden
              ayni board sistemi icinde acilacak.
            </p>
          </LaunchPanel>

          <LaunchPanel tone="subtle" className="space-y-3 p-5">
            <LaunchBadge tone="success">Design promise</LaunchBadge>
            <ul className="space-y-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
              <li>Checklist satirlari, veri tablosu gibi degil karar yuzeyi gibi gorunur.</li>
              <li>Category bloklari dashboard kartlariyla akraba davranir.</li>
              <li>Progress ve action rail ayni renk sistemini korur.</li>
            </ul>
          </LaunchPanel>
        </div>
      </div>
    </LaunchPanel>
  );
}
