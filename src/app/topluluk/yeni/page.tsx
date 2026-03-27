'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { onAuthChange } from '@/lib/auth';
import { useEffect } from 'react';
import { createCommunity } from '@/lib/community';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import type { User } from 'firebase/auth';

export default function YeniToplulukPage() {
  const router  = useRouter();
  const [user,    setUser]    = useState<User|null>(null);
  const [name,    setName]    = useState('');
  const [desc,    setDesc]    = useState('');
  const [cat,     setCat]     = useState<'dog'|'cat'|'bird'|'rabbit'|'other'>('dog');
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

  function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setCover(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError('');
    if (!name || !desc) { setError('Ad ve açıklama zorunlu.'); return; }
    if (!user) return;
    setSaving(true);
    try {
      let coverUrl = '';
      if (cover) {
        const storageRef = ref(storage, `communities/${slugify(name)}_${Date.now()}.${cover.name.split('.').pop()}`);
        await uploadBytes(storageRef, cover);
        coverUrl = await getDownloadURL(storageRef);
      }
      await createCommunity({
        name, slug: slugify(name), description: desc,
        emoji, category: cat, coverUrl,
        createdBy: user.uid, isDefault: false,
      });
      setSuccess(true);
    } catch(err: any) {
      setError('Hata: ' + err.message);
    } finally { setSaving(false); }
  }

  if (success) return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center pt-[68px]">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-serif text-3xl font-semibold text-[#2F2622] mb-3">Topluluk Oluşturuldu!</h2>
          <p className="text-[#7A7368] mb-6 leading-relaxed">Topluluğunuz admin incelemesine alındı. Onaylandıktan sonra yayına girecek.</p>
          <Link href="/topluluk" className="inline-flex bg-[#C9832E] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#b87523] transition-colors">
            Topluluklara Dön
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
          <Link href="/topluluk" className="text-sm text-[#7A7368] hover:text-[#2F2622] transition-colors mb-6 inline-flex items-center gap-1">
            ← Topluluklara Dön
          </Link>

          <div className="bg-white rounded-[24px] border border-[rgba(201,131,46,.1)] p-8 shadow-[0_8px_32px_rgba(92,74,50,.07)]">
            <h1 className="font-serif text-2xl font-semibold text-[#2F2622] mb-1">Yeni Topluluk Kur 🐾</h1>
            <p className="text-sm text-[#7A7368] mb-6">Admin onayından sonra yayına girecektir.</p>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[12px] px-4 py-3 mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Kapak fotoğrafı */}
              <div className="mb-5">
                <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-2">Kapak Fotoğrafı</label>
                <div onClick={() => fileRef.current?.click()}
                  className="w-full h-40 rounded-[16px] border-2 border-dashed border-[#E3D9C6] flex items-center justify-center cursor-pointer hover:border-[#C9832E] hover:bg-[#F5EDD4] transition-all overflow-hidden relative">
                  {preview
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={preview} alt="" className="w-full h-full object-cover"/>
                    : <div className="text-center"><div className="text-3xl mb-2">📷</div><div className="text-sm text-[#7A7368]">Fotoğraf seç</div></div>
                  }
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCover}/>
              </div>

              {/* Ad */}
              <div className="mb-3">
                <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Topluluk Adı *</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="örn: Beagle Sahipleri" required
                  className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
                {name && <div className="text-[11px] text-[#9A9188] mt-1">URL: /topluluk/{slugify(name)}</div>}
              </div>

              {/* Açıklama */}
              <div className="mb-3">
                <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Açıklama *</label>
                <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Bu topluluk hakkında kısa bir açıklama yazın…" rows={3} required
                  className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all resize-none"/>
              </div>

              {/* Kategori */}
              <div className="mb-3">
                <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-2">Kategori</label>
                <div className="grid grid-cols-5 gap-2">
                  {[{val:'dog',l:'🐕 Köpek'},{val:'cat',l:'🐱 Kedi'},{val:'bird',l:'🦜 Kuş'},{val:'rabbit',l:'🐰 Tavşan'},{val:'other',l:'🐾 Diğer'}].map(c=>(
                    <button key={c.val} type="button" onClick={()=>setCat(c.val as any)}
                      className={`py-2 rounded-[10px] text-xs font-medium border-[1.5px] transition-all ${cat===c.val?'border-[#C9832E] bg-[rgba(201,131,46,.06)] text-[#C9832E]':'border-[#E3D9C6] text-[#5C4A32] hover:border-[#8B7355]'}`}>
                      {c.l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Emoji */}
              <div className="mb-6">
                <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-2">Emoji</label>
                <div className="flex flex-wrap gap-2">
                  {['🐕','🐶','🐱','🐈','🦜','🐰','🐹','🐢','🐟','🐾','💬','🏠'].map(e=>(
                    <button key={e} type="button" onClick={()=>setEmoji(e)}
                      className={`w-10 h-10 rounded-[10px] text-xl border-[1.5px] transition-all ${emoji===e?'border-[#C9832E] bg-[rgba(201,131,46,.1)]':'border-[#E3D9C6] hover:border-[#8B7355]'}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[rgba(201,131,46,.06)] border border-[rgba(201,131,46,.2)] rounded-[12px] px-4 py-3 mb-5 text-sm text-[#8B7355]">
                ℹ️ Topluluğunuz admin tarafından incelendikten sonra yayına girecektir.
              </div>

              <button type="submit" disabled={saving}
                className="w-full py-[13px] rounded-[14px] bg-[#5C4A32] text-white text-[15px] font-medium hover:bg-[#2F2622] transition-all disabled:opacity-60">
                {saving ? 'Gönderiliyor…' : 'Topluluk Oluştur →'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
