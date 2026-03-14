"use client";

import { useEffect, useState } from "react";

import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { LaunchBadge } from "@/components/ui/LaunchKit";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "login",
    tone: "info"
  },
  {
    id: "register",
    tone: "brand"
  }
] as const;

type AuthTabId = (typeof tabs)[number]["id"];

interface AuthTabsProps {
  initialTab?: AuthTabId;
  locale: Locale;
}

export function AuthTabs({
  initialTab = "login",
  locale
}: AuthTabsProps) {
  const [activeTab, setActiveTab] = useState<AuthTabId>(initialTab);
  const dictionary = getDictionary(locale);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const isLogin = activeTab === "login";
  const activeTone = isLogin ? "info" : "brand";

  return (
    <div className="space-y-6">
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <LaunchBadge tone={activeTone}>
            {isLogin
              ? dictionary.authPage.loginEyebrow
              : dictionary.authPage.registerEyebrow}
          </LaunchBadge>
        </div>
        <div className="space-y-3">
          <h1 className="text-balance text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
            {isLogin
              ? dictionary.authPage.loginTitle
              : dictionary.authPage.registerTitle}
          </h1>
          <p className="mx-auto max-w-xl text-base leading-7 text-[hsl(var(--muted-foreground))]">
            {isLogin
              ? dictionary.authPage.loginDescription
              : dictionary.authPage.registerDescription}
          </p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-[hsl(var(--border))/0.58] bg-[hsl(var(--card))/0.78] p-5 shadow-[0_22px_64px_hsl(var(--shadow-color)/0.08)] backdrop-blur sm:p-7">
        {isLogin ? <LoginForm locale={locale} /> : <RegisterForm locale={locale} />}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-[hsl(var(--muted-foreground))]">
        <span>
          {isLogin
            ? dictionary.authPage.switchToRegisterPrompt
            : dictionary.authPage.switchToLoginPrompt}
        </span>
        <button
          type="button"
          onClick={() => setActiveTab(isLogin ? "register" : "login")}
          className={cn(
            "rounded-full px-4 py-2 font-semibold transition",
            isLogin
              ? "bg-[hsl(var(--brand-soft))/0.95] text-[hsl(var(--primary))] hover:bg-[hsl(var(--brand-soft))]"
              : "bg-[hsl(var(--info-soft))/0.95] text-[hsl(var(--info))] hover:bg-[hsl(var(--info-soft))]"
          )}
        >
          {isLogin
            ? dictionary.authPage.switchToRegisterLabel
            : dictionary.authPage.switchToLoginLabel}
        </button>
      </div>
    </div>
  );
}
