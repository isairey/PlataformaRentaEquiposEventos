import { Timestamp } from 'firebase/firestore';

// User types
export interface User {
  uid: string;
  email: string;
  name: string;
  profileImageUrl?: string;
  createdAt: Timestamp;
  averageRating: number;
  reviewCount: number;
}

// Item types
export interface Item {
  id?: string;
  hostId: string;
  hostName: string;
  hostProfileImage?: string;
  title: string;
  description: string;
  category: ItemCategory;
  pricePerDay: number;
  deposit: number;
  images: string[];
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  unavailableDates: string[];
  averageRating: number;
  reviewCount: number;
  isPublished: boolean;
  createdAt: Timestamp;
}

export type ItemCategory = 
  | 'party-supplies' 
  | 'photography' 
  | 'camping' 
  | 'electronics'
  | 'furniture'
  | 'sports'
  | 'other';

// Booking types
export interface Booking {
  id?: string;
  itemId: string;
  renterId: string;
  hostId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  deposit: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  renterMessage?: string;
  createdAt: Timestamp;
  // Denormalized data for faster queries
  itemTitle: string;
  itemImage: string;
}

export type BookingStatus = 
  | 'requested' 
  | 'confirmed' 
  | 'denied' 
  | 'in_use' 
  | 'returned' 
  | 'canceled';

export type PaymentStatus = 'pending' | 'paid';

// Review types
export interface Review {
  id?: string;
  bookingId: string;
  itemId: string;
  reviewerId: string;
  revieweeId: string;
  role: ReviewRole;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}

export type ReviewRole = 'renter_to_host' | 'host_to_renter';