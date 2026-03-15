export const SECTORS = {
  // TEKNOLOJİ & YAZILIM
  saas: "SaaS (B2B Yazılım)",
  fintech: "FinTech (Finansal Teknolojiler)",
  healthtech: "HealthTech (Sağlık Teknolojileri)",
  edtech: "EdTech (Eğitim Teknolojileri)",
  proptech: "PropTech (Gayrimenkul Teknolojileri)",
  legaltech: "LegalTech (Hukuk Teknolojileri)",
  hrtech: "HR Tech (İnsan Kaynakları Teknolojileri)",
  martech: "MarTech (Pazarlama Teknolojileri)",
  salestech: "Sales Tech (Satış Teknolojileri)",
  cybersecurity: "Siber Güvenlik",
  ai_ml: "Yapay Zeka & Makine Öğrenimi",
  blockchain_crypto: "Blockchain & Kripto",
  iot: "IoT (Nesnelerin İnterneti)",
  cloud_infra: "Cloud & Altyapı",
  devtools: "Developer Tools (Geliştirici Araçları)",
  // E-TİCARET & PERAKENDE
  ecommerce_b2c: "E-ticaret (B2C)",
  ecommerce_b2b: "E-ticaret (B2B)",
  marketplace: "Pazaryeri (Marketplace)",
  d2c: "D2C (Direct-to-Consumer)",
  retail_tech: "Perakende Teknolojileri",
  // MOBİL & TÜKETİCİ
  mobile_app_b2c: "Mobil Uygulama (B2C)",
  social_network: "Sosyal Ağ & Topluluk",
  dating: "Dating (Flört Uygulamaları)",
  gaming_mobile: "Mobil Oyun",
  gaming_pc_console: "PC/Konsol Oyun",
  content_creator: "İçerik Üretimi & Yayıncılık",
  streaming: "Streaming (Video/Müzik)",
  // SAĞLIK & WELLNESS
  telemedicine: "Tele-Tıp & Uzaktan Sağlık",
  mental_health: "Mental Sağlık & Wellness",
  fitness: "Fitness & Spor",
  nutrition: "Beslenme & Diyet",
  healthcare_provider: "Sağlık Kuruluşu",
  pharma: "İlaç & Biyoteknoloji",
  // EĞİTİM
  online_learning: "Online Öğrenme Platformu",
  k12: "K-12 (İlk-Orta-Lise)",
  higher_ed: "Yüksek Öğrenim",
  corporate_training: "Kurumsal Eğitim",
  language_learning: "Dil Öğrenimi",
  stem_education: "STEM Eğitimi",
  // FİNANS
  payments: "Ödeme Sistemleri",
  lending: "Kredi & Borç Verme",
  investing: "Yatırım & Trading",
  insurtech: "InsurTech (Sigorta Teknolojileri)",
  wealth_management: "Varlık Yönetimi",
  accounting: "Muhasebe & Finans Yönetimi",
  crypto_exchange: "Kripto Para Borsası",
  // LOJİSTİK & MOBİLİTE
  logistics: "Lojistik & Tedarik Zinciri",
  delivery: "Teslimat & Kurye",
  mobility: "Mobilite & Ulaşım",
  automotive: "Otomotiv Teknolojileri",
  aviation: "Havacılık",
  // GAYRİMENKUL
  real_estate_marketplace: "Gayrimenkul Pazaryeri",
  property_management: "Mülk Yönetimi",
  coworking: "Coworking & Ofis",
  construction_tech: "İnşaat Teknolojileri",
  // YİYECEK & İÇECEK
  food_delivery: "Yemek Teslimat",
  restaurant_tech: "Restoran Teknolojileri",
  food_beverage: "Gıda & İçecek Üretimi",
  agritech: "AgriTech (Tarım Teknolojileri)",
  // SEYAHAT & TURİZM
  travel_booking: "Seyahat Rezervasyon",
  hospitality: "Konaklama & Otel",
  tourism: "Turizm & Aktiviteler",
  event_management: "Etkinlik Yönetimi",
  // ENDÜSTRİ & ÜRETİM
  manufacturing: "Üretim & İmalat",
  industrial_iot: "Endüstriyel IoT",
  supply_chain: "Tedarik Zinciri",
  energy_cleantech: "Enerji & Temiz Teknoloji",
  sustainability: "Sürdürülebilirlik",
  // MEDYA & İLETİŞİM
  digital_media: "Dijital Medya",
  publishing: "Yayıncılık",
  advertising: "Reklamcılık",
  pr_comms: "PR & İletişim",
  news: "Haber & Gazetecilik",
  // HİZMETLER
  consulting: "Danışmanlık",
  agency: "Ajans (Creative/Digital)",
  freelance_platform: "Freelance Platformu",
  professional_services: "Profesyonel Hizmetler",
  // DİĞER
  nonprofit: "Kar Amacı Gütmeyen (Non-Profit)",
  government: "Kamu & Devlet Teknolojileri",
  other: "Diğer"
} as const;

export type SectorKey = keyof typeof SECTORS;

export const SECTOR_ENTRIES = Object.entries(SECTORS) as [SectorKey, string][];
