'use client';
import { useState, useEffect } from 'react';
import { onAuthChange } from '@/lib/auth';
import {
  collection, addDoc, getDocs, query,
  where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from 'firebase/auth';

interface Props {
  targetId:   string;
  targetName: string;
  targetType: 'vet' | 'service';
}

function timeAgo(date: any): string {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff/60000);
  if (m < 60) return `${m} dk önce`;
  if (m < 1440) return `${Math.floor(m/60)} sa önce`;
  return `${Math.floor(m/1440)} gün önce`;
}

export default function ReviewSystem({ targetId, targetName, targetType }: Props) {
  const [user,     setUser]     = useState<User|null>(null);
  const [reviews,  setReviews]  = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [rating,   setRating]   = useState(0);
  const [hover,    setHover]    = useState(0);
  const [comment,  setComment]  = useState('');
  const [sending,  setSending]  = useState(false);
  const [sent,     setSent]     = useState(false);

  useEffect(() => {
    const unsub = onAuthChange(u => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => { loadReviews(); }, [targetId]);

  async function loadReviews() {
    setLoading(true);
    try {
      const snap = await getDocs(query(
        collection(db,'reviews'),
        where('targetId','==',targetId),
        orderBy('createdAt','desc')
      ));
      setReviews(snap.docs.map(d=>({id:d.id,...d.data()})));
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || rating === 0) return;
    setSending(true);
    try {
      await addDoc(collection(db,'reviews'), {
        targetId,
        targetName,
        targetType,
        userId:    user.uid,
        userName:  user.displayName || user.email?.split('@')[0] || 'Kullanıcı',
        rating,
        comment:   comment.trim(),
        createdAt: serverTimestamp(),
      });
      setSent(true);
      setRating(0);
      setComment('');
      await loadReviews();
    } catch(err:any) { alert('Hata: '+err.message); }
    finally { setSending(false); }
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((a,r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-serif text-lg font-semibold text-[#2F2622]">Değerlendirmeler</h3>
        {avgRating && (
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1,2,3,4,5].map(i=>(
                <span key={i} className={`text-lg ${Number(avgRating)>=i?'text-[#C9832E]':'text-[#E3D9C6]'}`}>★</span>
              ))}
            </div>
            <span className="font-serif text-lg font-semibold text-[#2F2622]">{avgRating}</span>
            <span className="text-xs text-[#9A9188]">({reviews.length} yorum)</span>
          </div>
        )}
      </div>

      {/* Yorum formu */}
      {user ? (
        sent ? (
          <div className="text-center py-4 mb-4 bg-green-50 rounded-[14px]">
            <div className="text-3xl mb-2">⭐</div>
            <p className="text-sm font-semibold text-green-700">Değerlendirmeniz için teşekkürler!</p>
            <button onClick={()=>setSent(false)} className="text-xs text-green-600 hover:underline mt-1">Yeni değerlendirme yaz</button>
          </div>
        ) : (
          <form onSubmit={submit} className="mb-6 p-4 bg-[#F7F2EA] rounded-[16px]">
            <div className="mb-3">
              <label className="block text-[10px] uppercase tracking-[.1em] text-[#7A7368] mb-2">Puanınız *</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i=>(
                  <button key={i} type="button"
                    onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(0)}
                    onClick={()=>setRating(i)}
                    className={`text-3xl transition-transform hover:scale-110 ${(hover||rating)>=i?'text-[#C9832E]':'text-[#E3D9C6]'}`}>
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-[10px] uppercase tracking-[.1em] text-[#7A7368] mb-1">Yorumunuz</label>
              <textarea value={comment} onChange={e=>setComment(e.target.value)}
                placeholder="Deneyiminizi paylaşın…" rows={3}
                className="w-full px-3 py-2 rounded-[12px] border-[1.5px] border-[#E3D9C6] bg-white text-sm focus:outline-none focus:border-[#C9832E] transition-all resize-none"/>
            </div>
            <button type="submit" disabled={sending||rating===0}
              className="w-full py-2 rounded-full bg-[#C9832E] text-white text-sm font-semibold hover:bg-[#b87523] transition-all disabled:opacity-60">
              {sending?'Gönderiliyor…':'Değerlendirme Yap →'}
            </button>
          </form>
        )
      ) : (
        <div className="mb-4 p-4 bg-[#F7F2EA] rounded-[14px] text-center">
          <p className="text-sm text-[#7A7368] mb-2">Değerlendirme yapmak için giriş yapın.</p>
          <a href="/giris" className="text-sm text-[#C9832E] hover:underline font-medium">Giriş Yap →</a>
        </div>
      )}

      {/* Yorumlar listesi */}
      {loading ? (
        <div className="flex justify-center py-6"><div className="w-6 h-6 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-6 text-[#9A9188] text-sm">Henüz değerlendirme yok. İlk siz değerlendirin!</div>
      ) : (
        <div className="space-y-4">
          {reviews.map(r=>(
            <div key={r.id} className="border-b border-[#F7F2EA] last:border-0 pb-4 last:pb-0">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C9832E] to-[#E8B86D] flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
                  {r.userName?.charAt(0)?.toUpperCase()||'?'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-[#2F2622]">{r.userName}</span>
                    <span className="text-[11px] text-[#9A9188]">{timeAgo(r.createdAt)}</span>
                  </div>
                  <div className="flex mb-2">
                    {[1,2,3,4,5].map(i=>(
                      <span key={i} className={`text-sm ${r.rating>=i?'text-[#C9832E]':'text-[#E3D9C6]'}`}>★</span>
                    ))}
                  </div>
                  {r.comment && <p className="text-sm text-[#5C4A32] leading-relaxed">{r.comment}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
