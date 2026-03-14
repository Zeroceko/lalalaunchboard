export const deliverableMessages = {
  unauthorized: "Devam etmek için giriş yapman gerekiyor",
  unavailable: "Deliverable akışı için Supabase yapılandırması gerekiyor",
  appNotFound: "Bu workspace bulunamadı ya da sana ait değil",
  itemNotFound: "Bu checklist item'i bulunamadı",
  deliverableNotFound: "Bu deliverable bulunamadı ya da sana ait değil",
  genericError: "Deliverable işlemi sırasında bir hata oluştu",
  invalidUrl: "Geçerli bir URL giriniz",
  fileTooLarge: "Dosya boyutu 10 MB'ı geçemez",
  contentRequired: "Bu alan boş bırakılamaz",
  typeRequired: "Geçerli bir deliverable tipi seçiniz",
  fileRequired: "Lütfen bir dosya seçiniz",
  fileUploadUnavailable:
    "Dosya yükleme için storage bucket henüz hazır görünmüyor. Şimdilik link veya not ekleyebilirsin.",
  schemaUnavailable:
    "Deliverable veritabanı şeması bu Supabase projesine henüz uygulanmamış görünüyor."
} as const;
