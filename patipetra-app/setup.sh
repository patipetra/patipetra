#!/bin/bash
# ================================================================
# PATIPETRA — Tam Kurulum Scripti
# Kullanım: bash setup.sh
# ================================================================

set -e  # Hata olursa dur

echo ""
echo "🐾 Patıpetra kurulumu başlıyor..."
echo "================================="

# ── 1. Eski dosyaları temizle ──────────────────────────────────
echo ""
echo "🧹 Eski dosyalar temizleniyor..."
rm -rf node_modules
rm -rf .next
rm -f package-lock.json

# src altındaki eski default dosyaları sil
rm -f src/app/page.tsx
rm -f src/app/layout.tsx
rm -f src/app/globals.css
rm -f src/app/favicon.ico
rm -f src/app/fonts

# ── 2. Klasör yapısını oluştur ─────────────────────────────────
echo ""
echo "📁 Klasör yapısı oluşturuluyor..."
mkdir -p src/lib
mkdir -p src/types
mkdir -p src/data
mkdir -p src/hooks
mkdir -p src/components/layout
mkdir -p src/components/ui
mkdir -p src/components/shared
mkdir -p src/app/giris
mkdir -p src/app/kayit
mkdir -p src/app/sifremi-unuttum
mkdir -p src/app/ilanlar
mkdir -p src/app/veterinerler
mkdir -p src/app/magaza
mkdir -p src/app/blog
mkdir -p src/app/panel
mkdir -p src/app/panel/petlerim
mkdir -p src/app/panel/ilanlarim
mkdir -p src/app/panel/mesajlarim
mkdir -p src/app/panel/siparislerim
mkdir -p src/app/panel/premium
mkdir -p src/app/panel/ayarlar
mkdir -p src/app/veteriner-paneli
mkdir -p src/app/admin
mkdir -p public/icons

echo "✓ Klasörler hazır"

# ── 3. package.json yaz ────────────────────────────────────────
echo ""
echo "📦 package.json yazılıyor..."
cat > package.json << 'PKGJSON'
{
  "name": "patipetra",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "firebase": "10.12.2",
    "clsx": "2.1.1",
    "tailwind-merge": "2.3.0"
  },
  "devDependencies": {
    "@types/node": "20.14.2",
    "@types/react": "18.3.3",
    "@types/react-dom": "18.3.0",
    "typescript": "5.4.5",
    "tailwindcss": "3.4.4",
    "autoprefixer": "10.4.19",
    "postcss": "8.4.38",
    "eslint": "8.57.0",
    "eslint-config-next": "14.2.5"
  }
}
PKGJSON
echo "✓ package.json hazır"

# ── 4. tsconfig.json ──────────────────────────────────────────
cat > tsconfig.json << 'TSJSON'
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
TSJSON

# ── 5. next.config.ts ─────────────────────────────────────────
cat > next.config.ts << 'NEXTCFG'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
NEXTCFG

# ── 6. tailwind.config.ts ─────────────────────────────────────
cat > tailwind.config.ts << 'TWCFG'
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream:  { DEFAULT: "#F7F2EA", 2: "#EDE5D3", 3: "#E3D9C6", 4: "#F8F0E4" },
        bark:   { DEFAULT: "#8B7355", d: "#6E5A40", dd: "#5C4A32" },
        char:   { DEFAULT: "#2F2622", 2: "#3D3A34" },
        muted:  { DEFAULT: "#7A7368", 2: "#9A9188" },
        moss:   { DEFAULT: "#6B7C5C", l: "#8FA07A" },
        terra:  { DEFAULT: "#C17B5C", l: "#E8A882" },
        gold:   { DEFAULT: "#C9832E", l: "#E8B86D", ll: "#F5EDD4" },
        brand:  "#FDFBF7",
      },
      fontFamily: {
        sans:    ["Cabinet Grotesk", "system-ui", "sans-serif"],
        serif:   ["Cormorant", "Georgia", "Times New Roman", "serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
TWCFG

# ── 7. postcss.config.mjs ─────────────────────────────────────
cat > postcss.config.mjs << 'POSTCSS'
const config = {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
export default config;
POSTCSS

# ── 8. eslint.config.mjs ──────────────────────────────────────
cat > eslint.config.mjs << 'ESLINT'
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
ESLINT

# ── 9. .gitignore ─────────────────────────────────────────────
cat > .gitignore << 'GITIGNORE'
# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# env files — ASLA git'e ekleme!
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
GITIGNORE

echo "✓ Config dosyaları hazır"

# ── 10. .env.local.example ────────────────────────────────────
cat > .env.local.example << 'ENVEX'
# Firebase — console.firebase.google.com'dan al
# Bu dosyayı kopyala: cp .env.local.example .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_APP_URL=http://localhost:3000
ENVEX

# ── 11. .env.local (gerçek değerlerle) ────────────────────────
cat > .env.local << 'ENVLOCAL'
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAXjSthJEAqg5wqZ-2BScC1vsFwU02XJSk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=patipetra-dec35.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=patipetra-dec35
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=patipetra-dec35.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=154426577840
NEXT_PUBLIC_FIREBASE_APP_ID=1:154426577840:web:c273b6e8aba66ed658bc75
NEXT_PUBLIC_APP_URL=http://localhost:3000
ENVLOCAL

echo "✓ .env.local hazır"

# ── 12. README.md ─────────────────────────────────────────────
cat > README.md << 'README'
# 🐾 Patıpetra

Türkiye'nin pet yaşam platformu — pet profili, sahiplendirme ilanları, veteriner iletişimi, pet pasaport ve premium mağaza.

## Teknoloji
- Next.js 14 (App Router) · TypeScript · Tailwind CSS v3 · Firebase

## Başlangıç
```bash
npm install
npm run dev
```

## Deploy
Vercel → Import → Bu repo → Deploy
README

echo "✓ README hazır"

# ── 13. npm install ───────────────────────────────────────────
echo ""
echo "📦 Bağımlılıklar yükleniyor (bu 1-2 dakika sürebilir)..."
npm install

echo ""
echo "✅ Kurulum tamamlandı!"
echo ""
echo "Sonraki adım: Dosyaları kopyala, sonra 'npm run dev' çalıştır."
echo ""
