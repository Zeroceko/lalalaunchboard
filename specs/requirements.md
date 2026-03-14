# Gereksinimler Dokümanı

## Giriş

Lalalaunchboard, indie ve başlangıç seviyesindeki geliştiricilerin mobil/web uygulama pazarlamasını uçtan uca yönetmesini sağlayan bir süreç yönetim aracıdır. Araç; store hazırlığından ASO/SEO optimizasyonuna, kreatif üretimden yasal gereksinimlere kadar tüm pre-launch sürecini yapılandırılmış bir checklist ile yönetir. Post-launch aşamasında ise haftalık rutin şablonları ile süreci sürdürülebilir kılar. Platform yalnızca web üzerinde çalışır ve Free (1 uygulama) ile Pro (sınırsız uygulama) olmak üzere iki plan sunar.

---

## Sözlük

- **Sistem**: Lalalaunchboard web uygulamasının tamamı
- **Kullanıcı**: Sisteme kayıtlı, email ve şifre ile giriş yapan kişi
- **Uygulama (App)**: Kullanıcının pazarlama sürecini yönettiği mobil veya web uygulaması kaydı
- **Workspace**: Bir uygulamaya ait tüm checklist, deliverable ve rutin verilerini barındıran çalışma alanı
- **Checklist**: Pre-launch sürecindeki görevlerin listelendiği yapılandırılmış kontrol listesi
- **ChecklistItem**: Checklist içindeki tek bir görev kalemi; CMS'ten yönetilir
- **Deliverable**: Bir ChecklistItem'a bağlı link, not veya dosya eklentisi
- **RoutineTask**: Post-launch haftalık rutin şablonundaki tek bir görev
- **RoutineLog**: Bir RoutineTask'ın belirli bir haftaya ait tamamlanma kaydı
- **Progress**: Bir Workspace'teki tamamlanan ChecklistItem sayısının toplam sayıya oranı (yüzde)
- **CMS**: Checklist içeriğinin (kategori, item, rehber metni, araç linkleri) yönetildiği içerik yönetim sistemi
- **Free Plan**: Kullanıcı başına en fazla 1 Uygulama oluşturmaya izin veren ücretsiz plan
- **Pro Plan**: Kullanıcı başına sınırsız Uygulama oluşturmaya izin veren ücretli plan
- **Export**: Workspace verilerinin PDF veya Markdown formatında dışa aktarılması
- **Countdown**: Uygulamanın hedef lansman tarihine kalan gün sayısını gösteren geri sayım
- **CAPTCHA**: Otomatik kayıt girişimlerini engelleyen insan doğrulama mekanizması

---

## Gereksinimler

### Gereksinim 1: Kullanıcı Kaydı

**Kullanıcı Hikayesi:** Bir geliştirici olarak, email ve şifremle hesap oluşturmak istiyorum; böylece uygulamalarımın pazarlama süreçlerini kişisel bir workspace'te yönetebilirim.

#### Kabul Kriterleri

1. THE Sistem SHALL kullanıcıdan kayıt formunda email adresi, şifre ve şifre tekrarı alanlarını talep etmelidir.
2. WHEN kullanıcı kayıt formunu gönderdiğinde, THE Sistem SHALL CAPTCHA doğrulamasını tamamlamadan kaydı işleme almamalıdır.
3. WHEN geçerli bir email, en az 8 karakter uzunluğunda bir şifre ve eşleşen şifre tekrarı girildiğinde ve CAPTCHA doğrulandığında, THE Sistem SHALL yeni bir Kullanıcı kaydı oluşturmalı ve kullanıcıyı Dashboard ekranına yönlendirmelidir.
4. IF girilen email adresi sistemde zaten kayıtlıysa, THEN THE Sistem SHALL "Bu email adresi zaten kullanımda" hata mesajını göstermelidir.
5. IF şifre ve şifre tekrarı alanları eşleşmiyorsa, THEN THE Sistem SHALL "Şifreler eşleşmiyor" hata mesajını göstermelidir.
6. IF şifre 8 karakterden kısaysa, THEN THE Sistem SHALL "Şifre en az 8 karakter olmalıdır" hata mesajını göstermelidir.

---

### Gereksinim 2: Kullanıcı Girişi

**Kullanıcı Hikayesi:** Bir geliştirici olarak, email ve şifremle giriş yapmak istiyorum; böylece kayıtlı workspace'lerime erişebilirim.

#### Kabul Kriterleri

1. WHEN kullanıcı geçerli email ve şifre ile giriş formunu gönderdiğinde, THE Sistem SHALL kullanıcıyı doğrulamalı ve Dashboard ekranına yönlendirmelidir.
2. IF girilen email veya şifre hatalıysa, THEN THE Sistem SHALL "Email veya şifre hatalı" hata mesajını göstermeli ve giriş işlemini reddetmelidir.
3. THE Sistem SHALL oturum süresini 30 gün boyunca aktif tutmalıdır.
4. WHEN kullanıcı çıkış yaptığında, THE Sistem SHALL oturum bilgilerini temizlemeli ve giriş ekranına yönlendirmelidir.

---

### Gereksinim 3: Uygulama (App) Workspace Yönetimi

**Kullanıcı Hikayesi:** Bir geliştirici olarak, her uygulama için ayrı bir workspace oluşturmak istiyorum; böylece farklı projelerimin pazarlama süreçlerini birbirinden bağımsız takip edebilirim.

#### Kabul Kriterleri

1. WHEN kullanıcı yeni bir Uygulama oluşturduğunda, THE Sistem SHALL uygulama adı, platform (iOS / Android / Web) ve hedef lansman tarihi bilgilerini talep etmelidir.
2. WHEN geçerli bilgilerle yeni Uygulama formu gönderildiğinde, THE Sistem SHALL bir Workspace oluşturmalı ve kullanıcıyı Pre-Launch Checklist ekranına yönlendirmelidir.
3. WHILE kullanıcı Free Plan'daysa, THE Sistem SHALL ikinci bir Uygulama oluşturma girişimini engellemeli ve Pro Plan'a yükseltme mesajı göstermelidir.
4. WHILE kullanıcı Pro Plan'daysa, THE Sistem SHALL sınırsız Uygulama oluşturulmasına izin vermelidir.
5. THE Sistem SHALL Dashboard ekranında kullanıcıya ait tüm Uygulama kayıtlarını liste halinde göstermelidir.
6. WHEN kullanıcı bir Uygulamayı sildiğinde, THE Sistem SHALL silme işlemini onaylamasını isteyerek ilgili tüm Workspace verilerini kalıcı olarak silmelidir.

---

### Gereksinim 4: Pre-Launch Checklist

**Kullanıcı Hikayesi:** Bir geliştirici olarak, uygulamam için yapılandırılmış bir pre-launch checklist görmek istiyorum; böylece hangi adımları tamamladığımı ve hangilerinin eksik olduğunu kolayca takip edebileyim.

#### Kabul Kriterleri

1. THE Sistem SHALL Pre-Launch Checklist'i Store Prep, ASO, Creative ve Legal olmak üzere 4 kategori altında göstermelidir.
2. THE Sistem SHALL her kategorideki ChecklistItem'ları CMS'ten çekerek listelemeli; CMS'te yapılan içerik güncellemeleri mevcut Workspace'lere yansıtılmalıdır.
3. WHEN kullanıcı bir ChecklistItem'ı tamamlandı olarak işaretlediğinde, THE Sistem SHALL ilgili item'ın durumunu "tamamlandı" olarak kaydetmeli ve Progress değerini güncellemeli.
4. WHEN kullanıcı tamamlanmış bir ChecklistItem'ın işaretini kaldırdığında, THE Sistem SHALL item durumunu "tamamlanmadı" olarak güncellemeli ve Progress değerini yeniden hesaplamalıdır.
5. THE Sistem SHALL her kategori için tamamlanan item sayısını ve toplam item sayısını kategori başlığının yanında göstermelidir.
6. WHEN kullanıcı bir ChecklistItem'a tıkladığında, THE Sistem SHALL Item Detay Panelini (slide-over) açmalıdır.

---

### Gereksinim 5: Item Detay Paneli ve Deliverable Yönetimi

**Kullanıcı Hikayesi:** Bir geliştirici olarak, her checklist item'ına rehber bilgisi eklemek ve ilgili çıktılarımı (link, not, dosya) kaydetmek istiyorum; böylece tüm bilgileri tek bir yerde tutabilirim.

#### Kabul Kriterleri

1. WHEN Item Detay Paneli açıldığında, THE Sistem SHALL ChecklistItem'a ait CMS'ten gelen rehber metnini ve ilgili araç linklerini göstermelidir.
2. THE Sistem SHALL kullanıcının bir ChecklistItem'a en az bir Deliverable (link, not veya dosya) eklemesine izin vermelidir.
3. WHEN kullanıcı bir link Deliverable eklediğinde, THE Sistem SHALL URL formatını doğrulamalı; geçersiz URL girilmişse "Geçerli bir URL giriniz" hata mesajını göstermelidir.
4. WHEN kullanıcı bir dosya Deliverable yüklediğinde, THE Sistem SHALL dosya boyutunun 10 MB'ı aşmadığını doğrulamalı; aşıyorsa "Dosya boyutu 10 MB'ı geçemez" hata mesajını göstermelidir.
5. THE Sistem SHALL bir ChecklistItem'a eklenen tüm Deliverable'ları Item Detay Panelinde listelemeli ve her birini ayrı ayrı silmeye izin vermelidir.
6. WHEN bir Deliverable silindiğinde, THE Sistem SHALL silme işlemini onaylamasını isteyerek kaydı kalıcı olarak silmelidir.

---

### Gereksinim 6: Progress Takibi

**Kullanıcı Hikayesi:** Bir geliştirici olarak, pre-launch sürecinde ne kadar ilerlediğimi görmek istiyorum; böylece lansman öncesi eksik adımları hızlıca fark edebileyim.

#### Kabul Kriterleri

1. THE Sistem SHALL Workspace genelindeki Progress'i, tamamlanan ChecklistItem sayısının toplam ChecklistItem sayısına oranı olarak yüzde cinsinden hesaplamalıdır.
2. THE Sistem SHALL genel Progress değerini Pre-Launch Checklist ekranının üst bölümünde görünür biçimde göstermelidir.
3. WHEN bir ChecklistItem'ın tamamlanma durumu değiştiğinde, THE Sistem SHALL Progress değerini 1 saniye içinde güncelleyerek ekranda yansıtmalıdır.
4. THE Sistem SHALL her kategori için ayrı bir Progress yüzdesi hesaplamalı ve kategori başlığının yanında göstermelidir.

---

### Gereksinim 7: Lansman Tarihi Countdown

**Kullanıcı Hikayesi:** Bir geliştirici olarak, hedef lansman tarihime kalan gün sayısını görmek istiyorum; böylece süreci zamanında tamamlamak için motivasyonumu koruyabilirim.

#### Kabul Kriterleri

1. WHEN kullanıcı Uygulama oluştururken bir hedef lansman tarihi belirlediğinde, THE Sistem SHALL Pre-Launch Checklist ekranında lansman tarihine kalan gün sayısını göstermelidir.
2. WHILE hedef lansman tarihi gelecekte bir tarihe ayarlıysa, THE Sistem SHALL kalan gün sayısını her gün otomatik olarak güncelleyerek göstermelidir.
3. IF hedef lansman tarihi geçmişte bir tarihe denk geliyorsa, THEN THE Sistem SHALL "Lansman tarihi geçti" uyarısını göstermelidir.
4. WHEN kullanıcı lansman tarihini güncellediğinde, THE Sistem SHALL Countdown değerini yeni tarihe göre yeniden hesaplamalıdır.

---

### Gereksinim 8: Post-Launch Haftalık Rutin Şablonu

**Kullanıcı Hikayesi:** Bir geliştirici olarak, lansman sonrası haftalık rutin görevlerimi takip etmek istiyorum; böylece uygulamanın büyümesini destekleyen aktiviteleri düzenli olarak gerçekleştirebilirim.

#### Kabul Kriterleri

1. THE Sistem SHALL Post-Launch Rutin ekranında CMS'ten gelen haftalık RoutineTask şablonunu göstermelidir.
2. WHEN kullanıcı bir RoutineTask'ı tamamlandı olarak işaretlediğinde, THE Sistem SHALL ilgili haftaya ait bir RoutineLog kaydı oluşturmalıdır.
3. THE Sistem SHALL her hafta için tamamlanan RoutineTask sayısını ve toplam RoutineTask sayısını göstermelidir.
4. WHEN kullanıcı geçmiş bir haftanın RoutineLog kaydını görüntülemek istediğinde, THE Sistem SHALL o haftaya ait tamamlanma durumlarını göstermelidir.

---

### Gereksinim 9: PDF ve Markdown Export

**Kullanıcı Hikayesi:** Bir geliştirici olarak, pre-launch checklist durumumu ve deliverable'larımı dışa aktarmak istiyorum; böylece ekibimle veya yatırımcılarla paylaşabilecek bir rapor oluşturabilirim.

#### Kabul Kriterleri

1. THE Sistem SHALL Export ekranında kullanıcıya PDF ve Markdown formatlarından birini seçme imkânı sunmalıdır.
2. WHEN kullanıcı PDF export seçtiğinde, THE Sistem SHALL Workspace adını, Progress yüzdesini, tüm ChecklistItem'ların tamamlanma durumlarını ve Deliverable listesini içeren bir PDF dosyası oluşturmalı ve indirmeye sunmalıdır.
3. WHEN kullanıcı Markdown export seçtiğinde, THE Sistem SHALL aynı içeriği geçerli Markdown formatında bir .md dosyası olarak oluşturmalı ve indirmeye sunmalıdır.
4. THE Sistem SHALL export dosyasının adını `{uygulama-adi}-pre-launch-raporu` formatında oluşturmalıdır.
5. IF export işlemi sırasında bir hata oluşursa, THEN THE Sistem SHALL "Export işlemi başarısız oldu, lütfen tekrar deneyin" hata mesajını göstermelidir.

---

### Gereksinim 10: CMS Tabanlı İçerik Yönetimi

**Kullanıcı Hikayesi:** Bir ürün yöneticisi olarak, checklist içeriğini kod değişikliği yapmadan güncellemek istiyorum; böylece yeni araçlar veya en iyi pratikler ortaya çıktığında içeriği hızlıca revize edebileyim.

#### Kabul Kriterleri

1. THE Sistem SHALL ChecklistItem içeriğini (başlık, açıklama, kategori, rehber metni, araç linkleri) CMS'ten çekmelidir.
2. THE Sistem SHALL RoutineTask içeriğini CMS'ten çekmelidir.
3. WHEN CMS'te bir ChecklistItem güncellendiğinde, THE Sistem SHALL güncel içeriği mevcut tüm Workspace'lerde 24 saat içinde yansıtmalıdır.
4. IF CMS'e erişim sağlanamazsa, THEN THE Sistem SHALL en son başarıyla çekilen içeriği önbellekten sunmalı ve kullanıcıya "İçerik güncelleniyor" bilgi mesajını göstermelidir.
