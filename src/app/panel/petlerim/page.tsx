'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthChange } from '@/lib/auth';
import {
  createPet, updatePet, deletePet, getUserPets, addVaccine, addHealthRecord,
  uploadPetAvatar, getSpeciesEmoji,
  type Pet, type Vaccine, type HealthRecord, type SpeciesType, type GenderType,
} from '@/lib/pets';
import type { User } from 'firebase/auth';

const SPECIES = [
  {val:'cat',label:'🐱 Kedi'},{val:'dog',label:'🐶 Köpek'},{val:'bird',label:'🐦 Kuş'},
  {val:'rabbit',label:'🐰 Tavşan'},{val:'hamster',label:'🐹 Hamster'},
  {val:'turtle',label:'🐢 Kaplumbağa'},{val:'fish',label:'🐟 Balık'},{val:'other',label:'🐾 Diğer'},
];

const EMPTY: Omit<Pet,'id'|'createdAt'|'updatedAt'|'ownerId'> = {
  name:'',species:'cat',breed:'',birthDate:'',gender:'unknown',
  weight:undefined,color:'',microchipId:'',allergies:'',notes:'',
  avatarUrl:'',isVaccinated:false,isSterilized:false,vaccines:[],healthRecords:[],
};

const BG: Record<string,string> = {
  cat:'from-[#EDD5BE] to-[#C9A98C]',dog:'from-[#D8E8D0] to-[#9EC49A]',
  bird:'from-[#D5E0F0] to-[#9AB0D4]',rabbit:'from-[#F0D5E8] to-[#D49AC0]',
  hamster:'from-[#F0EAD5] to-[#D4C49A]',turtle:'from-[#D5F0D8] to-[#9AD4A0]',
  fish:'from-[#D5EEF0] to-[#9AC8D4]',other:'from-[#EDE5D3] to-[#C9A98C]',
};

const INPUT = "w-full px-3 py-[11px] rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all";
const LABEL = "block text-[10px] font-medium tracking-[.1em] uppercase text-[#7A7368] mb-1";

export default function PetlerimPage() {
  const router = useRouter();
  const [user,setUser]=useState<User|null>(null);
  const [pets,setPets]=useState<Pet[]>([]);
  const [loading,setLoading]=useState(true);
  const [modal,setModal]=useState<'pet'|'vaccine'|'health'|'passport'|null>(null);
  const [selPet,setSelPet]=useState<Pet|null>(null);
  const [form,setForm]=useState({...EMPTY});
  const [avatarFile,setAvatarFile]=useState<File|null>(null);
  const [avatarPrev,setAvatarPrev]=useState('');
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  const [vaccForm,setVaccForm]=useState({name:'',date:'',nextDate:'',vetName:'',notes:''});
  const [hlthForm,setHlthForm]=useState({type:'checkup' as HealthRecord['type'],date:'',title:'',notes:'',vetName:'',cost:''});
  const fileRef=useRef<HTMLInputElement>(null);

  useEffect(()=>{
    const unsub=onAuthChange(async(u)=>{
      if(!u){router.push('/giris');return;}
      setUser(u); await load(u.uid); setLoading(false);
    });
    return()=>unsub();
  },[router]);

  async function load(uid:string){try{setPets(await getUserPets(uid));}catch(e){console.error(e);}}

  function openNew(){setForm({...EMPTY});setAvatarFile(null);setAvatarPrev('');setSelPet(null);setError('');setModal('pet');}
  function openEdit(pet:Pet){
    setForm({name:pet.name,species:pet.species,breed:pet.breed||'',birthDate:pet.birthDate||'',
      gender:pet.gender,weight:pet.weight,color:pet.color||'',microchipId:pet.microchipId||'',
      allergies:pet.allergies||'',notes:pet.notes||'',avatarUrl:pet.avatarUrl||'',
      isVaccinated:pet.isVaccinated,isSterilized:pet.isSterilized,vaccines:pet.vaccines,healthRecords:pet.healthRecords});
    setAvatarFile(null);setAvatarPrev('');setSelPet(pet);setError('');setModal('pet');
  }

  async function handleSave(e:React.FormEvent){
    e.preventDefault();setError('');
    if(!form.name){setError('Pet adı zorunlu.');return;}
    if(!user)return;
    setSaving(true);
    try{
      let avatarUrl=form.avatarUrl||'';
      const petId=selPet?.id||`temp_${Date.now()}`;
      if(avatarFile)avatarUrl=await uploadPetAvatar(user.uid,petId,avatarFile);
      const payload={...form,avatarUrl,ownerId:user.uid};
      if(selPet?.id)await updatePet(selPet.id,payload);
      else await createPet(payload);
      await load(user.uid);setModal(null);
    }catch(err:any){setError('Hata: '+err.message);}
    finally{setSaving(false);}
  }

  async function handleDelete(pet:Pet){
    if(!confirm(`${pet.name} silinsin mi?`))return;
    await deletePet(pet.id!);setPets(p=>p.filter(x=>x.id!==pet.id));
  }

  async function handleAddVaccine(e:React.FormEvent){
    e.preventDefault();if(!selPet?.id)return;setSaving(true);
    try{
      await addVaccine(selPet.id,vaccForm,selPet.vaccines||[]);
      const list=await getUserPets(user!.uid);setPets(list);
      const updated=list.find(p=>p.id===selPet.id);if(updated)setSelPet(updated);
      setVaccForm({name:'',date:'',nextDate:'',vetName:'',notes:''});setModal('passport');
    }catch(err:any){setError(err.message);}finally{setSaving(false);}
  }

  async function handleAddHealth(e:React.FormEvent){
    e.preventDefault();if(!selPet?.id)return;setSaving(true);
    try{
      await addHealthRecord(selPet.id,{...hlthForm,cost:hlthForm.cost?Number(hlthForm.cost):undefined},selPet.healthRecords||[]);
      const list=await getUserPets(user!.uid);setPets(list);
      const updated=list.find(p=>p.id===selPet.id);if(updated)setSelPet(updated);
      setHlthForm({type:'checkup',date:'',title:'',notes:'',vetName:'',cost:''});setModal('passport');
    }catch(err:any){setError(err.message);}finally{setSaving(false);}
  }

  if(loading)return(<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>);

  return(
    <div className="max-w-[1100px]">

      {/* PET MODAL */}
      {modal==='pet'&&(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[6px] z-[800] flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[24px] w-full max-w-[600px] p-6 sm:p-8 mt-8 shadow-[0_32px_80px_rgba(0,0,0,.2)]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-2xl font-semibold text-[#2F2622]">{selPet?'Pet Düzenle':'Yeni Pet Ekle 🐾'}</h2>
              <button onClick={()=>setModal(null)} className="w-8 h-8 rounded-full bg-[#F7F2EA] flex items-center justify-center text-[#7A7368] text-lg">✕</button>
            </div>
            {error&&<div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[12px] px-4 py-3 mb-4">{error}</div>}
            <form onSubmit={handleSave}>
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-20 h-20 rounded-[18px] bg-gradient-to-br ${BG[form.species]||BG.other} flex items-center justify-center text-4xl cursor-pointer overflow-hidden border-2 border-[#E3D9C6] hover:border-[#C9832E] transition-colors`}
                  onClick={()=>fileRef.current?.click()}>
                  {avatarPrev
                    ?<img src={avatarPrev} alt="" className="w-full h-full object-cover"/>
                    :form.avatarUrl
                    ?<img src={form.avatarUrl} alt="" className="w-full h-full object-cover"/>
                    :getSpeciesEmoji(form.species as SpeciesType)}
                </div>
                <div>
                  <button type="button" onClick={()=>fileRef.current?.click()} className="text-sm text-[#C9832E] font-medium hover:underline">Fotoğraf Ekle</button>
                  <div className="text-[11px] text-[#9A9188] mt-1">Max 5MB</div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e=>{
                  const f=e.target.files?.[0];if(!f)return;
                  setAvatarFile(f);setAvatarPrev(URL.createObjectURL(f));
                }}/>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><label className={LABEL}>Hayvan Türü</label>
                  <select value={form.species} onChange={e=>setForm(p=>({...p,species:e.target.value as SpeciesType}))} className={INPUT}>
                    {SPECIES.map(s=><option key={s.val} value={s.val}>{s.label}</option>)}
                  </select></div>
                <div><label className={LABEL}>Ad *</label>
                  <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Luna" required className={INPUT}/></div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div><label className={LABEL}>Irk</label><input value={form.breed} onChange={e=>setForm(p=>({...p,breed:e.target.value}))} placeholder="British SH" className={INPUT}/></div>
                <div><label className={LABEL}>Doğum</label><input type="date" value={form.birthDate} onChange={e=>setForm(p=>({...p,birthDate:e.target.value}))} className={INPUT}/></div>
                <div><label className={LABEL}>Cinsiyet</label>
                  <select value={form.gender} onChange={e=>setForm(p=>({...p,gender:e.target.value as GenderType}))} className={INPUT}>
                    <option value="unknown">Belirtilmemiş</option><option value="female">Dişi</option><option value="male">Erkek</option>
                  </select></div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div><label className={LABEL}>Ağırlık (kg)</label><input type="number" step="0.1" value={form.weight||''} onChange={e=>setForm(p=>({...p,weight:Number(e.target.value)}))} placeholder="4.2" className={INPUT}/></div>
                <div><label className={LABEL}>Renk</label><input value={form.color} onChange={e=>setForm(p=>({...p,color:e.target.value}))} placeholder="Gri" className={INPUT}/></div>
                <div><label className={LABEL}>Mikroçip No</label><input value={form.microchipId} onChange={e=>setForm(p=>({...p,microchipId:e.target.value}))} placeholder="900..." className={INPUT}/></div>
              </div>
              <div className="mb-3"><label className={LABEL}>Alerjiler</label><input value={form.allergies} onChange={e=>setForm(p=>({...p,allergies:e.target.value}))} className={INPUT}/></div>
              <div className="mb-4"><label className={LABEL}>Notlar</label><textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} rows={2} className={INPUT+' resize-none'}/></div>
              <div className="flex gap-4 mb-5">
                {[{k:'isVaccinated',l:'💉 Aşılı'},{k:'isSterilized',l:'✂ Kısır'}].map(({k,l})=>(
                  <label key={k} className="flex items-center gap-2 cursor-pointer bg-[#F7F2EA] rounded-[10px] px-3 py-2">
                    <input type="checkbox" checked={(form as any)[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.checked}))} className="w-4 h-4 accent-[#C9832E]"/>
                    <span className="text-sm text-[#5C4A32]">{l}</span>
                  </label>
                ))}
              </div>
              <button type="submit" disabled={saving} className="w-full py-[13px] rounded-[14px] bg-[#5C4A32] text-white text-[15px] font-medium hover:bg-[#2F2622] transition-all disabled:opacity-60">
                {saving?'Kaydediliyor…':selPet?'Güncelle':'Pet Ekle 🐾'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PASSPORT MODAL */}
      {modal==='passport'&&selPet&&(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[6px] z-[800] flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[24px] w-full max-w-[680px] p-6 sm:p-8 mt-8 shadow-[0_32px_80px_rgba(0,0,0,.2)]">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-[14px] bg-gradient-to-br ${BG[selPet.species]||BG.other} flex items-center justify-center text-3xl overflow-hidden`}>
                  {selPet.avatarUrl?<img src={selPet.avatarUrl} alt={selPet.name} className="w-full h-full object-cover"/>:getSpeciesEmoji(selPet.species)}
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-[#2F2622]">{selPet.name} — Pasaport</h2>
                  <div className="text-sm text-[#7A7368]">{selPet.breed} · {selPet.gender==='female'?'Dişi':selPet.gender==='male'?'Erkek':'—'}</div>
                </div>
              </div>
              <button onClick={()=>setModal(null)} className="w-8 h-8 rounded-full bg-[#F7F2EA] flex items-center justify-center text-[#7A7368] text-lg">✕</button>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[{l:'Ağırlık',v:selPet.weight?`${selPet.weight} kg`:'—'},{l:'Renk',v:selPet.color||'—'},{l:'Mikroçip',v:selPet.microchipId||'—'}].map(i=>(
                <div key={i.l} className="bg-[#F7F2EA] rounded-[12px] p-3">
                  <div className="text-[10px] uppercase tracking-[.1em] text-[#9A9188] mb-1">{i.l}</div>
                  <div className="text-sm font-medium text-[#2F2622] truncate">{i.v}</div>
                </div>
              ))}
            </div>
            {selPet.allergies&&<div className="bg-[rgba(201,131,46,.06)] border border-[rgba(201,131,46,.2)] rounded-[12px] px-4 py-3 mb-5 text-sm text-[#8B7355]">⚠ Alerjiler: {selPet.allergies}</div>}
            {/* Aşılar */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#2F2622]">💉 Aşı Kayıtları ({(selPet.vaccines||[]).length})</h3>
                <button onClick={()=>setModal('vaccine')} className="text-xs bg-[#C9832E] text-white px-3 py-1 rounded-full hover:bg-[#b87523] transition-colors">+ Ekle</button>
              </div>
              {(!selPet.vaccines||selPet.vaccines.length===0)
                ?<div className="text-sm text-[#9A9188] text-center py-4 bg-[#F7F2EA] rounded-[12px]">Henüz aşı kaydı yok</div>
                :<div className="flex flex-col gap-2">{selPet.vaccines.map(v=>(
                  <div key={v.id} className="bg-[#F7F2EA] rounded-[12px] px-4 py-3 flex items-center justify-between">
                    <div><div className="text-sm font-medium text-[#2F2622]">{v.name}</div><div className="text-xs text-[#7A7368]">{v.date}{v.vetName?` · ${v.vetName}`:''}</div></div>
                    {v.nextDate&&<span className="text-[10px] bg-[rgba(201,131,46,.12)] text-[#C9832E] px-2 py-1 rounded-full">Hatırlatma: {v.nextDate}</span>}
                  </div>
                ))}</div>
              }
            </div>
            {/* Sağlık */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#2F2622]">🩺 Sağlık Geçmişi ({(selPet.healthRecords||[]).length})</h3>
                <button onClick={()=>setModal('health')} className="text-xs bg-[#5C4A32] text-white px-3 py-1 rounded-full hover:bg-[#2F2622] transition-colors">+ Ekle</button>
              </div>
              {(!selPet.healthRecords||selPet.healthRecords.length===0)
                ?<div className="text-sm text-[#9A9188] text-center py-4 bg-[#F7F2EA] rounded-[12px]">Henüz sağlık kaydı yok</div>
                :<div className="flex flex-col gap-2">{selPet.healthRecords.map(h=>(
                  <div key={h.id} className="bg-[#F7F2EA] rounded-[12px] px-4 py-3">
                    <div className="flex items-center justify-between"><div className="text-sm font-medium text-[#2F2622]">{h.title}</div><span className="text-[10px] bg-white text-[#7A7368] px-2 py-1 rounded-full">{h.type}</span></div>
                    <div className="text-xs text-[#7A7368]">{h.date}{h.vetName?` · ${h.vetName}`:''}{h.cost?` · ₺${h.cost}`:''}</div>
                    {h.notes&&<div className="text-xs text-[#9A9188] mt-1">{h.notes}</div>}
                  </div>
                ))}</div>
              }
            </div>
          </div>
        </div>
      )}

      {/* VACCINE MODAL */}
      {modal==='vaccine'&&selPet&&(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[6px] z-[900] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[480px] p-6 shadow-[0_32px_80px_rgba(0,0,0,.2)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-xl font-semibold text-[#2F2622]">💉 Aşı Ekle — {selPet.name}</h3>
              <button onClick={()=>setModal('passport')} className="w-8 h-8 rounded-full bg-[#F7F2EA] flex items-center justify-center text-[#7A7368] text-lg">✕</button>
            </div>
            <form onSubmit={handleAddVaccine}>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><label className={LABEL}>Aşı Adı *</label><input value={vaccForm.name} onChange={e=>setVaccForm(p=>({...p,name:e.target.value}))} placeholder="Karma Aşı" required className={INPUT}/></div>
                <div><label className={LABEL}>Tarih *</label><input type="date" value={vaccForm.date} onChange={e=>setVaccForm(p=>({...p,date:e.target.value}))} required className={INPUT}/></div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><label className={LABEL}>Sonraki Aşı</label><input type="date" value={vaccForm.nextDate} onChange={e=>setVaccForm(p=>({...p,nextDate:e.target.value}))} className={INPUT}/></div>
                <div><label className={LABEL}>Veteriner</label><input value={vaccForm.vetName} onChange={e=>setVaccForm(p=>({...p,vetName:e.target.value}))} placeholder="Dr. Kaya" className={INPUT}/></div>
              </div>
              <div className="mb-4"><label className={LABEL}>Notlar</label><textarea value={vaccForm.notes} onChange={e=>setVaccForm(p=>({...p,notes:e.target.value}))} rows={2} className={INPUT+' resize-none'}/></div>
              <button type="submit" disabled={saving} className="w-full py-[13px] rounded-[14px] bg-[#C9832E] text-white text-[15px] font-medium hover:bg-[#b87523] transition-all disabled:opacity-60">
                {saving?'Kaydediliyor…':'Aşıyı Kaydet'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HEALTH MODAL */}
      {modal==='health'&&selPet&&(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[6px] z-[900] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[480px] p-6 shadow-[0_32px_80px_rgba(0,0,0,.2)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-xl font-semibold text-[#2F2622]">🩺 Sağlık Kaydı — {selPet.name}</h3>
              <button onClick={()=>setModal('passport')} className="w-8 h-8 rounded-full bg-[#F7F2EA] flex items-center justify-center text-[#7A7368] text-lg">✕</button>
            </div>
            <form onSubmit={handleAddHealth}>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><label className={LABEL}>Tür</label>
                  <select value={hlthForm.type} onChange={e=>setHlthForm(p=>({...p,type:e.target.value as HealthRecord['type']}))} className={INPUT}>
                    <option value="checkup">Kontrol</option><option value="treatment">Tedavi</option>
                    <option value="surgery">Operasyon</option><option value="medication">İlaç</option><option value="other">Diğer</option>
                  </select></div>
                <div><label className={LABEL}>Tarih *</label><input type="date" value={hlthForm.date} onChange={e=>setHlthForm(p=>({...p,date:e.target.value}))} required className={INPUT}/></div>
              </div>
              <div className="mb-3"><label className={LABEL}>Başlık *</label><input value={hlthForm.title} onChange={e=>setHlthForm(p=>({...p,title:e.target.value}))} placeholder="Yıllık kontrol" required className={INPUT}/></div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><label className={LABEL}>Veteriner</label><input value={hlthForm.vetName} onChange={e=>setHlthForm(p=>({...p,vetName:e.target.value}))} className={INPUT}/></div>
                <div><label className={LABEL}>Ücret (₺)</label><input type="number" value={hlthForm.cost} onChange={e=>setHlthForm(p=>({...p,cost:e.target.value}))} placeholder="250" className={INPUT}/></div>
              </div>
              <div className="mb-4"><label className={LABEL}>Notlar</label><textarea value={hlthForm.notes} onChange={e=>setHlthForm(p=>({...p,notes:e.target.value}))} rows={2} className={INPUT+' resize-none'}/></div>
              <button type="submit" disabled={saving} className="w-full py-[13px] rounded-[14px] bg-[#5C4A32] text-white text-[15px] font-medium hover:bg-[#2F2622] transition-all disabled:opacity-60">
                {saving?'Kaydediliyor…':'Kaydı Ekle'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#2F2622]">Pet Pasaportlarım</h1>
          <p className="text-sm text-[#7A7368] mt-1">{pets.length} pet profili</p>
        </div>
        <button onClick={openNew} className="bg-[#C9832E] text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#b87523] transition-colors">+ Yeni Pet Ekle</button>
      </div>

      {/* GRID */}
      {pets.length===0?(
        <div className="text-center py-16 bg-white rounded-[20px] border border-[rgba(196,169,107,.12)]">
          <div className="text-6xl mb-4">🐾</div>
          <h3 className="font-serif text-xl font-semibold text-[#2F2622] mb-2">Henüz pet eklenmemiş</h3>
          <p className="text-sm text-[#7A7368] mb-5">İlk petinizin profilini oluşturun.</p>
          <button onClick={openNew} className="bg-[#C9832E] text-white text-sm font-medium px-6 py-2 rounded-full">Pet Ekle</button>
        </div>
      ):(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pets.map(pet=>(
            <div key={pet.id} className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className={`h-32 bg-gradient-to-br ${BG[pet.species]||BG.other} flex items-center justify-center text-5xl overflow-hidden relative`}>
                {pet.avatarUrl?<img src={pet.avatarUrl} alt={pet.name} className="w-full h-full object-cover"/>:getSpeciesEmoji(pet.species)}
                {pet.isVaccinated&&<span className="absolute top-2 right-2 text-[10px] bg-[rgba(107,124,92,.9)] text-white px-2 py-[2px] rounded-full">Aşılı</span>}
              </div>
              <div className="p-4">
                <div className="font-serif text-xl font-semibold text-[#2F2622] mb-1">{pet.name}</div>
                <div className="text-xs text-[#7A7368] mb-3">{pet.breed||'—'} · {pet.gender==='female'?'Dişi':pet.gender==='male'?'Erkek':'—'}{pet.weight?` · ${pet.weight} kg`:''}</div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {pet.isVaccinated&&<span className="text-[10px] bg-[#EDE5D3] text-[#6E5A40] px-2 py-[2px] rounded-full">💉 Aşılı</span>}
                  {pet.isSterilized&&<span className="text-[10px] bg-[#EDE5D3] text-[#6E5A40] px-2 py-[2px] rounded-full">✂ Kısır</span>}
                  {pet.microchipId&&<span className="text-[10px] bg-[#EDE5D3] text-[#6E5A40] px-2 py-[2px] rounded-full">📡 Çip</span>}
                  <span className="text-[10px] bg-[rgba(201,131,46,.1)] text-[#C9832E] px-2 py-[2px] rounded-full">{(pet.vaccines||[]).length} aşı</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={()=>{setSelPet(pet);setModal('passport');}} className="col-span-2 bg-[#5C4A32] text-white text-xs font-medium py-2 rounded-full hover:bg-[#2F2622] transition-colors">📋 Pasaport</button>
                  <button onClick={()=>openEdit(pet)} className="border border-[#8B7355] text-[#5C4A32] text-xs font-medium py-2 rounded-full hover:bg-[#5C4A32] hover:text-white transition-all">✏</button>
                </div>
                <button onClick={()=>handleDelete(pet)} className="w-full mt-2 text-xs text-red-400 hover:text-red-600 transition-colors py-1">Sil</button>
              </div>
            </div>
          ))}
          <div onClick={openNew} className="border-2 border-dashed border-[#E3D9C6] rounded-[20px] min-h-[260px] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#C9832E] hover:bg-[#F5EDD4] transition-all">
            <div className="text-4xl">+</div>
            <div className="text-sm font-medium text-[#7A7368]">Yeni Pet Ekle</div>
          </div>
        </div>
      )}
    </div>
  );
}
