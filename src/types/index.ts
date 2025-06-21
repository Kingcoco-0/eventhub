export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  description: string;
  location: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  availability: boolean;
  eventTypes: EventType[];
  images: string[];
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  portfolio: string[];
  specialties: string[];
}

export type VendorCategory = 
  | 'photographer'
  | 'caterer'
  | 'decorator'
  | 'event-organizer'
  | 'souvenir-provider'
  | 'entertainment'
  | 'venue';

export type EventType = 
  | 'wedding'
  | 'birthday'
  | 'corporate'
  | 'anniversary'
  | 'graduation'
  | 'baby-shower'
  | 'engagement';

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export interface EventPlan {
  eventType: EventType;
  budget: string;
  guestCount: number;
  timeline: string;
  recommendedVendors: Vendor[];
  estimatedCost: string;
  tips: string[];
}

export interface FilterState {
  category: VendorCategory | 'all';
  location: string;
  priceRange: string;
  rating: number;
  eventType: EventType | 'all';
  availability: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}