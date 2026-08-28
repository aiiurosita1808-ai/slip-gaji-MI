import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export function useCloudStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  // Sync from Firestore
  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'users', auth.currentUser.uid, 'data', key);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data().value;
        setStoredValue(data);
      } else {
        // Migration logic: If no cloud data, try to get from localStorage
        try {
          const localItem = window.localStorage.getItem(key);
          if (localItem) {
            const parsed = JSON.parse(localItem);
            setStoredValue(parsed);
            // Save migrated data to cloud
            setDoc(docRef, { value: parsed });
            // Optionally clear local to prevent duplicate migrations? 
            // window.localStorage.removeItem(key);
          } else {
            setStoredValue(initialValue);
          }
        } catch (error) {
          console.warn('Error migrating local data:', error);
          setStoredValue(initialValue);
        }
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching data from Firestore", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [key, auth.currentUser]);

  // Save to Firestore
  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Optimistic local update
      setStoredValue(valueToStore);
      
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid, 'data', key);
        await setDoc(docRef, { value: valueToStore });
      } else {
        console.warn("User not logged in. Changes are only local.");
      }
    } catch (error) {
      console.error("Error saving data to Firestore", error);
    }
  };

  return [storedValue, setValue];
}
