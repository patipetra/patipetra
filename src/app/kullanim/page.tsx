export default function KullanimPage() {
  return (
    <div className="min-h-screen bg-[#F7F2EA] py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl font-light text-[#2F2622] mb-8">Kullanım Koşulları</h1>
        <div className="bg-white rounded-[20px] p-8 text-sm text-[#5C4A32] leading-relaxed space-y-4">
          <p>Patıpetra'yı kullanarak bu koşulları kabul etmiş sayılırsınız.</p>
          <p>Platform yalnızca evcil hayvan sahiplendirme ve bakım amaçlı kullanılabilir.</p>
          <p>İletişim: patipetraa1@gmail.com</p>
        </div>
        <a href="/kayit" className="inline-block mt-6 text-[#C9832E] hover:underline">← Kayıt sayfasına dön</a>
      </div>
    </div>
  );
}
