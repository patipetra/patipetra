'use client';
import Link from 'next/link';
import { usePlan } from '@/hooks/usePlan';

interface PlanGateProps {
  children:    React.ReactNode;
  require:     'premium' | 'pro' | 'contact' | 'listing' | 'community' | 'blog' | 'ai';
  fallback?:   React.ReactNode;
  blur?:       boolean;
}

const MESSAGES: Record<string, {title:string, desc:string, icon:string}> = {
  premium:   { icon:'✦', title:'Premium Gerekli',    desc:'Bu özellik için premium üyelik gerekiyor.' },
  pro:       { icon:'🏆', title:'Pro Plan Gerekli',   desc:'Bu özellik Pro Yıllık plan gerektirir.' },
  contact:   { icon:'📞', title:'Premium Gerekli',    desc:'Telefon ve konum bilgisi görmek için premium üye olun.' },
  listing:   { icon:'📢', title:'İlan Limitiniz Doldu', desc:'Daha fazla ilan vermek için premium üye olun.' },
  community: { icon:'🏘️', title:'Pro Plan Gerekli',   desc:'Topluluk kurmak için Pro Yıllık plan gerekiyor.' },
  blog:      { icon:'✍️', title:'Pro Plan Gerekli',   desc:'Blog yazmak için Pro Yıllık plan gerekiyor.' },
  ai:        { icon:'🤖', title:'Premium Gerekli',    desc:'AI Veteriner Asistanı premium üyelere özeldir.' },
};

export default function PlanGate({ children, require, fallback, blur = true }: PlanGateProps) {
  const { limits, loading, isPremium, isPro } = usePlan();

  if (loading) return <>{children}</>;

  let hasAccess = false;
  switch(require) {
    case 'premium':   hasAccess = isPremium; break;
    case 'pro':       hasAccess = isPro; break;
    case 'contact':   hasAccess = limits.canSeeContact; break;
    case 'listing':   hasAccess = limits.maxListings > 0; break;
    case 'community': hasAccess = limits.canCreateCommunity; break;
    case 'blog':      hasAccess = limits.canWriteBlog; break;
    case 'ai':        hasAccess = limits.hasAI; break;
  }

  if (hasAccess) return <>{children}</>;
  if (fallback)  return <>{fallback}</>;

  const msg = MESSAGES[require] || MESSAGES.premium;

  if (blur) return (
    <div className="relative">
      <div className="pointer-events-none select-none" style={{filter:'blur(6px)', opacity:0.4}}>
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white rounded-[16px] border border-[rgba(196,169,107,.2)] shadow-lg p-5 text-center max-w-[260px] mx-4">
          <div className="text-3xl mb-2">{msg.icon}</div>
          <div className="font-semibold text-sm text-[#2F2622] mb-1">{msg.title}</div>
          <div className="text-xs text-[#7A7368] mb-3 leading-relaxed">{msg.desc}</div>
          <Link href="/panel/premium"
            className="inline-flex bg-[#C9832E] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#b87523] transition-all">
            ✦ Premium'a Geç
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[rgba(201,131,46,.06)] border border-[rgba(201,131,46,.15)] rounded-[14px] p-4 text-center">
      <div className="text-2xl mb-2">{msg.icon}</div>
      <div className="font-semibold text-sm text-[#2F2622] mb-1">{msg.title}</div>
      <div className="text-xs text-[#7A7368] mb-3">{msg.desc}</div>
      <Link href="/panel/premium"
        className="inline-flex bg-[#C9832E] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#b87523]">
        ✦ Premium'a Geç
      </Link>
    </div>
  );
}
