import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  getDocs, getDoc, query, where, orderBy, limit,
  serverTimestamp, increment, setDoc, onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

export interface Community {
  id?:          string;
  name:         string;
  slug:         string;
  description:  string;
  emoji:        string;
  category:     'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  coverUrl?:    string;
  memberCount:  number;
  postCount:    number;
  createdBy:    string;
  isDefault:    boolean;
  createdAt?:   any;
}

export interface Post {
  id?:          string;
  communityId:  string;
  communitySlug:string;
  authorId:     string;
  authorName:   string;
  authorAvatar?: string;
  content:      string;
  imageUrls:    string[];
  likeCount:    number;
  commentCount: number;
  createdAt?:   any;
  updatedAt?:   any;
}

export interface Comment {
  id?:          string;
  postId:       string;
  authorId:     string;
  authorName:   string;
  authorAvatar?: string;
  content:      string;
  createdAt?:   any;
}

// ─── Varsayılan topluluklar ───────────────────────────────────────────────────
export const DEFAULT_COMMUNITIES: Omit<Community,'id'|'memberCount'|'postCount'|'createdBy'|'createdAt'>[] = [
  { name:'Golden Retriever',    slug:'golden-retriever',    description:'Golden Retriever sahipleri ve sevenler',    emoji:'🐕', category:'dog',   isDefault:true  },
  { name:'Labrador',            slug:'labrador',            description:'Labrador topluluğu',                        emoji:'🦮', category:'dog',   isDefault:true  },
  { name:'Husky',               slug:'husky',               description:'Siberian Husky sahipleri',                  emoji:'🐺', category:'dog',   isDefault:true  },
  { name:'Alman Kurdu',         slug:'alman-kurdu',         description:'Alman Kurdu sahipleri ve hayranları',       emoji:'🐕‍🦺',category:'dog',  isDefault:true  },
  { name:'British Shorthair',   slug:'british-shorthair',   description:'British Shorthair kedi topluluğu',          emoji:'🐱', category:'cat',   isDefault:true  },
  { name:'Scottish Fold',       slug:'scottish-fold',       description:'Scottish Fold sahipleri',                   emoji:'😺', category:'cat',   isDefault:true  },
  { name:'Van Kedisi',          slug:'van-kedisi',          description:'Van Kedisi sevenleri',                      emoji:'🐈', category:'cat',   isDefault:true  },
  { name:'Tekir',               slug:'tekir',               description:'Tekir kedi sahipleri',                      emoji:'🐈‍⬛',category:'cat', isDefault:true  },
  { name:'Muhabbet Kuşu',       slug:'muhabbet-kusu',       description:'Muhabbet kuşu sahipleri',                   emoji:'🦜', category:'bird',  isDefault:true  },
  { name:'Papağan',             slug:'papagan',             description:'Papağan sahipleri ve meraklıları',          emoji:'🦚', category:'bird',  isDefault:true  },
  { name:'Hollanda Cüce Tavşan',slug:'tavsan',              description:'Tavşan sahipleri topluluğu',                emoji:'🐰', category:'rabbit',isDefault:true  },
  { name:'Genel Sohbet',        slug:'genel-sohbet',        description:'Her türlü pet hakkında sohbet',             emoji:'💬', category:'other', isDefault:true  },
];

// ─── Varsayılan toplulukları Firestore'a ekle (ilk kurulum) ──────────────────
export async function seedDefaultCommunities(): Promise<void> {
  const snap = await getDocs(query(collection(db,'communities'), where('isDefault','==',true)));
  if (snap.size >= DEFAULT_COMMUNITIES.length) return;

  for (const c of DEFAULT_COMMUNITIES) {
    const exists = snap.docs.find(d => d.data().slug === c.slug);
    if (!exists) {
      await addDoc(collection(db,'communities'), {
        ...c, memberCount:0, postCount:0,
        createdBy:'system', createdAt:serverTimestamp(),
      });
    }
  }
}

// ─── Tüm toplulukları getir ───────────────────────────────────────────────────
export async function getCommunities(): Promise<Community[]> {
  try {
    const snap = await getDocs(query(
      collection(db,'communities'),
      where('status','in',['active', null]),
      orderBy('memberCount','desc')
    ));
    // isDefault olanları veya status active olanları göster
    return snap.docs
      .map(d => ({id:d.id,...d.data()} as Community))
      .filter((c:any) => c.isDefault || c.status === 'active');
  } catch {
    // Fallback - index yoksa
    const snap = await getDocs(collection(db,'communities'));
    return snap.docs
      .map(d => ({id:d.id,...d.data()} as Community))
      .filter((c:any) => c.isDefault || c.status === 'active');
  }
}

// ─── Slug ile topluluk getir ──────────────────────────────────────────────────
export async function getCommunityBySlug(slug: string): Promise<Community|null> {
  const q = query(collection(db,'communities'), where('slug','==',slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return {id:snap.docs[0].id, ...snap.docs[0].data()} as Community;
}

// ─── Topluluk oluştur ─────────────────────────────────────────────────────────
export async function createCommunity(data: Omit<Community,'id'|'memberCount'|'postCount'|'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db,'communities'), {
    ...data,
    memberCount: 0,
    postCount:   0,
    status:      'pending',
    createdAt:   serverTimestamp(),
  });
  return docRef.id;
}

// ─── Gönderi oluştur ─────────────────────────────────────────────────────────
export async function createPost(data: Omit<Post,'id'|'likeCount'|'commentCount'|'createdAt'|'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db,'posts'), {
    ...data, likeCount:0, commentCount:0,
    createdAt:serverTimestamp(), updatedAt:serverTimestamp(),
  });
  // Topluluk post sayısını artır
  const commSnap = await getDocs(query(collection(db,'communities'), where('slug','==',data.communitySlug)));
  if (!commSnap.empty) {
    await updateDoc(doc(db,'communities',commSnap.docs[0].id), {postCount:increment(1)});
  }
  return docRef.id;
}

// ─── Topluluk gönderilerini getir (realtime) ──────────────────────────────────
export function subscribeToPostsByCommunity(
  communitySlug: string,
  callback: (posts: Post[]) => void
): Unsubscribe {
  const q = query(
    collection(db,'posts'),
    where('communitySlug','==',communitySlug),
    orderBy('createdAt','desc'),
    limit(30)
  );
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({id:d.id,...d.data()} as Post)));
  });
}

// ─── Tüm gönderiler (ana feed) ───────────────────────────────────────────────
export function subscribeToAllPosts(callback: (posts: Post[]) => void): Unsubscribe {
  const q = query(collection(db,'posts'), orderBy('createdAt','desc'), limit(20));
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({id:d.id,...d.data()} as Post)));
  });
}

// ─── Gönderi sil ─────────────────────────────────────────────────────────────
export async function deletePost(postId: string, communitySlug: string): Promise<void> {
  await deleteDoc(doc(db,'posts',postId));
  const commSnap = await getDocs(query(collection(db,'communities'), where('slug','==',communitySlug)));
  if (!commSnap.empty) {
    await updateDoc(doc(db,'communities',commSnap.docs[0].id), {postCount:increment(-1)});
  }
}

// ─── Beğeni toggle ────────────────────────────────────────────────────────────
export async function toggleLike(postId: string, userId: string): Promise<boolean> {
  const likeRef = doc(db,'posts',postId,'likes',userId);
  const snap    = await getDoc(likeRef);
  if (snap.exists()) {
    await deleteDoc(likeRef);
    await updateDoc(doc(db,'posts',postId), {likeCount:increment(-1)});
    return false;
  } else {
    await setDoc(likeRef, {userId, createdAt:serverTimestamp()});
    await updateDoc(doc(db,'posts',postId), {likeCount:increment(1)});
    return true;
  }
}

export async function isLiked(postId: string, userId: string): Promise<boolean> {
  const snap = await getDoc(doc(db,'posts',postId,'likes',userId));
  return snap.exists();
}

// ─── Yorum ekle ──────────────────────────────────────────────────────────────
export async function addComment(data: Omit<Comment,'id'|'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db,'posts',data.postId,'comments'), {
    ...data, createdAt:serverTimestamp(),
  });
  await updateDoc(doc(db,'posts',data.postId), {commentCount:increment(1)});
  return docRef.id;
}

// ─── Yorumları getir ─────────────────────────────────────────────────────────
export function subscribeToComments(postId: string, callback: (comments: Comment[]) => void): Unsubscribe {
  const q = query(collection(db,'posts',postId,'comments'), orderBy('createdAt','asc'));
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({id:d.id,...d.data()} as Comment)));
  });
}

// ─── Yorum sil ───────────────────────────────────────────────────────────────
export async function deleteComment(postId: string, commentId: string): Promise<void> {
  await deleteDoc(doc(db,'posts',postId,'comments',commentId));
  await updateDoc(doc(db,'posts',postId), {commentCount:increment(-1)});
}

// ─── Fotoğraf yükle ──────────────────────────────────────────────────────────
export async function uploadPostImage(userId: string, postId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const storageRef = ref(storage, `posts/${userId}/${postId}_${Date.now()}.${ext}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
