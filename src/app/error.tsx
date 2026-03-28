'use client';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-6xl mb-4">😿</div>
        <h1 className="font-serif text-2xl font-semibold text-[#2F2622] mb-3">Bir Şeyler Ters Gitti</h1>
        <p className="text-[#7A7368] mb-8 max-w-sm mx-auto">Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="bg-[#C9832E] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#b87523] transition-all">
            Tekrar Dene
          </button>
          <Link href="/" className="border border-[#8B7355] text-[#5C4A32] text-sm font-medium px-6 py-3 rounded-full hover:bg-[#5C4A32] hover:text-white transition-all">
            Ana Sayfa
          </Link>
        </div>
      </div>
    </div>
  );
}
