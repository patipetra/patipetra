'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthChange } from '@/lib/auth';
import {
  collection, getDocs, query, where, addDoc,
  updateDoc, deleteDoc, doc, serverTimestamp, orderBy,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { User } from 'firebase/auth';

// ── Tipler ────────────────────────────────────────────────────────────────────
interface Vaccine {
  id:       string;
  name:     string;
  date:     string;
  nextDate: string;
  vet:      string;
}
interface HealthRecord {
  id:      string;
  date:    string;
  type:    string;
  note:    string;
  vet:     string;
}
interface Pet {
  id:            string;
  name:          string;
  species:       string;
  breed:         string;
  birthDate:     string;
  gender:        string;
  weight:        string;
  color:         string;
  microchipId:   string;
  avatarUrl:     string;
  isVaccinated:  boolean;
  isSterilized:  boolean;
  allergies:     string;
  medications:   string;
  diseases:      string;
  dietNotes:     string;
  insurance:     string;
  emergencyVet:  string;
  notes:         string;
  vaccines:      Vaccine[];
  healthRecords: HealthRecord[];
  ownerId:       string;
  createdAt:     any;
}

const SPECIES = [
  {val:'cat',     label:'Kedi',     emoji:'🐱'},
  {val:'dog',     label:'Köpek',    emoji:'🐶'},
  {val:'bird',    label:'Kuş',      emoji:'🐦'},
  {val:'rabbit',  label:'Tavşan',   emoji:'🐰'},
  {val:'hamster', label:'Hamster',  emoji:'🐹'},
  {val:'turtle',  label:'Kaplumbağa',emoji:'🐢'},
  {val:'fish',    label:'Balık',    emoji:'🐟'},
  {val:'other',   label:'Diğer',    emoji:'🐾'},
];

const VACCINE_NAMES = [
  'Karma Aşı (FVRCP)','Kuduz','FeLV (Kedi Lösemi)','Karma (DHPPiL)',
  'Bordetella','Leptospiroz','Lyme','Influenza','Parvovirus','Distemper',
];

const HEALTH_TYPES = [
  'Muayene','Ameliyat','Kan Tahlili','İdrar Tahlili','Röntgen',
  'Ultrason','Diş Temizliği','Kısırlaştırma','Aşı','İlaç','Diğer',
];

function calcAge(birthDate: string): string {
  if (!birthDate) return '';
  const birth = new Date(birthDate);
  const now   = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();
  const totalMonths = years * 12 + months;
  if (totalMonths < 1)  return 'Yeni doğan';
  if (totalMonths < 12) return `${totalMonths} aylık`;
  const y = Math.floor(totalMonths/12);
  const m = totalMonths % 12;
  return m > 0 ? `${y} yıl ${m} ay` : `${y} yaşında`;
}

function daysUntil(dateStr: string): number {
  if (!dateStr) return -1;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000*60*60*24));
}

const EMPTY_PET: Omit<Pet,'id'|'ownerId'|'createdAt'> = {
  name:'', species:'cat', breed:'', birthDate:'', gender:'female',
  weight:'', color:'', microchipId:'', avatarUrl:'',
  isVaccinated:false, isSterilized:false,
  allergies:'', medications:'', diseases:'', dietNotes:'',
  insurance:'', emergencyVet:'', notes:'',
  vaccines:[], healthRecords:[],
};

export default function PetlerimPage() {
  const router   = useRouter();
  const fileRef  = useRef<HTMLInputElement>(null);
  const [user,       setUser]       = useState<User|null>(null);
  const [pets,       setPets]       = useState<Pet[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [selPet,     setSelPet]     = useState<Pet|null>(null);
  const [view,       setView]       = useState<'list'|'detail'|'form'|'vaccine'|'health'>('list');
  const [step,       setStep]       = useState(1);
  const [form,       setForm]       = useState<typeof EMPTY_PET>({...EMPTY_PET});
  const [avatarFile, setAvatarFile] = useState<File|null>(null);
  const [avatarPrev, setAvatarPrev] = useState('');
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState('');
  // AI
  const [aiQ,        setAiQ]        = useState('');
  const [aiA,        setAiA]        = useState('');
  const [aiLoading,  setAiLoading]  = useState(false);
  // Aşı formu
  const [vForm, setVForm] = useState({name:'',date:'',nextDate:'',vet:''});
  // Sağlık formu
  const [hForm, setHForm] = useState({date:'',type:'Muayene',note:'',vet:''});

  useEffect(() => {
    const unsub = onAuthChange(async u => {
      if (!u) { router.push('/giris'); return; }
      setUser(u);
      await loadPets(u.uid);
    });
    return () => unsub();
  }, [router]);

  async function loadPets(uid: string) {
    setLoading(true);
    try {
      const snap = await getDocs(query(
        collection(db,'pets'), where('ownerId','==',uid), orderBy('createdAt','desc')
      ));
      setPets(snap.docs.map(d=>({id:d.id,...d.data()} as Pet)));
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function savePet(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError('Pet adı zorunlu.'); return; }
    if (!user) return;
    setSaving(true); setError('');
    try {
      let avatarUrl = form.avatarUrl || '';
      if (avatarFile) {
        const petId = selPet?.id || `new_${Date.now()}`;
        const r = ref(storage, `pets/${user.uid}/${petId}.${avatarFile.name.split('.').pop()}`);
        await uploadBytes(r, avatarFile);
        avatarUrl = await getDownloadURL(r);
      }
      const payload = { ...form, avatarUrl, ownerId: user.uid };
      if (selPet?.id) {
        await updateDoc(doc(db,'pets',selPet.id), { ...payload, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db,'pets'), { ...payload, createdAt: serverTimestamp() });
      }
      await loadPets(user.uid);
      setView('list'); setSelPet(null); setStep(1);
    } catch(err:any) { setError('Hata: '+err.message); }
    finally { setSaving(false); }
  }

  async function deletePet(petId: string) {
    if (!confirm('Pet pasaportu silinsin mi?')) return;
    await deleteDoc(doc(db,'pets',petId));
    setPets(prev => prev.filter(p=>p.id!==petId));
    setSelPet(null); setView('list');
  }

  async function addVaccine() {
    if (!vForm.name || !vForm.date || !selPet) return;
    const newV: Vaccine = { id: Date.now().toString(), ...vForm };
    const updated = [...(selPet.vaccines||[]), newV];
    await updateDoc(doc(db,'pets',selPet.id), { vaccines: updated, isVaccinated: true });
    const updatedPet = { ...selPet, vaccines: updated, isVaccinated: true };
    setPets(prev=>prev.map(p=>p.id===selPet.id?updatedPet:p));
    setSelPet(updatedPet);
    setVForm({name:'',date:'',nextDate:'',vet:''});
  }

  async function removeVaccine(vid: string) {
    if (!selPet) return;
    const updated = selPet.vaccines.filter(v=>v.id!==vid);
    await updateDoc(doc(db,'pets',selPet.id), { vaccines: updated });
    const updatedPet = { ...selPet, vaccines: updated };
    setPets(prev=>prev.map(p=>p.id===selPet.id?updatedPet:p));
    setSelPet(updatedPet);
  }

  async function addHealth() {
    if (!hForm.date || !hForm.note || !selPet) return;
    const newH: HealthRecord = { id: Date.now().toString(), ...hForm };
    const updated = [...(selPet.healthRecords||[]), newH];
    await updateDoc(doc(db,'pets',selPet.id), { healthRecords: updated });
    const updatedPet = { ...selPet, healthRecords: updated };
    setPets(prev=>prev.map(p=>p.id===selPet.id?updatedPet:p));
    setSelPet(updatedPet);
    setHForm({date:'',type:'Muayene',note:'',vet:''});
  }

  async function askAI() {
    if (!aiQ.trim() || !selPet) return;
    setAiLoading(true); setAiA('');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Sen bir veteriner asistanısın. Petim hakkında bilgiler:
Ad: ${selPet.name}
Tür: ${SPECIES.find(s=>s.val===selPet.species)?.label}
Cins: ${selPet.breed||'Belirtilmemiş'}
Yaş: ${calcAge(selPet.birthDate)}
Cinsiyet: ${selPet.gender==='female'?'Dişi':'Erkek'}
Ağırlık: ${selPet.weight||'Belirtilmemiş'} kg
Alerjiler: ${selPet.allergies||'Yok'}
Hastalıklar: ${selPet.diseases||'Yok'}
İlaçlar: ${selPet.medications||'Yok'}

Sorum: ${aiQ}

Türkçe olarak kısa ve öz yanıtla. Bu bir genel bilgi amaçlıdır, kesin tanı için veterinere gidilmeli.`
          }]
        })
      });
      const data = await res.json();
      setAiA(data.content?.[0]?.text || 'Yanıt alınamadı.');
    } catch(e) { setAiA('Bağlantı hatası. Tekrar deneyin.'); }
    finally { setAiLoading(false); }
  }

  const INPUT = "w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all";
  const LABEL = "block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1";

  // ── Liste ────────────────────────────────────────────────────────────────────
  if (view==='list') return (
    <div className="min-h-screen bg-[#F7F2EA] lg:ml-[260px]">
      <div className="max-w-[900px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-[#2F2622]">🐾 Pet Pasaportlarım</h1>
            <p className="text-sm text-[#7A7368] mt-1">{pets.length} pet · Tüm sağlık kayıtları burada</p>
          </div>
          <button onClick={()=>{setForm({...EMPTY_PET});setAvatarFile(null);setAvatarPrev('');setSelPet(null);setStep(1);setView('form');}}
            className="bg-[#C9832E] text-white text-sm font-semibold px-5 py-3 rounded-full hover:bg-[#b87523] transition-all flex items-center gap-2">
            + Yeni Pet Ekle
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>
        ) : pets.length===0 ? (
          <div className="text-center py-20 bg-white rounded-[24px] border border-[rgba(196,169,107,.12)]">
            <div className="text-7xl mb-4">🐾</div>
            <h3 className="font-serif text-2xl font-semibold text-[#2F2622] mb-2">Henüz pet eklemediniz</h3>
            <p className="text-[#7A7368] mb-6 leading-relaxed">Petinizin dijital pasaportunu oluşturun.<br/>Aşı takibi, sağlık kayıtları ve AI asistan.</p>
            <button onClick={()=>{setForm({...EMPTY_PET});setStep(1);setView('form');}}
              className="bg-[#C9832E] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#b87523]">
              İlk Petimi Ekle →
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pets.map(pet=>{
              const spec = SPECIES.find(s=>s.val===pet.species);
              const upcoming = (pet.vaccines||[]).filter(v=>v.nextDate && daysUntil(v.nextDate)<=30 && daysUntil(v.nextDate)>=0);
              return (
                <div key={pet.id} onClick={()=>{setSelPet(pet);setView('detail');}}
                  className="bg-white rounded-[24px] border border-[rgba(196,169,107,.12)] overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group">
                  {/* Renk banner */}
                  <div className="h-24 bg-gradient-to-br from-[#2F2622] to-[#5C4A32] relative overflow-hidden flex items-center justify-center">
                    {pet.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={pet.avatarUrl} alt={pet.name} className="w-full h-full object-cover opacity-60"/>
                    ) : (
                      <span className="text-6xl opacity-80">{spec?.emoji||'🐾'}</span>
                    )}
                    {upcoming.length>0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-[2px] rounded-full animate-pulse">
                        ⚡ {upcoming.length} aşı yaklaşıyor
                      </div>
                    )}
                  </div>
                  {/* Pet avatar */}
                  <div className="flex justify-center -mt-8 mb-3">
                    <div className="w-16 h-16 rounded-full border-4 border-white bg-[#F7F2EA] flex items-center justify-center text-3xl overflow-hidden shadow-md">
                      {pet.avatarUrl
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={pet.avatarUrl} alt={pet.name} className="w-full h-full object-cover"/>
                        : spec?.emoji||'🐾'
                      }
                    </div>
                  </div>
                  <div className="px-5 pb-5 text-center">
                    <h3 className="font-serif text-xl font-semibold text-[#2F2622] mb-1">{pet.name}</h3>
                    <p className="text-sm text-[#7A7368] mb-3">
                      {spec?.label}{pet.breed?` · ${pet.breed}`:''}{pet.birthDate?` · ${calcAge(pet.birthDate)}`:''}
                    </p>
                    <div className="flex justify-center gap-2 flex-wrap mb-4">
                      {pet.isVaccinated && <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2 py-[2px] rounded-full">✓ Aşılı</span>}
                      {pet.isSterilized && <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-[2px] rounded-full">✓ Kısır</span>}
                      {pet.microchipId  && <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-[2px] rounded-full">✓ Çipli</span>}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center border-t border-[#F7F2EA] pt-3">
                      <div>
                        <div className="font-serif text-lg font-semibold text-[#C9832E]">{(pet.vaccines||[]).length}</div>
                        <div className="text-[10px] text-[#9A9188]">Aşı</div>
                      </div>
                      <div>
                        <div className="font-serif text-lg font-semibold text-[#C9832E]">{(pet.healthRecords||[]).length}</div>
                        <div className="text-[10px] text-[#9A9188]">Kayıt</div>
                      </div>
                      <div>
                        <div className="font-serif text-lg font-semibold text-[#C9832E]">{pet.weight||'—'}</div>
                        <div className="text-[10px] text-[#9A9188]">kg</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Yeni pet kartı */}
            <button onClick={()=>{setForm({...EMPTY_PET});setStep(1);setView('form');}}
              className="bg-white rounded-[24px] border-2 border-dashed border-[#E3D9C6] hover:border-[#C9832E] flex flex-col items-center justify-center p-8 transition-all hover:bg-[rgba(201,131,46,.03)] min-h-[280px]">
              <div className="text-4xl mb-3">➕</div>
              <div className="font-semibold text-[#5C4A32] mb-1">Yeni Pet Ekle</div>
              <div className="text-xs text-[#9A9188] text-center">Dijital pasaport oluştur</div>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ── Detay ────────────────────────────────────────────────────────────────────
  if (view==='detail' && selPet) {
    const spec = SPECIES.find(s=>s.val===selPet.species);
    const upcomingVaccines = (selPet.vaccines||[]).filter(v=>v.nextDate && daysUntil(v.nextDate)<=30 && daysUntil(v.nextDate)>=0);
    const overdueVaccines  = (selPet.vaccines||[]).filter(v=>v.nextDate && daysUntil(v.nextDate)<0);

    return (
      <div className="min-h-screen bg-[#F7F2EA] lg:ml-[260px]">
        <div className="max-w-[900px] mx-auto px-4 py-8">
          {/* Geri */}
          <button onClick={()=>{setSelPet(null);setView('list');setAiQ('');setAiA('');}} className="text-sm text-[#7A7368] hover:text-[#2F2622] mb-6 flex items-center gap-1">
            ← Tüm Petler
          </button>

          {/* Profil header */}
          <div className="bg-white rounded-[24px] border border-[rgba(196,169,107,.12)] overflow-hidden mb-5 shadow-sm">
            <div className="h-32 bg-gradient-to-br from-[#2F2622] to-[#5C4A32] relative">
              {selPet.avatarUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selPet.avatarUrl} alt={selPet.name} className="w-full h-full object-cover opacity-40"/>
              )}
            </div>
            <div className="px-6 pb-6">
              <div className="flex items-end gap-4 -mt-10 mb-4">
                <div className="w-20 h-20 rounded-full border-4 border-white bg-[#F7F2EA] flex items-center justify-center text-4xl overflow-hidden shadow-lg flex-shrink-0">
                  {selPet.avatarUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={selPet.avatarUrl} alt="" className="w-full h-full object-cover"/>
                    : spec?.emoji||'🐾'
                  }
                </div>
                <div className="flex-1 min-w-0 pb-1">
                  <h1 className="font-serif text-2xl font-semibold text-[#2F2622]">{selPet.name}</h1>
                  <p className="text-sm text-[#7A7368]">
                    {spec?.label}{selPet.breed?` · ${selPet.breed}`:''}{selPet.birthDate?` · ${calcAge(selPet.birthDate)}`:''}
                  </p>
                </div>
                <div className="flex gap-2 pb-1">
                  <button onClick={()=>{setForm({...EMPTY_PET,...selPet});setAvatarPrev(selPet.avatarUrl||'');setStep(1);setView('form');}}
                    className="text-xs px-3 py-2 rounded-full border border-[#8B7355] text-[#5C4A32] hover:bg-[#5C4A32] hover:text-white transition-all">
                    ✏️ Düzenle
                  </button>
                  <button onClick={()=>deletePet(selPet.id)}
                    className="text-xs px-3 py-2 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-all">
                    🗑
                  </button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selPet.isVaccinated  && <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full">✓ Aşılı</span>}
                {selPet.isSterilized  && <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full">✓ Kısırlaştırılmış</span>}
                {selPet.microchipId   && <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full">✓ Mikroçip: {selPet.microchipId}</span>}
                {selPet.insurance     && <span className="text-xs bg-[rgba(201,131,46,.1)] text-[#C9832E] px-3 py-1 rounded-full">🛡️ Sigortalı</span>}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  {l:'Ağırlık',  v:selPet.weight?`${selPet.weight} kg`:'—'},
                  {l:'Cinsiyet', v:selPet.gender==='female'?'♀ Dişi':'♂ Erkek'},
                  {l:'Renk',     v:selPet.color||'—'},
                  {l:'Aşı Sayısı',v:`${(selPet.vaccines||[]).length} aşı`},
                ].map(s=>(
                  <div key={s.l} className="bg-[#F7F2EA] rounded-[12px] p-3 text-center">
                    <div className="text-xs text-[#9A9188] mb-1">{s.l}</div>
                    <div className="font-semibold text-sm text-[#2F2622]">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Uyarılar */}
          {(upcomingVaccines.length>0 || overdueVaccines.length>0) && (
            <div className="space-y-2 mb-5">
              {overdueVaccines.map(v=>(
                <div key={v.id} className="bg-red-50 border border-red-200 rounded-[14px] px-4 py-3 flex items-center gap-3">
                  <span className="text-red-500 text-xl">⚠️</span>
                  <div>
                    <div className="font-semibold text-sm text-red-700">{v.name} aşısı gecikmiş!</div>
                    <div className="text-xs text-red-500">Planlanmış tarih: {v.nextDate}</div>
                  </div>
                </div>
              ))}
              {upcomingVaccines.map(v=>(
                <div key={v.id} className="bg-[rgba(201,131,46,.08)] border border-[rgba(201,131,46,.2)] rounded-[14px] px-4 py-3 flex items-center gap-3">
                  <span className="text-xl">🔔</span>
                  <div>
                    <div className="font-semibold text-sm text-[#8B7355]">{v.name} aşısı yaklaşıyor</div>
                    <div className="text-xs text-[#C9832E]">{daysUntil(v.nextDate)} gün sonra · {v.nextDate}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid lg:grid-cols-[1fr_.45fr] gap-5">
            <div className="space-y-5">
              {/* Sağlık Bilgileri */}
              {(selPet.allergies||selPet.diseases||selPet.medications||selPet.dietNotes) && (
                <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5">
                  <h3 className="font-serif text-lg font-semibold text-[#2F2622] mb-4">🏥 Sağlık Bilgileri</h3>
                  <div className="space-y-3">
                    {[
                      {l:'Alerjiler',     v:selPet.allergies,   icon:'🚫'},
                      {l:'Hastalıklar',   v:selPet.diseases,    icon:'🩺'},
                      {l:'İlaçlar',       v:selPet.medications, icon:'💊'},
                      {l:'Diyet Notları', v:selPet.dietNotes,   icon:'🥗'},
                    ].filter(f=>f.v).map(f=>(
                      <div key={f.l} className="bg-[#F7F2EA] rounded-[12px] p-3">
                        <div className="text-[10px] uppercase tracking-[.1em] text-[#9A9188] mb-1">{f.icon} {f.l}</div>
                        <div className="text-sm text-[#5C4A32]">{f.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Aşı Kayıtları */}
              <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg font-semibold text-[#2F2622]">💉 Aşı Kayıtları</h3>
                  <button onClick={()=>setView('vaccine')}
                    className="text-xs px-3 py-2 rounded-full bg-[#C9832E] text-white hover:bg-[#b87523]">
                    + Aşı Ekle
                  </button>
                </div>
                {(selPet.vaccines||[]).length===0 ? (
                  <div className="text-center py-6 text-[#9A9188] text-sm">Henüz aşı kaydı yok.</div>
                ) : (
                  <div className="space-y-2">
                    {[...(selPet.vaccines||[])].sort((a,b)=>b.date.localeCompare(a.date)).map(v=>{
                      const du = daysUntil(v.nextDate);
                      return (
                        <div key={v.id} className="border border-[#F7F2EA] rounded-[12px] p-3 flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-lg flex-shrink-0">💉</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm text-[#2F2622]">{v.name}</div>
                            <div className="text-xs text-[#9A9188]">Yapıldı: {v.date}{v.vet?` · ${v.vet}`:''}</div>
                            {v.nextDate && (
                              <div className={`text-xs mt-1 font-medium ${du<0?'text-red-500':du<=30?'text-[#C9832E]':'text-green-600'}`}>
                                {du<0?`⚠️ ${Math.abs(du)} gün gecikmiş`:du<=30?`🔔 ${du} gün sonra`:du===0?'🔴 Bugün':'✓ '+v.nextDate}
                              </div>
                            )}
                          </div>
                          <button onClick={()=>removeVaccine(v.id)} className="text-[#9A9188] hover:text-red-500 text-lg flex-shrink-0">✕</button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sağlık Kayıtları */}
              <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg font-semibold text-[#2F2622]">📋 Sağlık Geçmişi</h3>
                  <button onClick={()=>setView('health')}
                    className="text-xs px-3 py-2 rounded-full bg-[#5C4A32] text-white hover:bg-[#2F2622]">
                    + Kayıt Ekle
                  </button>
                </div>
                {(selPet.healthRecords||[]).length===0 ? (
                  <div className="text-center py-6 text-[#9A9188] text-sm">Henüz sağlık kaydı yok.</div>
                ) : (
                  <div className="space-y-2">
                    {[...(selPet.healthRecords||[])].sort((a,b)=>b.date.localeCompare(a.date)).map(h=>(
                      <div key={h.id} className="border border-[#F7F2EA] rounded-[12px] p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold bg-[rgba(201,131,46,.1)] text-[#C9832E] px-2 py-[1px] rounded-full">{h.type}</span>
                          <span className="text-xs text-[#9A9188]">{h.date}</span>
                          {h.vet && <span className="text-xs text-[#9A9188]">· {h.vet}</span>}
                        </div>
                        <p className="text-sm text-[#5C4A32]">{h.note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sağ — AI Asistan */}
            <div className="space-y-4">
              {/* Acil vet */}
              {selPet.emergencyVet && (
                <div className="bg-red-50 border border-red-200 rounded-[16px] p-4">
                  <div className="text-xs font-semibold text-red-600 mb-1">🚨 Acil Veteriner</div>
                  <div className="text-sm text-red-700 font-medium">{selPet.emergencyVet}</div>
                </div>
              )}

              {/* AI Asistan */}
              <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5 sticky top-4">
                <h3 className="font-serif text-base font-semibold text-[#2F2622] mb-1">🤖 AI Veteriner Asistanı</h3>
                <p className="text-xs text-[#9A9188] mb-4">{selPet.name} hakkında soru sor</p>
                <div className="space-y-3">
                  {/* Hızlı sorular */}
                  <div className="flex flex-wrap gap-1">
                    {[
                      `${selPet.name} kaç yaşında?`,
                      'Aşı takvimi nasıl olmalı?',
                      'Beslenmesine dikkat etmeli miyim?',
                      'Sağlıklı kilo nedir?',
                    ].map(q=>(
                      <button key={q} onClick={()=>setAiQ(q)}
                        className="text-[10px] bg-[#F7F2EA] text-[#5C4A32] px-2 py-1 rounded-full hover:bg-[#EDE5D3] transition-colors">
                        {q.length>25?q.slice(0,25)+'…':q}
                      </button>
                    ))}
                  </div>
                  <textarea value={aiQ} onChange={e=>setAiQ(e.target.value)}
                    placeholder={`${selPet.name} hakkında soru sor…`} rows={3}
                    className="w-full px-3 py-2 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] resize-none"/>
                  <button onClick={askAI} disabled={aiLoading||!aiQ.trim()}
                    className="w-full py-2 rounded-full bg-[#C9832E] text-white text-sm font-semibold hover:bg-[#b87523] disabled:opacity-60">
                    {aiLoading?'Düşünüyor…':'Sor →'}
                  </button>
                  {aiA && (
                    <div className="bg-[#F7F2EA] rounded-[12px] p-3">
                      <div className="text-[10px] font-semibold text-[#C9832E] mb-2">🤖 AI Yanıtı:</div>
                      <p className="text-xs text-[#5C4A32] leading-relaxed whitespace-pre-wrap">{aiA}</p>
                      <p className="text-[10px] text-[#9A9188] mt-2">⚠️ Kesin tanı için veterinerinize danışın.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notlar */}
              {selPet.notes && (
                <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-4">
                  <div className="text-[10px] uppercase tracking-[.1em] text-[#9A9188] mb-2">📝 Notlar</div>
                  <p className="text-sm text-[#5C4A32] leading-relaxed">{selPet.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Aşı Ekle ─────────────────────────────────────────────────────────────────
  if (view==='vaccine' && selPet) return (
    <div className="min-h-screen bg-[#F7F2EA] lg:ml-[260px]">
      <div className="max-w-[600px] mx-auto px-4 py-8">
        <button onClick={()=>setView('detail')} className="text-sm text-[#7A7368] hover:text-[#2F2622] mb-6 flex items-center gap-1">← {selPet.name}'e Dön</button>
        <h2 className="font-serif text-2xl font-semibold text-[#2F2622] mb-6">💉 Aşı Ekle</h2>
        <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6 space-y-4">
          <div>
            <label className={LABEL}>Aşı Adı *</label>
            <select value={vForm.name} onChange={e=>setVForm(p=>({...p,name:e.target.value}))} className={INPUT}>
              <option value="">Seçin…</option>
              {VACCINE_NAMES.map(n=><option key={n} value={n}>{n}</option>)}
              <option value="__other">Diğer (elle gir)</option>
            </select>
            {vForm.name==='__other' && (
              <input value="" onChange={e=>setVForm(p=>({...p,name:e.target.value}))} placeholder="Aşı adını yazın" className={`${INPUT} mt-2`}/>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Yapılma Tarihi *</label>
              <input type="date" value={vForm.date} onChange={e=>setVForm(p=>({...p,date:e.target.value}))} className={INPUT}/>
            </div>
            <div>
              <label className={LABEL}>Hatırlatma Tarihi</label>
              <input type="date" value={vForm.nextDate} onChange={e=>setVForm(p=>({...p,nextDate:e.target.value}))} className={INPUT}/>
            </div>
          </div>
          <div>
            <label className={LABEL}>Veteriner / Klinik</label>
            <input value={vForm.vet} onChange={e=>setVForm(p=>({...p,vet:e.target.value}))} placeholder="Dr. Ahmet / PetLife Kliniği" className={INPUT}/>
          </div>
          <button onClick={addVaccine} disabled={!vForm.name||!vForm.date}
            className="w-full py-3 rounded-full bg-[#C9832E] text-white text-sm font-semibold hover:bg-[#b87523] disabled:opacity-60">
            Aşıyı Kaydet →
          </button>
        </div>
      </div>
    </div>
  );

  // ── Sağlık Kaydı Ekle ────────────────────────────────────────────────────────
  if (view==='health' && selPet) return (
    <div className="min-h-screen bg-[#F7F2EA] lg:ml-[260px]">
      <div className="max-w-[600px] mx-auto px-4 py-8">
        <button onClick={()=>setView('detail')} className="text-sm text-[#7A7368] hover:text-[#2F2622] mb-6 flex items-center gap-1">← {selPet.name}'e Dön</button>
        <h2 className="font-serif text-2xl font-semibold text-[#2F2622] mb-6">📋 Sağlık Kaydı Ekle</h2>
        <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Tarih *</label>
              <input type="date" value={hForm.date} onChange={e=>setHForm(p=>({...p,date:e.target.value}))} className={INPUT}/>
            </div>
            <div>
              <label className={LABEL}>Kayıt Türü</label>
              <select value={hForm.type} onChange={e=>setHForm(p=>({...p,type:e.target.value}))} className={INPUT}>
                {HEALTH_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={LABEL}>Veteriner / Klinik</label>
            <input value={hForm.vet} onChange={e=>setHForm(p=>({...p,vet:e.target.value}))} placeholder="Dr. Zeynep / Minik Dostlar Vet" className={INPUT}/>
          </div>
          <div>
            <label className={LABEL}>Notlar / Bulgular *</label>
            <textarea value={hForm.note} onChange={e=>setHForm(p=>({...p,note:e.target.value}))} rows={5}
              placeholder="Muayene bulguları, verilen ilaçlar, öneriler…"
              className={`${INPUT} resize-none`}/>
          </div>
          <button onClick={addHealth} disabled={!hForm.date||!hForm.note}
            className="w-full py-3 rounded-full bg-[#5C4A32] text-white text-sm font-semibold hover:bg-[#2F2622] disabled:opacity-60">
            Kaydı Ekle →
          </button>
        </div>
      </div>
    </div>
  );

  // ── Form (3 Adım) ────────────────────────────────────────────────────────────
  if (view==='form') {
    const isEdit = !!selPet?.id;
    return (
      <div className="min-h-screen bg-[#F7F2EA] lg:ml-[260px]">
        <div className="max-w-[600px] mx-auto px-4 py-8">
          <button onClick={()=>{setView(isEdit?'detail':'list');}} className="text-sm text-[#7A7368] hover:text-[#2F2622] mb-6 flex items-center gap-1">← Geri</button>
          <h2 className="font-serif text-2xl font-semibold text-[#2F2622] mb-1">{isEdit?`${selPet?.name} Düzenle`:'Yeni Pet Ekle'} 🐾</h2>
          <p className="text-sm text-[#7A7368] mb-6">Petinizin dijital pasaportu oluşturuluyor</p>

          {/* Adım göstergesi */}
          <div className="flex items-center gap-2 mb-6">
            {[
              {n:1, l:'Temel Bilgiler'},
              {n:2, l:'Sağlık Bilgileri'},
              {n:3, l:'Ek Bilgiler'},
            ].map((s,i)=>(
              <div key={s.n} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 transition-all ${step>=s.n?'bg-[#C9832E] text-white':'bg-[#EDE5D3] text-[#9A9188]'}`}>{s.n}</div>
                {i<2 && <div className={`flex-1 h-[2px] rounded transition-all ${step>s.n?'bg-[#C9832E]':'bg-[#E3D9C6]'}`}/>}
              </div>
            ))}
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[12px] px-4 py-3 mb-4">{error}</div>}

          <form onSubmit={savePet}>
            {/* ADIM 1 — Temel Bilgiler */}
            {step===1 && (
              <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6 space-y-4">
                {/* Fotoğraf */}
                <div className="flex flex-col items-center gap-3">
                  <div onClick={()=>fileRef.current?.click()}
                    className="w-28 h-28 rounded-full border-2 border-dashed border-[#E3D9C6] hover:border-[#C9832E] flex items-center justify-center cursor-pointer overflow-hidden bg-[#F7F2EA] transition-all">
                    {avatarPrev||form.avatarUrl
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={avatarPrev||form.avatarUrl} alt="" className="w-full h-full object-cover"/>
                      : <div className="text-center"><div className="text-4xl">{SPECIES.find(s=>s.val===form.species)?.emoji||'🐾'}</div><div className="text-[10px] text-[#9A9188] mt-1">Fotoğraf Ekle</div></div>
                    }
                  </div>
                  <button type="button" onClick={()=>fileRef.current?.click()} className="text-xs text-[#C9832E] hover:underline">
                    {avatarPrev?'Değiştir':'Fotoğraf Yükle'}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={e=>{const f=e.target.files?.[0];if(f){setAvatarFile(f);setAvatarPrev(URL.createObjectURL(f))}}}/>
                </div>

                {/* Tür */}
                <div>
                  <label className={LABEL}>Hayvan Türü *</label>
                  <div className="grid grid-cols-4 gap-2">
                    {SPECIES.map(s=>(
                      <button key={s.val} type="button" onClick={()=>setForm(p=>({...p,species:s.val}))}
                        className={`flex flex-col items-center gap-1 p-3 rounded-[12px] border-[1.5px] transition-all ${form.species===s.val?'border-[#C9832E] bg-[rgba(201,131,46,.06)]':'border-[#E3D9C6] hover:border-[#8B7355]'}`}>
                        <span className="text-2xl">{s.emoji}</span>
                        <span className="text-[10px] text-[#5C4A32]">{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={LABEL}>Pet Adı *</label>
                  <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Luna, Max, Mochi…" required className={INPUT}/>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={LABEL}>Cins / Irk</label>
                    <input value={form.breed} onChange={e=>setForm(p=>({...p,breed:e.target.value}))} placeholder="British Shorthair" className={INPUT}/>
                  </div>
                  <div>
                    <label className={LABEL}>Renk</label>
                    <input value={form.color} onChange={e=>setForm(p=>({...p,color:e.target.value}))} placeholder="Gri, Turuncu…" className={INPUT}/>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={LABEL}>Doğum Tarihi</label>
                    <input type="date" value={form.birthDate} onChange={e=>setForm(p=>({...p,birthDate:e.target.value}))} className={INPUT}/>
                  </div>
                  <div>
                    <label className={LABEL}>Ağırlık (kg)</label>
                    <input type="number" step="0.1" value={form.weight} onChange={e=>setForm(p=>({...p,weight:e.target.value}))} placeholder="4.2" className={INPUT}/>
                  </div>
                </div>

                <div>
                  <label className={LABEL}>Cinsiyet</label>
                  <div className="flex gap-3">
                    {[{v:'female',l:'♀ Dişi'},{v:'male',l:'♂ Erkek'},{v:'unknown',l:'Bilinmiyor'}].map(g=>(
                      <button key={g.v} type="button" onClick={()=>setForm(p=>({...p,gender:g.v}))}
                        className={`flex-1 py-3 rounded-[12px] border-[1.5px] text-sm font-medium transition-all ${form.gender===g.v?'border-[#C9832E] bg-[rgba(201,131,46,.06)] text-[#C9832E]':'border-[#E3D9C6] text-[#5C4A32] hover:border-[#8B7355]'}`}>
                        {g.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={LABEL}>Mikroçip No</label>
                  <input value={form.microchipId} onChange={e=>setForm(p=>({...p,microchipId:e.target.value}))} placeholder="15 haneli çip numarası" className={INPUT}/>
                </div>

                <button type="button" onClick={()=>{if(!form.name){setError('Pet adı zorunlu.');return;}setError('');setStep(2);}}
                  className="w-full py-[13px] rounded-full bg-[#C9832E] text-white text-[15px] font-semibold hover:bg-[#b87523] transition-all">
                  Devam Et →
                </button>
              </div>
            )}

            {/* ADIM 2 — Sağlık Bilgileri */}
            {step===2 && (
              <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6 space-y-4">
                {/* Toggle'lar */}
                <div className="space-y-3">
                  {[
                    {l:'Aşı kayıtları var',          k:'isVaccinated', icon:'💉'},
                    {l:'Kısırlaştırılmış / iğdiş',   k:'isSterilized', icon:'✂️'},
                  ].map(f=>(
                    <label key={f.k} className="flex items-center justify-between p-4 bg-[#F7F2EA] rounded-[14px] cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{f.icon}</span>
                        <span className="font-medium text-sm text-[#2F2622]">{f.l}</span>
                      </div>
                      <div onClick={()=>setForm(p=>({...p,[f.k]:!(p as any)[f.k]}))}
                        className={`w-12 h-7 rounded-full transition-all relative ${(form as any)[f.k]?'bg-[#C9832E]':'bg-[#E3D9C6]'}`}>
                        <div className={`absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow transition-all ${(form as any)[f.k]?'left-[22px]':'left-[3px]'}`}/>
                      </div>
                    </label>
                  ))}
                </div>

                <div>
                  <label className={LABEL}>Alerjiler</label>
                  <textarea value={form.allergies} onChange={e=>setForm(p=>({...p,allergies:e.target.value}))}
                    placeholder="Tavuk eti, belirli ilaçlar…" rows={2} className={`${INPUT} resize-none`}/>
                </div>

                <div>
                  <label className={LABEL}>Kronik Hastalıklar / Durumlar</label>
                  <textarea value={form.diseases} onChange={e=>setForm(p=>({...p,diseases:e.target.value}))}
                    placeholder="Diyabet, böbrek yetmezliği…" rows={2} className={`${INPUT} resize-none`}/>
                </div>

                <div>
                  <label className={LABEL}>Sürekli Kullandığı İlaçlar</label>
                  <textarea value={form.medications} onChange={e=>setForm(p=>({...p,medications:e.target.value}))}
                    placeholder="İlaç adı, dozu, kullanım sıklığı…" rows={2} className={`${INPUT} resize-none`}/>
                </div>

                <div>
                  <label className={LABEL}>Diyet Notları</label>
                  <textarea value={form.dietNotes} onChange={e=>setForm(p=>({...p,dietNotes:e.target.value}))}
                    placeholder="Özel mama, porsiyon bilgisi…" rows={2} className={`${INPUT} resize-none`}/>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={()=>setStep(1)} className="flex-1 py-[13px] rounded-full border border-[#8B7355] text-[#5C4A32] text-[15px] font-medium hover:bg-[#5C4A32] hover:text-white transition-all">← Geri</button>
                  <button type="button" onClick={()=>setStep(3)} className="flex-1 py-[13px] rounded-full bg-[#C9832E] text-white text-[15px] font-semibold hover:bg-[#b87523]">Devam Et →</button>
                </div>
              </div>
            )}

            {/* ADIM 3 — Ek Bilgiler */}
            {step===3 && (
              <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6 space-y-4">
                <div>
                  <label className={LABEL}>Sigorta Bilgisi</label>
                  <input value={form.insurance} onChange={e=>setForm(p=>({...p,insurance:e.target.value}))} placeholder="Şirket adı, poliçe no…" className={INPUT}/>
                </div>

                <div>
                  <label className={LABEL}>Acil Durumda Veteriner</label>
                  <input value={form.emergencyVet} onChange={e=>setForm(p=>({...p,emergencyVet:e.target.value}))} placeholder="Dr. Ahmet · 0312 XXX XX XX" className={INPUT}/>
                </div>

                <div>
                  <label className={LABEL}>Genel Notlar</label>
                  <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}
                    placeholder="Sevdiği oyuncaklar, korkuları, özel bakım notları…" rows={4}
                    className={`${INPUT} resize-none`}/>
                </div>

                <div className="bg-[rgba(201,131,46,.06)] border border-[rgba(201,131,46,.2)] rounded-[14px] p-4">
                  <div className="font-semibold text-sm text-[#8B7355] mb-2">📝 Özet</div>
                  <div className="text-xs text-[#7A7368] space-y-1">
                    <div>🐾 <strong>{form.name}</strong> · {SPECIES.find(s=>s.val===form.species)?.label} {SPECIES.find(s=>s.val===form.species)?.emoji}</div>
                    {form.breed && <div>🦴 {form.breed}</div>}
                    {form.birthDate && <div>🎂 {calcAge(form.birthDate)}</div>}
                    {form.isVaccinated && <div>💉 Aşı kayıtları var</div>}
                    {form.isSterilized && <div>✂️ Kısırlaştırılmış</div>}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={()=>setStep(2)} className="flex-1 py-[13px] rounded-full border border-[#8B7355] text-[#5C4A32] text-[15px] font-medium hover:bg-[#5C4A32] hover:text-white transition-all">← Geri</button>
                  <button type="submit" disabled={saving}
                    className="flex-1 py-[13px] rounded-full bg-[#C9832E] text-white text-[15px] font-semibold hover:bg-[#b87523] disabled:opacity-60">
                    {saving?'Kaydediliyor…':isEdit?'Güncelle ✓':'Pasaportu Oluştur 🐾'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  return null;
}
