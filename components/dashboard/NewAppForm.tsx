"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/shared/ToastProvider";
import { appMessages } from "@/lib/apps/messages";
import { createAppSchema } from "@/lib/apps/validation";
import { flattenFieldErrors } from "@/lib/auth/validation";
import type { AppActionResult, AppLimitState, Plan } from "@/types";
import {
  LaunchActionBar,
  LaunchBadge,
  LaunchButton,
  LaunchChoiceCard,
  LaunchFieldShell,
  LaunchInput,
  LaunchMiniStat,
  LaunchNotice,
  LaunchPanel,
  LaunchRailList,
  launchButtonStyles
} from "@/components/ui/LaunchKit";

interface NewAppFormProps {
  limit: AppLimitState;
  initialValues?: Partial<NewAppFormState>;
  mode?: "default" | "platform" | "client";
  sourceAppName?: string | null;
}

type NewAppFormState = {
  name: string;
  platform: "ios" | "android" | "web";
  launchDate: string;
};

const platformOptions = [
  {
    value: "web",
    label: "Web app",
    hint: "Landing, onboarding ve launch funnel tarafini one al.",
    tone: "brand" as const
  },
  {
    value: "ios",
    label: "iOS app",
    hint: "App Store creative seti ve publish paketiyle basla.",
    tone: "clay" as const
  },
  {
    value: "android",
    label: "Android app",
    hint: "Play Store teslimleri ve rollout ritmini sabitle.",
    tone: "success" as const
  }
] as const;

const activationFlow = [
  {
    title: "Identity locked",
    description:
      "Isim ve platform secimi board kartinin tonu ile ilk odak alanini belirler.",
    badge: "Step 01",
    tone: "brand" as const
  },
  {
    title: "Launch window set",
    description:
      "Tarih netlestiginde countdown, prep ritmi ve oncelik sirasi ayni planin ustune oturur.",
    badge: "Step 02",
    tone: "warning" as const
  },
  {
    title: "Board goes live",
    description:
      "Dashboard, checklist ve sonraki routine bolumleri ayni workspace mantigiyla acilir.",
    badge: "Step 03",
    tone: "success" as const
  }
];

function getDefaultLaunchDate() {
  const nextTwoWeeks = new Date();
  nextTwoWeeks.setDate(nextTwoWeeks.getDate() + 14);

  return nextTwoWeeks.toISOString().slice(0, 10);
}

const defaultState: NewAppFormState = {
  name: "",
  platform: "web",
  launchDate: getDefaultLaunchDate()
};

function getPlanLabel(plan: Plan) {
  return plan === "pro" ? "Pro" : "Free";
}

interface FormSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  tone?: "default" | "tint" | "brand" | "clay";
}

function FormSection({
  eyebrow,
  title,
  description,
  children,
  tone = "default"
}: FormSectionProps) {
  return (
    <LaunchPanel tone={tone} className="space-y-7">
      <div className="space-y-3">
        <LaunchBadge tone={tone === "brand" ? "brand" : tone === "clay" ? "clay" : "neutral"}>
          {eyebrow}
        </LaunchBadge>
        <div className="space-y-2">
          <h3 className="text-[1.9rem] font-semibold tracking-[-0.04em] text-foreground">
            {title}
          </h3>
          <p className="max-w-2xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">
            {description}
          </p>
        </div>
      </div>
      {children}
    </LaunchPanel>
  );
}

export function NewAppForm({
  limit,
  initialValues,
  mode = "default",
  sourceAppName = null
}: NewAppFormProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<NewAppFormState>({
    ...defaultState,
    ...initialValues
  });
  const [fieldErrors, setFieldErrors] = useState<
    AppActionResult["fieldErrors"]
  >({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const isBlocked = !limit.canCreateApp;

  function updateField<K extends keyof NewAppFormState>(
    key: K,
    value: NewAppFormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isBlocked) {
      setStatusMessage(appMessages.planLimitReached);
      pushToast({
        title: "Limit dolu",
        description: appMessages.planLimitReached,
        variant: "destructive"
      });
      return;
    }

    setStatusMessage(null);
    const parsed = createAppSchema.safeParse(form);

    if (!parsed.success) {
      setFieldErrors(flattenFieldErrors(parsed.error));
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/apps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsed.data)
      });
      const result = (await response.json()) as AppActionResult;

      if (!response.ok || !result.ok) {
        setFieldErrors(result.fieldErrors ?? {});
        const message = result.message ?? appMessages.genericError;
        setStatusMessage(message);
        pushToast({
          title: "Workspace olusturulamadi",
          description: message,
          variant: "destructive"
        });
        return;
      }

      pushToast({
        title: "Workspace hazir",
        description: "Ilk checklist ekranina yonlendiriliyorsun.",
        variant: "success"
      });

      startTransition(() => {
        router.push(result.redirectTo ?? "/dashboard");
        router.refresh();
      });
    } catch {
      setStatusMessage(appMessages.genericError);
      pushToast({
        title: "Workspace olusturulamadi",
        description: appMessages.genericError,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-7 xl:grid-cols-[minmax(0,1.06fr)_360px]">
      <form className="space-y-7" onSubmit={handleSubmit}>
        <LaunchPanel tone="tint" className="space-y-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <LaunchBadge tone="brand">Board activation</LaunchBadge>
              <div className="space-y-2">
                <h2 className="text-[2.3rem] font-semibold tracking-[-0.05em] text-foreground">
                  Yeni uygulaman icin launch workspace kur.
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">
                  Once kimligi sabitle, sonra launch window&apos;u belirle.
                  Dashboard karti, checklist akisi ve countdown ayni planin
                  ustune kurulsun.
                </p>
              </div>
            </div>
            <LaunchBadge tone="warning">About 1 minute</LaunchBadge>
          </div>

          {mode !== "default" ? (
            <LaunchNotice tone="info">
              {mode === "platform"
                ? `${sourceAppName ?? "Mevcut proje"} icin yeni bir platform workspace'i aciyorsun. Isim ve tarih bilgisi hazir getirildi; istersen bu varyanti duzenleyebilirsin.`
                : `${sourceAppName ?? "Mevcut proje"} icin yeni bir client veya varyant workspace'i aciyorsun. Mevcut isim taslak olarak getirildi; client adina gore duzenleyebilirsin.`}
            </LaunchNotice>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-3">
            <LaunchMiniStat
              label="Plan"
              value={getPlanLabel(limit.plan)}
              detail="Board kapasitesi bu plana gore acilir."
              tone="brand"
            />
            <LaunchMiniStat
              label="Active boards"
              value={limit.appCount}
              detail="Su anda acik olan launch workspace sayisi."
              tone="clay"
            />
            <LaunchMiniStat
              label="Open slots"
              value={limit.remainingSlots === null ? "Unlimited" : limit.remainingSlots}
              detail="Yeni board olusturmak icin kalan alan."
              tone={limit.remainingSlots === 0 ? "warning" : "success"}
            />
          </div>
        </LaunchPanel>

        <FormSection
          eyebrow="Identity"
          title="Board kimligini tanimla"
          description="Bu secimler dashboard kartinin ilk hissini, checklist odagini ve boardun genel ritmini belirler."
        >
          <div className="space-y-7">
            <LaunchFieldShell
              label="Uygulama adi"
              hint="Workspace basliginda, export ekraninda ve checklist tarafinda ana isim olarak kullanilacak."
              error={fieldErrors?.name}
              fieldId="app-name"
            >
              <LaunchInput
                id="app-name"
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Orn. FocusFlow"
              />
            </LaunchFieldShell>

            <LaunchFieldShell
              label="Platform"
              hint="Platform secimi boardun ilk odagini dogru yone ceker."
              error={fieldErrors?.platform}
            >
              <div className="grid gap-4 sm:grid-cols-3">
                {platformOptions.map((option) => (
                  <LaunchChoiceCard
                    key={option.value}
                    label={option.label}
                    hint={option.hint}
                    selected={form.platform === option.value}
                    tone={option.tone}
                    onSelect={() => updateField("platform", option.value)}
                  />
                ))}
              </div>
            </LaunchFieldShell>
          </div>
        </FormSection>

        <FormSection
          eyebrow="Launch window"
          title="Go-live tarihini sabitle"
          description="Launch date sadece takvim bilgisi degildir. Countdown, prep ritmi ve sonraki hareket bu tarihin etrafinda sekillenir."
          tone="brand"
        >
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <LaunchFieldShell
              label="Launch date"
              hint="Bu tarih dashboard kartinda countdown, checklist tarafinda ise ana ritim noktasi olur."
              error={fieldErrors?.launchDate}
              fieldId="launch-date"
            >
              <LaunchInput
                id="launch-date"
                type="date"
                value={form.launchDate}
                onChange={(event) => updateField("launchDate", event.target.value)}
              />
            </LaunchFieldShell>

            <LaunchPanel tone="clay" className="space-y-4 p-5">
              <LaunchBadge tone="clay">Planning note</LaunchBadge>
              <h4 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
                Nefes alan bir launch window sec
              </h4>
              <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                Cogu indie launch icin iki haftalik hazirlik araligi; store
                teslimleri, gorseller ve launch-day iletisimini rahat toplar.
              </p>
            </LaunchPanel>
          </div>
        </FormSection>

        {isBlocked ? (
          <LaunchNotice tone="warning">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Free plan kapasitesi dolu. Yeni board açmadan önce mevcut bir
                workspace&apos;i silmen veya Pro plana geçmen gerekir.
              </p>
              <Link href="/pricing" className={launchButtonStyles.secondary}>
                Planları gör
              </Link>
            </div>
          </LaunchNotice>
        ) : null}

        {statusMessage ? <LaunchNotice tone="danger">{statusMessage}</LaunchNotice> : null}

        <LaunchActionBar
          eyebrow="Create workspace"
          title="Boardu ac ve launch operasyonunu baslat"
          description="Workspace olustugunda dashboard karti, launch timing ve sonraki checklist akisi ayni urun dili icinde hazir olacak."
        >
          <LaunchButton type="submit" disabled={isSubmitting || isPending || isBlocked}>
            {isSubmitting || isPending
              ? "Workspace olusturuluyor..."
              : "Workspace olustur"}
          </LaunchButton>
        </LaunchActionBar>
      </form>

      <div className="space-y-6">
        <LaunchRailList
          eyebrow="What opens next"
          title="Bu kurulum bir formdan fazlasi"
          description="Kaydi bitirdiginde board yalnizca olusmaz. Dashboard ve checklist tarafinda kullanilan tum ilk yapi birlikte acilir."
          items={activationFlow}
        />

        <LaunchPanel tone={isBlocked ? "warning" : "success"} className="space-y-4">
          <LaunchBadge tone={isBlocked ? "warning" : "success"}>
            {isBlocked ? "Capacity check" : "Board promise"}
          </LaunchBadge>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
              {isBlocked
                ? "Yeni board icin once alan ac"
                : "Olusan ilk sey sadece bir kayit olmayacak"}
            </h3>
            <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
              {isBlocked
                ? "Su anki plan limiti doluysa yeni workspace acmadan once bir slot bosaltman gerekir."
                : "Platform, launch date ve next move sinyali dashboardta ilk andan itibaren gorunur olacak."}
            </p>
          </div>
        </LaunchPanel>

        <LaunchPanel tone="default" className="space-y-4">
          <LaunchBadge tone="neutral">Default stack</LaunchBadge>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
              Ilk gun acilacak bolumler
            </h3>
            <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
              Bu ekran bittiginde su alanlar ayni board mantigiyla birlikte
              dusunulur.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Dashboard card", "Launch countdown", "Prep checklist", "Post-launch routine"].map(
              (item) => (
                <LaunchBadge
                  key={item}
                  tone="neutral"
                  className="bg-[hsl(var(--card))/0.96]"
                >
                  {item}
                </LaunchBadge>
              )
            )}
          </div>
        </LaunchPanel>
      </div>
    </div>
  );
}
