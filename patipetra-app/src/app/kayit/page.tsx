'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerWithEmail, loginWithGoogle } from '@/lib/auth';
import Logo from '@/components/layout/Logo';

const G = <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>;

export default function KayitPage() {
  const router = useRouter();
  const [name,setName]=useState('');
  const [surname,setSurname]=useState('');
  const [email,setEmail]=useState('');
  const [pw,setPw]=useState('');
  const [show,setShow]=useState(false);
  const [kvkk,setKvkk]=useState(false);
  const [terms,setTerms]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [success,setSuccess]=useState(false);

  function pwStr(v:string):number {
    let s=0;
    if(v.length>=8)s++;
    if(/[A-Z]/.test(v)||/\d/.test(v))s++;
    if(/[^a-zA-Z0-9]/.test(v)||v.length>=12)s++;
    return s;
  }
  const str=pwStr(pw);

  async function handleRegister(e:React.FormEvent) {
    e.preventDefault(); setError('');
    if(!name||!email||!pw){setError('Ad, e-posta ve şifre zorunlu.');return;}
    if(pw.length<8){setError('Şifre en az 8 karakter olmalı.');return;}
    if(!kvkk||!terms){setError('KVKK ve Kullanım Koşullarını kabul edin.');return;}
    setLoading(true);
    try { await registerWithEmail(email,pw,name,surname); setSuccess(true); setTimeout(()=>router.push('/panel'),1500); }
    catch(err:any) {
      const m:Record<string,string>={'auth/email-already-in-use':'Bu e-posta zaten kullanımda.','auth/weak-password':'Şifre çok zayıf.'};
      setError(m[err.code]||'Kayıt başarısız.');
    } finally { setLoading(false); }
  }

  if(success) return (
    <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="font-serif text-3xl font-semibold text-[#2F2622] mb-2">Hoş geldiniz!</h2>
        <p className="text-[#7A7368] mb-6">Hesabınız oluşturuldu. Dashboard'a yönlendiriliyorsunuz…</p>
        <div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin mx-auto"/>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-[480px]">
        <div className="text-center mb-8"><Link href="/"><Logo height={44}/></Link></div>
        <div className="bg-white rounded-[24px] border border-[rgba(201,131,46,.1)] p-8 shadow-[0_8px_32px_rgba(92,74,50,.07)]">
          <h1 className="font-serif text-[clamp(22px,4vw,30px)] font-semibold text-[#2F2622] mb-1">Ücretsiz üye ol 🐾</h1>
          <p className="text-sm text-[#7A7368] mb-6">Hesap oluşturun, petlerinizi kaydedin.</p>

          <button onClick={async()=>{setError('');setLoading(true);try{await loginWithGoogle();router.push('/panel');}catch{setError('Google ile kayıt başarısız.');}finally{setLoading(false);}}} disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-[#F7F2EA] border-[1.5px] border-[rgba(196,169,107,.25)] rounded-[14px] px-4 py-3 text-sm font-medium text-[#5C4A32] mb-5 hover:border-[#8B7355] transition-all disabled:opacity-60">
            {G} Google ile Kayıt Ol
          </button>
          <div className="flex items-center gap-3 mb-5 text-[#9A9188] text-xs"><span className="flex-1 h-px bg-[#E3D9C6]"/>veya e-posta ile<span className="flex-1 h-px bg-[#E3D9C6]"/></div>
          {error&&<div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[12px] px-4 py-3 mb-4">{error}</div>}

          <form onSubmit={handleRegister} noValidate>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {[{id:'r-name',label:'Ad',val:name,set:setName,ph:'Ahmet',ac:'given-name'},{id:'r-sur',label:'Soyad',val:surname,set:setSurname,ph:'Yılmaz',ac:'family-name'}].map(f=>(
                <div key={f.id}>
                  <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1" htmlFor={f.id}>{f.label}</label>
                  <input id={f.id} type="text" value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} autoComplete={f.ac}
                    className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm placeholder-[#9A9188] focus:outline-none focus:border-[#C9832E] focus:shadow-[0_0_0_3px_rgba(201,131,46,.1)] transition-all"/>
                </div>
              ))}
            </div>
            <div className="mb-3">
              <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1" htmlFor="r-email">E-posta</label>
              <input id="r-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="siz@email.com" required autoComplete="email"
                className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm placeholder-[#9A9188] focus:outline-none focus:border-[#C9832E] focus:shadow-[0_0_0_3px_rgba(201,131,46,.1)] transition-all"/>
            </div>
            <div className="mb-4">
              <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1" htmlFor="r-pw">Şifre</label>
              <div className="relative">
                <input id="r-pw" type={show?'text':'password'} value={pw} onChange={e=>setPw(e.target.value)} placeholder="En az 8 karakter" required autoComplete="new-password"
                  className="w-full px-3 py-[11px] pr-10 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm placeholder-[#9A9188] focus:outline-none focus:border-[#C9832E] focus:shadow-[0_0_0_3px_rgba(201,131,46,.1)] transition-all"/>
                <button type="button" onClick={()=>setShow(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7368] text-sm">{show?'🙈':'👁'}</button>
              </div>
              {pw&&(
                <div className="flex items-center gap-1 mt-2">
                  {[0,1,2].map(i=><div key={i} className={`flex-1 h-[3px] rounded transition-all ${i<str?['bg-red-400','bg-[#C9832E]','bg-[#6B7C5C]'][str-1]||'bg-[#E3D9C6]':'bg-[#E3D9C6]'}`}/>)}
                  <span className="text-[10px] text-[#7A7368] ml-1">{['','Zayıf','Orta','Güçlü'][str]}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3 mb-5">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={kvkk} onChange={e=>setKvkk(e.target.checked)} required className="mt-[2px] w-4 h-4 accent-[#C9832E]"/>
                <span className="text-[13px] text-[#7A7368] leading-relaxed"><Link href="/kvkk" target="_blank" className="text-[#C9832E] underline">KVKK Aydınlatma Metni</Link>'ni okudum ve kabul ediyorum.</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={terms} onChange={e=>setTerms(e.target.checked)} required className="mt-[2px] w-4 h-4 accent-[#C9832E]"/>
                <span className="text-[13px] text-[#7A7368] leading-relaxed"><Link href="/kullanim" target="_blank" className="text-[#C9832E] underline">Kullanım Koşulları</Link>'nı kabul ediyorum.</span>
              </label>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-[13px] rounded-[14px] bg-[#5C4A32] text-white text-[15px] font-medium hover:bg-[#2F2622] hover:-translate-y-[1px] transition-all disabled:opacity-60">
              {loading?'Hesap oluşturuluyor…':'Hesap Oluştur →'}
            </button>
          </form>
          <p className="text-center text-[13px] text-[#7A7368] mt-4">
            Zaten üye misiniz? <Link href="/giris" className="text-[#C9832E] font-medium hover:underline">Giriş Yap</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
