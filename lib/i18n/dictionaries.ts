import type { Locale } from "@/lib/i18n/config";

export interface AppDictionary {
  common: {
    languageLabel: string;
    turkishLabel: string;
    englishLabel: string;
  };
  landing: {
    topBadgePrimary: string;
    topBadgeSecondary: string;
    authButton: string;
    heroEyebrow: string;
    heroTitle: string;
    heroDescription: string;
    heroPrimaryCta: string;
    heroSecondaryCta: string;
  };
  authPage: {
    topBadge: string;
    topButton: string;
    heroEyebrow: string;
    heroTitle: string;
    heroDescription: string;
  };
}

const tr: AppDictionary = {
  common: {
    languageLabel: "Dil",
    turkishLabel: "Turkce",
    englishLabel: "Ingilizce"
  },
  landing: {
    topBadgePrimary: "Urununu pazara hazirla",
    topBadgeSecondary: "Tek ekranda takip",
    authButton: "Giris / Kayit",
    heroEyebrow: "Lansmana Hazirlik Araci",
    heroTitle: "Ne yapacagini her gun net gor, lansmana paniksiz hazirlan.",
    heroDescription:
      "Lalalaunchboard, teknik olmayan kullanicilarin bile kolayca anlayacagi bir sistem sunar. Yapilacaklar, teslim dosyalari ve geri sayim tek yerde oldugu icin sureci daha rahat yonetirsin.",
    heroPrimaryCta: "Ucretsiz basla",
    heroSecondaryCta: "Ornek dashboard"
  },
  authPage: {
    topBadge: "Guvenli giris",
    topButton: "Dashboard'a git",
    heroEyebrow: "Hesabina Baglan",
    heroTitle: "2 dakikada giris yap, planina kaldigin yerden devam et.",
    heroDescription:
      "Bu sayfada yeni hesap acabilir veya mevcut hesabinla giris yapabilirsin. Giris sonrasi tum projelerin ve yapilacaklarin seni tek yerde bekler."
  }
};

const en: AppDictionary = {
  common: {
    languageLabel: "Language",
    turkishLabel: "Turkish",
    englishLabel: "English"
  },
  landing: {
    topBadgePrimary: "Get launch-ready faster",
    topBadgeSecondary: "Track everything in one place",
    authButton: "Sign in / Register",
    heroEyebrow: "Launch Planning Tool",
    heroTitle: "Know what to do every day and launch without panic.",
    heroDescription:
      "Lalalaunchboard gives you a simple system anyone can understand. Your tasks, deliverables, and countdown live in one place so execution stays clear.",
    heroPrimaryCta: "Start free",
    heroSecondaryCta: "See dashboard"
  },
  authPage: {
    topBadge: "Secure access",
    topButton: "Go to dashboard",
    heroEyebrow: "Access Your Account",
    heroTitle: "Sign in in 2 minutes and continue your plan.",
    heroDescription:
      "You can create a new account or sign in with your existing one. After login, your projects and next actions are ready in one workspace."
  }
};

const dictionaries: Record<Locale, AppDictionary> = {
  tr,
  en
};

export function getDictionary(locale: Locale): AppDictionary {
  return dictionaries[locale];
}
