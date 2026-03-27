import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Kullanım Koşulları — Patıpetra',
};

export default function KullanimPage() {
  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#F7F2EA] pt-[108px] pb-20">
        <div className="max-w-[800px] mx-auto px-4 sm:px-8">
          <div className="mb-8">
            <div className="text-[11px] font-semibold tracking-[.28em] uppercase text-[#8B7355] mb-3">Yasal</div>
            <h1 className="font-serif text-[clamp(28px,4vw,44px)] font-light text-[#2F2622]">Kullanım Koşulları</h1>
            <p className="text-sm text-[#9A9188] mt-2">Son güncelleme: Mart 2026</p>
          </div>
          <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-8 space-y-6 text-sm leading-[1.9] text-[#5C4A32]">
            {[
              {title:'1. Kabul', content:'Patıpetra platformunu kullanarak bu koşulları kabul etmiş sayılırsınız. Koşulları kabul etmiyorsanız platformu kullanmayınız.'},
              {title:'2. Platform Kullanımı', content:'Platform; evcil hayvan sahiplendirme, topluluk iletişimi, veteriner erişimi ve ilgili hizmetler için tasarlanmıştır. Ticari olmayan, kişisel amaçlı kullanım esastır.'},
              {title:'3. Yasak İçerikler', content:'Yanıltıcı ilan, hakaret, nefret söylemi, spam, telif hakkı ihlali ve yasa dışı içerik kesinlikle yasaktır. Bu tür içerikler tespit edildiğinde hesap askıya alınabilir.'},
              {title:'4. İlan Kuralları', content:'İlanlar gerçek ve güncel bilgi içermelidir. Hayvanın sağlık durumu, aşı bilgileri ve diğer önemli bilgiler doğru aktarılmalıdır. Yanıltıcı ilan hukuki sorumluluk doğurur.'},
              {title:'5. Ücretli Hizmetler', content:'Premium üyelik ve işletme planları aylık/yıllık abonelik modeliyle sunulur. Ödemeler iyzico üzerinden güvenli şekilde alınır. İptal halinde dönem sonuna kadar hizmet devam eder.'},
              {title:'6. Sorumluluk Sınırlaması', content:'Patıpetra, kullanıcılar arasındaki sahiplendirme işlemlerinin sonuçlarından sorumlu tutulamaz. Platform bir aracı hizmet sağlayıcısıdır.'},
              {title:'7. Fikri Mülkiyet', content:'Platform tasarımı, kodu ve içerikleri Patıpetra\'ya aittir. Kullanıcılar paylaştıkları içeriklerin haklarını platform ile paylaşmış sayılır.'},
              {title:'8. Değişiklikler', content:'Koşullar önceden haber verilmeksizin güncellenebilir. Platforma devam eden erişim güncel koşulların kabulü anlamına gelir.'},
              {title:'9. Uygulanacak Hukuk', content:'Bu koşullar Türk hukukuna tabidir. Uyuşmazlıklarda İstanbul mahkemeleri yetkilidir.'},
            ].map(s=>(
              <div key={s.title}>
                <h2 className="font-serif text-lg font-semibold text-[#2F2622] mb-2">{s.title}</h2>
                <p>{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
