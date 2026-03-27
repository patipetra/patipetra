'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthChange } from '@/lib/auth';

export default function MesajlarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange(u => {
      if (!u) { router.push('/giris'); return; }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  if (loading) return <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#C9832E] border-t-transparent rounded-full animate-spin"/></div>;

  return (
    <div className="min-h-screen bg-[#F7F2EA] flex">
      <div className="flex-1 lg:ml-[260px] flex flex-col">
        <div className="p-6 max-w-[800px]">
          <Link href="/panel" className="text-sm text-[#7A7368] hover:text-[#2F2622] mb-6 inline-flex items-center gap-1">← Dashboard</Link>
          <h1 className="font-serif text-2xl font-semibold text-[#2F2622] mb-6">💬 Mesajlarım</h1>
          <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-8 text-center">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="font-serif text-xl font-semibold text-[#2F2622] mb-2">Henüz mesaj yok</h3>
            <p className="text-sm text-[#7A7368] mb-5 leading-relaxed">İlan sahipleri veya veterinerlerle iletişime geçtiğinizde mesajlarınız burada görünecek.</p>
            <Link href="/ilanlar" className="inline-flex bg-[#C9832E] text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#b87523] transition-colors">İlanlara Göz At</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
