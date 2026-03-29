import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { onAuthChange } from '@/lib/auth';

export type PlanType = 'free' | 'premium_monthly' | 'premium_yearly' | 'corporate_monthly' | 'corporate_yearly';

export interface PlanLimits {
  maxListings:   number;   // Aylık max ilan
  maxPets:       number;   // Max pet pasaport
  canSeeContact: boolean;  // Tel/konum görme
  canSeeListings:boolean;  // İlanları görme
  canCreateCommunity: boolean; // Topluluk kurma
  canWriteBlog:  boolean;  // Blog yazma
  canMessage:    boolean;  // Mesajlaşma
  hasAI:         boolean;  // AI asistan
  maxDailyListings: number; // Günlük max ilan
  isGuest:       boolean;  // Üye değil
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
  guest: {
    maxListings: 0, maxPets: 0, canSeeContact: false,
    canSeeListings: false, canCreateCommunity: false,
    canWriteBlog: false, canMessage: false, hasAI: false,
    maxDailyListings: 0, isGuest: true,
  },
  free: {
    maxListings: 1, maxPets: 1, canSeeContact: false,
    canSeeListings: true, canCreateCommunity: false,
    canWriteBlog: false, canMessage: true, hasAI: false,
    maxDailyListings: 1, isGuest: false,
  },
  premium_monthly: {
    maxListings: 5, maxPets: 5, canSeeContact: true,
    canSeeListings: true, canCreateCommunity: false,
    canWriteBlog: false, canMessage: true, hasAI: true,
    maxDailyListings: 5, isGuest: false,
  },
  premium_yearly: {
    maxListings: 20, maxPets: 20, canSeeContact: true,
    canSeeListings: true, canCreateCommunity: true,
    canWriteBlog: true, canMessage: true, hasAI: true,
    maxDailyListings: 5, isGuest: false,
  },
  corporate_monthly: {
    maxListings: 0, maxPets: 0, canSeeContact: true,
    canSeeListings: true, canCreateCommunity: false,
    canWriteBlog: false, canMessage: true, hasAI: true,
    maxDailyListings: 0, isGuest: false,
  },
  corporate_yearly: {
    maxListings: 0, maxPets: 0, canSeeContact: true,
    canSeeListings: true, canCreateCommunity: false,
    canWriteBlog: false, canMessage: true, hasAI: true,
    maxDailyListings: 0, isGuest: false,
  },
};

export function usePlan() {
  const [plan,    setPlan]    = useState<PlanType>('free');
  const [limits,  setLimits]  = useState<PlanLimits>(PLAN_LIMITS.free);
  const [loading, setLoading] = useState(true);
  const [expiry,  setExpiry]  = useState<Date|null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange(async u => {
      if (!u) {
        setPlan('free');
        setLimits(PLAN_LIMITS.guest);
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db,'users',u.uid));
        if (snap.exists()) {
          const data = snap.data();
          const userPlan = data.plan || 'free';

          // Plan süresi dolmuş mu?
          if (data.planExpiry) {
            const exp = data.planExpiry.toDate ? data.planExpiry.toDate() : new Date(data.planExpiry);
            setExpiry(exp);
            if (exp < new Date()) {
              // Süresi dolmuş, free'ye düşür
              setPlan('free');
              setLimits(PLAN_LIMITS.free);
              setIsExpired(true);
              setLoading(false);
              return;
            }
          }

          setPlan(userPlan);
          setLimits(PLAN_LIMITS[userPlan] || PLAN_LIMITS.free);
        }
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    });
    return () => unsub();
  }, []);

  const isPremium   = plan !== 'free';
  const isPro       = plan === 'premium_yearly';
  const isCorporate = plan.startsWith('corporate');

  return { plan, limits, loading, expiry, isExpired, isPremium, isPro, isCorporate };
}

// Plan gerektiren içerik için blur/lock bileşeni
export function getPlanName(plan: string): string {
  const names: Record<string,string> = {
    free:               'Ücretsiz',
    premium_monthly:    'Premium',
    premium_yearly:     'Pro',
    corporate_monthly:  'Kurumsal',
    corporate_yearly:   'Kurumsal Pro',
  };
  return names[plan] || 'Ücretsiz';
}
