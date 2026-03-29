'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthChange, logout, resetPassword } from '@/lib/auth';
import type { User } from 'firebase/auth';
import { useToast } from '@/components/Toast';
import { usePushNotification } from '@/hooks/usePushNotification';

export default function AyarlarPage() {
  const { success } = useToast();
  const router = useRouter();
  const [user,    setUser]    = useState<User|null>(null);
  const [loading, setLoading] = useState(true);
  const [pwSent,  setPwSent]  = useState(false);

  useEffect(() => {
    const unsub = onAuthChange(u => {
      if (!u) { router.push('/giris'); return; }
      setUser(u); setLoading(false);
    });
    return () => unsub();
  }, [router]);

  if (loading) return <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>;

  return (
    <div className="min-h-screen bg-[#F7F2EA]">
      <div className="lg:ml-[260px] p-6 max-w-[600px]">
        <Link href="/panel" className="text-sm text-[#7A7368] hover:text-[#2F2622] mb-6 inline-flex items-center gap-1">← Kontrol Paneli</Link>
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <Link href="/" className="text-xs px-3 py-2 rounded-full bg-white border border-[rgba(196,169,107,.2)] text-[#5C4A32] hover:bg-[#F7F2EA] transition-all flex-shrink-0">🌐 Ana Sayfa</Link>
          <Link href="/panel" className="text-xs px-3 py-2 rounded-full bg-white border border-[rgba(196,169,107,.2)] text-[#5C4A32] hover:bg-[#F7F2EA] transition-all flex-shrink-0">← Kontrol Paneli</Link>
        </div>
        <h1 className="font-serif text-2xl font-semibold text-[#2F2622] mb-6">⚙ Ayarlar</h1>

        {/* Hesap */}
        <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6 mb-4">
          <h3 className="font-semibold text-[#2F2622] mb-4">🔐 Hesap Güvenliği</h3>
          <div className="flex items-center justify-between py-3 border-b border-[#F7F2EA]">
            <div>
              <div className="text-sm font-medium text-[#2F2622]">E-posta</div>
              <div className="text-xs text-[#7A7368]">{user?.email}</div>
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="text-sm font-medium text-[#2F2622]">Şifre</div>
              <div className="text-xs text-[#7A7368]">Şifrenizi sıfırlayın</div>
            </div>
            <button onClick={async()=>{
              if(!user?.email)return;
              await resetPassword(user.email);
              setPwSent(true);
            }} className="text-sm text-[#C9832E] hover:underline font-medium">
              {pwSent?'E-posta Gönderildi ✓':'Şifre Sıfırla'}
            </button>
          </div>
        </div>

        {/* Bildirimler */}
        <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6 mb-4">
          <h3 className="font-semibold text-[#2F2622] mb-4">🔔 Bildirim Tercihleri</h3>
          {[
            {l:'İlan onay bildirimleri',   d:'İlanınız onaylandığında e-posta al'},
            {l:'Mesaj bildirimleri',       d:'Yeni mesaj geldiğinde e-posta al'},
            {l:'Aşı hatırlatmaları',       d:'Pet aşı tarihi yaklaştığında hatırlat'},
          ].map((item,i)=>(
            <div key={i} className="flex items-center justify-between py-3 border-b border-[#F7F2EA] last:border-0">
              <div>
                <div className="text-sm font-medium text-[#2F2622]">{item.l}</div>
                <div className="text-xs text-[#7A7368]">{item.d}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer"/>
                <div className="w-10 h-6 bg-[#E3D9C6] peer-checked:bg-[#C9832E] rounded-full transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4"/>
              </label>
            </div>
          ))}
        </div>

        {/* Gizlilik */}
        <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6 mb-4">
          <h3 className="font-semibold text-[#2F2622] mb-4">🛡 Gizlilik</h3>
          <div className="flex flex-col gap-2">
            <Link href="/kvkk"     className="flex items-center justify-between py-3 border-b border-[#F7F2EA] text-sm text-[#5C4A32] hover:text-[#C9832E] transition-colors"><span>KVKK Aydınlatma Metni</span><span>→</span></Link>
            <Link href="/gizlilik" className="flex items-center justify-between py-3 border-b border-[#F7F2EA] text-sm text-[#5C4A32] hover:text-[#C9832E] transition-colors"><span>Gizlilik Politikası</span><span>→</span></Link>
            <Link href="/kullanim" className="flex items-center justify-between py-3 text-sm text-[#5C4A32] hover:text-[#C9832E] transition-colors"><span>Kullanım Koşulları</span><span>→</span></Link>
          </div>
        </div>

        {/* Çıkış */}
        <button onClick={async()=>{await logout();router.push('/');}} className="w-full py-3 rounded-[14px] border-[1.5px] border-red-200 text-red-500 text-sm font-medium hover:bg-red-500 hover:text-white hover:border-red-500 transition-all mb-4">
          🚪 Çıkış Yap
        </button>

        {/* Hesap sil */}
        <button className="w-full py-3 rounded-[14px] text-[#9A9188] text-sm hover:text-red-500 transition-colors">
          Hesabımı Sil
        </button>
      </div>
    </div>
  );
}
