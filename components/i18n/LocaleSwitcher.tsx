"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";

import { launchButtonStyles } from "@/components/ui/LaunchKit";
import {
  LOCALE_COOKIE_NAME,
  type Locale
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

interface LocaleSwitcherProps {
  locale: Locale;
}

export function LocaleSwitcher({ locale }: LocaleSwitcherProps) {
  const router = useRouter();
  const dictionary = getDictionary(locale);

  function updateLocale(nextLocale: Locale) {
    if (nextLocale === locale) {
      return;
    }

    document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div
      role="group"
      aria-label={dictionary.common.languageLabel}
      className="inline-flex items-center gap-1 rounded-full border border-[hsl(var(--border))/0.58] bg-[hsl(var(--card))/0.76] p-1 shadow-[0_10px_28px_hsl(var(--shadow-color)/0.06)] backdrop-blur"
    >
      {([
        ["tr", dictionary.common.turkishLabel],
        ["en", dictionary.common.englishLabel]
      ] as const).map(([value, label]) => (
        <button
          key={value}
          type="button"
          onClick={() => updateLocale(value)}
          className={cn(
            "rounded-full px-3.5 py-2 text-sm font-semibold transition",
            locale === value
              ? launchButtonStyles.primary
              : "text-[hsl(var(--muted-foreground))] hover:text-foreground"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
