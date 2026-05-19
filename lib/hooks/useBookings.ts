import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  getDoc,
  addDoc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Booking, BookingStatus } from '@/types/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface UseBookingsOptions {
  renterId?: string;
  hostId?: string;
  itemId?: string;
  status?: BookingStatus;
}

export const useBookings = (options: UseBookingsOptions = {}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        let q = query(collection(db, 'bookings'));

        // Add filters
        if (options.renterId) {
          q = query(q, where('renterId', '==', options.renterId));
        }
        if (options.hostId) {
          q = query(q, where('hostId', '==', options.hostId));
        }
        if (options.itemId) {
          q = query(q, where('itemId', '==', options.itemId));
        }
        if (options.status) {
          q = query(q, where('status', '==', options.status));
        }

        // Order by creation date
        q = query(q, orderBy('createdAt', 'desc'));

        const querySnapshot = await getDocs(q);
        const bookingsData: Booking[] = [];
        
        querySnapshot.forEach((doc) => {
          bookingsData.push({ id: doc.id, ...doc.data() } as Booking);
        });

        setBookings(bookingsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [options.renterId, options.hostId, options.itemId, options.status]);

  return { bookings, loading, error };
};

export const useCreateBooking = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'renterId' | 'createdAt' | 'status' | 'paymentStatus'>) => {
    if (!currentUser) {
      throw new Error('User must be logged in to create bookings');
    }

    try {
      setLoading(true);
      setError(null);

      const newBooking = {
        ...bookingData,
        renterId: currentUser.uid,
        status: 'requested' as BookingStatus,
        paymentStatus: 'pending',
        createdAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'bookings'), newBooking);
      return docRef.id;
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to create booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading, error };
};

export const useUpdateBooking = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBooking = async (bookingId: string, updates: Partial<Booking>) => {
    if (!currentUser) {
      throw new Error('User must be logged in to update bookings');
    }

    try {
      setLoading(true);
      setError(null);

      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, updates);
    } catch (err) {
      console.error('Error updating booking:', err);
      setError('Failed to update booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateBooking, loading, error };
};

export const checkDateAvailability = async (
  itemId: string, 
  startDate: string, 
  endDate: string
): Promise<boolean> => {
  try {
    // Get all bookings for this item
    const q = query(
      collection(db, 'bookings'),
      where('itemId', '==', itemId),
      where('status', 'in', ['confirmed', 'in_use'])
    );
    
    const querySnapshot = await getDocs(q);
    
    // Check for date conflicts
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (const doc of querySnapshot.docs) {
      const booking = doc.data() as Booking;
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      
      // Check if dates overlap
      if (
        (start >= bookingStart && start <= bookingEnd) ||
        (end >= bookingStart && end <= bookingEnd) ||
        (start <= bookingStart && end >= bookingEnd)
      ) {
        return false; // Dates not available
      }
    }
    
    return true; // Dates are available
  } catch (error) {
    console.error('Error checking date availability:', error);
    return false;
  }
};