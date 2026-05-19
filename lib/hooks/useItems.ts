import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  doc, 
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Item, ItemCategory } from '@/types/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface UseItemsOptions {
  category?: ItemCategory;
  hostId?: string;
  limit?: number;
  sortBy?: 'createdAt' | 'pricePerDay' | 'averageRating';
  sortOrder?: 'asc' | 'desc';
}

export const useItems = (options: UseItemsOptions = {}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        let q = query(collection(db, 'items'));

        // Add filters
        if (options.category) {
          q = query(q, where('category', '==', options.category));
        }
        if (options.hostId) {
          q = query(q, where('hostId', '==', options.hostId));
        }
        
        // Only show published items unless fetching own items
        if (!options.hostId) {
          q = query(q, where('isPublished', '==', true));
        }

        // Add sorting
        const sortBy = options.sortBy || 'createdAt';
        const sortOrder = options.sortOrder || 'desc';
        q = query(q, orderBy(sortBy, sortOrder));

        // Add limit
        if (options.limit) {
          q = query(q, limit(options.limit));
        }

        const querySnapshot = await getDocs(q);
        const itemsData: Item[] = [];
        
        querySnapshot.forEach((doc) => {
          itemsData.push({ id: doc.id, ...doc.data() } as Item);
        });

        setItems(itemsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [options.category, options.hostId, options.limit, options.sortBy, options.sortOrder]);

  return { items, loading, error };
};

export const useItem = (itemId: string) => {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!itemId) return;

      try {
        setLoading(true);
        const docRef = doc(db, 'items', itemId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setItem({ id: docSnap.id, ...docSnap.data() } as Item);
          setError(null);
        } else {
          setError('Item not found');
        }
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Failed to load item');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  return { item, loading, error };
};

export const useCreateItem = () => {
  const { currentUser, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createItem = async (itemData: Omit<Item, 'id' | 'hostId' | 'hostName' | 'hostProfileImage' | 'createdAt' | 'averageRating' | 'reviewCount'>) => {
    if (!currentUser || !userProfile) {
      throw new Error('User must be logged in to create items');
    }

    try {
      setLoading(true);
      setError(null);

      const newItem = {
        ...itemData,
        hostId: currentUser.uid,
        hostName: userProfile.name,
        hostProfileImage: userProfile.profileImageUrl || '',
        averageRating: 0,
        reviewCount: 0,
        createdAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'items'), newItem);
      return docRef.id;
    } catch (err) {
      console.error('Error creating item:', err);
      setError('Failed to create item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createItem, loading, error };
};

export const useUpdateItem = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateItem = async (itemId: string, updates: Partial<Item>) => {
    if (!currentUser) {
      throw new Error('User must be logged in to update items');
    }

    try {
      setLoading(true);
      setError(null);

      const docRef = doc(db, 'items', itemId);
      await updateDoc(docRef, updates);
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Failed to update item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateItem, loading, error };
};

export const useDeleteItem = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteItem = async (itemId: string) => {
    if (!currentUser) {
      throw new Error('User must be logged in to delete items');
    }

    try {
      setLoading(true);
      setError(null);

      await deleteDoc(doc(db, 'items', itemId));
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteItem, loading, error };
};