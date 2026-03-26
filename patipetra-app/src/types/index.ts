export type UserRole = 'user' | 'vet' | 'admin';
export type PlanType = 'free' | 'standard' | 'plus' | 'clinic';
export type SpeciesType = 'cat' | 'dog' | 'bird' | 'rabbit' | 'hamster' | 'fish' | 'turtle' | 'other';
export type GenderType  = 'female' | 'male' | 'unknown';
export type ListingType = 'adoption' | 'temp' | 'lost' | 'found';
export type ListingStatus = 'active' | 'pending' | 'closed' | 'draft';

export interface AppUser {
  id: string; name: string; surname: string; email: string;
  phone?: string; city?: string; district?: string; bio?: string;
  avatarUrl?: string; role: UserRole; plan: PlanType;
  createdAt: Date; updatedAt: Date;
}

export interface Pet {
  id: string; ownerId: string; name: string; species: SpeciesType;
  breed?: string; birthDate?: Date; gender: GenderType;
  weight?: number; color?: string; microchipId?: string;
  allergies?: string; avatarUrl?: string;
  createdAt: Date; updatedAt: Date;
}

export interface Listing {
  id: string; ownerId: string; ownerName: string;
  type: ListingType; status: ListingStatus;
  name: string; species: SpeciesType; breed?: string;
  age?: string; ageGroup?: 'puppy'|'young'|'adult'|'senior';
  gender: GenderType; city: string; district?: string;
  description: string; imageUrls: string[]; tags: string[];
  isPuppy: boolean; puppyCount?: number;
  isVerified: boolean; isPremium: boolean; isUrgent: boolean;
  viewCount: number; favoriteCount: number;
  contactPhone?: string; contactEmail?: string;
  createdAt: Date; updatedAt: Date;
}

export interface VetProfile {
  id: string; userId: string; name: string; title: string;
  clinicName: string; city: string; specializations: string[];
  isVerified: boolean; isOnline: boolean;
  avgResponseMinutes?: number; rating: number; plan: 'basic'|'clinic';
  createdAt: Date;
}

export interface Notification {
  id: string; userId: string;
  type: 'message'|'listing_view'|'vaccine_reminder'|'listing_approved'|'favorite'|'system';
  title: string; body: string; isRead: boolean;
  actionUrl?: string; createdAt: Date;
}
