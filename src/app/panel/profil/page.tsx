'use client';
import { useToast } from '@/components/Toast';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthChange } from '@/lib/auth';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '@/lib/firebase';
import { CITIES_81 } from '@/data/cities';
import type { User } from 'firebase/auth';

export default function ProfilPage() {
  const { success, error } = useToast();
  const router  = useRouter();
  const [user,    setUser]    = useState<User|null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [name,    setName]    = useState('');
  const [surname, setSurname] = useState('');
  const [phone,   setPhone]   = useState('');
  const [city,    setCity]    = useState('');
  const [bio,     setBio]     = useState('');
  const [avatar,  setAvatar]  = useState<File|null>(null);
  const [preview, setPreview] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = onAuthChange(async u => {
      if (!u) { router.push('/giris'); return; }
      setUser(u);
      setPreview(u.photoURL||'');
      const parts = (u.displayName||'').split(' ');
      setName(parts[0]||'');
      setSurname(parts.slice(1).join(' ')||'');
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true); setSuccess(false);
    try {
      let photoURL = user.photoURL||'';
      if (avatar) {
        const storageRef = ref(storage, `avatars/${user.uid}/profile.${avatar.name.split('.').pop()}`);
        await uploadBytes(storageRef, avatar);
        photoURL = await getDownloadURL(storageRef);
      }
      await updateProfile(auth.currentUser!, { displayName:`${name} ${surname}`.trim(), photoURL });
      await updateDoc(doc(db,'users',user.uid), { name, surname, phone, city, bio, avatarUrl:photoURL, updatedAt:new Date() });
      setSuccess(true);
    } catch(err:any) { alert('Hata: '+err.message); }
    finally { setSaving(false); }
  }

  if (loading) return <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>;

  return (
    <div className="min-h-screen bg-[#F7F2EA]">
      <div className="lg:ml-[260px] p-6 max-w-[700px]">
        <Link href="/panel" className="text-sm text-[#7A7368] hover:text-[#2F2622] mb-6 inline-flex items-center gap-1">← Kontrol Paneli</Link>
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <Link href="/" className="text-xs px-3 py-2 rounded-full bg-white border border-[rgba(196,169,107,.2)] text-[#5C4A32] hover:bg-[#F7F2EA] transition-all flex-shrink-0">🌐 Ana Sayfa</Link>
          <Link href="/panel" className="text-xs px-3 py-2 rounded-full bg-white border border-[rgba(196,169,107,.2)] text-[#5C4A32] hover:bg-[#F7F2EA] transition-all flex-shrink-0">← Kontrol Paneli</Link>
        </div>
        <h1 className="font-serif text-2xl font-semibold text-[#2F2622] mb-6">👤 Profilim</h1>

        {success&&<div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-[12px] px-4 py-3 mb-5">✓ Profil güncellendi!</div>}

        <form onSubmit={handleSave}>
          {/* Avatar */}
          <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6 mb-4">
            <div className="flex items-center gap-5">
              <div onClick={()=>fileRef.current?.click()} className="w-20 h-20 rounded-full border-2 border-dashed border-[#E3D9C6] flex items-center justify-center cursor-pointer hover:border-[#C9832E] transition-all overflow-hidden flex-shrink-0">
                {preview
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={preview} alt="" className="w-full h-full object-cover"/>
                  : <span className="text-3xl">🧑</span>
                }
              </div>
              <div>
                <button type="button" onClick={()=>fileRef.current?.click()} className="text-sm font-medium text-[#C9832E] hover:underline">Fotoğraf Değiştir</button>
                <p className="text-[11px] text-[#9A9188] mt-1">JPG veya PNG, max 5MB</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f){setAvatar(f);setPreview(URL.createObjectURL(f))}}}/>
            </div>
          </div>

          <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6 mb-4">
            <h3 className="font-semibold text-[#2F2622] mb-4">Kişisel Bilgiler</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Ad</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Ahmet" className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
              </div>
              <div>
                <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Soyad</label>
                <input value={surname} onChange={e=>setSurname(e.target.value)} placeholder="Yılmaz" className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">E-posta</label>
              <div className="px-3 py-[11px] rounded-[12px] bg-[#EDE5D3] text-sm text-[#7A7368]">{user?.email} <span className="text-[11px]">(değiştirilemez)</span></div>
            </div>
            <div className="mb-3">
              <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Telefon</label>
              <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="05XX XXX XX XX" className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
            </div>
            <div className="mb-3">
              <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Şehir</label>
              <select value={city} onChange={e=>setCity(e.target.value)} className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all">
                <option value="">Seçin…</option>
                {CITIES_81.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Hakkımda</label>
              <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Kendinizden kısaca bahsedin…" rows={3} className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all resize-none"/>
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full py-[13px] rounded-[14px] bg-[#5C4A32] text-white text-[15px] font-medium hover:bg-[#2F2622] transition-all disabled:opacity-60">
            {saving?'Kaydediliyor…':'Değişiklikleri Kaydet'}
          </button>
        </form>
      </div>
    </div>
  );
}
