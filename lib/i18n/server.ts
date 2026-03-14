import { cookies, headers } from "next/headers";

import {
  DEFAULT_LOCALE,
  isSupportedLocale,
  LOCALE_COOKIE_NAME,
  type Locale
} from "@/lib/i18n/config";

function resolveLocaleFromHeader(value: string | null): Locale {
  if (!value) {
    return DEFAULT_LOCALE;
  }

  const normalized = value.toLowerCase();

  if (normalized.includes("tr")) {
    return "tr";
  }

  if (normalized.includes("en")) {
    return "en";
  }

  return DEFAULT_LOCALE;
}

export function resolveRequestLocale(): Locale {
  const cookieLocale = cookies().get(LOCALE_COOKIE_NAME)?.value;

  if (isSupportedLocale(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = headers().get("accept-language");
  return resolveLocaleFromHeader(acceptLanguage);
}
