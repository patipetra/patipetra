'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerWithEmail, loginWithGoogle } from '@/lib/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Logo from '@/components/layout/Logo';

const G = <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>;

const ACCOUNT_TYPES = [
  { val:'user',     icon:'🧑', label:'Pet Sahibi',   desc:'İlan ver, topluluk, veteriner' },
  { val:'vet',      icon:'🩺', label:'Veteriner',     desc:'Başvuru + admin onayı gerekir' },
  { val:'groomer',  icon:'✂️', label:'Pet Kuaför',    desc:'Başvuru + admin onayı gerekir' },
  { val:'hotel',    icon:'🏨', label:'Pet Otel',      desc:'Başvuru + admin onayı gerekir' },
  { val:'trainer',  icon:'🎓', label:'Pet Eğitmen',   desc:'Başvuru + admin onayı gerekir' },
  { val:'petshop',  icon:'🛒', label:'Pet Shop',      desc:'Başvuru + admin onayı gerekir' },
  { val:'sitter',   icon:'🐾', label:'Pet Bakıcı',    desc:'Başvuru + admin onayı gerekir' },
];

const BUSINESS_TYPES = ['vet','groomer','hotel','trainer','petshop','sitter'];

const APPLY_ROUTES: Record<string,string> = {
  vet:     '/veterinerler/basvur',
  groomer: '/hizmetler/basvur',
  hotel:   '/hizmetler/basvur',
  trainer: '/hizmetler/basvur',
  petshop: '/hizmetler/basvur',
  sitter:  '/hizmetler/basvur',
};

export default function KayitPage() {
  const router = useRouter();
  const [step,       setStep]       = useState<'type'|'form'>('type');
  const [accType,    setAccType]    = useState('user');
  const [name,       setName]       = useState('');
  const [surname,    setSurname]    = useState('');
  const [email,      setEmail]      = useState('');
  const [pw,         setPw]         = useState('');
  const [show,       setShow]       = useState(false);
  const [kvkk,       setKvkk]       = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!kvkk) { setError('KVKK metnini kabul etmeniz gerekiyor.'); return; }
    if (!name)  { setError('Ad zorunlu.'); return; }
    setLoading(true); setError('');
    try {
      const user = await registerWithEmail(email, pw, name, surname);
      // Hesap türünü kaydet
      if (accType !== 'user') {
        await updateDoc(doc(db,'users',user.uid), { accountType: accType });
      }
      // İşletme türü ise başvuru sayfasına yönlendir
      if (BUSINESS_TYPES.includes(accType)) {
        router.push(APPLY_ROUTES[accType] + '?type=' + accType);
      } else {
        router.push('/panel');
      }
    } catch(err:any) {
      const msgs: Record<string,string> = {
        'auth/email-already-in-use': 'Bu e-posta zaten kayıtlı.',
        'auth/weak-password':        'Şifre en az 6 karakter olmalı.',
        'auth/invalid-email':        'Geçersiz e-posta.',
      };
      setError(msgs[err.code] || err.message);
    } finally { setLoading(false); }
  }

  async function handleGoogle() {
    setLoading(true); setError('');
    try {
      const user = await loginWithGoogle();
      if (BUSINESS_TYPES.includes(accType)) {
        await updateDoc(doc(db,'users',user.uid), { accountType: accType });
        router.push(APPLY_ROUTES[accType] + '?type=' + accType);
      } else {
        router.push('/panel');
      }
    } catch(err:any) { setError('Google girişi başarısız: ' + err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[.9fr_1.1fr]">
      {/* Sol panel */}
      <div className="hidden lg:flex flex-col justify-between bg-[#2F2622] p-14 relative overflow-hidden">
        <div className="absolute w-[350px] h-[350px] rounded-full bg-[rgba(201,131,46,.1)] blur-[70px] -top-20 -right-20 pointer-events-none"/>
        <Link href="/"><Logo dark height={40}/></Link>
        <div className="relative z-10 my-10">
          <h2 className="font-serif text-[clamp(28px,3vw,40px)] font-light text-white leading-[1.05] mb-6">
            Türkiye'nin <em className="italic text-[#E8B86D]">pet platformuna</em> katıl
          </h2>
          <div className="flex flex-col gap-3">
            {['Pet profili & aşı takibi','81 ilde sahiplendirme ilanı','Doğrulanmış veterinerler','Pet toplulukları'].map(f=>(
              <div key={f} className="flex items-center gap-3 text-white/70 text-sm">
                <span className="text-[#C9832E]">✓</span> {f}
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 bg-white/[.06] border border-white/[.08] rounded-[18px] p-4">
          <p className="font-serif italic text-[14px] text-white/70 leading-relaxed mb-2">"Patıpetra sayesinde Luna'ya harika bir yuva buldum."</p>
          <p className="text-[11px] text-white/35">Ayşe K. · İstanbul · Kedi Sahibi</p>
        </div>
      </div>

      {/* Sağ panel */}
      <div className="flex items-center justify-center bg-[#F7F2EA] p-6 lg:p-12 min-h-screen">
        <div className="w-full max-w-[480px]">
          <div className="lg:hidden mb-8 text-center"><Link href="/"><Logo height={44}/></Link></div>

          {/* ADIM 1: Hesap türü seç */}
          {step === 'type' && (
            <>
              <h1 className="font-serif text-[clamp(22px,4vw,30px)] font-semibold text-[#2F2622] mb-1">Ücretsiz Üye Ol 🐾</h1>
              <p className="text-sm text-[#7A7368] mb-6">Hesap türünü seç, başlayalım.</p>

              <div className="grid grid-cols-2 gap-2 mb-6">
                {ACCOUNT_TYPES.map(t=>(
                  <button key={t.val} type="button" onClick={()=>setAccType(t.val)}
                    className={`p-3 rounded-[14px] border-[1.5px] text-left transition-all ${accType===t.val?'border-[#C9832E] bg-[rgba(201,131,46,.06)]':'border-[#E3D9C6] hover:border-[#8B7355] bg-white'}`}>
                    <div className="text-2xl mb-1">{t.icon}</div>
                    <div className={`text-sm font-semibold ${accType===t.val?'text-[#C9832E]':'text-[#2F2622]'}`}>{t.label}</div>
                    <div className="text-[10px] text-[#9A9188] mt-[2px] leading-tight">{t.desc}</div>
                  </button>
                ))}
              </div>

              {BUSINESS_TYPES.includes(accType) && (
                <div className="bg-[rgba(201,131,46,.08)] border border-[rgba(201,131,46,.2)] rounded-[12px] px-4 py-3 mb-4 text-sm text-[#8B7355]">
                  ℹ️ Önce hesap oluşturacaksın, sonra başvuru formuna yönlendirileceksin. Admin onayı gerekir.
                </div>
              )}

              <button onClick={()=>setStep('form')}
                className="w-full py-[13px] rounded-[14px] bg-[#5C4A32] text-white text-[15px] font-medium hover:bg-[#2F2622] transition-all">
                Devam Et →
              </button>
              <p className="text-center text-[13px] text-[#7A7368] mt-4">
                Zaten üye misiniz? <Link href="/giris" className="text-[#C9832E] font-medium hover:underline">Giriş Yap</Link>
              </p>
            </>
          )}

          {/* ADIM 2: Kayıt formu */}
          {step === 'form' && (
            <>
              <button onClick={()=>setStep('type')} className="flex items-center gap-1 text-sm text-[#7A7368] hover:text-[#2F2622] mb-5 transition-colors">
                ← Geri
              </button>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">{ACCOUNT_TYPES.find(t=>t.val===accType)?.icon}</span>
                <div>
                  <h1 className="font-serif text-[clamp(20px,3vw,26px)] font-semibold text-[#2F2622]">
                    {ACCOUNT_TYPES.find(t=>t.val===accType)?.label} Hesabı
                  </h1>
                  <p className="text-xs text-[#7A7368]">Bilgilerini gir, hemen başla</p>
                </div>
              </div>

              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[12px] px-4 py-3 mb-4">{error}</div>}

              <button onClick={handleGoogle} disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white border-[1.5px] border-[rgba(196,169,107,.25)] rounded-[14px] px-4 py-3 text-sm font-medium text-[#5C4A32] mb-5 hover:border-[#8B7355] hover:shadow-md transition-all disabled:opacity-60">
                {loading?<div className="w-5 h-5 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/>:G}
                Google ile Kayıt Ol
              </button>

              <div className="flex items-center gap-3 mb-5 text-[#9A9188] text-xs">
                <span className="flex-1 h-px bg-[#E3D9C6]"/>veya e-posta ile<span className="flex-1 h-px bg-[#E3D9C6]"/>
              </div>

              <form onSubmit={handleRegister} noValidate>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Ad *</label>
                    <input value={name} onChange={e=>setName(e.target.value)} placeholder="Ahmet" required
                      className="w-full px-[14px] py-3 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Soyad</label>
                    <input value={surname} onChange={e=>setSurname(e.target.value)} placeholder="Yılmaz"
                      className="w-full px-[14px] py-3 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">E-posta *</label>
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="siz@email.com" required autoComplete="email"
                    className="w-full px-[14px] py-3 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
                </div>
                <div className="mb-4">
                  <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Şifre *</label>
                  <div className="relative">
                    <input type={show?'text':'password'} value={pw} onChange={e=>setPw(e.target.value)} placeholder="En az 6 karakter" required autoComplete="new-password"
                      className="w-full px-[14px] py-3 pr-11 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
                    <button type="button" onClick={()=>setShow(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7368] text-sm">{show?'🙈':'👁'}</button>
                  </div>
                </div>
                <label className="flex items-start gap-3 cursor-pointer mb-5">
                  <input type="checkbox" checked={kvkk} onChange={e=>setKvkk(e.target.checked)} className="w-4 h-4 accent-[#C9832E] mt-[3px] flex-shrink-0"/>
                  <span className="text-xs text-[#7A7368] leading-relaxed">
                    <Link href="/kvkk" className="text-[#C9832E] hover:underline">KVKK Aydınlatma Metni</Link>'ni ve{' '}
                    <Link href="/kullanim" className="text-[#C9832E] hover:underline">Kullanım Koşulları</Link>'nı okudum, kabul ediyorum.
                  </span>
                </label>
                <button type="submit" disabled={loading}
                  className="w-full py-[13px] rounded-[14px] bg-[#C9832E] text-white text-[15px] font-semibold hover:bg-[#b87523] transition-all disabled:opacity-60">
                  {loading?'Kayıt yapılıyor…':'Hesap Oluştur →'}
                </button>
              </form>
              <p className="text-center text-[13px] text-[#7A7368] mt-5">
                Zaten üye misiniz? <Link href="/giris" className="text-[#C9832E] font-medium hover:underline">Giriş Yap</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
