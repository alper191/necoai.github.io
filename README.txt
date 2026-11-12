====================================================
 NECO.AI — Yapay Zekâ Sohbet Uygulaması
====================================================

NECO.AI, Groq API tabanlı gerçek yapay zekâ sohbet uygulamasıdır.
Tamamen HTML + CSS + Vanilla JavaScript ile çalışır. Sunucu tarafı
için Netlify Functions kullanılır. Bilgisayarınıza hiçbir program
kurmanız GEREKMEZ — her şey web tarayıcısından yönetilir.

DİKKAT: Yapay zekâ yanıtları Netlify'daki sunucu fonksiyonu
üzerinden gelir. Bu yüzden uygulama BİLGİSAYARDA ÇİFT TIKLAYARAK
(index.html) AÇILAMAZ. Mutlaka Netlify'da yayınlayıp o adresten
kullanın. Yerel test için tek yol Netlify CLI'dır (aşağıda).


----------------------------------------------------
 DOSYA YAPISI
----------------------------------------------------
  neco-ai/
    index.html               -> Uygulamanın tamamı (arayüz)
    assets/
      style.css              -> Tasarım (siyah/lacivert + neon mavi)
      app.js                 -> Uygulama mantığı (sohbet, geçmiş, dil)
    netlify.toml             -> Netlify yapılandırması
    netlify/functions/
      chat.js                -> Groq API'ye bağlanan sunucu fonksiyonu
      auth.js                -> Kayıt / giriş / kullanıcı listesi fonksiyonu
      node_modules/          -> Kayıt verisini Netlify'da saklayan paket
    README.txt               -> Bu dosya


----------------------------------------------------
 NETLIFY'DA YAYINLAMA (ZIP İLE, 5 DAKİKA)
----------------------------------------------------
1) https://app.netlify.com adresinden ücretsiz hesap açın
   (e-posta ile kayıt yeterli).

2) Tarayıcıda https://app.netlify.com/drop adresine gidin.

3) "neco-ai.zip" dosyasını sayfaya sürükleyip bırakın.
   Netlify siteyi otomatik oluşturur ve size bir adres verir
   (örn. https://ornek-ad.netlify.app).

4) İSTEĞE BAĞLI: API anahtarı zaten sunucu fonksiyonuna gömülüdür —
   ek ayar gerekmez. İsterseniz anahtarı Netlify ortam değişkeniyle
   de yönetebilirsiniz:
   - Site paneline girin:  Site configuration -> Environment variables
   - "Add a variable" ile şunu ekleyin:
       Key:   GROQ_API_KEY
       Value: Sizin Groq API anahtarınız (gsk_... ile başlar)
     (Ortam değişkeni tanımlıysa gömülü anahtar yerine o kullanılır.)

5) Yeni ZIP'i atmanız yeterli; ekstra deploy gerekmez. Sohbet başlar.

6) Site adresini açın ve sohbete başlayın. NECO.AI hazır!

NOT: Zaten yayında olan bir siteyi güncellemek için yeni site
oluşturmayın; app.netlify.com'da sitenizi açıp "Deploys" sekmesine
yeni ZIP'i sürükleyin. Böylece site adresiniz değişmez.


----------------------------------------------------
 ÖNEMLİ GÜVENLİK NOTU
----------------------------------------------------
- API anahtarı yalnızca SUNUCU tarafında durur
  (netlify/functions/chat.js). Tarayıcıdan ve site ziyaretçilerinden
  görülemez; index.html / app.js / style.css içinde ASLA yoktur.
- ZIP dosyasını herkese açık yerlerde paylaşmayın (içinde anahtar var).
- Anahtarı kimseyle paylaşmayın. Sızdığını düşünürseniz
  console.groq.com adresinden yeni anahtar üretip chat.js içindeki
  değeri güncelleyin ve ZIP'i yeniden deploy edin.
- Site adresi herkese açıktır; sohbet misafir olarak da kullanılabilir.
  E-posta ile kayıt olup giriş yapanların kaydı sunucuda tutulur;
  şifreler şifreli (hash'li) saklanır, düz metin olarak KAYDEDİLMEZ.


----------------------------------------------------
 ÖZELLİKLER
----------------------------------------------------
- Gerçek zamanlı (akışlı) AI sohbeti
  (varsayılan model: qwen/qwen3.8-27b — GROQ_MODEL ile değiştirilebilir)
- İNTERNET ARAMASI: soru sorulduğunda ("?" ile biten) veya güncel
  bilgi istendiğinde (hava, haber, fiyat, dolar, maç skoru, "bugün",
  "araştır" vb.) NECO.AI internetten araştırıp güncel yanıt verir
- İSTEĞE BAĞLI e-posta ile kayıt/giriş: sol menünün altındaki
  "Giriş Yap / Kaydol" ile açılır; kayıt olmadan da sohbet edilir
- YÖNETİCİ PANELİ: giriş ekranındaki "Yönetici Girişi" ile tüm
  kayıtlı kullanıcıları görme ve TXT dosyası olarak indirme
- Yeni sohbet, sohbet geçmişi, sohbet silme, tümünü silme
- Türkçe / İngilizce arayüz dili
- Metin dosyası yükleme ve analiz (.txt, .md, .csv, .json, kod
  dosyaları vb., en fazla 100 KB)
- Makale/metin üretimi, fikir üretme, kodlama yardımı
- WEB SAYFASI YAPMA: "Bana bir web sayfası yap" deyin; NECO.AI tam
  HTML sayfası yazar. Yanıttaki kod bloğunda ÖNİZLE (sayfayı
  uygulama içinde gösterir) ve İNDİR (html dosyası olarak kaydeder)
  düğmeleri vardır
- Markdown yanıtları, kod blokları ve kopyalama butonu
- Enter ile gönder, Shift+Enter ile yeni satır
- Mobil / tablet / masaüstü uyumlu tasarım


----------------------------------------------------
 KAYIT VE GİRİŞ SİSTEMİ (İSTEĞE BAĞLI)
----------------------------------------------------
- Uygulama GİRİŞ YAPMADAN açılır; sohbet misafir olarak da çalışır.
- Kayıt olmak isteyenler sol menünün altındaki
  "Giriş Yap / Kaydol" düğmesine tıklar.
- "Kaydol" sekmesinden e-posta ve şifre (en az 6 karakter) ile
  ücretsiz hesap oluşturulur. Kayıtlı e-postayla tekrar kayıt
  olunamaz; "Giriş" sekmesinden giriş yapılır.
- Giriş yapıldıktan sonra oturum tarayıcıda hatırlanır
  (localStorage) — her açılışta tekrar sorulmaz. "Çıkış Yap"
  düğmesiyle (sol menü) hesaptan çıkılır; menüdeki düğme
  giriş yapınca "Çıkış Yap"a, çıkınca "Giriş Yap / Kaydol"a döner.
- Şifreler sunucuda ŞİFRELİ (scrypt hash) saklanır; düz metin
  olarak hiçbir yerde tutulmaz.

YÖNETİCİ PANELİ (site sahibi için):
- Giriş ekranında "Yönetici Girişi" bağlantısına tıklayın.
- Yönetici şifresi:  neco1234
  (Değiştirmek için auth.js içindeki BUILTIN_PASSWORD satırını
  düzenleyin, ZIP'i yeniden oluşturup Netlify'a atın.)
- Panelde kayıtlı herkesin e-postası ve kayıt tarihi görünür;
  "TXT Olarak İndir" ile liste bilgisayara indirilir.
- Kayıt verileri Netlify'ın kalıcı deposunda (Netlify Blobs)
  tutulur — yeni ZIP attığınızda kayıtlar KAYBOLMAZ.

NOT: Kayıtlar site sahibi ve Netlify dışında kimseyle paylaşılmaz.
Site herkese açık olduğu için kotanız ortaktır — kayıt olan herkes
aynı ücretsiz Groq kotasını kullanır.


----------------------------------------------------
 SIK KARŞILAŞILAN SORUNLAR
----------------------------------------------------
S: "missing_api_key" hatası alıyorum.
C: Bu ZIP'te anahtar sunucuya gömülüdür; hata normalde görünmemeli.
   Görünüyorsa sitede ESKİ bir sürüm yayında demektir — yeni
   neco-ai.zip dosyasını Drop sayfasına tekrar atın ve deploy'un
   "Published" olmasını bekleyin.

S: "Ağ hatası" alıyorum.
C: Olası nedenler ve çözümler:
   1) Uygulamayı bilgisayarda index.html'e çift tıklayarak açtınız.
      Bu çalışmaz — uygulama yalnızca Netlify adresinden kullanılır.
   2) Deploy henüz tamamlanmadı. Deploys sekmesinden durumun
      "Published" olduğunu doğrulayın; gerekirse 1-2 dakika bekleyin.
   3) Ortam değişkeni eklendikten sonra yeniden deploy yapılmadı
      (4. ve 5. adımları tekrarlayın).
   4) İnternet bağlantınızı kontrol edin.

S: "Sunucu fonksiyonu bulunamadı" hatası alıyorum.
C: Site Netlify üzerinden yayınlanmamış veya deploy eksik. Yukarıdaki
   yayınlama adımlarını baştan uygulayın.

S: Uzun yanıtlarda hata alıyorum.
C: Netlify'ın ücretsiz planında fonksiyon süresi 60 saniyedir.
   Çok uzun isteklerde talebinizi daha kısa sorun.

S: "Request too large for model" / OTPM hatası alıyorum.
C: Groq'un ücretsiz planı dakikada 1000 çıktı tokenı sınırı koyar.
   Uygulama mesaj başına en fazla 900 token ister. Art arda çok
   mesaj gönderirseniz dakikalık sınıra takılabilirsiniz — birkaç
   saniye bekleyip tekrar deneyin.

S: İnternet araması ne zaman devreye girer?
C: Mesajınız soru işaretiyle bitiyorsa veya içinde "bugün", "güncel",
   "haber", "hava durumu", "fiyat", "dolar", "euro", "borsa",
   "maç sonucu", "deprem", "trafik", "araştır", "ne zaman",
   "saat kaç" gibi ifadeler varsa NECO.AI internetten araştırır.
   Sadece sohbet amaçlı mesajlarda (arama gerektirmeyen) normal
   hızlı model kullanılır. Arama yanıtları biraz daha yavaş gelebilir
   (birkaç saniye) — bu normaldir. Arama modeli kota yüzünden
   yanıt veremezse uygulama normal modelle devam eder.

S: Web sayfası yaptırınca nasıl görürüm / kaydederim?
C: NECO.AI sayfa kodunu bir kutu içinde yazar. Kutunun üstündeki
   "Önizle" sayfayı uygulamanın içinde gösterir; "İndir" ise
   neco-sayfa.html dosyası olarak bilgisayarınıza/telefonunuza
   kaydeder. İndirdiğiniz dosyaya çift tıklayınca tarayıcıda açılır.

S: Görsel / video oluşturma var mı?
C: Bu sürümde görsel ve video oluşturma özellikleri kaldırılmıştır.
   İsterseniz sohbette görsel veya video tarif edin; NECO.AI yazılı
   olarak anlatır.

S: Sohbetlerim nerede saklanıyor?
C: Sohbet geçmişi yalnızca sizin tarayıcınızda (localStorage) tutulur.
   Başka cihazdan görünmez; tarayıcı verileri silinirse kaybolur.

S: Şifremi unuttum.
C: Şifreler şifreli saklandığı için geri getirilemez. Site sahibinden
   yeni bir hesap istemekten başka seçenek yoktur (şifre sıfırlama
   özelliği bu sürümde yoktur).

S: "Kayıt sunucuda saklanamadı" hatası alıyorum.
C: Netlify deposuna yazılamadı demektir. ZIP'in en yeni sürümünü
   Deploys sekmesine tekrar atın ve "Published" olmasını bekleyin.
   Sorun sürerse site sahibine bildirin.

S: Yönetici şifresini unuttum.
C: Yönetici şifresi auth.js dosyasında yazılıdır
   (BUILTIN_PASSWORD satırı). Dosyaya bakıp öğrenebilir veya oradan
   yeni bir şifre yazıp ZIP'i yeniden yayınlayabilirsiniz.


----------------------------------------------------
 YEREL TEST (İSTEĞE BAĞLI)
----------------------------------------------------
Netlify CLI kurulu bir bilgisayarda:

   netlify login
   netlify dev

.env dosyasına GROQ_API_KEY=anahtariniz yazın, ardından
http://localhost:8888 adresini açın. (Yayınlamak için gerekmez.)


====================================================
 NECO.AI — İyi sohbetler!
====================================================
