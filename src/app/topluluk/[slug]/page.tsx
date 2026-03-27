'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { onAuthChange } from '@/lib/auth';
import { filterContent, sanitizeInput, checkRateLimit } from '@/lib/filter';
import {
  getCommunityBySlug, seedDefaultCommunities,
  subscribeToPostsByCommunity, createPost, deletePost,
  toggleLike, isLiked,
  addComment, subscribeToComments, deleteComment,
  uploadPostImage,
  type Community, type Post, type Comment,
} from '@/lib/community';
import type { User } from 'firebase/auth';

function timeAgo(date: any): string {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff/60000);
  if (m < 1)  return 'az önce';
  if (m < 60) return `${m} dk önce`;
  const h = Math.floor(m/60);
  if (h < 24) return `${h} sa önce`;
  const days = Math.floor(h/24);
  if (days < 7) return `${days} gün önce`;
  return d.toLocaleDateString('tr-TR');
}

// ── Post Card ─────────────────────────────────────────────────────────────────
function PostCard({ post, user, onDelete }: { post: Post; user: User|null; onDelete: (id:string)=>void }) {
  const [liked,        setLiked]        = useState(false);
  const [likeCount,    setLikeCount]    = useState(post.likeCount);
  const [showComments, setShowComments] = useState(false);
  const [comments,     setComments]     = useState<Comment[]>([]);
  const [commentText,  setCommentText]  = useState('');
  const [submitting,   setSubmitting]   = useState(false);
  const [imgIdx,       setImgIdx]       = useState(0);

  useEffect(() => {
    if (user) { isLiked(post.id!, user.uid).then(setLiked); }
  }, [post.id, user]);

  useEffect(() => {
    if (!showComments) return;
    const unsub = subscribeToComments(post.id!, setComments);
    return () => unsub();
  }, [showComments, post.id]);

  async function handleLike() {
    if (!user) { alert('Beğenmek için giriş yapın.'); return; }
    const nowLiked = await toggleLike(post.id!, user.uid);
    setLiked(nowLiked);
    setLikeCount(prev => nowLiked ? prev+1 : prev-1);
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !commentText.trim()) return;
    setSubmitting(true);
    try {
      await addComment({
        postId:      post.id!,
        authorId:    user.uid,
        authorName:  user.displayName || user.email?.split('@')[0] || 'Kullanıcı',
        authorAvatar:user.photoURL || '',
        content:     commentText.trim(),
      });
      setCommentText('');
    } finally { setSubmitting(false); }
  }

  async function handleDeleteComment(commentId: string) {
    if (!confirm('Yorumu silmek istediğinizden emin misiniz?')) return;
    await deleteComment(post.id!, commentId);
  }

  return (
    <article className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] overflow-hidden mb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9832E] to-[#E8B86D] flex items-center justify-center text-base flex-shrink-0 overflow-hidden">
            {post.authorAvatar
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={post.authorAvatar} alt="" className="w-full h-full object-cover"/>
              : '🧑'
            }
          </div>
          <div>
            <div className="font-semibold text-sm text-[#2F2622]">{post.authorName}</div>
            <div className="text-[11px] text-[#9A9188]">{timeAgo(post.createdAt)}</div>
          </div>
        </div>
        {user && user.uid === post.authorId && (
          <button onClick={() => { if(confirm('Gönderiyi sil?')) onDelete(post.id!); }}
            className="text-[#9A9188] hover:text-red-500 transition-colors text-sm p-1">🗑</button>
        )}
      </div>

      {/* İçerik */}
      <div className="px-5 pb-3">
        <p className="text-sm leading-[1.8] text-[#3D3A34] whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Fotoğraflar */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.imageUrls[imgIdx]} alt="" className="w-full max-h-[400px] object-cover"/>
          {post.imageUrls.length > 1 && (
            <>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                {post.imageUrls.map((_,i)=>(
                  <button key={i} onClick={()=>setImgIdx(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i===imgIdx?'bg-white':'bg-white/50'}`}/>
                ))}
              </div>
              {imgIdx > 0 && (
                <button onClick={()=>setImgIdx(i=>i-1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 text-white rounded-full flex items-center justify-center">‹</button>
              )}
              {imgIdx < post.imageUrls.length-1 && (
                <button onClick={()=>setImgIdx(i=>i+1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 text-white rounded-full flex items-center justify-center">›</button>
              )}
            </>
          )}
        </div>
      )}

      {/* Aksiyonlar */}
      <div className="px-5 py-3 border-t border-[#F7F2EA] flex items-center gap-4">
        <button onClick={handleLike} className={`flex items-center gap-2 text-sm font-medium transition-all ${liked?'text-red-500':'text-[#7A7368] hover:text-red-500'}`}>
          {liked ? '❤️' : '🤍'} {likeCount}
        </button>
        <button onClick={() => setShowComments(v=>!v)} className="flex items-center gap-2 text-sm text-[#7A7368] hover:text-[#2F2622] transition-colors font-medium">
          💬 {post.commentCount}
        </button>
        <button onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          alert('Link kopyalandı!');
        }} className="flex items-center gap-2 text-sm text-[#7A7368] hover:text-[#2F2622] transition-colors font-medium ml-auto">
          🔗 Paylaş
        </button>
      </div>

      {/* Yorumlar */}
      {showComments && (
        <div className="border-t border-[#F7F2EA] px-5 py-4">
          {comments.length > 0 && (
            <div className="flex flex-col gap-3 mb-4">
              {comments.map(c => (
                <div key={c.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9832E] to-[#E8B86D] flex items-center justify-center text-sm flex-shrink-0 overflow-hidden">
                    {c.authorAvatar
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={c.authorAvatar} alt="" className="w-full h-full object-cover"/>
                      : '🧑'
                    }
                  </div>
                  <div className="flex-1 bg-[#F7F2EA] rounded-[12px] px-3 py-2">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-[#2F2622]">{c.authorName}</span>
                      <span className="text-[10px] text-[#9A9188]">{timeAgo(c.createdAt)}</span>
                    </div>
                    <p className="text-sm text-[#3D3A34]">{c.content}</p>
                  </div>
                  {user && (user.uid === c.authorId) && (
                    <button onClick={() => handleDeleteComment(c.id!)} className="text-[#9A9188] hover:text-red-500 transition-colors text-xs mt-1">🗑</button>
                  )}
                </div>
              ))}
            </div>
          )}

          {user ? (
            <form onSubmit={handleComment} className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9832E] to-[#E8B86D] flex items-center justify-center text-sm flex-shrink-0 overflow-hidden">
                {user.photoURL
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={user.photoURL} alt="" className="w-full h-full object-cover"/>
                  : '🧑'
                }
              </div>
              <div className="flex-1 flex gap-2">
                <input value={commentText} onChange={e=>setCommentText(e.target.value)}
                  placeholder="Yorum yaz…" required
                  className="flex-1 px-3 py-2 rounded-full border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all"/>
                <button type="submit" disabled={submitting||!commentText.trim()}
                  className="bg-[#C9832E] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#b87523] transition-colors disabled:opacity-60">
                  {submitting ? '…' : 'Gönder'}
                </button>
              </div>
            </form>
          ) : (
            <Link href="/giris" className="block text-center text-sm text-[#C9832E] hover:underline py-2">
              Yorum yapmak için giriş yapın →
            </Link>
          )}
        </div>
      )}
    </article>
  );
}

// ── Community Feed Page ───────────────────────────────────────────────────────
export default function CommunityFeedPage() {
  const params   = useParams();
  const router   = useRouter();
  const slug     = params.slug as string;

  const [user,      setUser]      = useState<User|null>(null);
  const [community, setCommunity] = useState<Community|null>(null);
  const [posts,     setPosts]     = useState<Post[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [posting,   setPosting]   = useState(false);
  const [content,   setContent]   = useState('');
  const [files,     setFiles]     = useState<File[]>([]);
  const [previews,  setPreviews]  = useState<string[]>([]);
  const [showForm,  setShowForm]  = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = onAuthChange(setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    async function init() {
      await seedDefaultCommunities();
      const comm = await getCommunityBySlug(slug);
      if (!comm) { router.push('/topluluk'); return; }
      setCommunity(comm);
      setLoading(false);
    }
    init();
  }, [slug, router]);

  useEffect(() => {
    if (!slug) return;
    const unsub = subscribeToPostsByCommunity(slug, setPosts);
    return () => unsub();
  }, [slug]);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files||[]).slice(0, 4-files.length);
    setFiles(prev => [...prev, ...selected].slice(0,4));
    setPreviews(prev => [...prev, ...selected.map(f=>URL.createObjectURL(f))]);
  }

  function removeFile(i: number) {
    setFiles(prev=>prev.filter((_,idx)=>idx!==i));
    setPreviews(prev=>prev.filter((_,idx)=>idx!==i));
  }

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !content.trim()) return;

    // Rate limit kontrolü
    if (!checkRateLimit(user.uid, 'post', 3)) {
      alert('Çok hızlı gönderi yapıyorsunuz. Lütfen bekleyin.');
      return;
    }

    // Küfür filtresi
    const { isClean, reason } = filterContent(content);
    if (!isClean) {
      alert(reason || 'Uygunsuz içerik.');
      return;
    }

    setPosting(true);
    try {
      const tempId = `post_${Date.now()}`;
      const imageUrls: string[] = [];
      for (const file of files) {
        const url = await uploadPostImage(user.uid, tempId, file);
        imageUrls.push(url);
      }
      await createPost({
        communityId:   community?.id||'',
        communitySlug: slug,
        authorId:      user.uid,
        authorName:    user.displayName || user.email?.split('@')[0] || 'Kullanıcı',
        authorAvatar:  user.photoURL||'',
        content:       content.trim(),
        imageUrls,
      });
      setContent(''); setFiles([]); setPreviews([]); setShowForm(false);
    } finally { setPosting(false); }
  }

  async function handleDelete(postId: string) {
    await deletePost(postId, slug);
  }

  if (loading) return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center pt-[68px]">
        <div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/>
      </div>
    </>
  );

  return (
    <>
      <Navbar/>
      <main className="min-h-screen pb-20 lg:pb-0 bg-[#F7F2EA]">

        {/* Topluluk header */}
        <div className="bg-[#5C4A32] pt-[108px] pb-8">
          <div className="max-w-[860px] mx-auto px-4 sm:px-8">
            <Link href="/topluluk" className="text-sm text-white/50 hover:text-white/80 transition-colors mb-4 inline-flex items-center gap-1">
              ← Tüm Topluluklar
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-[18px] bg-white/10 flex items-center justify-center text-4xl flex-shrink-0">
                {community?.emoji}
              </div>
              <div>
                <h1 className="font-serif text-2xl font-semibold text-white">{community?.name}</h1>
                <div className="text-sm text-white/50 mt-1">{community?.description}</div>
                <div className="flex gap-4 text-xs text-white/40 mt-2">
                  <span>👥 {community?.memberCount?.toLocaleString('tr-TR')||0} üye</span>
                  <span>📝 {posts.length} gönderi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[860px] mx-auto px-4 sm:px-8 py-6">
          <div className="grid lg:grid-cols-[1fr_.36fr] gap-6">

            {/* Feed */}
            <div>
              {/* Gönderi kutusu */}
              {user ? (
                <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-4 mb-5">
                  {!showForm ? (
                    <button onClick={() => setShowForm(true)}
                      className="w-full flex items-center gap-3 text-left">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9832E] to-[#E8B86D] flex items-center justify-center text-base flex-shrink-0 overflow-hidden">
                        {user.photoURL
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={user.photoURL} alt="" className="w-full h-full object-cover"/>
                          : '🧑'
                        }
                      </div>
                      <div className="flex-1 bg-[#F7F2EA] rounded-full px-4 py-3 text-sm text-[#9A9188]">
                        {community?.name} topluluğuna bir şey paylaş…
                      </div>
                    </button>
                  ) : (
                    <form onSubmit={handlePost}>
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9832E] to-[#E8B86D] flex items-center justify-center text-base flex-shrink-0 overflow-hidden">
                          {user.photoURL
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={user.photoURL} alt="" className="w-full h-full object-cover"/>
                            : '🧑'
                          }
                        </div>
                        <textarea value={content} onChange={e=>setContent(e.target.value)}
                          placeholder={`${community?.name} topluluğuna bir şey paylaş…`}
                          rows={4} autoFocus required
                          className="flex-1 px-4 py-3 rounded-[16px] border-[1.5px] border-[#E3D9C6] bg-[#F7F2EA] text-sm focus:outline-none focus:border-[#C9832E] transition-all resize-none"/>
                      </div>

                      {/* Fotoğraf önizleme */}
                      {previews.length > 0 && (
                        <div className="flex gap-2 mb-3 flex-wrap">
                          {previews.map((p,i)=>(
                            <div key={i} className="relative w-20 h-20 rounded-[10px] overflow-hidden border border-[#E3D9C6]">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={p} alt="" className="w-full h-full object-cover"/>
                              <button type="button" onClick={()=>removeFile(i)}
                                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center">✕</button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex gap-2">
                          {files.length < 4 && (
                            <button type="button" onClick={() => fileRef.current?.click()}
                              className="flex items-center gap-1 text-sm text-[#7A7368] hover:text-[#C9832E] transition-colors px-3 py-2 rounded-full hover:bg-[#F7F2EA]">
                              📷 Fotoğraf
                            </button>
                          )}
                          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles}/>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => { setShowForm(false); setContent(''); setFiles([]); setPreviews([]); }}
                            className="text-sm text-[#7A7368] px-4 py-2 rounded-full hover:bg-[#F7F2EA] transition-colors">İptal</button>
                          <button type="submit" disabled={posting || !content.trim()}
                            className="bg-[#C9832E] text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#b87523] transition-colors disabled:opacity-60">
                            {posting ? 'Paylaşılıyor…' : 'Paylaş'}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5 mb-5 text-center">
                  <p className="text-sm text-[#7A7368] mb-3">Gönderi paylaşmak veya yorum yapmak için giriş yapın.</p>
                  <Link href="/giris" className="inline-flex bg-[#C9832E] text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#b87523] transition-colors">
                    Giriş Yap
                  </Link>
                </div>
              )}

              {/* Gönderiler */}
              {posts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-[20px] border border-[rgba(196,169,107,.12)]">
                  <div className="text-5xl mb-4">{community?.emoji}</div>
                  <h3 className="font-serif text-xl font-semibold text-[#2F2622] mb-2">Henüz gönderi yok</h3>
                  <p className="text-sm text-[#7A7368] mb-4">Bu topluluğa ilk gönderiyi siz yapın!</p>
                  {user
                    ? <button onClick={() => setShowForm(true)} className="bg-[#C9832E] text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#b87523] transition-colors">İlk Gönderiyi Yap</button>
                    : <Link href="/giris" className="bg-[#C9832E] text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#b87523] transition-colors inline-flex">Giriş Yap</Link>
                  }
                </div>
              ) : (
                posts.map(post => (
                  <PostCard key={post.id} post={post} user={user} onDelete={handleDelete}/>
                ))
              )}
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5 mb-4 sticky top-[84px]">
                <h3 className="font-serif text-base font-semibold text-[#2F2622] mb-3">Bu Topluluk Hakkında</h3>
                <p className="text-sm text-[#7A7368] leading-relaxed mb-4">{community?.description}</p>
                <div className="flex flex-col gap-2 text-sm text-[#5C4A32]">
                  <div className="flex items-center gap-2">👥 <span>{community?.memberCount||0} üye</span></div>
                  <div className="flex items-center gap-2">📝 <span>{posts.length} gönderi</span></div>
                </div>
                <div className="border-t border-[#E3D9C6] mt-4 pt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-[.1em] text-[#9A9188] mb-2">Diğer Topluluklar</h4>
                  <Link href="/topluluk" className="text-sm text-[#C9832E] hover:underline">Tüm toplulukları gör →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
