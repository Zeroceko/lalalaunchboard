"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/shared/ToastProvider";
import { appMessages } from "@/lib/apps/messages";
import { createAppSchema } from "@/lib/apps/validation";
import { flattenFieldErrors } from "@/lib/auth/validation";
import type { AppActionResult, AppLimitState, Plan } from "@/types";

interface NewAppFormProps {
  limit: AppLimitState;
}

function getDefaultLaunchDate() {
  const nextTwoWeeks = new Date();
  nextTwoWeeks.setDate(nextTwoWeeks.getDate() + 14);

  return nextTwoWeeks.toISOString().slice(0, 10);
}

type NewAppFormState = {
  name: string;
  platform: "ios" | "android" | "web";
  launchDate: string;
};

const initialState: NewAppFormState = {
  name: "",
  platform: "web",
  launchDate: getDefaultLaunchDate()
};

function getPlanLabel(plan: Plan) {
  return plan === "pro" ? "Pro" : "Free";
}

const platformOptions = [
  {
    value: "ios",
    label: "iOS",
    detail: "App Store odagi"
  },
  {
    value: "android",
    label: "Android",
    detail: "Google Play odagi"
  },
  {
    value: "web",
    label: "Web",
    detail: "Landing-first flow"
  }
] as const;

export function NewAppForm({ limit }: NewAppFormProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(initialState);
  const [fieldErrors, setFieldErrors] = useState<
    AppActionResult["fieldErrors"]
  >({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const isBlocked = !limit.canCreateApp;

  function updateField<K extends keyof typeof initialState>(
    key: K,
    value: (typeof initialState)[K]
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
        description: "Yeni app workspace'i dashboard'a eklendi.",
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
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-[1.75rem] bg-secondary/55 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
              Plan
            </p>
            <p className="mt-2 text-lg font-semibold">{getPlanLabel(limit.plan)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
              Mevcut App
            </p>
            <p className="mt-2 text-lg font-semibold">{limit.appCount}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
              Kalan Slot
            </p>
            <p className="mt-2 text-lg font-semibold">
              {limit.remainingSlots === null ? "Sinirsiz" : limit.remainingSlots}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Bu form tamamlandiginda direkt checklist ekranina gecmeye hazir bir workspace olusacak.
        </p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Uygulama Adi</span>
        <input
          type="text"
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="Orn. FocusFlow"
          className="w-full rounded-2xl border border-foreground/10 bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
        {fieldErrors?.name ? (
          <p className="text-sm text-destructive">{fieldErrors.name}</p>
        ) : null}
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <span className="text-sm font-medium">Platform</span>
          <div className="grid gap-3 sm:grid-cols-3">
            {platformOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateField("platform", option.value)}
                className={`rounded-[1.35rem] border px-4 py-4 text-left transition ${
                  form.platform === option.value
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-foreground/10 bg-background hover:bg-secondary/40"
                }`}
              >
                <p className="text-sm font-semibold">{option.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{option.detail}</p>
              </button>
            ))}
          </div>
          {fieldErrors?.platform ? (
            <p className="text-sm text-destructive">{fieldErrors.platform}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium">Hedef Lansman Tarihi</span>
          <input
            type="date"
            value={form.launchDate}
            onChange={(event) => updateField("launchDate", event.target.value)}
            className="w-full rounded-2xl border border-foreground/10 bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
          <p className="text-xs text-muted-foreground">
            Countdown, checklist ritmi ve workspace odagi bu tarihe gore sekillenecek.
          </p>
          {fieldErrors?.launchDate ? (
            <p className="text-sm text-destructive">{fieldErrors.launchDate}</p>
          ) : null}
        </div>
      </div>

      {isBlocked ? (
        <div className="rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-4 text-sm text-amber-900">
          Free plan limitine ulastin. Mevcut workspace&apos;ini silebilir ya da
          ileride Pro Plan&apos;a gecerek sinirsiz uygulama ekleyebilirsin.
        </div>
      ) : null}

      {statusMessage ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {statusMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || isPending || isBlocked}
        className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting || isPending
          ? "Workspace olusturuluyor..."
          : "Workspace Olustur"}
      </button>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.25rem] border border-foreground/10 bg-background/70 p-4 text-sm text-muted-foreground">
          Checklist ekrani hemen hazir olur.
        </div>
        <div className="rounded-[1.25rem] border border-foreground/10 bg-background/70 p-4 text-sm text-muted-foreground">
          Deliverable toplama akisi ayni board&apos;a baglanir.
        </div>
        <div className="rounded-[1.25rem] border border-foreground/10 bg-background/70 p-4 text-sm text-muted-foreground">
          Sonraki adim post-launch routine ve export olur.
        </div>
      </div>
    </form>
  );
}
