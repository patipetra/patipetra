import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası — Patıpetra',
};

export default function GizlilikPage() {
  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#F7F2EA] pt-[108px] pb-20">
        <div className="max-w-[800px] mx-auto px-4 sm:px-8">
          <div className="mb-8">
            <div className="text-[11px] font-semibold tracking-[.28em] uppercase text-[#8B7355] mb-3">Yasal</div>
            <h1 className="font-serif text-[clamp(28px,4vw,44px)] font-light text-[#2F2622]">Gizlilik Politikası</h1>
            <p className="text-sm text-[#9A9188] mt-2">Son güncelleme: Mart 2026</p>
          </div>
          <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-8 space-y-6 text-sm leading-[1.9] text-[#5C4A32]">
            {[
              {title:'Çerezler (Cookies)', content:'Platformumuz, kullanıcı deneyimini iyileştirmek amacıyla zorunlu çerezler kullanmaktadır. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz, ancak bu durumda bazı özellikler çalışmayabilir.'},
              {title:'Üçüncü Taraf Hizmetler', content:'Platform; Firebase (Google), iyzico ödeme sistemi gibi üçüncü taraf hizmet sağlayıcılarını kullanmaktadır. Bu hizmet sağlayıcıların kendi gizlilik politikaları geçerlidir.'},
              {title:'Veri Güvenliği', content:'Verileriniz Firebase güvenlik altyapısı ve SSL şifrelemesi ile korunmaktadır. Yetkisiz erişimlere karşı teknik ve idari önlemler alınmaktadır.'},
              {title:'Veri Saklama Süresi', content:'Hesap bilgileriniz aktif üyelik süresince saklanır. Hesap silme talebinde verileriniz yasal saklama süreleri dikkate alınarak silinir.'},
              {title:'Çocukların Gizliliği', content:'Platform 13 yaş altı bireylere yönelik değildir. 13 yaş altı kullanıcılara ait veri tespit edilmesi halinde ilgili veriler derhal silinir.'},
              {title:'Politika Değişiklikleri', content:'Bu politika zaman zaman güncellenebilir. Önemli değişiklikler e-posta ile bildirilir. Güncel politika her zaman bu sayfada yayınlanır.'},
              {title:'İletişim', content:'Gizlilik politikamıza ilişkin sorularınız için patipetraa1@gmail.com adresine ulaşabilirsiniz.'},
            ].map(s=>(
              <div key={s.title}>
                <h2 className="font-serif text-lg font-semibold text-[#2F2622] mb-2">{s.title}</h2>
                <p>{s.content}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-4">
            <Link href="/kvkk" className="text-sm text-[#C9832E] hover:underline">KVKK Metni →</Link>
            <Link href="/kullanim" className="text-sm text-[#C9832E] hover:underline">Kullanım Koşulları →</Link>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
