# 🐾 Patıpetra

Türkiye'nin pet yaşam platformu — pet profili, sahiplendirme ilanları, veteriner iletişimi, pet pasaport ve premium mağaza.

## Teknoloji
- **Next.js 14** (App Router) · **TypeScript** · **Tailwind CSS v3** · **Firebase 10**

## Kurulum

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. Çevre değişkenlerini ayarla
cp .env.local.example .env.local
# .env.local dosyasını aç ve Firebase bilgilerini kontrol et

# 3. Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda → [http://localhost:3000](http://localhost:3000)

## Proje Yapısı

```
src/
├── app/
│   ├── page.tsx              # Ana sayfa
│   ├── layout.tsx            # Root layout + SEO
│   ├── globals.css           # Global stiller
│   ├── giris/                # Giriş sayfası
│   ├── kayit/                # Kayıt sayfası
│   ├── ilanlar/              # Sahiplendirme ilanları
│   ├── veterinerler/         # Veteriner rehberi
│   ├── magaza/               # Ürün mağazası
│   ├── blog/                 # Blog & rehberler
│   └── panel/                # Kullanıcı dashboard
├── components/
│   └── layout/
│       ├── Navbar.tsx        # Navigasyon + auth durumu
│       ├── Footer.tsx        # Footer
│       └── Logo.tsx          # Logo SVG
├── lib/
│   ├── firebase.ts           # Firebase config
│   └── auth.ts               # Auth fonksiyonları
├── data/
│   └── cities.ts             # 81 il listesi
├── types/
│   └── index.ts              # TypeScript tipleri
└── middleware.ts             # Güvenlik + protected routes
```

## Özellikler

- ✅ Firebase Auth (E-posta + Google)
- ✅ Firestore veritabanı entegrasyonu
- ✅ Protected routes (middleware)
- ✅ Güvenlik başlıkları (CSP, HSTS, X-Frame-Options)
- ✅ SEO optimizasyonu (metadata, OG, schema.org)
- ✅ 81 il destekli ilan sistemi
- ✅ Yavru ilanı modu
- ✅ Dashboard (pet pasaport, ilan yönetimi)
- ✅ Responsive + mobil tab bar
- ✅ Shopier ödeme entegrasyonu (link bazlı)

## Deploy (Vercel)

1. [vercel.com](https://vercel.com) → **Import Project** → Bu repo'yu seç
2. **Environment Variables** bölümüne `.env.local` içindeki değerleri gir
3. **Deploy** — otomatik çalışır

## Firebase Konsol Yapılacaklar

1. [Firebase Console](https://console.firebase.google.com) → `patipetra-dec35`
2. **Authentication** → Sign-in methods → Email/Password + Google'ı etkinleştir
3. **Firestore** → Kuralları ayarla:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /listings/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

© 2026 Patıpetra. Tüm hakları saklıdır.
