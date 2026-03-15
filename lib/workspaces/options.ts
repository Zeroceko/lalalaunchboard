export const BUSINESS_MODELS = {
  subscription: "Abonelik (Subscription)",
  freemium: "Freemium",
  transaction_fee: "İşlem Başına Ücret",
  commission: "Komisyon",
  advertising: "Reklam",
  licensing: "Lisanslama",
  one_time_purchase: "Tek Seferlik Satış",
  usage_based: "Kullanım Bazlı Fiyatlandırma",
  marketplace: "Pazaryeri (Çok Taraflı)",
  hybrid: "Hibrit Model"
} as const;

export const TARGET_AUDIENCES = {
  b2b_enterprise: "B2B - Enterprise (1000+ çalışan)",
  b2b_smb: "B2B - KOBİ (10-999 çalışan)",
  b2b_startup: "B2B - Startup (1-9 çalışan)",
  b2b_developer: "B2B - Geliştiriciler",
  b2b_marketer: "B2B - Pazarlamacılar",
  b2b_sales: "B2B - Satış Ekipleri",
  b2b_hr: "B2B - İK Departmanları",
  b2b_finance: "B2B - Finans Departmanları",
  b2c_consumers: "B2C - Tüketiciler",
  b2c_gen_z: "B2C - Gen Z (18-24)",
  b2c_millennials: "B2C - Millennials (25-40)",
  b2c_parents: "B2C - Ebeveynler",
  b2c_students: "B2C - Öğrenciler",
  b2c_professionals: "B2C - Profesyoneller",
  b2b2c: "B2B2C (Hem İş Hem Tüketici)",
  marketplace_both: "Pazaryeri (Alıcı + Satıcı)"
} as const;

export const PLATFORMS = {
  web_app: "Web Uygulaması",
  mobile_ios: "Mobil (iOS)",
  mobile_android: "Mobil (Android)",
  mobile_cross: "Mobil (Cross-platform)",
  desktop_windows: "Desktop (Windows)",
  desktop_mac: "Desktop (macOS)",
  desktop_linux: "Desktop (Linux)",
  browser_extension: "Tarayıcı Eklentisi",
  api_saas: "API-First / Headless",
  marketplace_platform: "Pazaryeri Platformu",
  hardware_iot: "Hardware + Yazılım (IoT)",
  chatbot_messaging: "Chatbot / Messaging"
} as const;

export const STAGES = {
  idea: "Fikir Aşaması (Henüz ürün yok)",
  prototype: "Prototip / MVP Geliştirme",
  pre_launch: "Pre-Launch (Beta test ediliyor)",
  launched_early: "Yeni Lansman (0-6 ay)",
  launched_growth: "Büyüme Aşaması (6-24 ay)",
  seed: "Seed Yatırım Aldı",
  series_a: "Series A Yatırım Aldı",
  series_b_plus: "Series B+ (Ölçeklenme)",
  profitable: "Kârlı & Sürdürülebilir"
} as const;

export const TEAM_SIZES = {
  solo: "Solo Founder (1 kişi)",
  micro: "2-5 kişi",
  small: "6-15 kişi",
  medium: "16-50 kişi",
  large: "51-200 kişi",
  enterprise: "200+ kişi"
} as const;

export const TRACTION_LEVELS = {
  no_users: "Henüz kullanıcı yok",
  "0_100": "0-100 kullanıcı",
  "100_1000": "100-1,000 kullanıcı",
  "1k_10k": "1,000-10,000 kullanıcı",
  "10k_100k": "10,000-100,000 kullanıcı",
  "100k_plus": "100,000+ kullanıcı"
} as const;

export const REVENUE_LEVELS = {
  pre_revenue: "Gelir yok (Pre-revenue)",
  "0_1k": "$0-1,000 MRR",
  "1k_10k": "$1,000-10,000 MRR",
  "10k_50k": "$10,000-50,000 MRR",
  "50k_100k": "$50,000-100,000 MRR",
  "100k_plus": "$100,000+ MRR"
} as const;

export const GROWTH_CHANNELS = {
  organic_search: "Organik Arama (SEO)",
  paid_ads: "Ücretli Reklamlar (Google/FB/IG)",
  content_marketing: "İçerik Pazarlaması",
  social_media: "Sosyal Medya",
  referral: "Referans Programı",
  email_marketing: "E-posta Pazarlaması",
  partnerships: "Ortaklıklar & Entegrasyonlar",
  sales_outbound: "Satış (Outbound)",
  product_led: "Product-Led Growth (PLG)",
  community: "Topluluk İnşası",
  influencer: "Influencer Pazarlaması",
  app_store: "App Store Optimizasyonu (ASO)",
  not_sure: "Henüz emin değilim"
} as const;

export const COMPLIANCE_OPTIONS = {
  gdpr: "GDPR (Avrupa Veri Koruma)",
  hipaa: "HIPAA (Sağlık Verileri - ABD)",
  soc2: "SOC 2 (Güvenlik)",
  pci_dss: "PCI DSS (Ödeme Kartları)",
  ccpa: "CCPA (Kaliforniya Gizlilik)",
  iso27001: "ISO 27001",
  ferpa: "FERPA (Eğitim Verileri)",
  coppa: "COPPA (Çocuk Gizliliği)",
  kyc_aml: "KYC/AML (Finansal Kimlik)",
  none: "Henüz yok"
} as const;

export type BusinessModelKey = keyof typeof BUSINESS_MODELS;
export type TargetAudienceKey = keyof typeof TARGET_AUDIENCES;
export type PlatformKey = keyof typeof PLATFORMS;
export type StageKey = keyof typeof STAGES;
export type TeamSizeKey = keyof typeof TEAM_SIZES;
export type TractionLevelKey = keyof typeof TRACTION_LEVELS;
export type RevenueLevelKey = keyof typeof REVENUE_LEVELS;
export type GrowthChannelKey = keyof typeof GROWTH_CHANNELS;
export type ComplianceKey = keyof typeof COMPLIANCE_OPTIONS;

export const BUSINESS_MODEL_ENTRIES = Object.entries(BUSINESS_MODELS) as [BusinessModelKey, string][];
export const TARGET_AUDIENCE_ENTRIES = Object.entries(TARGET_AUDIENCES) as [TargetAudienceKey, string][];
export const PLATFORM_ENTRIES = Object.entries(PLATFORMS) as [PlatformKey, string][];
export const STAGE_ENTRIES = Object.entries(STAGES) as [StageKey, string][];
export const TEAM_SIZE_ENTRIES = Object.entries(TEAM_SIZES) as [TeamSizeKey, string][];
export const TRACTION_LEVEL_ENTRIES = Object.entries(TRACTION_LEVELS) as [TractionLevelKey, string][];
export const REVENUE_LEVEL_ENTRIES = Object.entries(REVENUE_LEVELS) as [RevenueLevelKey, string][];
export const GROWTH_CHANNEL_ENTRIES = Object.entries(GROWTH_CHANNELS) as [GrowthChannelKey, string][];
export const COMPLIANCE_ENTRIES = Object.entries(COMPLIANCE_OPTIONS) as [ComplianceKey, string][];
