import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, query, where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

export type SpeciesType = 'cat'|'dog'|'bird'|'rabbit'|'hamster'|'turtle'|'fish'|'other';
export type GenderType  = 'female'|'male'|'unknown';

export interface Vaccine {
  id: string; name: string; date: string;
  nextDate?: string; vetName?: string; notes?: string;
}

export interface HealthRecord {
  id: string; type: 'checkup'|'treatment'|'surgery'|'medication'|'other';
  date: string; title: string; notes?: string; vetName?: string; cost?: number;
}

export interface Pet {
  id?: string; ownerId: string; name: string; species: SpeciesType;
  breed?: string; birthDate?: string; gender: GenderType;
  weight?: number; color?: string; microchipId?: string;
  allergies?: string; notes?: string; avatarUrl?: string;
  isVaccinated: boolean; isSterilized: boolean;
  vaccines: Vaccine[]; healthRecords: HealthRecord[];
  createdAt?: any; updatedAt?: any;
}

const EMOJI: Record<SpeciesType,string> = {
  cat:'🐱',dog:'🐶',bird:'🐦',rabbit:'🐰',hamster:'🐹',turtle:'🐢',fish:'🐟',other:'🐾'
};
export const getSpeciesEmoji = (s: SpeciesType) => EMOJI[s]||'🐾';

export async function uploadPetAvatar(userId: string, petId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const r = ref(storage, `avatars/${userId}/pets/${petId}.${ext}`);
  await uploadBytes(r, file);
  return getDownloadURL(r);
}

export async function createPet(data: Omit<Pet,'id'|'createdAt'|'updatedAt'>): Promise<string> {
  const d = await addDoc(collection(db,'pets'), {...data, createdAt:serverTimestamp(), updatedAt:serverTimestamp()});
  return d.id;
}

export async function updatePet(id: string, data: Partial<Pet>): Promise<void> {
  await updateDoc(doc(db,'pets',id), {...data, updatedAt:serverTimestamp()});
}

export async function deletePet(id: string): Promise<void> {
  await deleteDoc(doc(db,'pets',id));
}

export async function getUserPets(userId: string): Promise<Pet[]> {
  const q = query(collection(db,'pets'), where('ownerId','==',userId), orderBy('createdAt','desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({id:d.id,...d.data()} as Pet));
}

export async function addVaccine(petId: string, vaccine: Omit<Vaccine,'id'>, current: Vaccine[]): Promise<void> {
  await updateDoc(doc(db,'pets',petId), {
    vaccines: [...current, {...vaccine, id:`v_${Date.now()}`}],
    updatedAt: serverTimestamp(),
  });
}

export async function addHealthRecord(petId: string, record: Omit<HealthRecord,'id'>, current: HealthRecord[]): Promise<void> {
  await updateDoc(doc(db,'pets',petId), {
    healthRecords: [...current, {...record, id:`h_${Date.now()}`}],
    updatedAt: serverTimestamp(),
  });
}
