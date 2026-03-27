import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni — Patıpetra',
};

export default function KvkkPage() {
  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#F7F2EA] pt-[108px] pb-20">
        <div className="max-w-[800px] mx-auto px-4 sm:px-8">
          <div className="mb-8">
            <div className="text-[11px] font-semibold tracking-[.28em] uppercase text-[#8B7355] mb-3">Yasal</div>
            <h1 className="font-serif text-[clamp(28px,4vw,44px)] font-light text-[#2F2622]">KVKK Aydınlatma Metni</h1>
            <p className="text-sm text-[#9A9188] mt-2">Son güncelleme: Mart 2026</p>
          </div>
          <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-8 space-y-6 text-sm leading-[1.9] text-[#5C4A32]">
            {[
              {title:'1. Veri Sorumlusu', content:'Patıpetra platformu ("Platform"), 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu sıfatıyla hareket etmektedir. İletişim: info@patipetra.com'},
              {title:'2. İşlenen Kişisel Veriler', content:'Platformumuzda; ad-soyad, e-posta adresi, telefon numarası, şehir bilgisi, platform içi davranış verileri ve evcil hayvan bilgileri işlenmektedir.'},
              {title:'3. Kişisel Verilerin İşlenme Amacı', content:'Kişisel verileriniz; platform hizmetlerinin sunulması, üyelik süreçlerinin yönetimi, ilan ve topluluk hizmetlerinin sağlanması, yasal yükümlülüklerin yerine getirilmesi amacıyla işlenmektedir.'},
              {title:'4. Kişisel Verilerin Aktarılması', content:'Kişisel verileriniz; hizmet alınan iş ortakları (Firebase/Google, iyzico) ile yasal zorunluluk halinde yetkili kurum ve kuruluşlarla paylaşılabilir. Üçüncü taraflara ticari amaçla satılmaz.'},
              {title:'5. Kişisel Verilerin Toplanma Yöntemi', content:'Verileriniz; platform üzerinden yapılan kayıt, ilan verme, yorum yapma ve topluluk katılımı gibi işlemler aracılığıyla elektronik ortamda toplanmaktadır.'},
              {title:'6. Veri Sahibinin Hakları', content:'KVKK madde 11 kapsamında; verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, amacını öğrenme, yurt içi/dışı aktarımları öğrenme, düzeltme, silme, işlemenin kısıtlanmasını isteme ve itiraz etme haklarına sahipsiniz.'},
              {title:'7. İletişim', content:'Haklarınızı kullanmak için info@patipetra.com adresine e-posta gönderebilirsiniz. Talepleriniz en geç 30 gün içinde yanıtlanacaktır.'},
            ].map(s=>(
              <div key={s.title}>
                <h2 className="font-serif text-lg font-semibold text-[#2F2622] mb-2">{s.title}</h2>
                <p>{s.content}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-4">
            <Link href="/gizlilik" className="text-sm text-[#C9832E] hover:underline">Gizlilik Politikası →</Link>
            <Link href="/kullanim" className="text-sm text-[#C9832E] hover:underline">Kullanım Koşulları →</Link>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
