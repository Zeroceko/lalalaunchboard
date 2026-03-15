export const productMessages = {
  productNameRequired: "Ürün adı zorunludur",
  productNameTooLong: "Ürün adı 80 karakteri geçmemelidir",
  platformRequired: "En az bir platform seçmelisiniz",
  platformInvalid: "Geçerli bir platform seçiniz",
  launchDateInvalid: "Geçerli bir lansman tarihi seçiniz",
  businessModelInvalid: "Geçerli bir iş modeli seçiniz",
  productsUnavailable: "Ürün yönetimi için Supabase yapılandırması gerekiyor",
  unauthorized: "Devam etmek için giriş yapman gerekiyor",
  profileUnavailable: "Kullanıcı profili henüz hazır değil. Lütfen tekrar dene.",
  workspaceUnavailable: "Workspace bulunamadı. Lütfen önce onboarding'i tamamla.",
  schemaUnavailable:
    "Veritabanı şeması bu Supabase projesine henüz uygulanmamış görünüyor. Migration push sonrası bu ekran çalışacak.",
  genericError: "Bir hata oluştu, lütfen tekrar dene",
  productNotFound: "Bu ürün bulunamadı ya da sana ait değil",
  planLimitReached:
    "Free plan ile yalnızca 1 ürün oluşturabilirsin. Pro Plan'a geçerek sınırsız ürün ekleyebilirsin.",
  productCreated: "Ürün workspace'i hazır.",
  productDeleted: "Ürün silindi",
  productUpdated: "Ürün güncellendi"
} as const;
