export const checklistMessages = {
  unauthorized: "Devam etmek için giriş yapman gerekiyor",
  unavailable:
    "Checklist akışı için Supabase yapılandırması gerekiyor",
  schemaUnavailable:
    "Checklist veritabanı şeması bu Supabase projesine henüz uygulanmamış görünüyor.",
  appNotFound: "Bu workspace bulunamadı ya da sana ait değil",
  genericError: "Checklist güncellenirken bir hata oluştu",
  invalidState: "Geçerli bir checklist durumu gönderilmedi"
} as const;
