export const exportMessages = {
  unauthorized: "Devam etmek icin giris yapman gerekiyor",
  unavailable: "Export akisi icin Supabase yapilandirmasi gerekiyor",
  appNotFound: "Bu workspace bulunamadi ya da sana ait degil",
  invalidFormat: "Lutfen gecerli bir export formati seciniz",
  genericError: "Export islemi basarisiz oldu, lutfen tekrar deneyin",
  schemaUnavailable:
    "Export icin gereken veritabani semasi bu Supabase projesine henuz uygulanmamis gorunuyor."
} as const;
