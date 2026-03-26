import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, Collection } from '../types';
import { auth as firebaseAuth, db } from '../firebase/config';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

interface AuthState {
  user: UserProfile | null;
  isAdmin: boolean;
  isLoggedIn: boolean;
  initialized: boolean;
  setUser: (user: UserProfile | null) => void;
  initializeAuth: () => void;
  syncToFirestore: (updatedUser: UserProfile) => Promise<void>;
  addFavoriteQawl: (id: string) => void;
  removeFavoriteQawl: (id: string) => void;
  addFavoriteQissa: (id: string) => void;
  removeFavoriteQissa: (id: string) => void;
  isFavoriteQawl: (id: string) => boolean;
  isFavoriteQissa: (id: string) => boolean;
  saveReadingProgress: (qissaId: string, progress: number) => void;
  addCollection: (name: string) => void;
  removeCollection: (id: string) => void;
  addToCollection: (collectionId: string, type: 'qawl' | 'qissa', itemId: string) => void;
}

const guestUser: UserProfile = {
  id: 'guest',
  favorites_aqwaal: [],
  favorites_qisas: [],
  reading_progress: {},
  theme: 'light',
  font_size: 1.35,
  collections: [],
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: guestUser,
      isAdmin: false,
      isLoggedIn: false,
      initialized: false,
      
      setUser: (user) => set({ 
        user, 
        isLoggedIn: !!user,
      }),

      initializeAuth: () => {
        onAuthStateChanged(firebaseAuth, async (fbUser) => {
          if (fbUser) {
            // User is signed in, sync with Firestore
            const userDocRef = doc(db, 'users', fbUser.uid);
            
            // Listen for real-time changes from Firestore
            onSnapshot(userDocRef, (docSnap) => {
              if (docSnap.exists()) {
                set({ 
                  user: { ...get().user, ...docSnap.data() } as UserProfile,
                  isLoggedIn: true,
                  initialized: true,
                  isAdmin: docSnap.data().role === 'admin'
                });
              } else {
                // Initialize new user doc in Firestore
                const newUser: UserProfile = {
                  ...guestUser,
                  id: fbUser.uid,
                };
                setDoc(userDocRef, newUser);
                set({ user: newUser, isLoggedIn: true, initialized: true });
              }
            });
          } else {
            // Sign in anonymously if not logged in
            signInAnonymously(firebaseAuth).catch(console.error);
          }
        });
      },

      syncToFirestore: async (updatedUser: UserProfile) => {
        const fbUser = firebaseAuth.currentUser;
        if (fbUser) {
          const userDocRef = doc(db, 'users', fbUser.uid);
          await setDoc(userDocRef, updatedUser, { merge: true });
        }
      },

      addFavoriteQawl: (id) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const updated = { ...currentUser, favorites_aqwaal: [...new Set([...currentUser.favorites_aqwaal, id])] };
        set({ user: updated });
        get().syncToFirestore(updated);
      },

      removeFavoriteQawl: (id) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const updated = { ...currentUser, favorites_aqwaal: currentUser.favorites_aqwaal.filter((f) => f !== id) };
        set({ user: updated });
        get().syncToFirestore(updated);
      },

      addFavoriteQissa: (id) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const updated = { ...currentUser, favorites_qisas: [...new Set([...currentUser.favorites_qisas, id])] };
        set({ user: updated });
        get().syncToFirestore(updated);
      },

      removeFavoriteQissa: (id) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const updated = { ...currentUser, favorites_qisas: currentUser.favorites_qisas.filter((f) => f !== id) };
        set({ user: updated });
        get().syncToFirestore(updated);
      },

      isFavoriteQawl: (id) => get().user?.favorites_aqwaal.includes(id) ?? false,
      isFavoriteQissa: (id) => get().user?.favorites_qisas.includes(id) ?? false,
      
      saveReadingProgress: (qissaId, progress) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const updated = { ...currentUser, reading_progress: { ...currentUser.reading_progress, [qissaId]: progress } };
        set({ user: updated });
        get().syncToFirestore(updated);
      },

      addCollection: (name) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const newCollection: Collection = { 
          id: crypto.randomUUID(), 
          name_ar: name, 
          aqwaal_ids: [], 
          qisas_ids: [], 
          created_at: new Date().toISOString() 
        };
        const updated = { ...currentUser, collections: [...currentUser.collections, newCollection] };
        set({ user: updated });
        get().syncToFirestore(updated);
      },

      removeCollection: (id) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const updated = { ...currentUser, collections: currentUser.collections.filter((c) => c.id !== id) };
        set({ user: updated });
        get().syncToFirestore(updated);
      },

      addToCollection: (collectionId, type, itemId) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const updatedCollections = currentUser.collections.map((c) => {
          if (c.id !== collectionId) return c;
          return type === 'qawl'
            ? { ...c, aqwaal_ids: [...new Set([...c.aqwaal_ids, itemId])] }
            : { ...c, qisas_ids: [...new Set([...c.qisas_ids, itemId])] };
        });
        const updated = { ...currentUser, collections: updatedCollections };
        set({ user: updated });
        get().syncToFirestore(updated);
      },
    }),
    { name: 'noor-auth' }
  )
);
