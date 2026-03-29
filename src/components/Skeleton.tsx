'use client';

// Tek bir shimmer animasyonu - tüm skeleton'lar için
const shimmer = `
  relative overflow-hidden
  before:absolute before:inset-0
  before:-translate-x-full
  before:animate-[shimmer_1.5s_infinite]
  before:bg-gradient-to-r
  before:from-transparent before:via-white/20 before:to-transparent
`;

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`bg-[#E3D9C6] rounded-[10px] ${shimmer} ${className}`}/>
  );
}

// İlan kartı skeleton
export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] overflow-hidden">
      <Skeleton className="h-48 rounded-none rounded-t-[20px]"/>
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4"/>
        <Skeleton className="h-3 w-1/2"/>
        <div className="flex gap-2 mt-3">
          <Skeleton className="h-6 w-16 rounded-full"/>
          <Skeleton className="h-6 w-20 rounded-full"/>
        </div>
        <Skeleton className="h-8 w-full rounded-full mt-2"/>
      </div>
    </div>
  );
}

// Veteriner kartı skeleton
export function VetCardSkeleton() {
  return (
    <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5 flex gap-4">
      <Skeleton className="w-16 h-16 rounded-full flex-shrink-0"/>
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3"/>
        <Skeleton className="h-3 w-1/2"/>
        <Skeleton className="h-3 w-3/4"/>
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-7 w-24 rounded-full"/>
          <Skeleton className="h-7 w-20 rounded-full"/>
        </div>
      </div>
    </div>
  );
}

// Pet kartı skeleton
export function PetCardSkeleton() {
  return (
    <div className="bg-white rounded-[24px] border border-[rgba(196,169,107,.12)] overflow-hidden">
      <Skeleton className="h-32 rounded-none rounded-t-[24px]"/>
      <div className="p-5 space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-full"/>
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2"/>
            <Skeleton className="h-3 w-2/3"/>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          <Skeleton className="h-12 rounded-[12px]"/>
          <Skeleton className="h-12 rounded-[12px]"/>
          <Skeleton className="h-12 rounded-[12px]"/>
        </div>
      </div>
    </div>
  );
}

// Blog kartı skeleton
export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] overflow-hidden">
      <Skeleton className="h-40 rounded-none rounded-t-[20px]"/>
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-full"/>
        <Skeleton className="h-4 w-3/4"/>
        <Skeleton className="h-3 w-1/3 mt-2"/>
      </div>
    </div>
  );
}

// Profil skeleton (vet/hizmet detay)
export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-[24px] border border-[rgba(196,169,107,.12)] overflow-hidden">
        <Skeleton className="h-40 rounded-none rounded-t-[24px]"/>
        <div className="p-6 space-y-3">
          <div className="flex items-end gap-4 -mt-12">
            <Skeleton className="w-20 h-20 rounded-full border-4 border-white"/>
            <div className="flex-1 pb-1 space-y-2">
              <Skeleton className="h-5 w-1/2"/>
              <Skeleton className="h-3 w-2/3"/>
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full"/>
            <Skeleton className="h-6 w-24 rounded-full"/>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-[20px] border border-[rgba(196,169,107,.12)] p-5 space-y-3">
        <Skeleton className="h-4 w-1/4"/>
        <Skeleton className="h-3 w-full"/>
        <Skeleton className="h-3 w-full"/>
        <Skeleton className="h-3 w-3/4"/>
      </div>
    </div>
  );
}

// Genel liste skeleton
export function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({length: count}).map((_,i) => (
        <div key={i} className="bg-white rounded-[16px] border border-[rgba(196,169,107,.12)] p-4 flex gap-3">
          <Skeleton className="w-10 h-10 rounded-full flex-shrink-0"/>
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-3/4"/>
            <Skeleton className="h-3 w-1/2"/>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
