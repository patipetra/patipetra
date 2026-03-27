import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Destek Merkezi — Patıpetra',
  description: 'Patıpetra destek merkezi. Sık sorulan sorular, iletişim ve yardım.',
};

export default function DestekPage() {
  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#F7F2EA] pt-[108px] pb-20">
        <div className="max-w-[900px] mx-auto px-4 sm:px-8">
          <div className="mb-10">
            <div className="text-[11px] font-semibold tracking-[.28em] uppercase text-[#8B7355] mb-3">Yardım</div>
            <h1 className="font-serif text-[clamp(28px,4vw,48px)] font-light text-[#2F2622] mb-3">Nasıl yardımcı olabiliriz?</h1>
            <p className="text-[#7A7368] leading-relaxed">Aşağıdan konunuzu seçin veya doğrudan bize ulaşın.</p>
          </div>

          {/* Hızlı linkler */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {[
              { icon:'❓', title:'Sık Sorulan Sorular', desc:'En çok merak edilen konular', href:'/sss' },
              { icon:'📢', title:'İlan Sorunları',      desc:'İlan verme ve yönetimi',       href:'/sss#ilanlar' },
              { icon:'🐾', title:'Pet Pasaport',        desc:'Profil oluşturma ve yönetim',  href:'/sss' },
              { icon:'💳', title:'Ödeme ve Premium',    desc:'Abonelik ve faturalama',        href:'/panel/premium' },
              { icon:'🔐', title:'Hesap Güvenliği',     desc:'Şifre ve gizlilik ayarları',   href:'/panel/ayarlar' },
              { icon:'🏪', title:'İşletme Başvurusu',   desc:'Kuaför, otel, eğitmen kaydı', href:'/hizmetler/basvur' },
            ].map(c => (
              <Link key={c.title} href={c.href}
                className="bg-white rounded-[18px] border border-[rgba(196,169,107,.12)] p-5 hover:shadow-lg hover:-translate-y-1 hover:border-[rgba(201,131,46,.25)] transition-all block">
                <div className="text-3xl mb-3">{c.icon}</div>
                <div className="font-semibold text-[#2F2622] mb-1">{c.title}</div>
                <div className="text-xs text-[#7A7368]">{c.desc}</div>
              </Link>
            ))}
          </div>

          {/* İletişim */}
          <div className="grid sm:grid-cols-2 gap-5 mb-10">
            <div className="bg-[#2F2622] rounded-[20px] p-6 text-white">
              <div className="text-3xl mb-3">📧</div>
              <h3 className="font-serif text-lg font-semibold mb-2">E-posta ile Ulaşın</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-4">Sorularınızı e-posta ile iletebilirsiniz. Genellikle 24 saat içinde yanıt veriyoruz.</p>
              <a href="mailto:destek@patipetra.com"
                className="inline-flex bg-[#C9832E] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#b87523] transition-colors">
                destek@patipetra.com
              </a>
            </div>
            <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-serif text-lg font-semibold text-[#2F2622] mb-2">Hızlı Yanıt</h3>
              <p className="text-sm text-[#7A7368] leading-relaxed mb-4">Acil konular için Instagram üzerinden bize ulaşabilirsiniz.</p>
              <a href="https://instagram.com/patipetra" target="_blank" rel="noopener noreferrer"
                className="inline-flex border border-[#8B7355] text-[#5C4A32] text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#5C4A32] hover:text-white transition-all">
                @patipetra
              </a>
            </div>
          </div>

          {/* Çalışma saatleri */}
          <div className="bg-[#F4EBDD] rounded-[20px] p-6 text-center">
            <h3 className="font-serif text-lg font-semibold text-[#2F2622] mb-2">Destek Saatleri</h3>
            <p className="text-sm text-[#7A7368]">Hafta içi <strong className="text-[#5C4A32]">09:00 — 18:00</strong> arası aktif destek sunuyoruz.</p>
            <p className="text-xs text-[#9A9188] mt-2">Hafta sonu gelen mesajlar Pazartesi yanıtlanır.</p>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
