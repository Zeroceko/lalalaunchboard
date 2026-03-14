"use client";

import { useState } from "react";

import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "register",
    label: "Kayit Ol"
  },
  {
    id: "login",
    label: "Giris Yap"
  }
] as const;

export function AuthTabs() {
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]["id"]>("register");

  return (
    <div className="overflow-hidden rounded-[2rem] border border-foreground/10 bg-white/92 shadow-[0_28px_70px_rgba(15,23,42,0.1)]">
      <div className="border-b border-foreground/8 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(245,238,225,0.92))] px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">
          Secure workspace access
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Continue with your launch board
        </h2>
      </div>

      <div className="p-3">
        <div className="grid grid-cols-2 gap-2 rounded-[1.25rem] bg-secondary/70 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-2xl px-4 py-3 text-sm font-semibold transition",
                activeTab === tab.id
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 pt-1 sm:p-6 sm:pt-2">
        <div className="rounded-[1.75rem] border border-foreground/8 bg-white/70 p-1">
          <div className="p-4 sm:p-5">
            {activeTab === "register" ? <RegisterForm /> : <LoginForm />}
          </div>
        </div>
      </div>
    </div>
  );
}
