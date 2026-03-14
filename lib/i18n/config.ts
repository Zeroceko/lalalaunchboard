export const SUPPORTED_LOCALES = ["tr", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "tr";
export const LOCALE_COOKIE_NAME = "lalalaunchboard.locale";

export function isSupportedLocale(
  value: string | null | undefined
): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}
