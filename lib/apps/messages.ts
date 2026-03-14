export const appMessages = {
  appNameRequired: "Uygulama adı zorunludur",
  appNameTooLong: "Uygulama adı 80 karakteri geçmemelidir",
  platformInvalid: "Geçerli bir platform seçiniz",
  launchDateInvalid: "Geçerli bir lansman tarihi seçiniz",
  appsUnavailable: "Uygulama yönetimi için Supabase yapılandırması gerekiyor",
  unauthorized: "Devam etmek için giriş yapman gerekiyor",
  profileUnavailable: "Kullanıcı profili henüz hazır değil. Lütfen tekrar dene.",
  schemaUnavailable:
    "App veritabanı şeması bu Supabase projesine henüz uygulanmamış görünüyor. Migration push sonrası bu ekran çalışacak.",
  genericError: "Bir hata oluştu, lütfen tekrar dene",
  appNotFound: "Bu uygulama bulunamadı ya da sana ait değil",
  planLimitReached:
    "Free plan ile yalnızca 1 uygulama oluşturabilirsin. Pro Plan'a geçerek sınırsız uygulama ekleyebilirsin.",
  appCreated: "Workspace hazır. Dashboard'a dönüyoruz.",
  appDeleted: "Workspace silindi",
  appUpdated: "Lansman tarihi güncellendi"
} as const;
