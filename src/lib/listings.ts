import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDoc, getDocs, query, where,
  orderBy, serverTimestamp, limit,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';

export type ListingStatus = 'pending' | 'active' | 'rejected' | 'closed';
export type ListingType   = 'adoption' | 'temp' | 'lost' | 'found';
export type SpeciesType   = 'cat' | 'dog' | 'bird' | 'rabbit' | 'hamster' | 'turtle' | 'fish' | 'other';

export interface Listing {
  id?: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  type: ListingType;
  status: ListingStatus;
  // Pet bilgileri
  species: SpeciesType;
  breed?: string;
  name: string;
  age?: string;
  gender: 'female' | 'male' | 'unknown';
  color?: string;
  // Konum
  city: string;
  district?: string;
  // İlan detayı
  description: string;
  imageUrls: string[];
  // Özellikler
  isVaccinated: boolean;
  isSterilized: boolean;
  isMicrochipped: boolean;
  isKidFriendly: boolean;
  isPuppy: boolean;
  puppyCount?: number;
  isUrgent: boolean;
  // İletişim
  contactPhone?: string;
  contactEmail?: string;
  // İstatistikler
  viewCount: number;
  favoriteCount: number;
  // Tarihler
  createdAt?: any;
  updatedAt?: any;
  approvedAt?: any;
  approvedBy?: string;
  rejectionReason?: string;
}

// ─── Fotoğraf yükle ─────────────────────────────────────────────────────────
export async function uploadListingImage(
  userId: string,
  file: File,
  listingId: string
): Promise<string> {
  const ext      = file.name.split('.').pop();
  const fileName = `${Date.now()}.${ext}`;
  const storageRef = ref(storage, `listings/${userId}/${listingId}/${fileName}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// ─── İlan oluştur ────────────────────────────────────────────────────────────
export async function createListing(
  data: Omit<Listing, 'id' | 'status' | 'viewCount' | 'favoriteCount' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const docRef = await addDoc(collection(db, 'listings'), {
    ...data,
    status:        'pending',
    viewCount:     0,
    favoriteCount: 0,
    createdAt:     serverTimestamp(),
    updatedAt:     serverTimestamp(),
  });
  return docRef.id;
}

// ─── İlan güncelle ───────────────────────────────────────────────────────────
export async function updateListing(id: string, data: Partial<Listing>): Promise<void> {
  await updateDoc(doc(db, 'listings', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ─── İlan sil ────────────────────────────────────────────────────────────────
export async function deleteListing(id: string): Promise<void> {
  await deleteDoc(doc(db, 'listings', id));
}

// ─── Admin: İlanı onayla ─────────────────────────────────────────────────────
export async function approveListing(id: string, adminId: string): Promise<void> {
  await updateDoc(doc(db, 'listings', id), {
    status:     'active',
    approvedAt: serverTimestamp(),
    approvedBy: adminId,
    updatedAt:  serverTimestamp(),
  });
}

// ─── Admin: İlanı reddet ─────────────────────────────────────────────────────
export async function rejectListing(id: string, reason: string): Promise<void> {
  await updateDoc(doc(db, 'listings', id), {
    status:          'rejected',
    rejectionReason: reason,
    updatedAt:       serverTimestamp(),
  });
}

// ─── Kullanıcının ilanlarını getir ───────────────────────────────────────────
export async function getUserListings(userId: string): Promise<Listing[]> {
  const q = query(
    collection(db, 'listings'),
    where('ownerId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Listing));
}

// ─── Aktif ilanları getir (herkese açık) ─────────────────────────────────────
export async function getActiveListings(limitCount = 20): Promise<Listing[]> {
  const q = query(
    collection(db, 'listings'),
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Listing));
}

// ─── Admin: Tüm ilanları getir ───────────────────────────────────────────────
export async function getAllListings(): Promise<Listing[]> {
  const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Listing));
}

// ─── Admin: Bekleyen ilanlar ─────────────────────────────────────────────────
export async function getPendingListings(): Promise<Listing[]> {
  const q = query(
    collection(db, 'listings'),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Listing));
}