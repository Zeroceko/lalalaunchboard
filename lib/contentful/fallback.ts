import type { CmsChecklistItem, CmsRoutineTask } from "@/types";

export const fallbackChecklistItems: CmsChecklistItem[] = [
  {
    id: "fallback-store-1",
    title: "App Store listing metnini hazirla",
    description: "Kisa aciklama, uzun aciklama ve temel deger onerini netlestir.",
    category: "store_prep",
    guideText:
      "Store listing dili sadece teknik degil, donusum odakli olmali. Acik ilk fayda, hedef kullanici ve fark yaratan ozellik ilk ekranda netlesmeli.",
    toolLinks: [
      {
        label: "App Store Product Page",
        url: "https://developer.apple.com/app-store/product-page/"
      }
    ],
    order: 1
  },
  {
    id: "fallback-store-2",
    title: "Store screenshot planini cikar",
    description: "Ilk 3 ekran goruntusunde ana faydayi gosterecek bir storyboard hazirla.",
    category: "store_prep",
    guideText:
      "Screenshot akisi ozellik listesinden cok kullanici sonucuna odaklanmali. Her kare tek bir mesaji tasimayi hedeflemeli.",
    toolLinks: [
      {
        label: "Google Play Store Listing",
        url: "https://support.google.com/googleplay/android-developer/answer/1078870"
      }
    ],
    order: 2
  },
  {
    id: "fallback-aso-1",
    title: "Anahtar kelime listesini olustur",
    description: "Rakip, problem ve fayda odakli temel anahtar kelime havuzunu toparla.",
    category: "aso",
    guideText:
      "Baslangicta genis havuz topla, sonra arama niyeti guclu ve rekabeti dengeli olan kelimeleri sec. Marka diliyle arama dili ayni olmak zorunda degil.",
    toolLinks: [
      {
        label: "Google Trends",
        url: "https://trends.google.com/"
      }
    ],
    order: 3
  },
  {
    id: "fallback-aso-2",
    title: "Rakip store sayfalarini analiz et",
    description: "Benzer urunlerin pozisyonlamasini, screenshot dilini ve CTA kaliplari incele.",
    category: "aso",
    guideText:
      "Rakip analizi kopyalamak icin degil, kategoride neyin norm oldugunu ve senin nasil ayrisacagini anlamak icindir.",
    toolLinks: [
      {
        label: "App Store",
        url: "https://www.apple.com/app-store/"
      }
    ],
    order: 4
  },
  {
    id: "fallback-creative-1",
    title: "Launch gorsel setini hazirla",
    description: "Logo, cover, screenshot overlay ve sosyal medya varyasyonlarini toparla.",
    category: "creative",
    guideText:
      "Tum launch assetleri ayni mesaj cekirdeginden beslenmeli. Gorsel sistem farkli boyutlarda bile ayni urun hissini korumali.",
    toolLinks: [
      {
        label: "Figma",
        url: "https://www.figma.com/"
      }
    ],
    order: 5
  },
  {
    id: "fallback-creative-2",
    title: "Launch duyuru metnini yaz",
    description: "Product Hunt, X ve email duyurusu icin kisa mesaj varyasyonlari olustur.",
    category: "creative",
    guideText:
      "Launch copy ozellik saymak yerine tek bir vaat ve tek bir eylem cagrisi etrafinda toplanmali.",
    toolLinks: [
      {
        label: "Product Hunt",
        url: "https://www.producthunt.com/"
      }
    ],
    order: 6
  },
  {
    id: "fallback-legal-1",
    title: "Privacy Policy ve Terms sayfalarini tamamla",
    description: "Toplanan veri tipleri ve kullanim kosullari net sekilde yayinlansin.",
    category: "legal",
    guideText:
      "Yasal sayfalar son dakika isi olmamali. Kullanilan servisler, analytics ve auth akisi ile tutarli bir metin olustur.",
    toolLinks: [
      {
        label: "Google Privacy Policy Help",
        url: "https://support.google.com/googleplay/android-developer/answer/10144311"
      }
    ],
    order: 7
  },
  {
    id: "fallback-legal-2",
    title: "Destek ve iletisim kanalini ayarla",
    description: "Kullanici destek emaili, landing footer ve store support URL alanlari hazir olsun.",
    category: "legal",
    guideText:
      "Support kanali sadece yasal gereklilik degil, launch sonrasi ilk guven sinyalidir. Tek bir net iletisim noktasi belirle.",
    toolLinks: [
      {
        label: "Apple Support URL Guidance",
        url: "https://developer.apple.com/help/app-store-connect/reference/app-information/"
      }
    ],
    order: 8
  }
];

export const fallbackRoutineTasks: CmsRoutineTask[] = [
  {
    id: "fallback-routine-1",
    title: "Haftalik analytics gozden gecirme",
    description: "Activation, retention ve acquisition rakamlarini tek ekranda kontrol et.",
    frequency: "weekly",
    order: 1
  },
  {
    id: "fallback-routine-2",
    title: "Kullanici feedback taramasi",
    description: "Store yorumlari, email yanitlari ve sosyal mentionlari grupla.",
    frequency: "weekly",
    order: 2
  },
  {
    id: "fallback-routine-3",
    title: "Bir growth deneyi planla",
    description: "Onumuzdeki hafta icin tek bir acquisition veya activation deneyi sec.",
    frequency: "weekly",
    order: 3
  }
];
