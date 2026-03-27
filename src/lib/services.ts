import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  getDocs, query, where, orderBy, serverTimestamp,
  increment, getDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

export type ServiceType = 'groomer' | 'hotel' | 'trainer' | 'vet';
export type ServiceStatus = 'pending' | 'active' | 'rejected' | 'suspended';
export type PlanType = 'basic' | 'premium';

export interface ServicePrice {
  name:  string;
  price: number;
  desc?: string;
}

export interface Service {
  id?:           string;
  ownerId:       string;
  ownerName:     string;
  ownerEmail:    string;
  ownerPhone:    string;
  type:          ServiceType;
  status:        ServiceStatus;
  plan:          PlanType;
  // İşletme bilgileri
  businessName:  string;
  slug:          string;
  description:   string;
  city:          string;
  district?:     string;
  address?:      string;
  phone:         string;
  email:         string;
  website?:      string;
  instagram?:    string;
  // Görsel
  coverUrl?:     string;
  imageUrls:     string[];
  // Hizmetler & Fiyatlar
  prices:        ServicePrice[];
  // Çalışma saatleri
  workingHours?: string;
  // İstatistikler
  rating:        number;
  reviewCount:   number;
  // Tarihler
  createdAt?:    any;
  updatedAt?:    any;
  approvedAt?:   any;
}

export interface Appointment {
  id?:             string;
  serviceId:       string;
  serviceName:     string;
  serviceOwnerId:  string;
  userId:          string;
  userName:        string;
  userEmail:       string;
  userPhone:       string;
  petName?:        string;
  petSpecies?:     string;
  date:            string;
  time:            string;
  note?:           string;
  status:          'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt?:      any;
}

export interface Review {
  id?:          string;
  serviceId:    string;
  authorId:     string;
  authorName:   string;
  authorAvatar?: string;
  rating:       number;
  comment:      string;
  createdAt?:   any;
}

export const SERVICE_TYPE_LABEL: Record<ServiceType, string> = {
  groomer: '✂️ Pet Kuaför',
  hotel:   '🏨 Pet Otel',
  trainer: '🎓 Pet Eğitmen',
  vet:     '🩺 Veteriner',
};

export const SERVICE_TYPE_DESC: Record<ServiceType, string> = {
  groomer: 'Tıraş, banyo, tırnak kesimi ve bakım',
  hotel:   'Günlük ve haftalık konaklama hizmeti',
  trainer: 'Temel komutlar ve davranış eğitimi',
  vet:     'Veteriner muayene ve tedavi hizmetleri',
};

export const PLAN_PRICES: Record<PlanType, {label:string; price:string; features:string[]}> = {
  basic: {
    label: 'Temel Üyelik',
    price: '₺299/ay',
    features: ['Profil sayfası','Fotoğraf galerisi (5 foto)','Randevu talebi alma','Müşteri yorumları'],
  },
  premium: {
    label: 'Premium Üyelik',
    price: '₺499/ay',
    features: ['Öne çıkan listeleme','Fotoğraf galerisi (20 foto)','Randevu yönetimi','Öncelikli destek','Sosyal medya entegrasyonu','Aylık istatistik raporu'],
  },
};

// ─── Fotoğraf yükle ───────────────────────────────────────────────────────────
export async function uploadServiceImage(userId: string, serviceId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const storageRef = ref(storage, `services/${userId}/${serviceId}_${Date.now()}.${ext}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// ─── Slugify ──────────────────────────────────────────────────────────────────
export function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
    .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

// ─── Hizmet oluştur ───────────────────────────────────────────────────────────
export async function createService(data: Omit<Service,'id'|'status'|'rating'|'reviewCount'|'createdAt'|'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db,'services'), {
    ...data, status:'pending', rating:0, reviewCount:0,
    createdAt:serverTimestamp(), updatedAt:serverTimestamp(),
  });
  return docRef.id;
}

// ─── Hizmet güncelle ──────────────────────────────────────────────────────────
export async function updateService(id: string, data: Partial<Service>): Promise<void> {
  await updateDoc(doc(db,'services',id), {...data, updatedAt:serverTimestamp()});
}

// ─── Admin: Onayla ────────────────────────────────────────────────────────────
export async function approveService(id: string): Promise<void> {
  await updateDoc(doc(db,'services',id), {
    status:'active', approvedAt:serverTimestamp(), updatedAt:serverTimestamp(),
  });
}

// ─── Admin: Reddet ────────────────────────────────────────────────────────────
export async function rejectService(id: string): Promise<void> {
  await updateDoc(doc(db,'services',id), {status:'rejected', updatedAt:serverTimestamp()});
}

// ─── Aktif hizmetleri getir ───────────────────────────────────────────────────
export async function getActiveServices(type?: ServiceType, city?: string): Promise<Service[]> {
  let q = query(collection(db,'services'), where('status','==','active'));
  const snap = await getDocs(q);
  let results = snap.docs.map(d => ({id:d.id,...d.data()} as Service));
  if (type) results = results.filter(s => s.type === type);
  if (city) results = results.filter(s => s.city === city);
  return results.sort((a,b) => (b.plan==='premium'?1:0) - (a.plan==='premium'?1:0));
}

// ─── Tüm hizmetler (admin) ────────────────────────────────────────────────────
export async function getAllServices(): Promise<Service[]> {
  const snap = await getDocs(query(collection(db,'services'), orderBy('createdAt','desc')));
  return snap.docs.map(d => ({id:d.id,...d.data()} as Service));
}

// ─── Slug ile getir ───────────────────────────────────────────────────────────
export async function getServiceBySlug(slug: string): Promise<Service|null> {
  const q = query(collection(db,'services'), where('slug','==',slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return {id:snap.docs[0].id,...snap.docs[0].data()} as Service;
}

// ─── Randevu oluştur ──────────────────────────────────────────────────────────
export async function createAppointment(data: Omit<Appointment,'id'|'status'|'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db,'appointments'), {
    ...data, status:'pending', createdAt:serverTimestamp(),
  });
  return docRef.id;
}

// ─── Kullanıcının randevuları ─────────────────────────────────────────────────
export async function getUserAppointments(userId: string): Promise<Appointment[]> {
  const snap = await getDocs(query(collection(db,'appointments'), where('userId','==',userId)));
  return snap.docs.map(d => ({id:d.id,...d.data()} as Appointment));
}

// ─── Yorum ekle ───────────────────────────────────────────────────────────────
export async function addReview(data: Omit<Review,'id'|'createdAt'>): Promise<void> {
  await addDoc(collection(db,'reviews'), {...data, createdAt:serverTimestamp()});
  // Rating güncelle
  const reviews = await getServiceReviews(data.serviceId);
  const avg = reviews.reduce((s,r) => s+r.rating, 0) / reviews.length;
  await updateDoc(doc(db,'services',data.serviceId), {
    rating: Math.round(avg*10)/10,
    reviewCount: reviews.length,
  });
}

// ─── Hizmet yorumları ─────────────────────────────────────────────────────────
export async function getServiceReviews(serviceId: string): Promise<Review[]> {
  const snap = await getDocs(query(collection(db,'reviews'), where('serviceId','==',serviceId), orderBy('createdAt','desc')));
  return snap.docs.map(d => ({id:d.id,...d.data()} as Review));
}
