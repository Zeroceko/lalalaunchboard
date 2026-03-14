"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { Locale } from "@/lib/i18n/config";
import type { AppDictionary } from "@/lib/i18n/dictionaries";

interface LocaleContextValue {
  locale: Locale;
  dictionary: AppDictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  locale: Locale;
  dictionary: AppDictionary;
  children: ReactNode;
}

export function LocaleProvider({
  locale,
  dictionary,
  children
}: LocaleProviderProps) {
  return (
    <LocaleContext.Provider value={{ locale, dictionary }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocaleContext must be used within LocaleProvider");
  }

  return context;
}
