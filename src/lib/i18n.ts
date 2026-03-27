export type Lang = 'tr' | 'en';

export const translations = {
  tr: {
    nav: {
      communities: 'Topluluklar',
      listings:    'İlanlar',
      vets:        'Veterinerler',
      services:    'Hizmetler',
      store:       'Mağaza',
      blog:        'Blog',
    },
    auth: {
      login:    'Giriş Yap',
      register: 'Üye Ol',
      logout:   'Çıkış',
    },
    common: {
      loading:  'Yükleniyor…',
      save:     'Kaydet',
      cancel:   'İptal',
      delete:   'Sil',
      edit:     'Düzenle',
      send:     'Gönder',
    },
  },
  en: {
    nav: {
      communities: 'Communities',
      listings:    'Listings',
      vets:        'Vets',
      services:    'Services',
      store:       'Store',
      blog:        'Blog',
    },
    auth: {
      login:    'Sign In',
      register: 'Sign Up',
      logout:   'Sign Out',
    },
    common: {
      loading:  'Loading…',
      save:     'Save',
      cancel:   'Cancel',
      delete:   'Delete',
      edit:     'Edit',
      send:     'Send',
    },
  },
} as const;

export function t(lang: Lang, key: string): string {
  const keys = key.split('.');
  let val: any = translations[lang];
  for (const k of keys) { val = val?.[k]; }
  return val || key;
}
