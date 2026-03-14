"use client";

import { useState } from "react";

import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { LaunchBadge, LaunchPanel } from "@/components/ui/LaunchKit";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "register",
    label: "Kayit ol",
    description: "Ilk boardunu ac ve sistemi baslat."
  },
  {
    id: "login",
    label: "Giris yap",
    description: "Mevcut launch boardlarina geri don."
  }
] as const;

export function AuthTabs() {
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]["id"]>("register");

  const activeTabData = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <LaunchPanel tone="default" className="relative overflow-hidden p-3">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--bg-glow-brand)/0.12),transparent_26%),radial-gradient(circle_at_bottom_left,hsl(var(--bg-glow-accent)/0.14),transparent_24%)]" />

      <div className="relative space-y-4">
        <div className="rounded-[1.5rem] border border-[hsl(var(--border))/0.68] bg-[hsl(var(--card))/0.85] p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <LaunchBadge tone="brand">Access</LaunchBadge>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Lalalaunchboard hesabina baglan
              </h2>
              <p className="max-w-sm text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                {activeTabData.description}
              </p>
            </div>
            <LaunchBadge tone="success">Secure flow</LaunchBadge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-[1.35rem] bg-[hsl(var(--secondary))/0.75] p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-[1rem] px-4 py-3 text-sm font-semibold transition",
                activeTab === tab.id
                  ? "bg-[hsl(var(--card))/0.96] text-foreground shadow-[0_14px_32px_hsl(var(--shadow-color)/0.08)]"
                  : "text-[hsl(var(--muted-foreground))] hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="rounded-[1.6rem] border border-[hsl(var(--border))/0.68] bg-[hsl(var(--card))/0.92] p-5 sm:p-6">
          {activeTab === "register" ? <RegisterForm /> : <LoginForm />}
        </div>
      </div>
    </LaunchPanel>
  );
}
