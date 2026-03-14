import type { Locale } from "@/lib/i18n/config";

interface LandingJourneyStep {
  label: string;
  title: string;
  description: string;
}

interface LandingHighlight {
  title: string;
  description: string;
}

interface LandingShowcaseStat {
  label: string;
  value: string;
  detail: string;
}

export interface AppDictionary {
  common: {
    languageLabel: string;
    turkishLabel: string;
    englishLabel: string;
    homeLabel: string;
    signInLabel: string;
    signUpLabel: string;
  };
  landing: {
    topTagline: string;
    heroEyebrow: string;
    heroTitle: string;
    heroDescription: string;
    heroPrimaryCta: string;
    heroSecondaryCta: string;
    heroPoints: string[];
    journeyEyebrow: string;
    journeyTitle: string;
    journeyDescription: string;
    journeySteps: LandingJourneyStep[];
    productEyebrow: string;
    productTitle: string;
    productDescription: string;
    productHighlights: LandingHighlight[];
    showcaseEyebrow: string;
    showcasePreviewLabel: string;
    showcaseTitle: string;
    showcaseDescription: string;
    showcaseStats: LandingShowcaseStat[];
    showcaseListTitle: string;
    showcaseList: string[];
    ctaEyebrow: string;
    ctaTitle: string;
    ctaDescription: string;
  };
  authPage: {
    topBadge: string;
    title: string;
    description: string;
    loginEyebrow: string;
    loginTitle: string;
    loginDescription: string;
    registerEyebrow: string;
    registerTitle: string;
    registerDescription: string;
    switchToRegisterPrompt: string;
    switchToRegisterLabel: string;
    switchToLoginPrompt: string;
    switchToLoginLabel: string;
    redirectNoticeTitle: string;
    redirectNoticeDescription: string;
  };
  authForm: {
    emailLabel: string;
    emailHint: string;
    emailPlaceholder: string;
    passwordLabel: string;
    loginPasswordHint: string;
    registerPasswordHint: string;
    passwordPlaceholder: string;
    confirmPasswordLabel: string;
    confirmPasswordHint: string;
    confirmPasswordPlaceholder: string;
    captchaLabel: string;
    captchaHint: string;
    loginSubmit: string;
    loginSubmitting: string;
    registerSubmit: string;
    registerSubmitting: string;
    loginConfigNotice: string;
    registerConfigNotice: string;
    loginErrorTitle: string;
    registerErrorTitle: string;
  };
}

const tr: AppDictionary = {
  common: {
    languageLabel: "Dil",
    turkishLabel: "Türkçe",
    englishLabel: "İngilizce",
    homeLabel: "Ana sayfa",
    signInLabel: "Giriş yap",
    signUpLabel: "Kayıt ol"
  },
  landing: {
    topTagline: "Pazardan önce ve pazarda tek yardımcın",
    heroEyebrow: "Lansman düzeni",
    heroTitle: "Pazara çıkmadan hazırlan. Pazara çıktıktan sonra da ritmini koru.",
    heroDescription:
      "Lalalaunchboard, ürününü yayına hazırlarken yapılacakları, teslimleri, geri sayımı ve ilk büyüme adımlarını tek yerde toplar.",
    heroPrimaryCta: "Kayıt ol",
    heroSecondaryCta: "Giriş yap",
    heroPoints: [
      "Yapılacaklar, teslimler ve takvim aynı yerde kalır.",
      "Lansman gününe giden akış tek bakışta okunur.",
      "Yayından sonra da aynı düzenle ilerlersin."
    ],
    journeyEyebrow: "Süreç",
    journeyTitle: "Masaya kurul, lansmana hazırlan ve büyümeyi takip et.",
    journeyDescription:
      "Bugün lansman odaklı bir çalışma alanıyla başlarsın. Yarın aynı düzen daha geniş operasyon kararlarına evrilir.",
    journeySteps: [
      {
        label: "01",
        title: "Masaya kurul",
        description:
          "Ürünün, hedef tarihin ve önceliklerin tek bir masada netleşsin."
      },
      {
        label: "02",
        title: "Lansmana hazırlan",
        description:
          "Teslimler, yapılacaklar ve geri sayım aynı ritimde ilerlesin."
      },
      {
        label: "03",
        title: "Büyümeyi takip et",
        description:
          "Yayın sonrasında da aynı düzen seni bir sonraki hamleye hazırlasın."
      }
    ],
    productEyebrow: "Ürün",
    productTitle: "Az araç değil, doğru ritim.",
    productDescription:
      "Tek tek ekranlar arasında kaybolmak yerine, karar vermeyi hızlandıran birkaç net yüzey kullanırsın.",
    productHighlights: [
      {
        title: "Tek bakışta odak",
        description:
          "Neyin hazır olduğunu, neyin beklediğini ve sıradaki işin ne olduğunu hemen görürsün."
      },
      {
        title: "Pazardan önce netlik",
        description:
          "Teslim dosyaları, mağaza hazırlığı ve lansman takvimi birbirinden kopmaz."
      },
      {
        title: "Pazarda devamlılık",
        description:
          "Lansman bittiğinde sistem bitmez; aynı düzen büyüme tarafına taşınır."
      }
    ],
    showcaseEyebrow: "Tek görünüm",
    showcasePreviewLabel: "Çalışma alanı",
    showcaseTitle: "Ne yapılacağı, neyin beklediği ve neyin yaklaştığı aynı bakışta okunur.",
    showcaseDescription:
      "Bu ürün, karar anında sana tablo değil yön duygusu vermek için tasarlandı.",
    showcaseStats: [
      {
        label: "Hazırlık",
        value: "%68",
        detail: "Kritik teslimler görünür durumda."
      },
      {
        label: "Kalan süre",
        value: "14 gün",
        detail: "Lansman tarihi her gün yeniden okunur."
      },
      {
        label: "Sıradaki odak",
        value: "Mağaza görselleri",
        detail: "Ekip önceliği dağılmadan ilerler."
      }
    ],
    showcaseListTitle: "Tek yardımcı",
    showcaseList: [
      "Ürünün, tarihler ve öncelikler aynı masada kalır.",
      "Teslim dosyaları ile yapılacaklar birbirinden kopmaz.",
      "Lansman bittiğinde büyüme notları aynı düzenin içinde devam eder."
    ],
    ctaEyebrow: "Başlangıç",
    ctaTitle: "İlk board'unu aç, dağınıklığı değil ritmi büyüt.",
    ctaDescription:
      "Kayıt olduğunda doğrudan giriş ekranına geçer, ardından board'unu kurup işe başlarsın."
  },
  authPage: {
    topBadge: "Güvenli erişim",
    title: "Hesabına gir veya yenisini oluştur.",
    description:
      "Bu ekranda yalnızca giriş ve kayıt formları var. İşin neyse doğrudan ona geç.",
    loginEyebrow: "Giriş",
    loginTitle: "Tekrar hoş geldin",
    loginDescription: "Board'larına kaldığın yerden dön.",
    registerEyebrow: "Kayıt",
    registerTitle: "İlk hesabını oluştur",
    registerDescription: "İlk board'unu açmak için birkaç bilgi yeterli.",
    switchToRegisterPrompt: "Üye değil misin?",
    switchToRegisterLabel: "Üye ol",
    switchToLoginPrompt: "Zaten üye misin?",
    switchToLoginLabel: "Giriş yap",
    redirectNoticeTitle: "Giriş gerekiyor",
    redirectNoticeDescription:
      "İstediğin çalışma alanına devam etmek için önce giriş yapman gerekiyor."
  },
  authForm: {
    emailLabel: "E-posta",
    emailHint: "Hesabın bu adres altında tutulur.",
    emailPlaceholder: "ornek@mail.com",
    passwordLabel: "Şifre",
    loginPasswordHint: "Board'larına güvenli şekilde dönmek için kullanılır.",
    registerPasswordHint: "En az 8 karakter kullan.",
    passwordPlaceholder: "En az 8 karakter",
    confirmPasswordLabel: "Şifre tekrarı",
    confirmPasswordHint: "Şifreni tekrar yazarak doğrula.",
    confirmPasswordPlaceholder: "Şifreni tekrar yaz",
    captchaLabel: "CAPTCHA",
    captchaHint: "Kayıt akışını korumak için doğrulama gerekir.",
    loginSubmit: "Giriş yap",
    loginSubmitting: "Giriş yapılıyor...",
    registerSubmit: "Kayıt ol",
    registerSubmitting: "Hesap oluşturuluyor...",
    loginConfigNotice:
      "Giriş akışını çalıştırmak için önce NEXT_PUBLIC_SUPABASE_URL ve bir Supabase public key tanımlanmalı.",
    registerConfigNotice:
      "Kayıt akışını açmak için önce NEXT_PUBLIC_SUPABASE_URL ve bir Supabase public key tanımlanmalı.",
    loginErrorTitle: "Giriş başarısız",
    registerErrorTitle: "Kayıt tamamlanamadı"
  }
};

const en: AppDictionary = {
  common: {
    languageLabel: "Language",
    turkishLabel: "Türkçe",
    englishLabel: "English",
    homeLabel: "Home",
    signInLabel: "Sign in",
    signUpLabel: "Sign up"
  },
  landing: {
    topTagline: "Your only helper before launch and in market",
    heroEyebrow: "Launch operating system",
    heroTitle: "Get ready before launch. Keep your rhythm after launch.",
    heroDescription:
      "Lalalaunchboard brings your tasks, deliverables, countdown, and first growth moves into one clear operating surface.",
    heroPrimaryCta: "Sign up",
    heroSecondaryCta: "Sign in",
    heroPoints: [
      "Checklist, deliverables, and timing stay in one place.",
      "The path to launch day is readable at a glance.",
      "The same rhythm continues after you go live."
    ],
    journeyEyebrow: "Journey",
    journeyTitle: "Set the table, prepare the launch, and track growth.",
    journeyDescription:
      "Today it starts as a launch-focused workspace. Tomorrow the same rhythm can expand into broader app operations.",
    journeySteps: [
      {
        label: "01",
        title: "Set the table",
        description:
          "Clarify the product, launch date, and priorities on one shared surface."
      },
      {
        label: "02",
        title: "Prepare the launch",
        description:
          "Keep deliverables, checklist items, and countdown moving in the same rhythm."
      },
      {
        label: "03",
        title: "Track growth",
        description:
          "After launch, the same setup keeps guiding the next move instead of starting over."
      }
    ],
    productEyebrow: "Product",
    productTitle: "Not more tools. The right rhythm.",
    productDescription:
      "Instead of bouncing between disconnected screens, you use a few focused surfaces that speed up decisions.",
    productHighlights: [
      {
        title: "Clarity at a glance",
        description:
          "See what is ready, what is waiting, and what deserves attention next."
      },
      {
        title: "Confidence before launch",
        description:
          "Store prep, deliverables, and launch timing stay connected."
      },
      {
        title: "Continuity in market",
        description:
          "The system does not stop when you go live; the same rhythm carries into growth."
      }
    ],
    showcaseEyebrow: "One view",
    showcasePreviewLabel: "Workspace",
    showcaseTitle: "What to do, what is waiting, and what is approaching all read in one glance.",
    showcaseDescription:
      "The product is designed to give direction in decision moments, not just another table of data.",
    showcaseStats: [
      {
        label: "Readiness",
        value: "68%",
        detail: "Critical deliverables stay visible."
      },
      {
        label: "Time left",
        value: "14 days",
        detail: "The launch date stays present every day."
      },
      {
        label: "Next focus",
        value: "Store visuals",
        detail: "The team moves without losing priority."
      }
    ],
    showcaseListTitle: "One helper",
    showcaseList: [
      "Product, dates, and priorities stay on the same table.",
      "Deliverables and checklist work do not drift apart.",
      "After launch, growth notes continue inside the same system."
    ],
    ctaEyebrow: "Start here",
    ctaTitle: "Open your first board and grow rhythm instead of chaos.",
    ctaDescription:
      "Once you sign up, you move straight into access and then into your first board setup."
  },
  authPage: {
    topBadge: "Secure access",
    title: "Sign in or create your account.",
    description:
      "This screen shows only the sign-in and sign-up forms, so you can get straight to the work.",
    loginEyebrow: "Sign in",
    loginTitle: "Welcome back",
    loginDescription: "Return to your boards and continue where you left off.",
    registerEyebrow: "Sign up",
    registerTitle: "Create your first account",
    registerDescription: "A few details are enough to open your first board.",
    switchToRegisterPrompt: "Not a member yet?",
    switchToRegisterLabel: "Create an account",
    switchToLoginPrompt: "Already a member?",
    switchToLoginLabel: "Sign in",
    redirectNoticeTitle: "Sign-in required",
    redirectNoticeDescription:
      "You need to sign in first to continue to the workspace you requested."
  },
  authForm: {
    emailLabel: "Email",
    emailHint: "Your account is kept under this address.",
    emailPlaceholder: "example@mail.com",
    passwordLabel: "Password",
    loginPasswordHint: "Used to return securely to your boards.",
    registerPasswordHint: "Use at least 8 characters.",
    passwordPlaceholder: "At least 8 characters",
    confirmPasswordLabel: "Repeat password",
    confirmPasswordHint: "Type your password again to confirm it.",
    confirmPasswordPlaceholder: "Type your password again",
    captchaLabel: "CAPTCHA",
    captchaHint: "Verification is required to protect the sign-up flow.",
    loginSubmit: "Sign in",
    loginSubmitting: "Signing in...",
    registerSubmit: "Sign up",
    registerSubmitting: "Creating account...",
    loginConfigNotice:
      "To enable sign-in, define NEXT_PUBLIC_SUPABASE_URL and a Supabase public key first.",
    registerConfigNotice:
      "To enable sign-up, define NEXT_PUBLIC_SUPABASE_URL and a Supabase public key first.",
    loginErrorTitle: "Sign-in failed",
    registerErrorTitle: "Sign-up failed"
  }
};

const dictionaries: Record<Locale, AppDictionary> = {
  tr,
  en
};

export function getDictionary(locale: Locale): AppDictionary {
  return dictionaries[locale];
}
