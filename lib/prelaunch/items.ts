export type PreLaunchPriority = "critical" | "important" | "nice_to_have";
export type PreLaunchCategory =
  | "store_compliance"
  | "aso"
  | "sector_compliance"
  | "technical";

export interface PreLaunchItem {
  id: string;
  title: string;
  why: string;
  how: string[];
  priority: PreLaunchPriority;
  category: PreLaunchCategory;
  platforms?: string[]; // if undefined → all platforms
  sectors?: string[]; // if undefined → all sectors
  compliance?: string[]; // triggered by compliance tags
  sourceUrl?: string;
}

// ── Store Compliance (Apple / Google Reject Prevention) ───────────────────────

const storeComplianceItems: PreLaunchItem[] = [
  {
    id: "sc-account-deletion",
    title: "Hesap Silme Butonu",
    why: "Apple Guideline 5.1.1: Uygulama içinde hesap silme zorunlu. Olmadan reject.",
    how: [
      "Settings > Privacy > 'Delete Account' ekranı ekle.",
      "Backend'de soft delete + GDPR uyumlu veri silme pipeline'ı kur.",
      "Silme işlemi tamamlanınca kullanıcıya e-posta gönder."
    ],
    priority: "critical",
    category: "store_compliance",
    platforms: ["ios", "android"]
  },
  {
    id: "sc-test-account",
    title: "Test Hesabı Sağla",
    why: "Apple, login gerektiren uygulamaları test edemez ve direkt reject atar.",
    how: [
      "App Store Connect > Review Notes alanına demo kullanıcı adı + şifresi yaz.",
      "Test hesabının tüm özelliklerine erişimi olduğundan emin ol.",
      "Test hesabı verilerini periyodik olarak sıfırla (stale data engellemek için)."
    ],
    priority: "critical",
    category: "store_compliance",
    platforms: ["ios"]
  },
  {
    id: "sc-sign-in-apple",
    title: "Sign in with Apple",
    why: "3. parti auth (Google/FB) kullanıyorsan, Apple'ı da sunmak zorundasın.",
    how: [
      "@react-native-apple-authentication veya next-auth Apple provider kur.",
      "Backend'de Apple token verify endpoint'i ekle.",
      "Apple Developer Console'da Sign in with Apple capability aktif et."
    ],
    priority: "critical",
    category: "store_compliance",
    platforms: ["ios"]
  },
  {
    id: "sc-no-external-payment",
    title: "Harici Ödeme Linki YOK",
    why: "Apple, dijital ürünlerde %30 komisyon ister. Stripe linki koyarsan anında reject.",
    how: [
      "Mobilde dijital ürün satıyorsan sadece IAP (In-App Purchase) kullan.",
      "Fiziksel ürün veya B2B SaaS ise Stripe serbest.",
      "App içinde 'daha ucuz web'de al' gibi yönlendirme yapma."
    ],
    priority: "critical",
    category: "store_compliance",
    platforms: ["ios"]
  },
  {
    id: "sc-privacy-policy",
    title: "Privacy Policy URL",
    why: "Hem Apple hem Google zorunlu tutar. Olmadan publish edilemez.",
    how: [
      "Iubenda veya Termly ile 5 dakikada privacy policy oluştur.",
      "privacy.yourdomain.com gibi kalıcı bir URL'e koy.",
      "App Store Connect ve Play Console'a aynı URL'i gir."
    ],
    priority: "critical",
    category: "store_compliance"
  },
  {
    id: "sc-data-safety-google",
    title: "Data Safety Formu (Google)",
    why: "Google Play, hangi veriyi neden topladığını şeffaf biçimde ister.",
    how: [
      "Play Console > App Content > Data Safety bölümünü doldur.",
      "'Veri şifreleniyor' ve 'Kullanıcı silebilir' seçeneklerini işaretle.",
      "Topladığın her veri türünü (konum, kimlik, kullanım) beyan et."
    ],
    priority: "critical",
    category: "store_compliance",
    platforms: ["android"]
  },
  {
    id: "sc-age-rating",
    title: "Yaş Derecelendirmesi",
    why: "Yanlış yaş derecelendirmesi hem reject hem kaldırılma sebebi.",
    how: [
      "App Store Connect > Age Rating questionnaire'i doldur.",
      "Play Console > Content Rating bölümünü tamamla.",
      "Şüpheli içerik varsa (ör. sosyal platform) 17+ seç."
    ],
    priority: "important",
    category: "store_compliance"
  }
];

// ── ASO Temelleri ─────────────────────────────────────────────────────────────

const asoItems: PreLaunchItem[] = [
  {
    id: "aso-app-name",
    title: "App Name + Keyword Optimizasyonu",
    why: "İlk 30 karakter (iOS) en kritik ASO alanı. Doğru keyword = organik keşif.",
    how: [
      "'AppName: Ana Fayda' formatını kullan. Örnek: 'FitTrack: Kalori Sayacı & Diyet'",
      "App Annie veya Sensor Tower ile rakip keyword araştırması yap.",
      "Brand adın + en yüksek arama hacimli keyword'ü birleştir."
    ],
    priority: "critical",
    category: "aso"
  },
  {
    id: "aso-keyword-field",
    title: "Keyword Alanı (iOS)",
    why: "100 karakterlik gizli keyword deposu. Boşa harcama = kaybedilen ranking.",
    how: [
      "appannie.com veya AppFollow ile rakip keyword'lerini analiz et.",
      "Virgülle ayır, boşluk bırakma: 'fitness,diyet,kalori,saglik'",
      "App adında geçen keyword'leri tekrar etme (zaten indexleniyor)."
    ],
    priority: "critical",
    category: "aso",
    platforms: ["ios"]
  },
  {
    id: "aso-screenshots",
    title: "Screenshot Stratejisi",
    why: "İlk 3 ekran, indirme kararının %70'ini etkiler.",
    how: [
      "1. Ekran: Ana fayda (problem statement). 2. Ekran: Nasıl çalışır. 3. Ekran: Sosyal kanıt.",
      "Metin büyük ve okunaklı olsun — store'da küçük görünüyor.",
      "Figma ile 6.7 inç ve 6.5 inç boyutlarında tasarla."
    ],
    priority: "critical",
    category: "aso"
  },
  {
    id: "aso-app-preview",
    title: "App Preview Video",
    why: "Apple verisine göre dönüşümü %20-30 artırıyor.",
    how: [
      "15-30 sn, sessiz izlenebilir olsun (ses olmadan da anlaşılsın).",
      "İlk 3 saniyede değeri göster — dikkat süresi kısa.",
      "CapCut veya Rotato ile hızlı edit yapılabilir."
    ],
    priority: "important",
    category: "aso",
    platforms: ["ios"]
  },
  {
    id: "aso-long-desc-android",
    title: "Long Description (Android)",
    why: "Google, açıklamadaki keyword'leri indexler. iOS'ta görmez, Android'de kritik.",
    how: [
      "İlk 180 karakterde ana faydayı yaz — 'Read more' öncesi görünen kısım.",
      "Doğal dilde keyword tekrarı yap (3-4 kez, zorlamadan).",
      "Bullet point ile özellik listesi ekle — okunabilirlik artar."
    ],
    priority: "important",
    category: "aso",
    platforms: ["android"]
  },
  {
    id: "aso-subtitle",
    title: "Subtitle / Short Description",
    why: "iOS subtitle ve Android short description arama sonuçlarında görünür.",
    how: [
      "iOS: 30 karakterde ikincil keyword + value prop yaz.",
      "Android: 80 karakterde en güçlü faydayı öne çıkar.",
      "App adında geçmeyen keyword'leri burada kullan."
    ],
    priority: "important",
    category: "aso"
  }
];

// ── Sektör Spesifik Compliance ────────────────────────────────────────────────

const sectorItems: PreLaunchItem[] = [
  // HealthTech
  {
    id: "sec-healthtech-hipaa",
    title: "HIPAA Uyumluluk Kontrolü",
    why: "ABD'de sağlık verisi işliyorsan yasal zorunluluk. İhlal = ciddi ceza.",
    how: [
      "Veritabanında PII (kişisel sağlık bilgisi) şifrele — pgcrypto veya AES-256.",
      "AWS/Azure'da 'HIPAA eligible' servisleri kullan.",
      "'Bu tıbbi tavsiye değildir' disclaimer'ını onboarding'e ve her öneri ekranına ekle.",
      "Veri erişim loglarını tut — audit trail zorunlu."
    ],
    priority: "critical",
    category: "sector_compliance",
    sectors: ["HealthTech", "Sağlık & Wellness"],
    sourceUrl: "https://www.hhs.gov/hipaa"
  },
  {
    id: "sec-healthtech-medical-disclaimer",
    title: "Medikal Sorumluluk Reddi",
    why: "Apple, sağlık uygulamalarını özellikle sıkı inceler.",
    how: [
      "Her ekranda 'Bu uygulama tıbbi tavsiye vermez' uyarısını göster.",
      "Onboarding'de kullanıcıdan acknowledgement al.",
      "Terms of Service'e sağlık sorumluluğu reddi ekle."
    ],
    priority: "critical",
    category: "sector_compliance",
    sectors: ["HealthTech", "Sağlık & Wellness"]
  },

  // FinTech
  {
    id: "sec-fintech-pci",
    title: "PCI-DSS Uyumluluk",
    why: "Kredi kartı işliyorsan sertifika zorunlu. İhlal = banka hesabı kapanması.",
    how: [
      "Asla kart numarasını kendi DB'nde tutma — Stripe, Braintree veya Iyzico kullan.",
      "Payment gateway'in PCI Level 1 olduğunu doğrula.",
      "Kart formu için sadece ödeme sağlayıcısının hosted fields'ını kullan."
    ],
    priority: "critical",
    category: "sector_compliance",
    sectors: ["FinTech", "E-ticaret"]
  },
  {
    id: "sec-fintech-2fa",
    title: "Para Transferinde 2FA Zorunluluğu",
    why: "Finansal işlemler olmadan hesap güvenliği yetersiz kalır, regülatör sorun çıkarır.",
    how: [
      "Giriş + para transferi + hesap değişikliğinde 2FA aktif et.",
      "SMS OTP veya TOTP (Google Authenticator) entegre et.",
      "'Finansal tavsiye değildir' uyarısını footer'a ekle."
    ],
    priority: "critical",
    category: "sector_compliance",
    sectors: ["FinTech"]
  },
  {
    id: "sec-fintech-kyc",
    title: "KYC / Kimlik Doğrulama",
    why: "Türkiye'de BDDK, AB'de PSD2 kapsamında kimlik doğrulama zorunlu.",
    how: [
      "Persona veya Onfido ile kimlik doğrulama entegrasyonu kur.",
      "Kullanıcı başına işlem limitleri belirle (KYC öncesi).",
      "AML (Kara para aklamayla mücadele) politikasını privacy policy'e ekle."
    ],
    priority: "important",
    category: "sector_compliance",
    sectors: ["FinTech"]
  },

  // EdTech / K-12
  {
    id: "sec-edtech-coppa",
    title: "COPPA Uyumluluk (Çocuk Gizliliği)",
    why: "13 yaş altı kullanıcı varsa, ebeveyn onayı ABD yasası gereği zorunlu.",
    how: [
      "Kayıt sırasında yaş doğrulama ekranı ekle (doğum tarihi).",
      "13 altı için kişiselleştirilmiş reklamı tamamen kapat.",
      "Ebeveyn portalı: 'Çocuğumun verisini sil / görüntüle' butonu ekle."
    ],
    priority: "critical",
    category: "sector_compliance",
    sectors: ["EdTech"],
    sourceUrl: "https://www.ftc.gov/enforcement/rules/rulemaking-regulatory-reform-proceedings/childrens-online-privacy-protection-rule"
  },
  {
    id: "sec-edtech-ferpa",
    title: "FERPA Uyumluluk",
    why: "ABD'de okul kayıtlarına erişim gerektiren uygulamalar için federal zorunluluk.",
    how: [
      "Eğitim kurumlarıyla data sharing agreement imzala.",
      "Öğrenci verilerini reklamcılık amaçlı kullanma.",
      "Veri saklama politikasını net belirt (mezuniyet sonrası silme)."
    ],
    priority: "important",
    category: "sector_compliance",
    sectors: ["EdTech"]
  },

  // E-ticaret
  {
    id: "sec-ecom-return-policy",
    title: "İade ve İptal Politikası",
    why: "Türkiye'de TKHK, AB'de Consumer Rights Directive iade hakkını zorunlu kılar.",
    how: [
      "14 günlük sorunsuz iade hakkını checkout sayfasına yaz.",
      "İade sürecini uygulama içinden başlatılabilir yap.",
      "Sipariş onay e-postasında iade politikasına link ver."
    ],
    priority: "critical",
    category: "sector_compliance",
    sectors: ["E-ticaret", "Marketplace"]
  },
  {
    id: "sec-ecom-vat",
    title: "KDV / Vergi Uyumluluk",
    why: "Türkiye'de dijital hizmetlerde %20 KDV zorunlu, AB'de farklı oranlar geçerli.",
    how: [
      "Stripe Tax veya manuel olarak KDV hesaplama ekle.",
      "Fatura kesme altyapısı kur (Parasut, Logo).",
      "Yurt dışı kullanıcılar için müşteri ülkesine göre vergi oranı belirle."
    ],
    priority: "important",
    category: "sector_compliance",
    sectors: ["E-ticaret", "Marketplace", "FinTech"]
  },

  // B2B SaaS
  {
    id: "sec-b2b-gdpr",
    title: "GDPR Data Processing Agreement",
    why: "AB'deki kurumsal müşteriler DPA imzalamadan satın almaz.",
    how: [
      "Standart DPA template'i hukuki incelemeyle hazırla.",
      "Müşteri onay akışını CRM'e entegre et.",
      "Veri işleme kayıtlarını (ROPA) tut."
    ],
    priority: "critical",
    category: "sector_compliance",
    sectors: ["B2B SaaS"]
  },
  {
    id: "sec-b2b-sso",
    title: "SSO / Enterprise Auth",
    why: "Kurumsal müşteriler kendi SSO'larını kullanmak ister, yoksa IT onayı çıkmaz.",
    how: [
      "SAML 2.0 veya OIDC protokolünü destekle.",
      "WorkOS veya Auth0 enterprise connection kur.",
      "IT admin için kullanıcı yönetim paneli ekle."
    ],
    priority: "important",
    category: "sector_compliance",
    sectors: ["B2B SaaS"]
  },

  // GDPR compliance tag
  {
    id: "sec-gdpr-cookie",
    title: "Cookie Consent Banner",
    why: "AB'de GDPR, Türkiye'de KVKK kapsamında zorunlu rıza altyapısı gerekiyor.",
    how: [
      "Cookiebot veya CookieYes ile consent management platform kur.",
      "Analytics ve reklam cookie'lerini kullanıcı onayından önce yükleme.",
      "Cookie tercihlerini 30 gün saklayıp yenileme kararını kullanıcıya bırak."
    ],
    priority: "critical",
    category: "sector_compliance",
    compliance: ["GDPR", "KVKK"]
  },
  {
    id: "sec-gdpr-data-export",
    title: "Veri Dışa Aktarma (GDPR Article 20)",
    why: "Kullanıcı kendi verisini indirme hakkına sahip — ihlal = ceza.",
    how: [
      "Ayarlar > Gizlilik > 'Verilerimi indir' butonu ekle.",
      "JSON veya CSV formatında tam veri export'u hazırla.",
      "Export isteğinden 30 gün içinde teslim et (yasal süre)."
    ],
    priority: "important",
    category: "sector_compliance",
    compliance: ["GDPR", "KVKK"]
  }
];

// ── Teknik & Büyüme Hazırlığı ─────────────────────────────────────────────────

const technicalItems: PreLaunchItem[] = [
  {
    id: "tech-crash-free",
    title: "Crash-Free Rate > %99",
    why: "Lansmanda çöken uygulama 1 yıldız alır ve ASO'yu anında mahveder.",
    how: [
      "Sentry veya Firebase Crashlytics kur.",
      "TestFlight / internal track'te 50+ kullanıcıyla beta test yap.",
      "Kritik kullanıcı akışlarında hata oranı sıfırla."
    ],
    priority: "critical",
    category: "technical"
  },
  {
    id: "tech-app-size",
    title: "App Boyutu < 150 MB",
    why: "Hücresel ağda 150MB üstü indirilemez — potansiyel kullanıcı kaybı.",
    how: [
      "Görselleri WebP formatına dönüştür (PNG'ye kıyasla %25-35 küçük).",
      "Unused dependency'leri ve dead code'u sil.",
      "iOS: App Thinning aktif et. Android: App Bundle kullan."
    ],
    priority: "important",
    category: "technical"
  },
  {
    id: "tech-deep-linking",
    title: "Deep Linking Kurulumu",
    why: "E-posta / push'tan gelen kullanıcı yanlış ekrana düşerse aktivasyon düşer.",
    how: [
      "Universal Links (iOS) ve App Links (Android) kur.",
      "Her temel ekran için deep link URL şeması tanımla.",
      "E-posta kampanyaları, push bildirimleri ve sosyal paylaşımda deep link kullan."
    ],
    priority: "important",
    category: "technical"
  },
  {
    id: "tech-waitlist",
    title: "Pre-launch Email / Waitlist Capture",
    why: "Pre-launch'ta her ziyaretçi potansiyel kullanıcı — kaçırma.",
    how: [
      "Landing page'e e-posta toplama formu ekle.",
      "'Erken erişim kazan' vaadi ile dönüşüm artır.",
      "Mailchimp / Loops ile welcome sequence kur."
    ],
    priority: "important",
    category: "technical"
  },
  {
    id: "tech-analytics",
    title: "Analytics & Event Tracking",
    why: "Ölçmediğini optimize edemezsin. Launch sonrası kör uçarsın.",
    how: [
      "Mixpanel, Amplitude veya PostHog kur.",
      "Temel olayları tanımla: signup, activation, retention, purchase.",
      "Funnel'ı launch öncesi test kullanıcılarıyla doğrula."
    ],
    priority: "critical",
    category: "technical"
  },
  {
    id: "tech-referral",
    title: "Referral Mekanizması",
    why: "Viral loop olmadan organik büyüme yavaştır. Erken eklemek kolay, sonra pahalı.",
    how: [
      "'3 arkadaşını davet et, premium kazan' gibi basit bir loop tasarla.",
      "Branch.io veya manuel referral code sistemi kur.",
      "Referral linki paylaşım butonunu profil / onboarding'e ekle."
    ],
    priority: "nice_to_have",
    category: "technical"
  },
  {
    id: "tech-push-permissions",
    title: "Push Bildirim İzin Stratejisi",
    why: "Zamanlamayı yanlış yaparsan izin reddedilir, bir daha sormak mümkün olmaz.",
    how: [
      "İzni onboarding'in ilk ekranında değil, kullanıcı değer gördükten sonra iste.",
      "iOS için custom pre-permission dialog tasarla ('Bildirim almak ister misin?').",
      "Hayır diyeni re-engage etmek için in-app reminder mekanizması kur."
    ],
    priority: "important",
    category: "technical"
  }
];

// ── Engine: Workspace context'e göre filtreleme ───────────────────────────────

export interface WorkspaceContext {
  industry?: string | null;
  platforms?: string[] | null;
  compliance?: string[] | null;
  company_stage?: string | null;
}

export function generatePreLaunchItems(ctx: WorkspaceContext): PreLaunchItem[] {
  const allItems = [
    ...storeComplianceItems,
    ...asoItems,
    ...sectorItems,
    ...technicalItems
  ];

  const platformSet = new Set((ctx.platforms ?? []).map((p) => p.toLowerCase()));
  const complianceSet = new Set(ctx.compliance ?? []);
  const industry = ctx.industry ?? "";

  const filtered = allItems.filter((item) => {
    // Platform filter
    if (item.platforms && item.platforms.length > 0) {
      const hasMatchingPlatform = item.platforms.some((p) => platformSet.has(p));
      if (!hasMatchingPlatform) return false;
    }

    // Sector filter
    if (item.sectors && item.sectors.length > 0) {
      const hasMatchingSector = item.sectors.some(
        (s) => industry.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(industry.toLowerCase())
      );
      if (!hasMatchingSector) return false;
    }

    // Compliance filter
    if (item.compliance && item.compliance.length > 0) {
      const hasMatchingCompliance = item.compliance.some((c) => complianceSet.has(c));
      if (!hasMatchingCompliance) return false;
    }

    return true;
  });

  // Sort: critical → important → nice_to_have
  const priorityOrder: Record<PreLaunchPriority, number> = {
    critical: 0,
    important: 1,
    nice_to_have: 2
  };

  return filtered.sort((a, b) => {
    const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (pDiff !== 0) return pDiff;
    return a.category.localeCompare(b.category);
  });
}

export const CATEGORY_LABELS: Record<PreLaunchCategory, string> = {
  store_compliance: "Store Uyumluluk",
  aso: "ASO Temelleri",
  sector_compliance: "Sektör Compliance",
  technical: "Teknik Hazırlık"
};

export const PRIORITY_LABELS: Record<PreLaunchPriority, string> = {
  critical: "Kritik",
  important: "Önemli",
  nice_to_have: "Bonus"
};
