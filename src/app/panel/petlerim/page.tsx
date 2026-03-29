'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthChange } from '@/lib/auth';
import { usePlan } from '@/hooks/usePlan';
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
  batch?:   string; // Parti numarası
  reminder?: boolean;
}
interface HealthRecord {
  id:      string;
  date:    string;
  type:    string;
  note:    string;
  vet:     string;
  cost?:   string; // Masraf
  files?:  string[]; // Belge URL'leri
}
interface WeightRecord {
  id:     string;
  date:   string;
  weight: number;
  note?:  string;
}
interface Milestone {
  id:    string;
  date:  string;
  title: string;
  note:  string;
  emoji: string;
}
interface Parasite {
  id:       string;
  type:     string; // pire, kene, iç parazit
  date:     string;
  nextDate: string;
  product:  string;
  vet?:     string;
}
interface DailyLog {
  id:       string;
  date:     string;
  mood:     string; // 😊 😐 😟
  appetite: string; // iyi normal kötü
  activity: string; // aktif normal pasif
  poop:     string; // normal anormal yok
  note?:    string;
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
  weightHistory: WeightRecord[];
  milestones:    Milestone[];
  parasites:     Parasite[];
  dailyLogs:     DailyLog[];
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
  vaccines:[], healthRecords:[], weightHistory:[],
  milestones:[], parasites:[], dailyLogs:[],
};

const PARASITE_TYPES = ['Pire & Kene','İç Parazit (Kurtlar)','Dış Parazit','Uyuz','Mantar'];
const MILESTONE_EMOJIS = ['🎂','🏠','💉','✂️','🏆','❤️','🐾','⭐','🎉','🌟'];
const MOODS = [
  {val:'great',  label:'Harika',  emoji:'😊'},
  {val:'normal', label:'Normal',  emoji:'😐'},
  {val:'bad',    label:'Kötü',    emoji:'😟'},
];

export default function PetlerimPage() {
  const router   = useRouter();
  const fileRef  = useRef<HTMLInputElement>(null);
  const [user,       setUser]       = useState<User|null>(null);
  const [pets,       setPets]       = useState<Pet[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [selPet,     setSelPet]     = useState<Pet|null>(null);
  const [view,       setView]       = useState<'list'|'detail'|'form'|'vaccine'|'health'|'weight'|'milestone'|'parasite'|'daily'>('list');
  const [step,       setStep]       = useState(1);
  const [form,       setForm]       = useState<typeof EMPTY_PET>({...EMPTY_PET});
  const [avatarFile, setAvatarFile] = useState<File|null>(null);
  const [avatarPrev, setAvatarPrev] = useState('');
  const [saving,     setSaving]     = useState(false);
  const { limits } = usePlan();
  const [error,      setError]      = useState('');
  // AI
  const [aiQ,        setAiQ]        = useState('');
  const [aiA,        setAiA]        = useState('');
  const [aiLoading,  setAiLoading]  = useState(false);
  // Aşı formu
  const [vForm, setVForm] = useState({name:'',date:'',nextDate:'',vet:'',batch:'',reminder:true});
  const [hForm, setHForm] = useState({date:'',type:'Muayene',note:'',vet:'',cost:''});
  const [wForm, setWForm] = useState({date:new Date().toISOString().split('T')[0],weight:'',note:''});
  const [mForm, setMForm] = useState({date:new Date().toISOString().split('T')[0],title:'',note:'',emoji:'🎂'});
  const [pForm, setPForm] = useState({type:'Pire & Kene',date:'',nextDate:'',product:'',vet:''});
  const [dForm, setDForm] = useState({date:new Date().toISOString().split('T')[0],mood:'great',appetite:'iyi',activity:'aktif',poop:'normal',note:''});
  const [activeTab, setActiveTab] = useState<'ozet'|'asılar'|'saglik'|'kilo'|'parazit'|'gunluk'|'milestone'|'ai'>('ozet');

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
        collection(db,'pets'), where('ownerId','==',uid)
      ));
      // Client'ta tarihe göre sırala (Firestore composite index gerektirmez)
      const petList = snap.docs
        .map(d=>({id:d.id,...d.data()} as Pet))
        .sort((a:any,b:any)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
      setPets(petList);
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
    } catch(err:any) {
      console.error('savePet error:', err);
      setError('Kayıt hatası: ' + (err.message || err.code || 'Bilinmeyen hata'));
    }
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
    setVForm({name:'',date:'',nextDate:'',vet:'',batch:'',reminder:true});
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
    setHForm({date:'',type:'Muayene',note:'',vet:'',cost:''});
  }

  // ── Kilo kaydı ──────────────────────────────────────────────────────────────
  async function addWeight() {
    if (!wForm.weight || !selPet) return;
    const newW: WeightRecord = {
      id: Date.now().toString(),
      date: wForm.date,
      weight: parseFloat(wForm.weight),
      note: wForm.note,
    };
    const updated = [...(selPet.weightHistory||[]), newW].sort((a,b)=>a.date.localeCompare(b.date));
    await updateDoc(doc(db,'pets',selPet.id), { weightHistory: updated, weight: wForm.weight });
    const up = {...selPet, weightHistory: updated, weight: wForm.weight};
    setPets(prev=>prev.map(p=>p.id===selPet.id?up:p));
    setSelPet(up);
    setWForm({date:new Date().toISOString().split('T')[0],weight:'',note:''});
    setView('detail');
  }

  // ── Milestone ekle ───────────────────────────────────────────────────────────
  async function addMilestone() {
    if (!mForm.title || !selPet) return;
    const newM: Milestone = { id: Date.now().toString(), ...mForm };
    const updated = [...(selPet.milestones||[]), newM].sort((a,b)=>b.date.localeCompare(a.date));
    await updateDoc(doc(db,'pets',selPet.id), { milestones: updated });
    const up = {...selPet, milestones: updated};
    setPets(prev=>prev.map(p=>p.id===selPet.id?up:p));
    setSelPet(up);
    setMForm({date:new Date().toISOString().split('T')[0],title:'',note:'',emoji:'🎂'});
    setView('detail');
  }

  // ── Parazit kaydı ────────────────────────────────────────────────────────────
  async function addParasite() {
    if (!pForm.date || !pForm.product || !selPet) return;
    const newP: Parasite = { id: Date.now().toString(), ...pForm };
    const updated = [...(selPet.parasites||[]), newP].sort((a,b)=>b.date.localeCompare(a.date));
    await updateDoc(doc(db,'pets',selPet.id), { parasites: updated });
    const up = {...selPet, parasites: updated};
    setPets(prev=>prev.map(p=>p.id===selPet.id?up:p));
    setSelPet(up);
    setPForm({type:'Pire & Kene',date:'',nextDate:'',product:'',vet:''});
    setView('detail');
  }

  // ── Günlük log ───────────────────────────────────────────────────────────────
  async function addDailyLog() {
    if (!selPet) return;
    const newD: DailyLog = { id: Date.now().toString(), ...dForm };
    const updated = [...(selPet.dailyLogs||[]), newD].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,90); // Son 90 gün
    await updateDoc(doc(db,'pets',selPet.id), { dailyLogs: updated });
    const up = {...selPet, dailyLogs: updated};
    setPets(prev=>prev.map(p=>p.id===selPet.id?up:p));
    setSelPet(up);
    setDForm({date:new Date().toISOString().split('T')[0],mood:'great',appetite:'iyi',activity:'aktif',poop:'normal',note:''});
    setView('detail');
  }

  async function askAI() {
    if (!aiQ.trim() || !selPet) return;
    setAiLoading(true); setAiA('');
    try {
      const speciesLabel = SPECIES.find((s:any)=>s.val===selPet.species)?.label || selPet.species;
      const prompt = `Sen bir veteriner asistanissin. Petim hakkinda bilgiler:\nAd: ${selPet.name}\nTur: ${speciesLabel}\nCins: ${selPet.breed||'Belirtilmemis'}\nYas: ${calcAge(selPet.birthDate)}\nCinsiyet: ${selPet.gender==='female'?'Disi':'Erkek'}\nAgirlik: ${selPet.weight||'Belirtilmemis'} kg\nAlerjiler: ${selPet.allergies||'Yok'}\nHastaliklar: ${selPet.diseases||'Yok'}\nIlaclar: ${selPet.medications||'Yok'}\n\nSorum: ${aiQ}\n\nTurkce olarak kisa ve oz yanItla. Genel bilgi amaclidir, kesin tani icin veterinere gidilmeli.`;
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
          })
        }
      );
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setAiA(text || 'Yanit alinamadi.');
    } catch(e) { setAiA('Baglanti hatasi. Tekrar deneyin.'); }
    finally { setAiLoading(false); }
  }

  const INPUT = "w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all";
  const LABEL = "block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1";

  // ── Liste ────────────────────────────────────────────────────────────────────
  if (view==='list') return (
    <div className="min-h-screen bg-[#F7F2EA] lg:ml-[260px]">
      <div className="max-w-[900px] mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="text-xs px-3 py-2 rounded-full bg-white border border-[rgba(196,169,107,.2)] text-[#5C4A32] hover:bg-[#F7F2EA] transition-all">🌐 Ana Sayfa</Link>
          <Link href="/panel" className="text-xs px-3 py-2 rounded-full bg-white border border-[rgba(196,169,107,.2)] text-[#5C4A32] hover:bg-[#F7F2EA] transition-all">← Kontrol Paneli</Link>
        </div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-[#2F2622]">🐾 Pet Pasaportlarım</h1>
            <p className="text-sm text-[#7A7368] mt-1">{pets.length} pet · Tüm sağlık kayıtları burada</p>
          </div>
          <button onClick={()=>{setForm({...EMPTY_PET});setAvatarFile(null);setAvatarPrev('');setSelPet(null);setStep(1);setView('form');}}
            disabled={pets.length >= limits.maxPets}
          className={`text-sm font-semibold px-5 py-3 rounded-full transition-all flex items-center gap-2 ${pets.length >= limits.maxPets ? 'bg-[#E3D9C6] text-[#9A9188] cursor-not-allowed' : 'bg-[#C9832E] text-white hover:bg-[#b87523]'}`}>
            {pets.length >= limits.maxPets ? `Limit Doldu (${limits.maxPets})` : '+ Yeni Pet Ekle'}
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
          <div className="flex items-center gap-3 mb-4">
            <button onClick={()=>{setSelPet(null);setView('list');}} className="text-xs px-3 py-2 rounded-full bg-white border border-[rgba(196,169,107,.2)] text-[#5C4A32] hover:bg-[#F7F2EA]">🌐 Ana Sayfa</button>
            <button onClick={()=>{setSelPet(null);setView('list');}} className="text-xs px-3 py-2 rounded-full bg-white border border-[rgba(196,169,107,.2)] text-[#5C4A32] hover:bg-[#F7F2EA]">← Tüm Petler</button>
          </div>

          {/* Profil header */}
          <div className="bg-white rounded-[24px] border border-[rgba(196,169,107,.12)] overflow-hidden mb-5 shadow-sm">
            <div className="h-32 bg-gradient-to-br from-[#2F2622] to-[#5C4A32] relative">
              {selPet.avatarUrl && <img src={selPet.avatarUrl} alt={selPet.name} className="w-full h-full object-cover opacity-40"/>}
            </div>
            <div className="px-6 pb-6">
              <div className="flex items-end gap-4 -mt-10 mb-4">
                <div className="w-20 h-20 rounded-full border-4 border-white bg-[#F7F2EA] flex items-center justify-center text-4xl overflow-hidden shadow-lg flex-shrink-0">
                  {selPet.avatarUrl ? <img src={selPet.avatarUrl} alt="" className="w-full h-full object-cover"/> : spec?.emoji||'🐾'}
                </div>
                <div className="flex-1 min-w-0 pb-1">
                  <h1 className="font-serif text-2xl font-semibold text-[#2F2622]">{selPet.name}</h1>
                  <p className="text-sm text-[#7A7368]">{spec?.label}{selPet.breed?` · ${selPet.breed}`:''}{selPet.birthDate?` · ${calcAge(selPet.birthDate)}`:''}</p>
                </div>
                <div className="flex gap-2 pb-1">
                  <button onClick={()=>{setForm({...EMPTY_PET,...selPet});setAvatarPrev(selPet.avatarUrl||'');setStep(1);setView('form');}} className="text-xs px-3 py-2 rounded-full border border-[#8B7355] text-[#5C4A32] hover:bg-[#5C4A32] hover:text-white transition-all">✏️ Düzenle</button>
                  <button onClick={()=>deletePet(selPet.id)} className="text-xs px-3 py-2 rounded-full border border-red-200 text-red-500 hover:bg-red-50">🗑</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {selPet.isVaccinated && <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full">✓ Aşılı</span>}
                {selPet.isSterilized && <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full">✓ Kısırlaştırılmış</span>}
                {selPet.microchipId  && <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full">✓ Mikroçip: {selPet.microchipId}</span>}
                {selPet.insurance    && <span className="text-xs bg-[rgba(201,131,46,.1)] text-[#C9832E] px-3 py-1 rounded-full">🛡️ Sigortalı</span>}
              </div>
              {(overdueVaccines.length>0||upcomingVaccines.length>0) && (
                <div className={`rounded-[12px] p-3 text-xs ${overdueVaccines.length>0?'bg-red-50 border border-red-200 text-red-700':'bg-[rgba(201,131,46,.08)] border border-[rgba(201,131,46,.2)] text-[#C9832E]'}`}>
                  {overdueVaccines.length>0 ? `⚠️ ${overdueVaccines.length} aşı gecikmiş!` : `🔔 ${upcomingVaccines.length} aşı yaklaşıyor`}
                </div>
              )}
            </div>
          </div>

          {/* Tab menü */}
          <div className="bg-white rounded-[16px] border border-[rgba(196,169,107,.12)] p-1 mb-4 flex gap-1 overflow-x-auto" style={{scrollbarWidth:'none'}}>
            {[
              {val:'ozet',      label:'📊 Özet'},
              {val:'asilar',    label:'💉 Aşılar'},
              {val:'saglik',    label:'🏥 Sağlık'},
              {val:'kilo',      label:'⚖️ Kilo'},
              {val:'parazit',   label:'🦟 Parazit'},
              {val:'gunluk',    label:'📅 Günlük'},
              {val:'milestone', label:'🏆 Anlar'},
              {val:'ai',        label:'🤖 AI'},
            ].map(t=>(
              <button key={t.val} onClick={()=>setActiveTab(t.val as any)}
                className={`flex-shrink-0 px-3 py-2 rounded-[10px] text-xs font-medium transition-all whitespace-nowrap ${activeTab===t.val?'bg-[#5C4A32] text-white':'text-[#7A7368] hover:text-[#2F2622]'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ÖZET TAB */}
          {activeTab==='ozet' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {icon:'💉', label:'Aşı',      val:(selPet.vaccines||[]).length,       color:'#C9832E'},
                  {icon:'🏥', label:'Muayene',   val:(selPet.healthRecords||[]).length,  color:'#1D9E75'},
                  {icon:'⚖️', label:'Kilo Kay.', val:(selPet.weightHistory||[]).length,  color:'#534AB7'},
                  {icon:'🦟', label:'Parazit',   val:(selPet.parasites||[]).length,      color:'#D85A30'},
                ].map(s=>(
                  <div key={s.label} className="bg-white rounded-[14px] border border-[rgba(196,169,107,.12)] p-3 text-center">
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className="font-serif text-xl font-semibold" style={{color:s.color}}>{s.val}</div>
                    <div className="text-[10px] text-[#9A9188]">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5">
                <h3 className="font-serif text-base font-semibold text-[#2F2622] mb-3">⏱️ Canlı Takip</h3>
                <div className="space-y-2">
                  {selPet.birthDate && (
                    <div className="flex items-center justify-between p-3 bg-[#F7F2EA] rounded-[12px]">
                      <div className="text-sm text-[#5C4A32]">🎂 Yaşı</div>
                      <div className="font-semibold text-sm text-[#2F2622]">{calcAge(selPet.birthDate)}</div>
                    </div>
                  )}
                  {selPet.birthDate && (()=>{
                    const b=new Date(selPet.birthDate); const now=new Date();
                    const next=new Date(now.getFullYear(),b.getMonth(),b.getDate());
                    if(next<now) next.setFullYear(now.getFullYear()+1);
                    const days=Math.ceil((next.getTime()-now.getTime())/(1000*60*60*24));
                    return (
                      <div className="flex items-center justify-between p-3 bg-[#F7F2EA] rounded-[12px]">
                        <div className="text-sm text-[#5C4A32]">🎂 Sonraki Doğum Günü</div>
                        <div className="font-semibold text-sm text-[#2F2622]">{days===0?'🎉 Bugün!':days===1?'Yarın!':days+' gün sonra'}</div>
                      </div>
                    );
                  })()}
                  {selPet.weight && (
                    <div className="flex items-center justify-between p-3 bg-[#F7F2EA] rounded-[12px]">
                      <div className="text-sm text-[#5C4A32]">⚖️ Güncel Ağırlık</div>
                      <div className="font-semibold text-sm text-[#2F2622]">{selPet.weight} kg</div>
                    </div>
                  )}
                  {(selPet.vaccines||[]).filter(v=>v.nextDate&&daysUntil(v.nextDate)>=0).sort((a,b)=>a.nextDate.localeCompare(b.nextDate))[0] && (()=>{
                    const v=(selPet.vaccines||[]).filter(x=>x.nextDate&&daysUntil(x.nextDate)>=0).sort((a,b)=>a.nextDate.localeCompare(b.nextDate))[0];
                    const d=daysUntil(v.nextDate);
                    return (
                      <div className="flex items-center justify-between p-3 bg-[rgba(201,131,46,.06)] rounded-[12px] border border-[rgba(201,131,46,.2)]">
                        <div className="text-sm text-[#C9832E]">💉 Sonraki Aşı</div>
                        <div className="font-semibold text-sm text-[#C9832E]">{v.name} — {d===0?'Bugün':d+' gün'}</div>
                      </div>
                    );
                  })()}
                  {(selPet.parasites||[]).filter(p=>p.nextDate&&daysUntil(p.nextDate)>=0).sort((a,b)=>a.nextDate.localeCompare(b.nextDate))[0] && (()=>{
                    const p=(selPet.parasites||[]).filter(x=>x.nextDate&&daysUntil(x.nextDate)>=0).sort((a,b)=>a.nextDate.localeCompare(b.nextDate))[0];
                    const d=daysUntil(p.nextDate);
                    return (
                      <div className="flex items-center justify-between p-3 rounded-[12px] border" style={{background:'rgba(216,90,48,.06)',borderColor:'rgba(216,90,48,.2)'}}>
                        <div className="text-sm" style={{color:'#D85A30'}}>🦟 Sonraki Parazit</div>
                        <div className="font-semibold text-sm" style={{color:'#D85A30'}}>{p.type} — {d===0?'Bugün':d+' gün'}</div>
                      </div>
                    );
                  })()}
                </div>
              </div>
              {(selPet.dailyLogs||[]).length>0 && (
                <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5">
                  <h3 className="font-serif text-base font-semibold text-[#2F2622] mb-3">📅 Son Günler</h3>
                  <div className="space-y-2">
                    {(selPet.dailyLogs||[]).slice(0,5).map((log:any)=>(
                      <div key={log.id} className="flex items-center gap-3 p-2 bg-[#F7F2EA] rounded-[10px]">
                        <div className="text-xs text-[#9A9188] w-20 flex-shrink-0">{log.date}</div>
                        <span className="text-base">{MOODS.find(m=>m.val===log.mood)?.emoji||'😐'}</span>
                        <div className="text-xs text-[#5C4A32] flex-1">İştah: {log.appetite} · Aktivite: {log.activity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AŞI TAB */}
          {activeTab==='asilar' && (
            <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-semibold text-[#2F2622]">💉 Aşı Kayıtları</h3>
                <button onClick={()=>setView('vaccine')} className="text-xs px-3 py-2 rounded-full bg-[#C9832E] text-white hover:bg-[#b87523]">+ Aşı Ekle</button>
              </div>
              {(selPet.vaccines||[]).length===0 ? (
                <div className="text-center py-6 text-[#9A9188] text-sm">Henüz aşı kaydı yok.</div>
              ) : (
                <div className="space-y-2">
                  {[...(selPet.vaccines||[])].sort((a,b)=>b.date.localeCompare(a.date)).map(v=>{
                    const du=v.nextDate?daysUntil(v.nextDate):null;
                    return (
                      <div key={v.id} className="border border-[#F7F2EA] rounded-[12px] p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm text-[#2F2622]">{v.name}</span>
                          <button onClick={()=>removeVaccine(v.id)} className="text-red-400 text-xs hover:text-red-600">✕</button>
                        </div>
                        <div className="text-xs text-[#9A9188]">Tarih: {v.date}{v.vet?` · ${v.vet}`:''}</div>
                        {du!==null && <div className={`text-xs mt-1 font-medium ${du<0?'text-red-500':du<=7?'text-[#C9832E]':'text-green-600'}`}>
                          {du<0?`⚠️ ${Math.abs(du)} gün gecikmiş`:du===0?'🔴 Bugün!':du<=30?`🔔 ${du} gün sonra`:`✓ ${v.nextDate}`}
                        </div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SAĞLIK TAB */}
          {activeTab==='saglik' && (
            <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-semibold text-[#2F2622]">📋 Sağlık Geçmişi</h3>
                <button onClick={()=>setView('health')} className="text-xs px-3 py-2 rounded-full bg-[#5C4A32] text-white hover:bg-[#2F2622]">+ Kayıt Ekle</button>
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
          )}

          {/* KİLO TAB */}
          {activeTab==='kilo' && (
            <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-semibold text-[#2F2622]">⚖️ Kilo Takibi</h3>
                <button onClick={()=>setView('weight')} className="text-xs px-3 py-2 rounded-full bg-[#534AB7] text-white hover:opacity-90">+ Kilo Ekle</button>
              </div>
              {(selPet.weightHistory||[]).length===0 ? (
                <div className="text-center py-6 text-[#9A9188] text-sm">Henüz kilo kaydı yok.</div>
              ) : (
                <div className="space-y-2">
                  {[...(selPet.weightHistory||[])].sort((a,b)=>b.date.localeCompare(a.date)).map((w:any,i:number,arr:any[])=>{
                    const prev=arr[i+1]; const diff=prev?w.weight-prev.weight:0;
                    return (
                      <div key={w.id} className="flex items-center gap-3 p-3 bg-[#F7F2EA] rounded-[12px]">
                        <div className="w-10 h-10 rounded-full bg-[#534AB7] text-white flex items-center justify-center text-sm flex-shrink-0">⚖️</div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-[#2F2622]">{w.weight} kg</div>
                          <div className="text-xs text-[#9A9188]">{w.date}{w.note?` · ${w.note}`:''}</div>
                        </div>
                        {diff!==0 && <span className={`text-xs font-bold ${diff>0?'text-red-500':'text-green-500'}`}>{diff>0?'▲':'▼'}{Math.abs(diff).toFixed(1)} kg</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* PARAZİT TAB */}
          {activeTab==='parazit' && (
            <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-semibold text-[#2F2622]">🦟 Parazit Tedavisi</h3>
                <button onClick={()=>setView('parasite')} className="text-xs px-3 py-2 rounded-full text-white hover:opacity-90" style={{background:'#D85A30'}}>+ Tedavi Ekle</button>
              </div>
              {(selPet.parasites||[]).length===0 ? (
                <div className="text-center py-6 text-[#9A9188] text-sm">Henüz parazit kaydı yok.</div>
              ) : (
                <div className="space-y-2">
                  {[...(selPet.parasites||[])].sort((a,b)=>b.date.localeCompare(a.date)).map((p:any)=>{
                    const du=p.nextDate?daysUntil(p.nextDate):null;
                    return (
                      <div key={p.id} className="border border-[#F7F2EA] rounded-[12px] p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm text-[#2F2622]">🦟 {p.type}</span>
                          <span className="text-xs text-[#9A9188]">{p.date}</span>
                        </div>
                        <div className="text-xs text-[#7A7368]">Ürün: {p.product}{p.vet?` · ${p.vet}`:''}</div>
                        {du!==null && <div className={`text-xs mt-1 font-medium ${du<0?'text-red-500':du<=7?'text-[#C9832E]':'text-green-600'}`}>
                          {du<0?`⚠️ ${Math.abs(du)} gün gecikmiş`:du===0?'🔴 Bugün!':du<=7?`🔔 ${du} gün sonra`:`✓ ${p.nextDate}`}
                        </div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* GÜNLÜK TAB */}
          {activeTab==='gunluk' && (
            <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-semibold text-[#2F2622]">📅 Günlük Takip</h3>
                <button onClick={()=>setView('daily')} className="text-xs px-3 py-2 rounded-full bg-[#1D9E75] text-white hover:opacity-90">+ Bugün Ekle</button>
              </div>
              {(selPet.dailyLogs||[]).length===0 ? (
                <div className="text-center py-6 text-[#9A9188] text-sm">Henüz günlük kayıt yok.</div>
              ) : (
                <div className="space-y-2">
                  {(selPet.dailyLogs||[]).slice(0,30).map((log:any)=>(
                    <div key={log.id} className="border border-[#F7F2EA] rounded-[12px] p-3">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{MOODS.find(m=>m.val===log.mood)?.emoji}</span>
                        <span className="font-semibold text-sm text-[#2F2622]">{log.date}</span>
                        <span className="text-xs text-[#9A9188] ml-auto">{MOODS.find(m=>m.val===log.mood)?.label}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-center">
                        <div className="bg-[#F7F2EA] rounded-[8px] p-2"><div className="text-[#9A9188] mb-1">İştah</div><div className="font-medium">{log.appetite}</div></div>
                        <div className="bg-[#F7F2EA] rounded-[8px] p-2"><div className="text-[#9A9188] mb-1">Aktivite</div><div className="font-medium">{log.activity}</div></div>
                        <div className="bg-[#F7F2EA] rounded-[8px] p-2"><div className="text-[#9A9188] mb-1">Dışkı</div><div className="font-medium">{log.poop}</div></div>
                      </div>
                      {log.note && <div className="text-xs text-[#7A7368] mt-2">{log.note}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MİLESTONE TAB */}
          {activeTab==='milestone' && (
            <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-semibold text-[#2F2622]">🏆 Özel Anlar</h3>
                <button onClick={()=>setView('milestone')} className="text-xs px-3 py-2 rounded-full bg-[#C9832E] text-white hover:bg-[#b87523]">+ An Ekle</button>
              </div>
              {(selPet.milestones||[]).length===0 ? (
                <div className="text-center py-6 text-[#9A9188] text-sm">Henüz özel an eklenmedi.</div>
              ) : (
                <div className="space-y-3">
                  {(selPet.milestones||[]).map((m:any)=>(
                    <div key={m.id} className="flex items-start gap-3 p-3 bg-[#F7F2EA] rounded-[12px]">
                      <span className="text-3xl flex-shrink-0">{m.emoji}</span>
                      <div>
                        <div className="font-semibold text-sm text-[#2F2622]">{m.title}</div>
                        <div className="text-xs text-[#9A9188] mb-1">{m.date}</div>
                        {m.note && <div className="text-xs text-[#5C4A32]">{m.note}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AI TAB */}
          {activeTab==='ai' && (
            <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5">
              <h3 className="font-serif text-lg font-semibold text-[#2F2622] mb-1">🤖 AI Veteriner Asistanı</h3>
              <p className="text-xs text-[#9A9188] mb-4">{selPet.name} hakkında her şeyi biliyor. Sağlık, beslenme, davranış hakkında sor.</p>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 mb-2">
                  {['Aşı takvimi nasıl?','Beslenme önerisi','Kilo durumu normal mi?','Parazit koruması','Yaşına göre bakım'].map(q=>(
                    <button key={q} onClick={()=>setAiQ(q)} className="text-xs px-3 py-1 rounded-full bg-[#F7F2EA] border border-[#E3D9C6] text-[#5C4A32] hover:border-[#C9832E] hover:text-[#C9832E] transition-all">{q}</button>
                  ))}
                </div>
                <textarea value={aiQ} onChange={e=>setAiQ(e.target.value)} rows={3}
                  placeholder={`${selPet.name} hakkında sormak istediğin bir şey var mı?`}
                  className="w-full px-4 py-3 rounded-[14px] bg-[#F7F2EA] border border-[#E3D9C6] text-sm text-[#2F2622] resize-none focus:outline-none focus:border-[#C9832E]"/>
                <button onClick={askAI} disabled={!aiQ.trim()||aiLoading}
                  className="w-full py-3 rounded-full bg-[#2F2622] text-white text-sm font-semibold hover:bg-[#5C4A32] disabled:opacity-60">
                  {aiLoading?'Analiz ediliyor…':'🤖 Sor →'}
                </button>
                {aiA && (
                  <div className="bg-[#F7F2EA] rounded-[14px] p-4 text-sm text-[#2F2622] leading-relaxed whitespace-pre-wrap border border-[#E3D9C6]">
                    <div className="text-[10px] text-[#9A9188] uppercase tracking-[.1em] mb-2">AI Yanıtı</div>
                    {aiA}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // ── Kilo Ekle ────────────────────────────────────────────────────────────────
  if (view==='weight' && selPet) return (
    <div className="min-h-screen bg-[#F7F2EA] lg:ml-[260px]">
      <div className="max-w-[600px] mx-auto px-4 py-8">
        <button onClick={()=>setView('detail')} className="text-sm text-[#7A7368] hover:text-[#2F2622] mb-6 flex items-center gap-1">← {selPet.name}'e Dön</button>
        <h2 className="font-serif text-2xl font-semibold text-[#2F2622] mb-6">⚖️ Kilo Kaydı Ekle</h2>
        <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={LABEL}>Tarih *</label><input type="date" value={wForm.date} onChange={e=>setWForm(p=>({...p,date:e.target.value}))} className={INPUT}/></div>
            <div><label className={LABEL}>Kilo (kg) *</label><input type="number" step="0.1" value={wForm.weight} onChange={e=>setWForm(p=>({...p,weight:e.target.value}))} placeholder="4.2" className={INPUT}/></div>
          </div>
          <div><label className={LABEL}>Not</label><input value={wForm.note||''} onChange={e=>setWForm(p=>({...p,note:e.target.value}))} placeholder="Veteriner ziyareti sonrası..." className={INPUT}/></div>
          {selPet.weight && <div className="bg-[#F7F2EA] rounded-[12px] p-3 text-sm text-[#5C4A32]">Son kayıt: <strong>{selPet.weight} kg</strong>{wForm.weight?` → ${wForm.weight} kg`:''}</div>}
          <button onClick={addWeight} disabled={!wForm.weight} className="w-full py-3 rounded-full bg-[#534AB7] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60">Kilo Kaydet →</button>
        </div>
      </div>
    </div>
  );

  // ── Milestone Ekle ────────────────────────────────────────────────────────────
  if (view==='milestone' && selPet) return (
    <div className="min-h-screen bg-[#F7F2EA] lg:ml-[260px]">
      <div className="max-w-[600px] mx-auto px-4 py-8">
        <button onClick={()=>setView('detail')} className="text-sm text-[#7A7368] hover:text-[#2F2622] mb-6 flex items-center gap-1">← {selPet.name}'e Dön</button>
        <h2 className="font-serif text-2xl font-semibold text-[#2F2622] mb-6">🏆 Özel An Ekle</h2>
        <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6 space-y-4">
          <div><label className={LABEL}>Emoji</label>
            <div className="flex flex-wrap gap-2">{MILESTONE_EMOJIS.map(e=><button key={e} type="button" onClick={()=>setMForm(p=>({...p,emoji:e}))} className={`text-2xl w-10 h-10 rounded-[10px] transition-all ${mForm.emoji===e?'bg-[rgba(201,131,46,.15)] border-2 border-[#C9832E]':'hover:bg-[#F7F2EA]'}`}>{e}</button>)}</div>
          </div>
          <div><label className={LABEL}>Tarih *</label><input type="date" value={mForm.date} onChange={e=>setMForm(p=>({...p,date:e.target.value}))} className={INPUT}/></div>
          <div><label className={LABEL}>Başlık *</label><input value={mForm.title} onChange={e=>setMForm(p=>({...p,title:e.target.value}))} placeholder="İlk veteriner ziyareti, yuvasına geldi..." className={INPUT}/></div>
          <div><label className={LABEL}>Not</label><textarea value={mForm.note} onChange={e=>setMForm(p=>({...p,note:e.target.value}))} rows={3} className={INPUT+' resize-none'}/></div>
          <button onClick={addMilestone} disabled={!mForm.title} className="w-full py-3 rounded-full bg-[#C9832E] text-white text-sm font-semibold hover:bg-[#b87523] disabled:opacity-60">Anı Kaydet →</button>
        </div>
      </div>
    </div>
  );

  // ── Parazit Ekle ──────────────────────────────────────────────────────────────
  if (view==='parasite' && selPet) return (
    <div className="min-h-screen bg-[#F7F2EA] lg:ml-[260px]">
      <div className="max-w-[600px] mx-auto px-4 py-8">
        <button onClick={()=>setView('detail')} className="text-sm text-[#7A7368] hover:text-[#2F2622] mb-6 flex items-center gap-1">← {selPet.name}'e Dön</button>
        <h2 className="font-serif text-2xl font-semibold text-[#2F2622] mb-6">🦟 Parazit Tedavisi Ekle</h2>
        <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6 space-y-4">
          <div><label className={LABEL}>Tedavi Türü</label>
            <select value={pForm.type} onChange={e=>setPForm(p=>({...p,type:e.target.value}))} className={INPUT}>
              {PARASITE_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={LABEL}>Uygulama Tarihi *</label><input type="date" value={pForm.date} onChange={e=>setPForm(p=>({...p,date:e.target.value}))} className={INPUT}/></div>
            <div><label className={LABEL}>Sonraki Tarih</label><input type="date" value={pForm.nextDate} onChange={e=>setPForm(p=>({...p,nextDate:e.target.value}))} className={INPUT}/></div>
          </div>
          <div><label className={LABEL}>Ürün Adı *</label><input value={pForm.product} onChange={e=>setPForm(p=>({...p,product:e.target.value}))} placeholder="Frontline, Drontal..." className={INPUT}/></div>
          <div><label className={LABEL}>Veteriner</label><input value={pForm.vet} onChange={e=>setPForm(p=>({...p,vet:e.target.value}))} className={INPUT}/></div>
          <button onClick={addParasite} disabled={!pForm.date||!pForm.product} className="w-full py-3 rounded-full text-white text-sm font-semibold disabled:opacity-60" style={{background:'#D85A30'}}>Tedaviyi Kaydet →</button>
        </div>
      </div>
    </div>
  );

  // ── Günlük Log Ekle ───────────────────────────────────────────────────────────
  if (view==='daily' && selPet) return (
    <div className="min-h-screen bg-[#F7F2EA] lg:ml-[260px]">
      <div className="max-w-[600px] mx-auto px-4 py-8">
        <button onClick={()=>setView('detail')} className="text-sm text-[#7A7368] hover:text-[#2F2622] mb-6 flex items-center gap-1">← {selPet.name}'e Dön</button>
        <h2 className="font-serif text-2xl font-semibold text-[#2F2622] mb-6">📅 Günlük Durum Ekle</h2>
        <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6 space-y-4">
          <div><label className={LABEL}>Tarih</label><input type="date" value={dForm.date} onChange={e=>setDForm(p=>({...p,date:e.target.value}))} className={INPUT}/></div>
          <div><label className={LABEL}>Genel Ruh Hali</label>
            <div className="flex gap-3">{MOODS.map(m=><button key={m.val} type="button" onClick={()=>setDForm(p=>({...p,mood:m.val}))} className={`flex-1 py-3 rounded-[12px] border-[1.5px] text-center transition-all ${dForm.mood===m.val?'border-[#C9832E] bg-[rgba(201,131,46,.06)]':'border-[#E3D9C6]'}`}><div className="text-2xl">{m.emoji}</div><div className="text-xs text-[#5C4A32] mt-1">{m.label}</div></button>)}</div>
          </div>
          {[
            {k:'appetite', label:'İştah', opts:['çok iyi','iyi','normal','az','yok']},
            {k:'activity', label:'Aktivite', opts:['çok aktif','aktif','normal','pasif','yatıyor']},
            {k:'poop',     label:'Dışkı',    opts:['normal','yumuşak','sulu','sert','yok']},
          ].map(f=>(
            <div key={f.k}><label className={LABEL}>{f.label}</label>
              <div className="flex flex-wrap gap-2">{f.opts.map(o=><button key={o} type="button" onClick={()=>setDForm(p=>({...p,[f.k]:o}))} className={`px-3 py-1 rounded-full text-xs border-[1.5px] transition-all ${(dForm as any)[f.k]===o?'bg-[#5C4A32] text-white border-[#5C4A32]':'border-[#E3D9C6] text-[#5C4A32]'}`}>{o}</button>)}</div>
            </div>
          ))}
          <div><label className={LABEL}>Not</label><textarea value={dForm.note||''} onChange={e=>setDForm(p=>({...p,note:e.target.value}))} rows={3} placeholder="Bugün nasıldı?" className={INPUT+' resize-none'}/></div>
          <button onClick={addDailyLog} className="w-full py-3 rounded-full bg-[#1D9E75] text-white text-sm font-semibold hover:opacity-90">Günü Kaydet →</button>
        </div>
      </div>
    </div>
  );

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
