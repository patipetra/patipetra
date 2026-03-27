import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { BLOG_POSTS } from '@/data/blogPosts';

// Tüm makale içerikleri
const CONTENTS: Record<string, string> = {
  'kedi-asi-takvimi-kapsamli-rehber': `
Kedinizin sağlıklı ve uzun bir yaşam sürmesi için aşılar kritik bir öneme sahiptir. Pek çok evcil hayvan sahibi hangi aşıları ne zaman yaptırması gerektiği konusunda kararsız kalır. Bu kapsamlı rehberde, yavru kediden yaşlı kediye kadar tüm yaş grupları için aşı takvimini detaylı biçimde ele alıyoruz.

## Aşı Neden Bu Kadar Önemli?

Aşılar, kedinizin bağışıklık sistemini olası hastalıklara karşı hazırlar. Özellikle apartman kedilerinin dahi belirli aşılara ihtiyaç duyduğunu bilmek önemlidir; zira bazı hastalıklar hava yoluyla ya da sahibinin kıyafetleri üzerinden bulaşabilir.

Düzenli aşılar sayesinde:
- Ölümcül solunum yolu hastalıklarından korunulur
- Virüs kaynaklı ishaller önlenir
- Kediden insana geçebilecek hastalık riskleri azalır
- Veteriner masrafları uzun vadede düşer

## Yavru Kedi Aşı Takvimi (0-12 Ay)

**6-8. Hafta:** İlk veteriner muayenesi ve Felis Trivalent (FPV) aşısının birinci dozu yapılır. Bu aşı; panloköpeni, rinotrakeit ve kalisivirüse karşı koruma sağlar.

**10-12. Hafta:** FPV aşısının ikinci dozu uygulanır. Bu dönemde veterineriniz iç parazit kontrolü de yapacaktır.

**14-16. Hafta:** FPV aşısının üçüncü ve son dozu ile birlikte kuduz aşısı yapılır. Türkiye'de kuduz aşısı yasal zorunluluktur.

**12. Ay:** İlk yıllık hatırlatma aşıları yapılır. Bu dönemde FeLV (Kedi Lösemi Virüsü) aşısına ihtiyaç olup olmadığı veterinerinizle değerlendirilmelidir.

## Yetişkin Kedi Aşı Takvimi (1-10 Yaş)

Yetişkin kediler için aşı takvimi genellikle yılda bir ya da üç yılda bir şeklinde düzenlenir. Bu süre, kullanılan aşının türüne ve kedinizin yaşam koşullarına göre değişir.

**Yıllık yapılan aşılar:**
- Kuduz aşısı (Türkiye mevzuatı gereği yıllık)
- FPV hatırlatma (bazı aşı tipleri için)

**3 Yılda bir yapılan aşılar:**
- Modifiye canlı FPV aşısı
- Kalisivirüs ve rinotrakeit kombinasyonu

## Yaşlı Kedi Aşı Takvimi (10+ Yaş)

10 yaş üstü kediler "yaşlı" olarak değerlendirilir. Bu dönemde bağışıklık sistemi zayıflamaya başlar, bu nedenle aşılar daha da önem kazanır. Ancak bazı yaşlı kedilerde aşıya bağlı yan etkiler daha sık görülebilir.

Veterineriniz, kedinizin genel sağlık durumuna göre aşı programını bireysel olarak belirleyecektir. 6 ayda bir veteriner kontrolü bu dönemde altın standart sayılır.

## Aşı Öncesi ve Sonrası Dikkat Edilecekler

Aşı öncesinde kediniz sağlıklı olmalıdır. Nezle, ishal ya da herhangi bir hastalık belirtisi varsa aşı birkaç hafta ertelenmelidir.

Aşı sonrasında 24-48 saat kedinizi yakından gözlemleyin. Hafif uyuşukluk, iştah kaybı ve aşı bölgesinde hassasiyet normaldir. Ancak şiddetli şişlik, nefes darlığı ya da yüz ödemi acil veteriner müdahalesi gerektiren belirtilerdir.

## Aşı Defteri Tutun

Kedinizin tüm aşı bilgilerini dijital ortamda saklamak için Patıpetra Pet Pasaport sistemini kullanabilirsiniz. Aşı tarihleri, veteriner bilgileri ve hatırlatma tarihleri otomatik olarak kaydedilir.

Düzenli aşı yaptırmak, kedinize verebileceğiniz en güzel armağanlardan biridir. Bir sonraki veteriner randevunuzu bugün planlayın.
  `,

  'kopek-beslenmesi-yasagore-rehber': `
Köpekler için beslenme, ırka, yaşa, kiloya ve aktivite düzeyine göre büyük farklılıklar gösterir. "Köpek mamısı, köpek yiyeceği" gibi genel bir yaklaşım yerine, köpeğinizin bireysel ihtiyaçlarını göz önünde bulundurmanız gerekir.

## Köpeklerin Temel Besin İhtiyaçları

Her köpek diyeti beş temel besin grubunu içermelidir:

**Protein:** Kas gelişimi ve bakımı için hayati önem taşır. Köpekler için ideal protein kaynakları tavuk, hindi, sığır, balık ve yumurtadır.

**Karbonhidrat:** Enerji sağlar. Pirinç, patates ve yulaf iyi kaynaklardır. Buğday bazlı ürünlere alerjisi olan köpekler için tahılsız seçenekler mevcuttur.

**Yağ:** Cilt ve tüy sağlığı için gereklidir. Omega-3 ve Omega-6 yağ asitleri özellikle önemlidir.

**Vitamin ve Mineraller:** Kemik sağlığı, bağışıklık sistemi ve metabolizma için şarttır.

**Su:** Çoğu zaman göz ardı edilse de su, bir köpeğin ihtiyaç duyduğu en kritik besindir.

## Yavru Köpek Beslenmesi (0-12 Ay)

Yavru köpekler hızlı büyüdüğünden, yetişkin köpeklere kıyasla kilo başına çok daha fazla kalori ve protein ihtiyaç duyarlar.

Küçük ırklar (Chihuahua, Yorkshire Terrier): Günde 3-4 küçük öğün
Orta ırklar (Labrador, Golden): Günde 3 öğün
Büyük ırklar (Alman Kurdu, Rottweiler): Günde 2-3 öğün

Büyük ırk yavruları için özellikle tasarlanmış mamalar tercih edilmelidir; zira fazla hızlı büyüme iskelet sorunlarına yol açabilir.

## Yetişkin Köpek Beslenmesi (1-7 Yaş)

Bu dönemde günde iki öğün standart haline gelir. Köpeğinizin ideal kilosunu korumak için porsiyon kontrolü çok önemlidir.

Günlük kalori ihtiyacı kabaca şu şekilde hesaplanabilir:
- Sedanter köpek: Vücut ağırlığı (kg) × 30 + 70
- Aktif köpek: Bu değerin %20-40 fazlası

Hazır mama seçerken ilk üç içeriğe bakın. Bunların protein kaynakları olması (tavuk, sığır, balık) tercih edilir.

## Yaşlı Köpek Beslenmesi (7+ Yaş)

Yaşlı köpekler daha az aktif olduğundan kalori ihtiyaçları düşer, ancak protein ihtiyaçları artabilir. Joint (eklem) sağlığını destekleyen glukozamin içeren mamalar bu dönemde faydalıdır.

Böbrek sorunları yaşlı köpeklerde sık görülür; bu nedenle düşük fosfor içeren mamalar önerilebilir. Ancak bu tür özel diyetler mutlaka veteriner gözetiminde uygulanmalıdır.

## Asla Verilmemesi Gereken Besinler

- Çikolata (teobromin zehirlenmesi)
- Soğan ve sarımsak (kırmızı kan hücresi hasarı)
- Üzüm ve kuru üzüm (böbrek yetmezliği)
- Avokado (persine toksini)
- Makadamya fıstığı (nörolojik sorunlar)
- Ksilitol içeren ürünler (karaciğer yetmezliği)
- Alkol ve kafein

## Ev Yapımı Mama vs. Hazır Mama

Ev yapımı mamalar doğal görünse de yeterli vitamin ve mineral dengesini sağlamak oldukça zordur. Hazır mamalar bu açıdan daha güvenilir seçenekler sunar. Ev yapımı diyet uygulamak isteyenler mutlaka bir veteriner beslenmecisiyle çalışmalıdır.
  `,

  'ilk-kez-kedi-sahiplenmek': `
Hayatınıza ilk kedinizi almak heyecan verici ama bir o kadar da hazırlık gerektiren bir süreçtir. Yüzlerce sahip adayı "nereden başlayacağını bilmiyorum" diyerek bu yolculuğa başlar. Bu rehber, ilk kez kedi sahipleneceklere adım adım yol göstermek için hazırlanmıştır.

## Kedi mi Yavru mu, Yetişkin mi?

İlk soruyu yanıtlamanız gerekiyor: Yavru kedi mi (2-4 aylık) yoksa yetişkin kedi mi sahipleneceksiniz?

**Yavru kediler** daha fazla enerji, sabır ve zaman gerektirir. Tuvalet eğitimi, sosyalleşme ve aşı programı yönetimi sizin sorumluluğunuzdadır. Ancak yavruyla büyümenin verdiği bağ eşsizdir.

**Yetişkin kediler** genellikle karakteri oturmuş, tuvalet eğitimli ve daha sakin hayvanlardır. Barınak ve sahiplendirme derneklerinde bekleyen pek çok yetişkin kedi vardır.

## Sahiplendirme Mi, Petshop Mu?

Bu konuda net bir tavsiyemiz var: **Önce sahiplendirmeyi deneyin.** Türkiye'de milyonlarca sahipsiz kedi ve köpek vardır. Patıpetra gibi platformlarda ya da yerel hayvanseverler aracılığıyla çok sayıda sahiplendirme ilanı bulabilirsiniz.

Sahiplendirilen kediler genellikle veteriner kontrolünden geçirilmiş, aşıları yapılmış ve kısırlaştırılmış olarak gelir.

## Eve Gelmeden Önce Hazırlık Listesi

Kedinizin ilk gününde ihtiyaç duyacağı malzemeler:

**Temel İhtiyaçlar:**
- Mama kabı ve su kabı (paslanmaz çelik veya seramik tercih edin)
- Kapalı kumu kutan (özellikle utangaç kediler için)
- Kaliteli kedi kumu (topaklaşan ve kokusuz çeşitler önerilir)
- Taşıma çantası (ilk veteriner ziyareti için şart)

**Konfor ve Oyun:**
- Kedi yatağı veya minderli kutu
- Tırmalama tahtası (mobilyalarınızı korumak için)
- İnteraktif oyuncaklar (tüylü asa, lazer pointer, top)

**Sağlık:**
- Kedi tarağı (tüy bakımı için)
- Tırnak makası

## İlk Veteriner Ziyareti

Kedinizi eve aldıktan sonraki ilk hafta içinde veteriner ziyareti şarttır. Bu ziyarette:

- Genel sağlık muayenesi yapılır
- Parazit kontrolü (iç ve dış parazit) gerçekleştirilir
- Mevcut aşı durumu değerlendirilir
- Kısırlaştırma zamanlaması planlanır

## Eve Alışma Süreci

İlk günler kedinize çok fazla dokunmaya ya da zorlamaya çalışmayın. Güvenli bir oda belirleyin; onu mama, su, kumu kutusu ve yatakla birlikte bu odaya bırakın. Kendi hızında keşfetmesine izin verin.

Çoğu kedi 1-2 haftada yeni evine alışır. Bazı kediler ise birkaç ay sürebilir. Sabır bu sürecin en önemli anahtarıdır.

## Tuvalet Eğitimi

Kediler içgüdüsel olarak kumu kutusunu kullanmayı bilirler. Ancak kutunun konumu, kumu türü ve temizlik düzeni önemlidir. Kumu kutusunu sakin, ulaşılabilir bir yere koyun. Günde en az bir kez temizleyin.

Evde birden fazla katin varsa her kata bir kumu kutusu yerleştirin.

## Besleme Düzeni

Kediler tatlı tadı alamaz ve karbonhidratlara ihtiyaç duymazlar. Protein ağırlıklı bir diyet idealdir. Yaşa uygun kedi maması seçin; yavru, yetişkin ve yaşlı formülasyonları birbirinden farklıdır.

Su tüketimini artırmak için ıslak mama ya da çeşme benzeri su içecekleri düşünebilirsiniz.
  `,

  'kedi-kisirlastirma-neden-onemli': `
Kısırlaştırma, evcil hayvan sahipliğinin en sorumlu adımlarından biridir. Pek çok sahip bu konuda kararsız kalır ya da "doğal hayatına karışmak istemiyorum" der. Ancak bilimsel veriler, kısırlaştırmanın hem bireysel hayvan sağlığını hem de toplumsal hayvan refahını büyük ölçüde iyileştirdiğini göstermektedir.

## Kısırlaştırma Nedir?

Dişi kedilerde ovaryohisterektomi (yumurtalık ve rahim alımı), erkek kedilerde ise orşiektomi (testis alımı) işlemidir. Her iki ameliyat da genel anestezi altında gerçekleştirilir ve deneyimli bir veteriner tarafından yapıldığında oldukça güvenlidir.

## Sağlık Faydaları

**Dişi kedilerde:**
- Rahim enfeksiyonu (pyometra) riski ortadan kalkar; bu hastalık tedavi edilmezse ölümcül olabilir
- Meme tümörü riski dramatik biçimde azalır; özellikle ilk kızgınlık öncesi kısırlaştırmalarda bu oran %90'a kadar düşer
- Yalancı gebelik semptomları yaşanmaz

**Erkek kedilerde:**
- Testis kanseri riski sıfırlanır
- Prostat sorunları azalır
- Bölge işaretleme davranışı ve saldırganlık önemli ölçüde azalır

## Davranışsal Değişiklikler

Kısırlaştırma sonrası en sık gözlemlenen davranış değişiklikleri şunlardır:

- Koku salgısıyla bölge işaretleme azalır veya tamamen durur
- Ev dışına kaçma isteği belirgin biçimde düşer
- Diğer kedilerle kavga etme eğilimi azalır
- Genel olarak daha sakin ve uysal bir karakter ortaya çıkar

Önemli not: Kısırlaştırma kedinin kişiliğini değiştirmez; yalnızca hormonal dürtüleri ortadan kaldırır.

## Ne Zaman Yapılmalı?

Geleneksel yaklaşım, dişi kedilerin ilk kızgınlık öncesinde (genellikle 5-6. aylarda), erkek kedilerin ise 6. ay civarında kısırlaştırılması yönündedir. Ancak barınaklarda erken dönem kısırlaştırma (8-16 haftalık) da uygulanmakta ve güvenli olduğu kanıtlanmaktadır.

## Ameliyat Süreci Nasıl İşler?

Ameliyat öncesi kedinizin 8-12 saat aç kalması gerekir. Ameliyat genel anestezi altında 20-45 dakika sürer. Dişi kediler için iyileşme süresi 7-10 gün, erkek kediler için ise 2-3 gündür.

Ameliyat sonrası yaklaşık 10 gün için elizabethan yaka (koruyucu yakalık) takılması gerekebilir.

## Kısırlaştırmanın Toplumsal Boyutu

Türkiye'de sokak hayvanı sorunu büyük ölçüde kontrolsüz üremeden kaynaklanmaktadır. Her yıl milyonlarca kedi ve köpek barınaklarda ya da sokaklarda hayatta kalma mücadelesi vermektedir. Evcil hayvanınızı kısırlaştırarak bu tablonun bir parçası olmayı reddediyorsunuz.
  `,

  'kopek-egitimi-temel-komutlar': `
Köpek eğitimi, ne kadar erken başlanırsa o kadar kolay ilerler. Ancak bu "yaşlı köpek yeni numara öğrenemez" demek değildir; sabır ve doğru tekniklerle her yaştaki köpek eğitilebilir. Bu rehberde pozitif pekiştirme yöntemiyle temel komutları nasıl öğreteceğinizi adım adım anlatıyoruz.

## Pozitif Pekiştirme Nedir?

Pozitif pekiştirme, köpeğinizin doğru davranışı yaptığında ödül (mama, oyun, övgü) vermesi esasına dayanır. Ceza temelli yöntemler hem etkisiz hem de köpek-sahip ilişkisine zarar vericidir. Modern köpek eğitimi bilimi, pozitif pekiştirmenin çok daha hızlı ve kalıcı sonuçlar verdiğini göstermektedir.

## Eğitime Başlamadan Önce

**Doğru ödül seçimi:** Köpeğinizin en çok neyi sevdiğini öğrenin. Bazı köpekler mama için, bazıları oyun için, bazıları ise övgü için çalışır.

**Zamanlama:** Ödül, davranış gerçekleştikten sonraki 1-2 saniye içinde verilmelidir. Gecikmeli ödül, köpeğin hangi davranışının ödüllendirildiğini anlamamasına yol açar.

**Seans süresi:** Günde 2-3 kez, 5-10 dakikalık kısa seanslar daha verimlidir. Uzun seanslar köpeği yorar ve dikkatini dağıtır.

## OTUR Komutu

Otur, tüm komutların temelidir. Öğretmek en kolay komutlardan biridir.

1. Elinizde ödül tutun ve köpeğinizin burnunun önüne getirin
2. Elinizi yavaşça başının üstüne ve arkasına doğru götürün
3. Köpek ödülü takip ederken otomatik olarak oturacaktır
4. Oturur oturmaz "OTUR" deyin ve ödülü verin
5. 10-15 tekrar sonra el hareketi olmadan komutla deneyin

## DUR Komutu

Dur komutu güvenlik açısından kritiktir; özellikle trafik yanında ya da tehlikeli durumlarda hayat kurtarabilir.

1. Köpeğiniz otururken öne iki adım atın
2. Elinizi açık tutarak "DUR" deyin
3. 3 saniye bekleyin, kalmazsa geri dönün ve baştan başlayın
4. Başarılı olursa ödülü verin
5. Süreyi kademeli olarak artırın: 3 saniye → 5 saniye → 10 saniye

## GEL Komutu

Gel komutu, köpeğinizin her koşulda yanınıza gelmesini sağlar. Bu komutun her uygulamasının pozitif bitmesi şarttır.

1. Köpeğinizden birkaç adım uzaklaşın
2. Çömelip "GEL" deyin ve coşkuyla el hareketi yapın
3. Geldiğinde bol ödül ve övgüyle karşılayın
4. Mesafeyi kademeli olarak artırın

Uyarı: Köpek geldiğinde asla azarlamayın. Bu, gelme davranışını olumsuz koşullandırır.

## YATIR Komutu

Yatır, otur komutunu öğrenen köpekler için nispeten kolaydır.

1. Köpek otururken ödülü burnunun önüne getirin
2. Ödülü yavaşça aşağı ve öne doğru çekin
3. Köpek ödülü takip ederken yere uzanacaktır
4. "YATIR" deyin ve ödülü verin

## Yaygın Hatalar

**Komutları tekrarlamak:** "Otur, otur, otur!" demek köpeğe hangi tekrarda oturması gerektiğini öğretir. Komutu bir kez verin.

**Eğitim seanslarını çok uzun tutmak:** Yorgunluk öğrenmeyi engeller.

**Tutarsız olmak:** Ailenin herkes aynı komutları kullanmalıdır.

**Olumsuz duygularla eğitmek:** Sinirli ya da sabırsızken eğitim yapmayın.

## Ne Zaman Profesyonel Yardım Alınmalı?

Köpeğinizde saldırganlık, aşırı korku ya da yıkıcı davranışlar varsa ve temel eğitim teknikleri işe yaramıyorsa, deneyimli bir köpek eğitmeninden destek almanız gerekebilir. Patıpetra üzerinden onaylı köpek eğitmenlerine ulaşabilirsiniz.
  `,

  'pet-pasaport-nedir-nasil-kullanilir': `
Evcil hayvanınızın tüm sağlık bilgilerini, aşı tarihlerini, veteriner notlarını ve ilaç kayıtlarını tek bir dijital platformda yönetebilirsiniz. İşte bu, pet pasaport sistemidir.

## Pet Pasaport Nedir?

Pet pasaport, evcil hayvanınızın tüm sağlık geçmişini dijital ortamda saklayan ve yöneten bir sistemdir. Fiziksel sağlık karnelerinin aksine kaybolmaz, her yerden erişilebilir ve paylaşılması çok kolaydır.

## Neden Her Evcil Hayvan Sahibi Pet Pasaporta İhtiyaç Duyar?

Günümüzde evcil hayvan sahipliği giderek daha bilinçli bir hal almaktadır. Veterinerinizin değişmesi, tatile gittiğinizde başka birine bakım bırakmanız ya da acil bir durumda farklı bir kliniğe gidilmesi gerektiğinde, eksiksiz sağlık geçmişine sahip olmak hayat kurtarabilir.

Bir araştırmaya göre, evcil hayvan sahiplerinin %60'ı son yapılan aşının tarihini hatırlayamadıklarını belirtiyor. Bu, geç aşı yapılmasına ya da gereksiz tekrar aşılara neden olabilir.

## Patıpetra Pet Pasaport ile Neler Yapabilirsiniz?

**Aşı Takibi:** Her aşının tarihi, sonraki uygulama zamanı ve yapan veteriner bilgisi kaydedilir. Hatırlatma bildirimler gönderilir.

**Veteriner Notları:** Her muayeneden sonra notlar eklenir; böylece hastalık geçmişi eksiksiz tutulur.

**İlaç Kaydı:** Kullanılan ilaçlar, dozaj bilgileri ve kullanım süreleri sisteme eklenir.

**Fotoğraf Galerisi:** Hayvanınızın fotoğraflarını yükleyebilirsiniz; bu özellikle kayıp ilanları için kritik önem taşır.

**Paylaşım Özelliği:** Pet pasaportunuzu veterinerinizle, bakıcınızla ya da otel yetkilileriyle kolayca paylaşabilirsiniz.

## Nasıl Oluşturulur?

Patıpetra'ya üye olduktan sonra Dashboard'dan "Pet Pasaportlarım" bölümüne girin. "Yeni Pet Ekle" butonuna tıklayarak birkaç dakika içinde ilk pasaportunuzu oluşturabilirsiniz.

Gerekli bilgiler: Pet adı, türü, ırkı, doğum tarihi, cinsiyet, kilo ve fotoğraf. Sonrasında aşı ve sağlık bilgilerini eklemeye başlayabilirsiniz.

## Sonuç

Dijital dönüşüm evcil hayvan sahipliğini de değiştiriyor. Pet pasaport sistemi sayesinde hayvanınızın sağlığı artık parmaklarınızın ucunda.
  `,

  'kedi-tuy-dokme-bakimi': `
Her kedi tüy döker; bu doğal ve kaçınılmazdır. Ancak mevsim geçişlerinde, özellikle ilkbahar ve sonbaharda yoğunlaşan tüy dökme döneminde doğru bakım hem evcil hayvanınızın sağlığını hem de evinizin temizliğini korur.

## Neden Tüy Dökerler?

Kediler, vücut ısısını düzenlemek için mevsimsel tüy değişimi geçirirler. İlkbaharda kış tüylerini atarak daha serin yazlık tüylere geçerler. Sonbaharda ise tam tersi olur.

İç mekânda yaşayan kedilerde bu döngü yapay aydınlatma nedeniyle düzensizleşebilir ve yıl boyu hafif düzeyde tüy dökümü yaşanabilir.

## Aşırı Tüy Dökümünün Nedenleri

Mevsimsel değişimin ötesinde aşırı tüy dökümü farklı nedenlere işaret edebilir:

- Beslenme yetersizliği (özellikle protein ve yağ asidi eksikliği)
- Parazit enfestasyonu (pire, uyuz)
- Alerjiler (gıda veya çevresel)
- Stres ve anksiyete
- Hormonal dengesizlik
- Tiroid sorunları
- Dermatit ve mantar enfeksiyonları

Normal dönemi aşan tüy dökümü, deride açıklar ya da kaşıma davranışı varsa veteriner muayenesi şarttır.

## Tarama Rutini

Düzenli tarama, tüy dökümünü kontrol altına almanın en etkili yoludur.

**Kısa tüylü kediler:** Haftada 1-2 kez tarama yeterlidir.
**Uzun tüylü kediler:** Günlük tarama gereklidir; aksi halde keçeleşme kaçınılmazdır.
**Yoğun dökme dönemlerinde:** Kısa tüylü kediler bile günlük taramadan fayda görür.

Tüy tarağı seçimi de önemlidir. Metal dişli ince taraklar ölü tüyleri almak için idealdir. Silikon kaplamalı taraklar ise deriye masaj yaparak kan dolaşımını artırır.

## Beslenme ile Tüy Sağlığı

Tüy kalitesini artırmanın en etkili yolu beslenmedir.

- Omega-3 ve Omega-6 yağ asitleri zengin mamalar tercih edin
- Balık yağı takviyesi veteriner onayıyla eklenebilir
- Kaliteli protein kaynakları tüy güçlendirici etkiye sahiptir
- Bol su içmek de tüy sağlığını destekler

## Ev Temizliği İçin Öneriler

Tüy dökme dönemlerinde evinizi temiz tutmak için:

- HEPA filtreli elektrikli süpürge kullanın
- Mobilyaları mikrofiber bezle silin
- Kedi yatağını haftada bir yıkayın
- Hava filtreli fanlar veya hava temizleyiciler düşünün

## Tüy Yumağı (Bezoar) Sorunu

Kediler tüy bakımı yaparken (grooming) önemli miktarda tüy yutarlar. Bu tüyler midede birikip tüy yumağı oluşturabilir. Haftalık tüy yumağı önleyici macunlar ve tarama bu riski azaltır.
  `,

  'mikrocip-neden-zorunlu': `
Her yıl binlerce evcil kedi ve köpek kaybolmakta ya da çalınmaktadır. Bunların büyük çoğunluğu sahiplerine bir daha kavuşamamaktadır; çünkü kimlikleri belirlenemez. Mikroçip, bu trajedileri önlemenin en etkili yoludur.

## Mikroçip Nedir?

Mikroçip, yaklaşık bir pirinç tanesi büyüklüğünde (2x12 mm), radyo frekansıyla çalışan pasif bir elektronik etikettir. İçinde 15 haneli benzersiz bir kod bulunur. Bu kod, ulusal veri tabanına kayıtlı sahip bilgileriyle eşleştirilir.

Mikroçipin kendi pil veya enerji kaynağı yoktur; yalnızca okuyucu cihaz yakına geldiğinde aktif hale gelir.

## Nasıl Takılır?

Mikroçip, enjektör yardımıyla hayvanın kürek kemikleri arasındaki deri altına yerleştirilir. İşlem birkaç saniye sürer ve standart bir aşı kadar acı verir. Genel anestezi gerektirmez.

İmplante edilen çip kaybolmaz, çalışmaz hale gelmez ve yaşam boyu aynı yerde kalır.

## Türkiye'de Mikroçip Zorunluluğu

Türkiye'de 5199 sayılı Hayvanları Koruma Kanunu kapsamında köpek ve kedilerin mikroçiplenmesi zorunludur. Mikroçipsiz hayvanla yakalanmak idari para cezasına neden olabilir. Ayrıca yurt dışına çıkarılacak evcil hayvanlar için ISO standartlı (15 haneli) mikroçip zorunludur.

## Mikroçip Kaybolan Hayvanı Nasıl Bulduruyor?

Barınaklar, veteriner klinikleri ve belediye ekipleri okuyucu cihazlara sahiptir. Bulunan ya da getirilen her hayvan taranır. Eşleşen kod varsa veri tabanından sahip bilgilerine ulaşılır ve iletişim kurulur.

Bu nedenle mikroçip taktırdıktan sonra iletişim bilgilerinizi güncel tutmanız kritik önem taşır.

## Mikroçip, Tasma Yerine Geçer Mi?

Hayır. Tasma ve kimlik kolye dışarıdan görülür ve anında bilgi verir. Mikroçip ise okuyucu cihaz olmadan okunamaz. İkisi birbirini tamamlar; birinin diğerinin yerini alması beklenmemelidir.

## Kayıp Durumunda Ne Yapmalı?

1. Hemen yakın çevreyi arayın; kaybolduktan ilk 24 saat kritiktir
2. Bölgedeki tüm veteriner kliniklerine ve barınaklara haber verin
3. Sosyal medyada ve Patıpetra kayıp ilanı bölümünde ilan verin
4. Belediye zabıtası ve sokak hayvanları birimlerine bildirim yapın
5. Mikroçip kayıt firmanıza da durumu bildirin
  `,

  'dogru-veteriner-nasil-secilir': `
Evcil hayvanınız için doğru veterineri bulmak, sağlıklı ve uzun bir ilişkinin temelidir. İyi bir veteriner yalnızca hastalıkları tedavi etmez; koruyucu sağlık hizmetleri sunar, sorularınızı sabırla yanıtlar ve hayvanınızla sağlıklı bir ilişki kurar.

## 1. Uzmanlık Alanını Kontrol Edin

Her veteriner her hayvan türünde uzman değildir. Köpek ve kedi klinikleri en yaygın olsa da egzotik hayvanlar (tavşan, papağan, hamster, sürüngen) için özel veteriner arayışına girmeniz gerekebilir.

Veterinerin hangi konularda daha deneyimli olduğunu sormaktan çekinmeyin: Diş sağlığı, ortopedi, dermatoloji, onkoloji gibi alanlarda ek eğitim almış veterinerler de bulunmaktadır.

## 2. Klinikteki Ekipmanlar

Modern bir veteriner kliniği şu ekipmanlara sahip olmalıdır:
- Dijital röntgen cihazı
- Ultrason cihazı
- Kan tahlil laboratuvarı (ya da hızlı sonuç için anlaşmalı lab)
- Steril ameliyathane
- Yatış ünitesi

Bu ekipmanların varlığı hem teşhis kalitesini artırır hem de acil durumlarda kıymetli zaman kazandırır.

## 3. İletişim Kalitesi

İyi bir veteriner:
- Tanıyı ve tedaviyi anlaşılır bir dille açıklar
- Alternatif tedavi seçeneklerini sunar
- Maliyet konusunda önceden şeffaf bilgi verir
- Sorularınıza sabırla yanıt verir

Veteriner muayene sırasında sürekli ekrana bakıyor, sizi dinlemiyor ya da sorularınıza cevap vermekten kaçınıyorsa bu iyi bir işaret değildir.

## 4. Temizlik ve Hijyen

Kliniğin genel temizliği sağlık güvencesinin görsel bir yansımasıdır. Yüzeylerin temiz olması, keskin koku bulunmaması ve kullanılan ekipmanların steril görünmesi dikkat edilmesi gereken noktalardır.

## 5. Acil Durumlarda Ulaşılabilirlik

Evcil hayvanlar her zaman mesai saatlerinde hastalanmaz. Kliniğin nöbet uygulaması var mı ya da acil durumlarda yönlendirebilecekleri bir klinikle anlaşmaları mevcut mu? Bunu önceden öğrenin.

## 6. Fiyat Şeffaflığı

Muayene, aşı ve temel işlemler için yaklaşık ücretleri önceden sorabilirsiniz. Şeffaf fiyatlandırma yapan klinikler, güvenilirlik açısından olumlu bir işarettir.

## 7. Hayvanınızın Tepkisi

Hayvanınız veterinere gitmeyi tamamen reddetmesi, klinikte aşırı panik yaşaması ya da muayene sırasında veterinere karşı olağandışı saldırgan davranması bir işaret olabilir. Ancak bu bazen hayvandan kaynaklanıyor da olabilir; bu nedenle sıklıkla yaşanıyorsa değerlendirmeye alın.

## 8. Tavsiyeler ve Yorumlar

Çevrenizden aldığınız tavsiyeler hâlâ en güvenilir bilgi kaynaklarından biridir. Patıpetra üzerinden de doğrulanmış veterinerler için yorumları inceleyebilirsiniz.

## İlk Muayeneyi Deneme Fırsatı Olarak Görün

İlk muayeneden sonra kendinize şu soruları sorun:
- Kendimi iyi dinlenilmiş hissettim mi?
- Tanı anlaşılır biçimde açıklandı mı?
- Fiyatlar makul müydi?
- Kliniğe güvenebildim mi?

Yanıtlar olumlu değilse farklı bir veteriner denemekten çekinmeyin. Evcil hayvanınızın sağlığı en doğru tercih hakkını hak eder.
  `,
};

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = BLOG_POSTS.find(p => p.slug === params.slug);
  if (!post) return { title: 'Makale Bulunamadı' };
  return {
    title:       `${post.title} — Patıpetra Blog`,
    description: post.excerpt,
    keywords:    [post.cat, 'evcil hayvan', 'pet bakım', 'patipetra'],
    openGraph: {
      title:       post.title,
      description: post.excerpt,
      images:      [{ url: post.img }],
      type:        'article',
    },
  };
}

export function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }));
}

export default function BlogPostPage({ params }: Props) {
  const post    = BLOG_POSTS.find(p => p.slug === params.slug);
  const content = CONTENTS[params.slug];

  if (!post) notFound();

  const related = BLOG_POSTS.filter(p => p.slug !== params.slug && p.cat === post.cat).slice(0, 2);

  // Markdown benzeri içeriği HTML'e çevir
  function renderContent(text: string) {
    return text.trim().split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="font-serif text-[clamp(20px,2.5vw,26px)] font-semibold text-[#2F2622] mt-8 mb-4">{line.slice(3)}</h2>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-semibold text-[#2F2622] mb-2">{line.slice(2,-2)}</p>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-5 mb-1 list-disc text-[#5C4A32]">{line.slice(2)}</li>;
      }
      if (line.trim() === '') return null;
      // Bold içinde işle
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className="mb-4 leading-[1.95] text-[#5C4A32]">
          {parts.map((part, j) => j % 2 === 0 ? part : <strong key={j} className="font-semibold text-[#2F2622]">{part}</strong>)}
        </p>
      );
    });
  }

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#F7F2EA] pb-20 lg:pb-0">
        {/* Hero image */}
        <div className="h-[300px] lg:h-[420px] relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.img} alt={post.title} className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"/>
          <div className="absolute top-[84px] left-4 sm:left-8">
            <Link href="/blog" className="text-sm text-white/70 hover:text-white transition-colors">← Blog'a Dön</Link>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-10">
          <div className="grid lg:grid-cols-[1fr_.32fr] gap-10">

            {/* Makale */}
            <article>
              {/* Başlık */}
              <div className="mb-8">
                <span className="inline-block text-[10px] font-semibold tracking-[.1em] uppercase text-[#C9832E] bg-[rgba(201,131,46,.1)] px-3 py-1 rounded-full mb-3">{post.cat}</span>
                <h1 className="font-serif text-[clamp(26px,4vw,42px)] font-semibold text-[#2F2622] mb-4 leading-tight">{post.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#9A9188]">
                  <span>✍️ Patıpetra Editörü</span>
                  <span>📅 {post.date}</span>
                  <span>⏱ {post.readTime} dakika okuma</span>
                </div>
              </div>

              {/* Özet */}
              <div className="bg-[#F4EBDD] border-l-4 border-[#C9832E] rounded-r-[16px] px-5 py-4 mb-8">
                <p className="text-[15px] font-medium text-[#5C4A32] leading-relaxed italic">{post.excerpt}</p>
              </div>

              {/* İçerik */}
              <div className="prose max-w-none text-[15px]">
                {content ? renderContent(content) : (
                  <p className="text-[#7A7368]">Bu makale yakında eklenecek.</p>
                )}
              </div>

              {/* Etiketler */}
              <div className="mt-8 pt-6 border-t border-[#E3D9C6]">
                <div className="flex flex-wrap gap-2">
                  {[post.cat, 'evcil hayvan', 'pet bakım', 'patipetra'].map(tag => (
                    <span key={tag} className="text-xs bg-[#EDE5D3] text-[#6E5A40] px-3 py-1 rounded-full">#{tag}</span>
                  ))}
                </div>
              </div>

              {/* İlgili makaleler */}
              {related.length > 0 && (
                <div className="mt-10">
                  <h3 className="font-serif text-xl font-semibold text-[#2F2622] mb-4">İlgili Makaleler</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {related.map(r => (
                      <Link key={r.slug} href={`/blog/${r.slug}`}
                        className="bg-white rounded-[16px] border border-[rgba(196,169,107,.12)] p-4 hover:shadow-md hover:-translate-y-1 transition-all flex gap-3">
                        <div className="w-16 h-16 rounded-[10px] overflow-hidden flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={r.img} alt={r.title} className="w-full h-full object-cover"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-[#C9832E] mb-1">{r.cat}</div>
                          <div className="text-sm font-semibold text-[#2F2622] leading-tight line-clamp-2">{r.title}</div>
                          <div className="text-[11px] text-[#9A9188] mt-1">{r.readTime} dk</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-[84px] space-y-4">
                {/* İçindekiler */}
                <div className="bg-white rounded-[16px] border border-[rgba(196,169,107,.12)] p-5">
                  <h3 className="font-serif text-base font-semibold text-[#2F2622] mb-3">📋 Hızlı Erişim</h3>
                  <div className="space-y-2">
                    {content && content.split('\n').filter(l => l.startsWith('## ')).map((h, i) => (
                      <div key={i} className="text-xs text-[#7A7368] hover:text-[#C9832E] transition-colors cursor-pointer py-1 border-b border-[#F7F2EA] last:border-0">
                        {h.slice(3)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pet Pasaport CTA */}
                <div className="bg-[#5C4A32] rounded-[16px] p-5 text-white">
                  <div className="text-2xl mb-2">🐾</div>
                  <h3 className="font-serif text-base font-semibold mb-2">Pet Pasaport Oluşturun</h3>
                  <p className="text-xs text-white/60 leading-relaxed mb-4">Petinizin tüm sağlık bilgilerini dijital ortamda yönetin.</p>
                  <Link href="/panel/petlerim"
                    className="block w-full text-center bg-[#C9832E] text-white text-xs font-semibold py-2 rounded-full hover:bg-[#b87523] transition-colors">
                    Hemen Başla →
                  </Link>
                </div>

                {/* Diğer makaleler */}
                <div className="bg-white rounded-[16px] border border-[rgba(196,169,107,.12)] p-5">
                  <h3 className="font-serif text-base font-semibold text-[#2F2622] mb-3">Son Makaleler</h3>
                  <div className="space-y-3">
                    {BLOG_POSTS.filter(p => p.slug !== params.slug).slice(0,4).map(p => (
                      <Link key={p.slug} href={`/blog/${p.slug}`}
                        className="flex gap-2 hover:opacity-75 transition-opacity">
                        <div className="w-10 h-10 rounded-[8px] overflow-hidden flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.img} alt="" className="w-full h-full object-cover"/>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-[#2F2622] leading-tight line-clamp-2">{p.title}</div>
                          <div className="text-[10px] text-[#9A9188] mt-1">{p.readTime} dk</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
