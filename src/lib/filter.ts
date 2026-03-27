// Türkçe küfür ve uygunsuz içerik filtresi
const BANNED_WORDS = [
  'orospu','sik','göt','amk','bok','piç','oç',
  'salak','aptal','gerize','mal','beyinsiz',
  'sikik','amına','orospunun','kahpe','ibne',
  'orospu çocuğu','bok gibi','siktir',
];

const SPAM_PATTERNS = [
  /(.)\1{4,}/g,           // Tekrar karakterler: aaaaaa
  /(https?:\/\/[^\s]+)/g, // Linkler (isteğe bağlı)
];

export function filterContent(text: string): {
  isClean: boolean;
  filtered: string;
  reason?: string;
} {
  const lower = text.toLowerCase();

  // Küfür kontrolü
  for (const word of BANNED_WORDS) {
    if (lower.includes(word)) {
      return {
        isClean: false,
        filtered: text,
        reason: 'Uygunsuz içerik tespit edildi.',
      };
    }
  }

  // Spam kontrolü
  let filtered = text;
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(text)) {
      filtered = filtered.replace(pattern, (match) =>
        match[0].repeat(Math.min(match.length, 3))
      );
    }
  }

  // Uzunluk kontrolü
  if (text.length > 2000) {
    return {
      isClean: false,
      filtered: text,
      reason: 'İçerik çok uzun (max 2000 karakter).',
    };
  }

  return { isClean: true, filtered };
}

// HTML injection temizle
export function sanitizeInput(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

// Rate limiting (client-side basit versiyon)
const rateLimitMap = new Map<string, number[]>();

export function checkRateLimit(userId: string, action: string, maxPerMinute = 5): boolean {
  const key = `${userId}_${action}`;
  const now  = Date.now();
  const times = rateLimitMap.get(key) || [];
  
  // Son 1 dakikadaki işlemleri filtrele
  const recent = times.filter(t => now - t < 60000);
  
  if (recent.length >= maxPerMinute) return false;
  
  rateLimitMap.set(key, [...recent, now]);
  return true;
}
