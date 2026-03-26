'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginWithEmail, loginWithGoogle, resetPassword } from '@/lib/auth';
import Logo from '@/components/layout/Logo';

const G = <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>;

export default function GirisPage() {
  const router = useRouter();
  const [email,setEmail]=useState('');
  const [pw,setPw]=useState('');
  const [show,setShow]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [info,setInfo]=useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setInfo('');
    if(!email||!pw){setError('E-posta ve şifre zorunlu.');return;}
    setLoading(true);
    setInfo('Giriş yapılıyor...');
    try {
      const user = await loginWithEmail(email,pw);
      setInfo('Başarılı! Yönlendiriliyor...');
      console.log('Login success:', user.uid);
      window.location.href = '/panel';
    } catch(err:any) {
      console.error('Login error:', err.code, err.message);
      const m:Record<string,string>={
        'auth/user-not-found':'Kullanıcı bulunamadı.',
        'auth/wrong-password':'Şifre yanlış.',
        'auth/invalid-credential':'E-posta veya şifre hatalı.',
        'auth/invalid-email':'Geçersiz e-posta.',
        'auth/too-many-requests':'Çok fazla deneme. Bekleyin.',
      };
      setError(m[err.code] || err.code + ': ' + err.message);
    } finally { setLoading(false); }
  }

  async function handleGoogle() {
    setError(''); setInfo(''); setLoading(true);
    try {
      await loginWithGoogle();
      window.location.href = '/panel';
    } catch(err:any) {
      setError('Google girişi başarısız: ' + err.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[.9fr_1.1fr]">
      <div className="hidden lg:flex flex-col justify-between bg-[#2F2622] p-14 relative overflow-hidden">
        <div className="absolute w-[350px] h-[350px] rounded-full bg-[rgba(201,131,46,.1)] blur-[70px] -top-20 -right-20 pointer-events-none"/>
        <Link href="/" className="relative z-10"><Logo dark height={40}/></Link>
        <div className="relative z-10 my-10">
          <h2 className="font-serif text-[clamp(28px,3vw,40px)] font-light text-white leading-[1.05] mb-3">
            Petiniz için <em className="italic text-[#E8B86D]">her şey</em> tek platformda
          </h2>
          <div className="flex flex-col gap-3">
            {[{i:'🐾',t:'Pet Pasaport',d:'Aşı, muayene geçmişi tek yerde'},{i:'🩺',t:'Veteriner İletişimi',d:'Doğrulanmış vet, hızlı yanıt'},{i:'📢',t:'81 İlde İlan',d:'Güvenli sahiplendirme'},{i:'🛍',t:'Premium Mağaza',d:'Vet önerili ürünler'}].map(f=>(
              <div key={f.t} className="flex items-start gap-3 bg-white/5 border border-white/[.07] rounded-[14px] p-3">
                <div className="w-8 h-8 rounded-[9px] bg-[rgba(201,131,46,.15)] flex items-center justify-center text-sm flex-shrink-0">{f.i}</div>
                <div><div className="text-sm font-medium text-white">{f.t}</div><div className="text-[11px] text-white/40">{f.d}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 bg-white/[.06] border border-white/[.08] rounded-[18px] p-4">
          <p className="font-serif italic text-[14px] text-white/70 leading-relaxed mb-2">"Luna'nın tüm sağlık geçmişini kolayca takip edebiliyorum."</p>
          <p className="text-[11px] text-white/35">Merve D. · İstanbul · Scottish Fold sahibi</p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-[#F7F2EA] p-6 lg:p-12">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden mb-8 text-center"><Link href="/"><Logo height={44}/></Link></div>
          <h1 className="font-serif text-[clamp(24px,4vw,32px)] font-semibold text-[#2F2622] mb-1">Tekrar hoş geldiniz 🐾</h1>
          <p className="text-sm text-[#7A7368] mb-6">Hesabınıza giriş yapın.</p>

          <button onClick={handleGoogle} disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-[1.5px] border-[rgba(196,169,107,.25)] rounded-[14px] px-4 py-3 text-sm font-medium text-[#5C4A32] mb-5 hover:border-[#8B7355] hover:shadow-md transition-all disabled:opacity-60">
            {loading?<div className="w-5 h-5 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/>:G}
            Google ile Giriş Yap
          </button>

          <div className="flex items-center gap-3 mb-5 text-[#9A9188] text-xs">
            <span className="flex-1 h-px bg-[#E3D9C6]"/>veya e-posta ile<span className="flex-1 h-px bg-[#E3D9C6]"/>
          </div>

          {error&&<div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[12px] px-4 py-3 mb-4">{error}</div>}
          {info&&<div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-[12px] px-4 py-3 mb-4">{info}</div>}

          <form onSubmit={handleLogin} noValidate>
            <div className="mb-3">
              <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1" htmlFor="l-email">E-posta</label>
              <input id="l-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="siz@email.com" required autoComplete="email"
                className="w-full px-[14px] py-3 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm placeholder-[#9A9188] focus:outline-none focus:border-[#C9832E] focus:shadow-[0_0_0_3px_rgba(201,131,46,.1)] transition-all"/>
            </div>
            <div className="mb-2">
              <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1" htmlFor="l-pw">Şifre</label>
              <div className="relative">
                <input id="l-pw" type={show?'text':'password'} value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••" required autoComplete="current-password"
                  className="w-full px-[14px] py-3 pr-11 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm placeholder-[#9A9188] focus:outline-none focus:border-[#C9832E] focus:shadow-[0_0_0_3px_rgba(201,131,46,.1)] transition-all"/>
                <button type="button" onClick={()=>setShow(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7368] text-sm">{show?'🙈':'👁'}</button>
              </div>
              <button type="button" onClick={async()=>{
                if(!email){setError('Şifre sıfırlamak için e-posta girin.');return;}
                try{await resetPassword(email);setInfo('Şifre sıfırlama e-postası gönderildi.');}
                catch(err:any){setError('Hata: '+err.message);}
              }} className="block text-right text-[12px] text-[#8B7355] mt-1 hover:text-[#C9832E] w-full transition-colors">
                Şifremi unuttum
              </button>
            </div>
            <button type="submit" disabled={loading}
              className="w-full mt-4 py-[13px] rounded-[14px] bg-[#5C4A32] text-white text-[15px] font-medium hover:bg-[#2F2622] transition-all disabled:opacity-60">
              {loading?'Giriş yapılıyor…':'Giriş Yap →'}
            </button>
          </form>
          <p className="text-center text-[13px] text-[#7A7368] mt-5">
            Henüz üye değil misiniz? <Link href="/kayit" className="text-[#C9832E] font-medium hover:underline">Kayıt Ol</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
