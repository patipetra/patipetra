'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { onAuthChange } from '@/lib/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { User } from 'firebase/auth';

const CATS = [
  {val:'dog',    label:'Köpek', emoji:'🐶'},
  {val:'cat',    label:'Kedi',  emoji:'🐱'},
  {val:'bird',   label:'Kuş',   emoji:'🐦'},
  {val:'rabbit', label:'Tavşan',emoji:'🐰'},
  {val:'other',  label:'Diğer', emoji:'🐾'},
];

const EMOJIS = ['🐾','🐶','🐱','🐦','🐰','🐹','🐢','🐟','🦜','🦮','🐕','🐈','😺','🐕‍🦺','💬','🌟','❤️','🏡'];

export default function YeniToplulukPage() {
  const router = useRouter();
  const [user,    setUser]    = useState<User|null>(null);
  const [name,    setName]    = useState('');
  const [desc,    setDesc]    = useState('');
  const [cat,     setCat]     = useState('dog');
  const [emoji,   setEmoji]   = useState('🐾');
  const [cover,   setCover]   = useState<File|null>(null);
  const [preview, setPreview] = useState('');
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = onAuthChange(u => {
      if (!u) { router.push('/giris?redirect=/topluluk/yeni'); return; }
      setUser(u);
    });
    return () => unsub();
  }, [router]);

  function slugify(text: string): string {
    return text.toLowerCase()
      .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
      .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
      .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!name.trim() || !desc.trim()) { setError('Ad ve açıklama zorunlu.'); return; }
    if (name.trim().length < 3) { setError('Topluluk adı en az 3 karakter olmalı.'); return; }
    if (!user) return;
    setSaving(true);
    try {
      let coverUrl = '';
      if (cover) {
        const storageRef = ref(storage, `communities/${slugify(name)}_${Date.now()}.${cover.name.split('.').pop()}`);
        await uploadBytes(storageRef, cover);
        coverUrl = await getDownloadURL(storageRef);
      }

      const slug = `${slugify(name)}-${Date.now().toString().slice(-4)}`;

      // Firestore'a kaydet - status: pending
      await addDoc(collection(db,'communities'), {
        name:        name.trim(),
        slug,
        description: desc.trim(),
        category:    cat,
        emoji,
        coverUrl,
        isDefault:   false,
        status:      'pending',
        createdBy:   user.uid,
        creatorName: user.displayName || user.email?.split('@')[0] || 'Kullanıcı',
        creatorEmail:user.email || '',
        memberCount: 0,
        postCount:   0,
        createdAt:   serverTimestamp(),
      });

      // Admin'e mail gönder
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'community_request',
          data: {
            communityName: name.trim(),
            description:   desc.trim(),
            category:      cat,
            creatorName:   user.displayName || user.email?.split('@')[0],
            creatorEmail:  user.email,
          }
        })
      }).catch(console.error);

      setSuccess(true);
    } catch(err:any) {
      setError('Hata: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  if (success) return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center pt-[68px]">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-serif text-3xl font-semibold text-[#2F2622] mb-3">Başvurunuz Alındı!</h2>
          <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5 text-left mb-5">
            <h3 className="font-semibold text-[#2F2622] mb-3">Süreç:</h3>
            <div className="space-y-2">
              {[
                {n:1, t:'İnceleme',    d:'Ekibimiz başvurunuzu inceler (1-2 iş günü)'},
                {n:2, t:'Onay',        d:'Onaylanırsa topluluklar listesine eklenir'},
                {n:3, t:'Bildirim',    d:'Sonuç e-posta ile bildirilir'},
              ].map(s=>(
                <div key={s.n} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#C9832E] text-white text-xs flex items-center justify-center flex-shrink-0">{s.n}</div>
                  <div>
                    <div className="font-semibold text-sm text-[#2F2622]">{s.t}</div>
                    <div className="text-xs text-[#7A7368]">{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Link href="/topluluk" className="inline-flex bg-[#C9832E] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#b87523]">
            Topluluklara Dön →
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#F7F2EA] pt-[108px] pb-20">
        <div className="max-w-[600px] mx-auto px-4">
          <Link href="/topluluk" className="text-sm text-[#7A7368] hover:text-[#2F2622] mb-6 inline-flex items-center gap-1">← Topluluklara Dön</Link>
          <h1 className="font-serif text-2xl font-semibold text-[#2F2622] mb-1">Yeni Topluluk Kur 🐾</h1>
          <p className="text-sm text-[#7A7368] mb-6">Başvurunuz admin onayından sonra yayına girer.</p>

          {/* Durum bilgisi */}
          <div className="bg-[rgba(201,131,46,.08)] border border-[rgba(201,131,46,.2)] rounded-[14px] px-4 py-3 mb-5 text-sm text-[#8B7355]">
            ℹ️ Topluluk başvuruları admin incelemesinden geçer. Onay süreci 1-2 iş günü sürer.
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[12px] px-4 py-3 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6 space-y-4">
            {/* Cover */}
            <div>
              <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-2">Kapak Fotoğrafı</label>
              <div onClick={()=>fileRef.current?.click()}
                className="w-full h-32 rounded-[14px] border-2 border-dashed border-[#E3D9C6] hover:border-[#C9832E] overflow-hidden flex items-center justify-center cursor-pointer transition-all bg-[#F7F2EA]">
                {preview
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={preview} alt="" className="w-full h-full object-cover"/>
                  : <div className="text-center"><div className="text-3xl mb-1">📷</div><div className="text-xs text-[#9A9188]">Fotoğraf ekle</div></div>
                }
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={e=>{const f=e.target.files?.[0];if(f){setCover(f);setPreview(URL.createObjectURL(f))}}}/>
            </div>

            {/* Emoji */}
            <div>
              <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-2">Emoji</label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map(em=>(
                  <button key={em} type="button" onClick={()=>setEmoji(em)}
                    className={`text-2xl w-10 h-10 rounded-[10px] transition-all ${emoji===em?'bg-[rgba(201,131,46,.15)] border-2 border-[#C9832E]':'hover:bg-[#F7F2EA]'}`}>
                    {em}
                  </button>
                ))}
              </div>
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-2">Kategori</label>
              <div className="flex flex-wrap gap-2">
                {CATS.map(c=>(
                  <button key={c.val} type="button" onClick={()=>setCat(c.val)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-[1.5px] transition-all ${cat===c.val?'bg-[#5C4A32] text-white border-[#5C4A32]':'border-[#E3D9C6] text-[#5C4A32] hover:border-[#8B7355]'}`}>
                    {c.emoji} {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ad */}
            <div>
              <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Topluluk Adı *</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Örn: Ankara Kedi Sahipleri" required maxLength={50}
                className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
              <div className="text-[11px] text-[#9A9188] mt-1">{name.length}/50</div>
            </div>

            {/* Açıklama */}
            <div>
              <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Açıklama *</label>
              <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Topluluğunuz hakkında kısa bir açıklama…" rows={3} required maxLength={200}
                className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all resize-none"/>
              <div className="text-[11px] text-[#9A9188] mt-1">{desc.length}/200</div>
            </div>

            <button type="submit" disabled={saving||!name.trim()||!desc.trim()}
              className="w-full py-[13px] rounded-[14px] bg-[#C9832E] text-white text-[15px] font-semibold hover:bg-[#b87523] transition-all disabled:opacity-60">
              {saving?'Gönderiliyor…':'Başvuruyu Gönder 🐾'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
