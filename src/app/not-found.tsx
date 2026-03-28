import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function NotFound() {
  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-[#F7F2EA] flex items-center justify-center pt-[68px]">
        <div className="text-center px-4">
          <div className="font-serif text-[120px] font-light text-[#E3D9C6] leading-none mb-4">404</div>
          <div className="text-6xl mb-6">🐾</div>
          <h1 className="font-serif text-2xl font-semibold text-[#2F2622] mb-3">Sayfa Bulunamadı</h1>
          <p className="text-[#7A7368] mb-8 max-w-sm mx-auto leading-relaxed">
            Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/" className="bg-[#C9832E] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#b87523] transition-all">
              Ana Sayfaya Dön
            </Link>
            <Link href="/ilanlar" className="border border-[#8B7355] text-[#5C4A32] text-sm font-medium px-6 py-3 rounded-full hover:bg-[#5C4A32] hover:text-white transition-all">
              İlanları Gör
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
