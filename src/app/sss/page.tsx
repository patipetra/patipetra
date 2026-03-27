import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Sık Sorulan Sorular — Patıpetra',
};

const FAQS = [
  {cat:'Genel', items:[
    {q:'Patıpetra nedir?', a:'Patıpetra, Türkiye genelinde evcil hayvan sahiplendirme, veteriner iletişimi, topluluk ve hizmet erişimini tek platformda sunan bir pet yaşam platformudur.'},
    {q:'Üyelik ücretsiz mi?', a:'Evet, temel üyelik tamamen ücretsizdir. Premium özellikler için aylık abonelik planları mevcuttur.'},
    {q:'Platformu mobilde kullanabilir miyim?', a:'Evet, platform tam mobil uyumludur. Tarayıcınızdan erişebilirsiniz.'},
  ]},
  {cat:'İlanlar', items:[
    {q:'İlan nasıl veririm?', a:'Dashboard\'dan "İlan Ver" butonuna tıklayarak yeni ilan oluşturabilirsiniz. İlanlar admin onayından sonra yayına girer.'},
    {q:'İlanım ne zaman yayına girer?', a:'İlanlar genellikle 24 saat içinde admin tarafından incelenerek onaylanır veya reddedilir.'},
    {q:'Kaç ilan verebilirim?', a:'Ücretsiz üyelikte 2, Premium\'da 10, Pro Yıllık\'ta sınırsız ilan verebilirsiniz.'},
  ]},
  {cat:'Pet Pasaport', items:[
    {q:'Pet pasaport nedir?', a:'Petinizin aşı geçmişi, sağlık bilgileri ve önemli tarihlerini dijital ortamda saklayabileceğiniz sistemdir.'},
    {q:'Kaç pet ekleyebilirim?', a:'Ücretsiz üyelikte 1, Premium ve üzeri planlarda sınırsız pet profili oluşturabilirsiniz.'},
  ]},
  {cat:'Premium', items:[
    {q:'Premium\'u nasıl satın alabilirim?', a:'Dashboard\'dan "Premium\'a Geç" bölümüne giderek iyzico ile güvenli ödeme yapabilirsiniz.'},
    {q:'Premium\'u iptal edebilir miyim?', a:'Evet, ayarlar sayfasından istediğiniz zaman iptal edebilirsiniz. Dönem sonuna kadar özellikleriniz aktif kalır.'},
    {q:'İşletme hesabı nasıl açarım?', a:'/hizmetler/basvur adresinden başvurunuzu yapın. Ödeme ve admin onayı sonrası işletme profiliniz yayına girer.'},
  ]},
  {cat:'Güvenlik', items:[
    {q:'Verilerim güvende mi?', a:'Tüm veriler Firebase güvenlik altyapısı ve SSL şifrelemesiyle korunmaktadır.'},
    {q:'Şifremi unuttum ne yapmalıyım?', a:'Giriş sayfasındaki "Şifremi unuttum" linkine tıklayarak e-posta ile sıfırlama yapabilirsiniz.'},
  ]},
];

export default function SSSPage() {
  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#F7F2EA] pt-[108px] pb-20">
        <div className="max-w-[800px] mx-auto px-4 sm:px-8">
          <div className="mb-8">
            <div className="text-[11px] font-semibold tracking-[.28em] uppercase text-[#8B7355] mb-3">Yardım</div>
            <h1 className="font-serif text-[clamp(28px,4vw,44px)] font-light text-[#2F2622]">Sık Sorulan Sorular</h1>
          </div>
          <div className="space-y-6">
            {FAQS.map(cat=>(
              <div key={cat.cat}>
                <h2 className="font-serif text-xl font-semibold text-[#2F2622] mb-3">{cat.cat}</h2>
                <div className="space-y-3">
                  {cat.items.map(faq=>(
                    <div key={faq.q} className="bg-white rounded-[16px] border border-[rgba(196,169,107,.12)] p-5">
                      <div className="font-semibold text-sm text-[#2F2622] mb-2">❓ {faq.q}</div>
                      <div className="text-sm text-[#7A7368] leading-relaxed">{faq.a}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#5C4A32] rounded-[20px] p-6 text-center">
            <h3 className="font-serif text-lg font-semibold text-white mb-2">Cevabını bulamadın mı?</h3>
            <p className="text-sm text-white/60 mb-4">Bize doğrudan ulaşın, en kısa sürede yanıt verelim.</p>
            <a href="mailto:patipetraa1@gmail.com" className="inline-flex bg-[#C9832E] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#b87523] transition-colors">
              E-posta Gönder
            </a>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
