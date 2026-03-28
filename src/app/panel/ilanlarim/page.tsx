'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthChange } from '@/lib/auth';
import {
  createListing, getUserListings, updateListing, deleteListing,
  uploadListingImage, approveListing,
  type Listing, type ListingType, type SpeciesType,
} from '@/lib/listings';
import { CITIES_81 } from '@/data/cities';
import type { User } from 'firebase/auth';

const SPECIES_OPTS: { val: SpeciesType; label: string }[] = [
  { val: 'cat',     label: '🐱 Kedi'     },
  { val: 'dog',     label: '🐶 Köpek'    },
  { val: 'bird',    label: '🐦 Kuş'      },
  { val: 'rabbit',  label: '🐰 Tavşan'   },
  { val: 'hamster', label: '🐹 Hamster'  },
  { val: 'turtle',  label: '🐢 Kaplumbağa'},
  { val: 'fish',    label: '🐟 Balık'    },
  { val: 'other',   label: '🐾 Diğer'    },
];

const TYPE_OPTS: { val: ListingType; label: string; desc: string }[] = [
  { val: 'adoption', label: 'Sahiplendirme',  desc: 'Kalıcı yuva arıyorum'        },
  { val: 'temp',     label: 'Geçici Yuva',    desc: 'Geçici bakım aranıyor'       },
  { val: 'lost',     label: 'Kayıp İlan',     desc: 'Hayvanımı kaybettim'         },
  { val: 'found',    label: 'Bulunan Hayvan', desc: 'Sahipsiz hayvan buldum'      },
];

const STATUS_LABEL: Record<string, string> = {
  pending:  'İncelemede',
  active:   'Aktif',
  rejected: 'Reddedildi',
  closed:   'Kapatıldı',
};
const STATUS_COLOR: Record<string, string> = {
  pending:  'bg-[rgba(201,131,46,.12)] text-[#C9832E]',
  active:   'bg-[rgba(107,124,92,.12)] text-[#6B7C5C]',
  rejected: 'bg-red-50 text-red-600',
  closed:   'bg-[#EDE5D3] text-[#7A7368]',
};

const EMPTY: Omit<Listing, 'id'|'status'|'viewCount'|'favoriteCount'|'createdAt'|'updatedAt'|'ownerId'|'ownerName'|'ownerEmail'> = {
  type: 'adoption', species: 'cat', name: '', age: '', gender: 'unknown',
  breed: '', color: '', city: '', district: '', description: '',
  imageUrls: [], isVaccinated: false, isSterilized: false,
  isMicrochipped: false, isKidFriendly: false, isPuppy: false,
  puppyCount: 0, isUrgent: false,
  contactPhone: '', contactEmail: '',
};

export default function IlanlarimPage() {
  const router  = useRouter();
  const [user,     setUser]     = useState<User|null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [editId,   setEditId]   = useState<string|null>(null);
  const [form,     setForm]     = useState({ ...EMPTY });
  const [files,    setFiles]    = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      if (!u) { router.push('/giris'); return; }
      setUser(u);
      await loadListings(u.uid);
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  async function loadListings(uid: string) {
    try {
      const data = await getUserListings(uid);
      setListings(data);
    } catch (e) {
      console.error(e);
    }
  }

  function openNew() {
    setForm({ ...EMPTY });
    setFiles([]); setPreviews([]); setEditId(null); setError('');
    setModal(true);
  }

  function openEdit(l: Listing) {
    setForm({
      type: l.type, species: l.species, name: l.name, age: l.age||'',
      gender: l.gender, breed: l.breed||'', color: l.color||'',
      city: l.city, district: l.district||'', description: l.description,
      imageUrls: l.imageUrls, isVaccinated: l.isVaccinated,
      isSterilized: l.isSterilized, isMicrochipped: l.isMicrochipped,
      isKidFriendly: l.isKidFriendly, isPuppy: l.isPuppy,
      puppyCount: l.puppyCount, isUrgent: l.isUrgent,
      contactPhone: l.contactPhone||'', contactEmail: l.contactEmail||'',
    });
    setFiles([]); setPreviews([]); setEditId(l.id!); setError('');
    setModal(true);
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files||[]).slice(0, 5 - form.imageUrls.length);
    setFiles(prev => [...prev, ...selected].slice(0, 5));
    const urls = selected.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...urls]);
  }

  function removeNewFile(i: number) {
    setFiles(prev => prev.filter((_,idx) => idx !== i));
    setPreviews(prev => prev.filter((_,idx) => idx !== i));
  }

  function removeExistingImage(i: number) {
    setForm(prev => ({ ...prev, imageUrls: prev.imageUrls.filter((_,idx) => idx !== i) }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setError('');
    if (!form.name || !form.city || !form.description) {
      setError('Ad, şehir ve açıklama zorunlu.'); return;
    }
    if (!user) return;
    setSaving(true);
    try {
      let imageUrls = [...form.imageUrls];
      const tempId  = editId || `temp_${Date.now()}`;

      // Fotoğrafları yükle
      for (const file of files) {
        const url = await uploadListingImage(user.uid, file, tempId);
        imageUrls.push(url);
      }

      const payload = {
        ...form,
        imageUrls,
        ownerId:      user.uid,
        ownerName:    user.displayName || user.email?.split('@')[0] || '',
        ownerEmail:   user.email || '',
        contactEmail: form.contactEmail || user.email || '',
        puppyCount:   form.puppyCount || 0,
      };

      if (editId) {
        await updateListing(editId, payload);
      } else {
        await createListing(payload);
      }

      await loadListings(user.uid);
      setModal(false);
    } catch (err: any) {
      setError('Hata: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('İlanı silmek istediğinizden emin misiniz?')) return;
    await deleteListing(id);
    setListings(prev => prev.filter(l => l.id !== id));
  }

  async function handleClose(id: string) {
    await updateListing(id, { status: 'closed' });
    await loadListings(user!.uid);
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  return (
    <div className="max-w-[1100px]">
      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[6px] z-[800] flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[24px] w-full max-w-[680px] p-6 sm:p-8 mt-8 relative shadow-[0_32px_80px_rgba(0,0,0,.2)]">
            <button onClick={() => setModal(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F7F2EA] flex items-center justify-center text-[#7A7368] hover:bg-[#EDE5D3] transition-colors text-lg">✕</button>
            <h2 className="font-serif text-2xl font-semibold text-[#2F2622] mb-1">{editId ? 'İlanı Düzenle' : 'Yeni İlan Ver 🐾'}</h2>
            <p className="text-sm text-[#7A7368] mb-6">İlan admin onayından sonra yayına girer.</p>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[12px] px-4 py-3 mb-4">{error}</div>}

            <form onSubmit={handleSave}>

              {/* İlan türü */}
              <div className="mb-5">
                <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-2">İlan Türü</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {TYPE_OPTS.map(t => (
                    <button key={t.val} type="button"
                      onClick={() => setForm(p => ({...p, type: t.val}))}
                      className={`p-3 rounded-[12px] border-[1.5px] text-left transition-all ${form.type === t.val ? 'border-[#C9832E] bg-[rgba(201,131,46,.06)]' : 'border-[#E3D9C6] hover:border-[#8B7355]'}`}>
                      <div className="text-sm font-semibold text-[#2F2622]">{t.label}</div>
                      <div className="text-[10px] text-[#7A7368] mt-[2px]">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tür + Cins */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Hayvan Türü *</label>
                  <select value={form.species} onChange={e => setForm(p => ({...p, species: e.target.value as SpeciesType}))}
                    className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all">
                    {SPECIES_OPTS.map(s => <option key={s.val} value={s.val}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Irk / Cins</label>
                  <input value={form.breed} onChange={e => setForm(p => ({...p, breed: e.target.value}))} placeholder="Golden Retriever…"
                    className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
                </div>
              </div>

              {/* Ad + Yaş + Cinsiyet */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Ad *</label>
                  <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Luna" required
                    className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
                </div>
                <div>
                  <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Yaş</label>
                  <input value={form.age} onChange={e => setForm(p => ({...p, age: e.target.value}))} placeholder="2 yaş"
                    className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
                </div>
                <div>
                  <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Cinsiyet</label>
                  <select value={form.gender} onChange={e => setForm(p => ({...p, gender: e.target.value as any}))}
                    className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all">
                    <option value="unknown">Belirtilmemiş</option>
                    <option value="female">Dişi</option>
                    <option value="male">Erkek</option>
                  </select>
                </div>
              </div>

              {/* Şehir + İlçe */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Şehir (81 İl) *</label>
                  <select value={form.city} onChange={e => setForm(p => ({...p, city: e.target.value}))} required
                    className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all">
                    <option value="">Seçin…</option>
                    {CITIES_81.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">İlçe</label>
                  <input value={form.district} onChange={e => setForm(p => ({...p, district: e.target.value}))} placeholder="Çankaya"
                    className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
                </div>
              </div>

              {/* Açıklama */}
              <div className="mb-4">
                <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Açıklama *</label>
                <textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))}
                  placeholder="Hayvanınız hakkında detaylı bilgi verin…" required rows={4}
                  className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all resize-none"/>
              </div>

              {/* Fotoğraflar */}
              <div className="mb-4">
                <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-2">Fotoğraflar (max 5)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {/* Mevcut fotoğraflar */}
                  {form.imageUrls.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-[10px] overflow-hidden border border-[#E3D9C6]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-full h-full object-cover"/>
                      <button type="button" onClick={() => removeExistingImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center">✕</button>
                    </div>
                  ))}
                  {/* Yeni fotoğraflar */}
                  {previews.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-[10px] overflow-hidden border-2 border-[#C9832E]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-full h-full object-cover"/>
                      <button type="button" onClick={() => removeNewFile(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center">✕</button>
                    </div>
                  ))}
                  {/* Ekle butonu */}
                  {(form.imageUrls.length + files.length) < 5 && (
                    <button type="button" onClick={() => fileRef.current?.click()}
                      className="w-20 h-20 rounded-[10px] border-2 border-dashed border-[#E3D9C6] flex flex-col items-center justify-center gap-1 hover:border-[#C9832E] hover:bg-[#F5EDD4] transition-all text-[#7A7368]">
                      <span className="text-2xl">+</span>
                      <span className="text-[9px]">Ekle</span>
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles}/>
                <p className="text-[11px] text-[#9A9188]">Maksimum 5 fotoğraf, her biri max 5MB</p>
              </div>

              {/* Özellikler */}
              <div className="mb-4">
                <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-2">Özellikler</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { key: 'isVaccinated',   label: '💉 Aşılı'            },
                    { key: 'isSterilized',   label: '✂ Kısır'             },
                    { key: 'isMicrochipped', label: '📡 Mikroçipli'        },
                    { key: 'isKidFriendly',  label: '👶 Çocuk Dostu'      },
                    { key: 'isPuppy',        label: '🍼 Yavru'             },
                    { key: 'isUrgent',       label: '🚨 Acil Sahiplendirme'},
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer bg-[#F7F2EA] rounded-[10px] px-3 py-2">
                      <input type="checkbox" checked={(form as any)[key]} onChange={e => setForm(p => ({...p, [key]: e.target.checked}))}
                        className="w-4 h-4 accent-[#C9832E]"/>
                      <span className="text-sm text-[#5C4A32]">{label}</span>
                    </label>
                  ))}
                </div>
                {form.isPuppy && (
                  <div className="mt-3">
                    <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">Yavru Sayısı</label>
                    <input type="number" min="1" max="20" value={form.puppyCount||''} onChange={e => setForm(p => ({...p, puppyCount: Number(e.target.value)}))}
                      placeholder="4" className="w-32 px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
                  </div>
                )}
              </div>

              {/* İletişim */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div>
                  <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">İletişim Telefonu</label>
                  <input value={form.contactPhone} onChange={e => setForm(p => ({...p, contactPhone: e.target.value}))} placeholder="05XX XXX XX XX"
                    className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
                </div>
                <div>
                  <label className="block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1">İletişim E-posta</label>
                  <input value={form.contactEmail} onChange={e => setForm(p => ({...p, contactEmail: e.target.value}))} placeholder="siz@email.com" type="email"
                    className="w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
                </div>
              </div>

              <div className="bg-[rgba(201,131,46,.06)] border border-[rgba(201,131,46,.2)] rounded-[12px] px-4 py-3 mb-5 text-sm text-[#8B7355]">
                ℹ️ İlanınız admin onayından sonra yayına girecektir. Genellikle 24 saat içinde değerlendirilir.
              </div>

              <button type="submit" disabled={saving}
                className="w-full py-[13px] rounded-[14px] bg-[#5C4A32] text-white text-[15px] font-medium hover:bg-[#2F2622] transition-all disabled:opacity-60">
                {saving ? 'Kaydediliyor…' : editId ? 'Değişiklikleri Kaydet' : 'İlanı Gönder 🐾'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="text-xs px-3 py-2 rounded-full bg-white border border-[rgba(196,169,107,.2)] text-[#5C4A32] hover:bg-[#F7F2EA] transition-all">🌐 Ana Sayfa</Link>
          <Link href="/panel" className="text-xs px-3 py-2 rounded-full bg-white border border-[rgba(196,169,107,.2)] text-[#5C4A32] hover:bg-[#F7F2EA] transition-all">← Kontrol Paneli</Link>
        </div>
        <h1 className="font-serif text-2xl font-semibold text-[#2F2622]">İlanlarım</h1>
          <p className="text-sm text-[#7A7368] mt-1">{listings.length} ilan</p>
        </div>
        <button onClick={openNew} className="bg-[#C9832E] text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#b87523] transition-colors">
          + Yeni İlan Ver
        </button>
      </div>

      {/* İlan listesi */}
      {listings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-[20px] border border-[rgba(196,169,107,.12)]">
          <div className="text-5xl mb-4">📢</div>
          <h3 className="font-serif text-xl font-semibold text-[#2F2622] mb-2">Henüz ilan yok</h3>
          <p className="text-sm text-[#7A7368] mb-5">İlk ilanınızı oluşturun.</p>
          <button onClick={openNew} className="bg-[#C9832E] text-white text-sm font-medium px-6 py-2 rounded-full hover:bg-[#b87523] transition-colors">
            İlan Ver
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {listings.map(l => (
            <div key={l.id} className="bg-white rounded-[18px] border border-[rgba(196,169,107,.12)] p-5 flex gap-4 hover:shadow-md transition-shadow">
              {/* Fotoğraf */}
              <div className="w-20 h-20 rounded-[12px] bg-[#F7F2EA] flex-shrink-0 overflow-hidden border border-[#E3D9C6]">
                {l.imageUrls[0]
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={l.imageUrls[0]} alt={l.name} className="w-full h-full object-cover"/>
                  : <div className="w-full h-full flex items-center justify-center text-3xl">
                      {SPECIES_OPTS.find(s => s.val === l.species)?.label.split(' ')[0] || '🐾'}
                    </div>
                }
              </div>
              {/* Bilgi */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <span className="font-serif text-lg font-semibold text-[#2F2622]">{l.name}</span>
                    <span className="text-sm text-[#7A7368] ml-2">{l.breed}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-3 py-1 rounded-full flex-shrink-0 ${STATUS_COLOR[l.status]}`}>
                    {STATUS_LABEL[l.status]}
                  </span>
                </div>
                <div className="text-xs text-[#9A9188] mb-2">
                  📍 {l.city}{l.district ? `, ${l.district}` : ''} · {l.age} · {TYPE_OPTS.find(t => t.val === l.type)?.label}
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {l.isVaccinated  && <span className="text-[10px] bg-[#EDE5D3] text-[#6E5A40] px-2 py-[2px] rounded-full">Aşılı</span>}
                  {l.isSterilized  && <span className="text-[10px] bg-[#EDE5D3] text-[#6E5A40] px-2 py-[2px] rounded-full">Kısır</span>}
                  {l.isMicrochipped&& <span className="text-[10px] bg-[#EDE5D3] text-[#6E5A40] px-2 py-[2px] rounded-full">Mikroçip</span>}
                  {l.isUrgent      && <span className="text-[10px] bg-red-50 text-red-600 px-2 py-[2px] rounded-full">Acil</span>}
                  {l.isPuppy       && <span className="text-[10px] bg-[rgba(201,131,46,.1)] text-[#C9832E] px-2 py-[2px] rounded-full">🍼 Yavru</span>}
                </div>
                {l.status === 'rejected' && l.rejectionReason && (
                  <div className="text-xs text-red-600 bg-red-50 rounded-[8px] px-3 py-2 mb-2">
                    Red sebebi: {l.rejectionReason}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-[#9A9188]">
                  <span>👁 {l.viewCount}</span>
                  <span>❤ {l.favoriteCount}</span>
                  <span>📷 {l.imageUrls.length} fotoğraf</span>
                </div>
              </div>
              {/* Aksiyonlar */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button onClick={() => openEdit(l)} className="text-xs px-3 py-[7px] rounded-full bg-[#5C4A32] text-white hover:bg-[#2F2622] transition-colors">✏ Düzenle</button>
                {l.status === 'active' && (
                  <button onClick={() => handleClose(l.id!)} className="text-xs px-3 py-[7px] rounded-full border border-[#8B7355] text-[#5C4A32] hover:bg-[#5C4A32] hover:text-white transition-all">Kapat</button>
                )}
                <button onClick={() => handleDelete(l.id!)} className="text-xs px-3 py-[7px] rounded-full border border-red-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">🗑 Sil</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
