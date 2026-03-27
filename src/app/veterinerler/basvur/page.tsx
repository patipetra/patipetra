'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { onAuthChange } from '@/lib/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { CITIES_81 } from '@/data/cities';
import type { User } from 'firebase/auth';

const SPECS = ['Dahiliye','Cerrahi','Dermatoloji','Ortopedi','Onkoloji','Diş','Beslenme','Radyoloji','Göz','Nöroloji','Kardiyoloji','Genel Pratik'];

export default function VetBasvurPage() {
  const router = useRouter();
  const [user,    setUser]    = useState<User|null>(null);
  const [loading, setLoading] = useState(true);
  const [step,    setStep]    = useState(1);
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState('');

  const [title,       setTitle]       = useState('Dr.');
  const [name,        setName]        = useState('');
  const [clinicName,  setClinicName]  = useState('');
  const [taxNo,       setTaxNo]       = useState('');
  const [taxOffice,   setTaxOffice]   = useState('');
  const [tcNo,        setTcNo]        = useState('');
  const [city,        setCity]        = useState('');
  const [district,    setDistrict]    = useState('');
  const [address,     setAddress]     = useState('');
  const [phone,       setPhone]       = useState('');
  const [email,       setEmail]       = useState('');
  const [website,     setWebsite]     = useState('');
  const [instagram,   setInstagram]   = useState('');
  const [education,   setEducation]   = useState('');
  const [gradYear,    setGradYear]    = useState('');
  const [experience,  setExperience]  = useState('');
  const [specs,       setSpecs]       = useState<string[]>([]);
  const [bio,         setBio]         = useState('');
  const [workHours,   setWorkHours]   = useState('Hafta içi 09:00-18:00');
  const [planType,    setPlanType]    = useState<'monthly'|'yearly'>('monthly');
  const [diplomaFile, setDiplomaFile] = useState<File|null>(null);
  const [avatarFile,  setAvatarFile]  = useState<File|null>(null);
  const [avatarPreview,setAvatarPreview] = useState('');
  const [agreed,      setAgreed]      = useState(false);

  const diplomaRef = useRef<HTMLInputElement>(null);
  const avatarRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = onAuthChange(u => {
      if (!u) { router.push('/giris?redirect=/veterinerler/basvur'); return; }
      setUser(u);
      setEmail(u.email||'');
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  function toggleSpec(s: string) {
    setSpecs(prev => prev.includes(s) ? prev.filter(x=>x!==s) : [...prev,s]);
  }

  function slugify(text: string): string {
    return text.toLowerCase()
      .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
      .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
      .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) { setError('Koşulları kabul etmeniz gerekiyor.'); return; }
    if (!name||!clinicName||!city||!phone||!education||!tcNo) {
      setError('Zorunlu alanları doldurun.'); return;
    }
    if (specs.length===0) { setError('En az bir uzmanlık alanı seçin.'); return; }
    if (!user) return;
    setSaving(true); setError('');
    try {
      let diplomaUrl = '';
      let avatarUrl  = '';
      if (diplomaFile) {
        const r = ref(storage,`vetApplications/${user.uid}/diploma.${diplomaFile.name.split('.').pop()}`);
        await uploadBytes(r,diplomaFile);
        diplomaUrl = await getDownloadURL(r);
      }
      if (avatarFile) {
        const r = ref(storage,`vetApplications/${user.uid}/avatar.${avatarFile.name.split('.').pop()}`);
        await uploadBytes(r,avatarFile);
        avatarUrl = await getDownloadURL(r);
      }
      const slug = `${slugify(title+'-'+name)}-${Date.now().toString().slice(-4)}`;
      await addDoc(collection(db,'vetApplications'), {
        userId:user.uid, userEmail:user.email, status:'pending',
        title, name, fullName:`${title} ${name}`, slug,
        clinicName, taxNo, taxOffice, tcNo,
        city, district, address, phone, email, website, instagram,
        education, gradYear, experience, specs, bio, workHours,
        planType, diplomaUrl, avatarUrl,
        adminNotes:'', meetingDate:'',
        contractSentAt:null, approvedAt:null,
        createdAt:serverTimestamp(), updatedAt:serverTimestamp(),
      });
      // Admin'e bildirim maili gönder
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'vet_application',
          data: {
            fullName: `${title} ${name}`,
            clinicName, city, district, phone, email,
            tcNo, taxNo, education, experience,
            specs, bio, planType,
          }
        })
      });
      setSuccess(true);
    } catch(err:any) { setError('Hata: '+err.message); }
    finally { setSaving(false); }
  }

  if (loading) return (<><Navbar/><div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center pt-[68px]"><div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div></>);

  if (success) return (
    <><Navbar/>
    <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center pt-[68px]">
      <div className="text-center p-8 max-w-lg">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="font-serif text-3xl font-semibold text-[#2F2622] mb-3">Başvurunuz Alındı!</h2>
        <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6 text-left mb-6">
          <h3 className="font-semibold text-[#2F2622] mb-3">Sonraki Adımlar:</h3>
          <div className="space-y-3">
            {[
              {n:1,t:'İnceleme',d:'Ekibimiz başvurunuzu 2 iş günü içinde inceler.'},
              {n:2,t:'Canlı Görüşme',d:'Uygun görüldüğünüzde görüntülü görüşme için davet edilirsiniz.'},
              {n:3,t:'Sözleşme',d:'Dijital sözleşme e-posta ile gönderilir, onaylamanız beklenir.'},
              {n:4,t:'Ödeme & Aktivasyon',d:'Ödeme sonrası profiliniz yayına girer.'},
            ].map(s=>(
              <div key={s.n} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#C9832E] text-white text-xs flex items-center justify-center flex-shrink-0 mt-[2px]">{s.n}</div>
                <div><div className="font-semibold text-sm text-[#2F2622]">{s.t}</div><div className="text-xs text-[#7A7368]">{s.d}</div></div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-[#7A7368] mb-6">Gelişmeler <strong className="text-[#5C4A32]">{email}</strong> adresine bildirilecek.</p>
        <Link href="/" className="inline-flex bg-[#C9832E] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#b87523] transition-colors">Ana Sayfaya Dön</Link>
      </div>
    </div>
    <Footer/></>
  );

  const INPUT = "w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all";
  const LABEL = "block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1";

  return (
    <><Navbar/>
    <main className="min-h-screen bg-[#F7F2EA] pt-[108px] pb-20">
      <div className="max-w-[700px] mx-auto px-4">
        <Link href="/veterinerler" className="text-sm text-[#7A7368] hover:text-[#2F2622] mb-6 inline-flex items-center gap-1">← Veterinerlere Dön</Link>
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-semibold text-[#2F2622] mb-1">Veteriner Başvurusu 🩺</h1>
          <p className="text-sm text-[#7A7368]">Başvurunuz incelendikten sonra canlı görüşme ve sözleşme süreci başlar.</p>
        </div>

        {/* Adım göstergesi */}
        <div className="flex items-center gap-2 mb-6">
          {[1,2,3].map(s=>(
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step>=s?'bg-[#5C4A32] text-white':'bg-[#EDE5D3] text-[#9A9188]'}`}>{s}</div>
              {s<3&&<div className={`h-[2px] w-16 rounded transition-all ${step>s?'bg-[#5C4A32]':'bg-[#E3D9C6]'}`}/>}
            </div>
          ))}
          <div className="ml-2 text-xs text-[#7A7368]">{step===1?'Kişisel & Klinik':step===2?'Mesleki Bilgiler':'Plan & Belgeler'}</div>
        </div>

        {error&&<div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[12px] px-4 py-3 mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* ADIM 1 */}
          {step===1&&(
            <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6 space-y-4">
              <h3 className="font-semibold text-[#2F2622]">Kişisel & Klinik Bilgiler</h3>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div onClick={()=>avatarRef.current?.click()} className="w-20 h-20 rounded-full border-2 border-dashed border-[#E3D9C6] flex items-center justify-center cursor-pointer hover:border-[#C9832E] overflow-hidden flex-shrink-0">
                  {avatarPreview?<img src={avatarPreview} alt="" className="w-full h-full object-cover"/>:<span className="text-3xl">🩺</span>}
                </div>
                <div>
                  <button type="button" onClick={()=>avatarRef.current?.click()} className="text-sm text-[#C9832E] hover:underline">Profil Fotoğrafı Ekle</button>
                  <p className="text-[11px] text-[#9A9188] mt-1">JPG veya PNG, max 5MB</p>
                </div>
                <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f){setAvatarFile(f);setAvatarPreview(URL.createObjectURL(f))}}}/>
              </div>

              <div className="grid grid-cols-[90px_1fr] gap-3">
                <div>
                  <label className={LABEL}>Unvan</label>
                  <select value={title} onChange={e=>setTitle(e.target.value)} className={INPUT}>
                    <option>Dr.</option><option>Prof. Dr.</option><option>Doç. Dr.</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Ad Soyad *</label>
                  <input value={name} onChange={e=>setName(e.target.value)} placeholder="Ahmet Yılmaz" required className={INPUT}/>
                </div>
              </div>

              <div>
                <label className={LABEL}>T.C. Kimlik No *</label>
                <input value={tcNo} onChange={e=>setTcNo(e.target.value)} placeholder="12345678901" maxLength={11} required className={INPUT}/>
              </div>

              <div>
                <label className={LABEL}>Klinik / Muayenehane Adı *</label>
                <input value={clinicName} onChange={e=>setClinicName(e.target.value)} placeholder="PetLife Veteriner Kliniği" required className={INPUT}/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>Vergi No</label>
                  <input value={taxNo} onChange={e=>setTaxNo(e.target.value)} placeholder="1234567890" className={INPUT}/>
                </div>
                <div>
                  <label className={LABEL}>Vergi Dairesi</label>
                  <input value={taxOffice} onChange={e=>setTaxOffice(e.target.value)} placeholder="Çankaya" className={INPUT}/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>Şehir *</label>
                  <select value={city} onChange={e=>setCity(e.target.value)} required className={INPUT}>
                    <option value="">Seçin…</option>
                    {CITIES_81.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL}>İlçe</label>
                  <input value={district} onChange={e=>setDistrict(e.target.value)} placeholder="Çankaya" className={INPUT}/>
                </div>
              </div>

              <div>
                <label className={LABEL}>Adres</label>
                <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Tam adres" className={INPUT}/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>Telefon *</label>
                  <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="05XX XXX XX XX" required className={INPUT}/>
                </div>
                <div>
                  <label className={LABEL}>E-posta *</label>
                  <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required className={INPUT}/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>Website</label>
                  <input value={website} onChange={e=>setWebsite(e.target.value)} placeholder="https://…" className={INPUT}/>
                </div>
                <div>
                  <label className={LABEL}>Instagram</label>
                  <input value={instagram} onChange={e=>setInstagram(e.target.value)} placeholder="@kullanici" className={INPUT}/>
                </div>
              </div>

              <div>
                <label className={LABEL}>Çalışma Saatleri</label>
                <input value={workHours} onChange={e=>setWorkHours(e.target.value)} className={INPUT}/>
              </div>

              <button type="button" onClick={()=>{if(!name||!clinicName||!city||!phone||!tcNo){setError('Zorunlu alanları doldurun.');return;}setError('');setStep(2);}}
                className="w-full py-[13px] rounded-[14px] bg-[#5C4A32] text-white text-[15px] font-medium hover:bg-[#2F2622] transition-all">
                Devam Et →
              </button>
            </div>
          )}

          {/* ADIM 2 */}
          {step===2&&(
            <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6 space-y-4">
              <h3 className="font-semibold text-[#2F2622]">Mesleki Bilgiler</h3>

              <div>
                <label className={LABEL}>Mezun Olunan Üniversite *</label>
                <input value={education} onChange={e=>setEducation(e.target.value)} placeholder="Ankara Üniversitesi Veteriner Fakültesi" required className={INPUT}/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>Mezuniyet Yılı</label>
                  <input value={gradYear} onChange={e=>setGradYear(e.target.value)} placeholder="2010" className={INPUT}/>
                </div>
                <div>
                  <label className={LABEL}>Deneyim (yıl)</label>
                  <input value={experience} onChange={e=>setExperience(e.target.value)} placeholder="10" className={INPUT}/>
                </div>
              </div>

              <div>
                <label className={LABEL}>Uzmanlık Alanları * (en az 1)</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {SPECS.map(s=>(
                    <button key={s} type="button" onClick={()=>toggleSpec(s)}
                      className={`text-sm px-3 py-[6px] rounded-full border-[1.5px] transition-all ${specs.includes(s)?'bg-[#5C4A32] text-white border-[#5C4A32]':'border-[#E3D9C6] text-[#5C4A32] hover:border-[#8B7355]'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={LABEL}>Hakkınızda</label>
                <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Kendinizi ve uzmanlığınızı kısaca tanıtın…" rows={4} className={`${INPUT} resize-none`}/>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={()=>setStep(1)} className="flex-1 py-[13px] rounded-[14px] border border-[#8B7355] text-[#5C4A32] text-[15px] font-medium hover:bg-[#5C4A32] hover:text-white transition-all">← Geri</button>
                <button type="button" onClick={()=>{if(specs.length===0){setError('Uzmanlık alanı seçin.');return;}if(!education){setError('Üniversite bilgisi girin.');return;}setError('');setStep(3);}} className="flex-1 py-[13px] rounded-[14px] bg-[#5C4A32] text-white text-[15px] font-medium hover:bg-[#2F2622] transition-all">Devam Et →</button>
              </div>
            </div>
          )}

          {/* ADIM 3 */}
          {step===3&&(
            <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6 space-y-5">
              <h3 className="font-semibold text-[#2F2622]">Plan & Belgeler</h3>

              <div>
                <label className={LABEL}>Üyelik Planı</label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  {[
                    {val:'monthly',title:'Aylık Plan',   price:'₺599/ay',    desc:'Esnek, her ay yenilenebilir'},
                    {val:'yearly', title:'Yıllık Plan',  price:'₺5.990/yıl', desc:'%17 indirim + öncelikli listeleme'},
                  ].map(p=>(
                    <button key={p.val} type="button" onClick={()=>setPlanType(p.val as any)}
                      className={`p-4 rounded-[16px] border-[1.5px] text-left transition-all ${planType===p.val?'border-[#C9832E] bg-[rgba(201,131,46,.05)]':'border-[#E3D9C6] hover:border-[#8B7355]'}`}>
                      <div className="font-semibold text-[#2F2622] mb-1">{p.title}</div>
                      <div className={`font-serif text-xl font-semibold mb-1 ${planType===p.val?'text-[#C9832E]':'text-[#5C4A32]'}`}>{p.price}</div>
                      <div className="text-xs text-[#7A7368]">{p.desc}</div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[#9A9188] mt-2">💳 Ödeme bilgileri sözleşme onayı sonrasında iletilecektir.</p>
              </div>

              <div>
                <label className={LABEL}>Diploma / Veterinerlik Belgesi *</label>
                <div onClick={()=>diplomaRef.current?.click()} className="border-2 border-dashed border-[#E3D9C6] rounded-[14px] p-4 flex items-center gap-3 cursor-pointer hover:border-[#C9832E] hover:bg-[#F5EDD4] transition-all">
                  <span className="text-2xl">{diplomaFile?'✅':'📄'}</span>
                  <div>
                    <div className="text-sm font-medium text-[#5C4A32]">{diplomaFile?diplomaFile.name:'Diploma yükle'}</div>
                    <div className="text-[11px] text-[#9A9188]">PDF, JPG veya PNG, max 10MB</div>
                  </div>
                </div>
                <input ref={diplomaRef} type="file" accept=".pdf,image/*" className="hidden" onChange={e=>setDiplomaFile(e.target.files?.[0]||null)}/>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} className="w-5 h-5 accent-[#C9832E] mt-[2px] flex-shrink-0"/>
                <span className="text-sm text-[#5C4A32] leading-relaxed">
                  Başvurum onaylandıktan sonra platform ile sözleşme imzalamayı, ücretleri ödemeyi ve platform kurallarına uymayı kabul ediyorum.
                  <Link href="/kullanim" className="text-[#C9832E] hover:underline ml-1">Kullanım Koşulları</Link>
                </span>
              </label>

              <div className="bg-[rgba(201,131,46,.06)] border border-[rgba(201,131,46,.2)] rounded-[12px] px-4 py-3 text-sm text-[#8B7355]">
                ℹ️ Başvurunuz 2 iş günü içinde incelenir. Uygun görülürse görüntülü görüşme için davet edilirsiniz.
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={()=>setStep(2)} className="flex-1 py-[13px] rounded-[14px] border border-[#8B7355] text-[#5C4A32] text-[15px] font-medium hover:bg-[#5C4A32] hover:text-white transition-all">← Geri</button>
                <button type="submit" disabled={saving||!agreed} className="flex-1 py-[13px] rounded-[14px] bg-[#C9832E] text-white text-[15px] font-medium hover:bg-[#b87523] transition-all disabled:opacity-60">
                  {saving?'Gönderiliyor…':'Başvuruyu Gönder 🩺'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
    <Footer/></>
  );
}
