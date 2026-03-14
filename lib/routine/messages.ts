export const routineMessages = {
  unauthorized: "Devam etmek icin giris yapman gerekiyor",
  unavailable: "Post-launch routine akisi icin Supabase yapilandirmasi gerekiyor",
  schemaUnavailable:
    "Routine veritabani semasi bu Supabase projesine henuz uygulanmamis gorunuyor.",
  appNotFound: "Bu workspace bulunamadi ya da sana ait degil",
  genericError: "Routine islemi sirasinda bir hata olustu",
  invalidState: "Gecerli bir routine durumu gonderilmedi",
  invalidWeek: "Hafta numarasi 1 ile 53 arasinda olmalidir"
} as const;
