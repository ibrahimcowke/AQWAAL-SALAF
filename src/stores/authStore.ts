import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { UserProfile, Collection } from '../types';

interface AuthState {
  user: UserProfile | null;
  isAdmin: boolean;
  isLoggedIn: boolean;
  initialized: boolean;
  setUser: (user: UserProfile | null) => void;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  syncProfile: () => Promise<void>;
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
        isAdmin: user?.role === 'admin', 
        isLoggedIn: !!user && user.id !== 'guest',
        initialized: true
      }),

      signIn: async (email) => {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
      },

      signOut: async () => {
        await supabase.auth.signOut();
        set({ user: guestUser, isLoggedIn: false, isAdmin: false });
      },

      syncProfile: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code === 'PGRST116') {
          // Profile not found, create one
          const newProfile: UserProfile = {
            ...guestUser,
            id: user.id,
            email: user.email,
          };
          const { error: insertError } = await supabase.from('profiles').insert(newProfile);
          if (!insertError) set({ user: newProfile, isLoggedIn: true });
        } else if (profile) {
          set({ user: profile as UserProfile, isLoggedIn: true, isAdmin: profile.role === 'admin' });
        }
      },

      addFavoriteQawl: (id) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const updated = { ...currentUser, favorites_aqwaal: [...new Set([...currentUser.favorites_aqwaal, id])] };
        set({ user: updated });
        if (get().isLoggedIn) supabase.from('profiles').update({ favorites_aqwaal: updated.favorites_aqwaal }).eq('id', updated.id);
      },

      removeFavoriteQawl: (id) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const updated = { ...currentUser, favorites_aqwaal: currentUser.favorites_aqwaal.filter((f) => f !== id) };
        set({ user: updated });
        if (get().isLoggedIn) supabase.from('profiles').update({ favorites_aqwaal: updated.favorites_aqwaal }).eq('id', updated.id);
      },

      addFavoriteQissa: (id) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const updated = { ...currentUser, favorites_qisas: [...new Set([...currentUser.favorites_qisas, id])] };
        set({ user: updated });
        if (get().isLoggedIn) supabase.from('profiles').update({ favorites_qisas: updated.favorites_qisas }).eq('id', updated.id);
      },

      removeFavoriteQissa: (id) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const updated = { ...currentUser, favorites_qisas: currentUser.favorites_qisas.filter((f) => f !== id) };
        set({ user: updated });
        if (get().isLoggedIn) supabase.from('profiles').update({ favorites_qisas: updated.favorites_qisas }).eq('id', updated.id);
      },

      isFavoriteQawl: (id) => get().user?.favorites_aqwaal.includes(id) ?? false,
      isFavoriteQissa: (id) => get().user?.favorites_qisas.includes(id) ?? false,
      
      saveReadingProgress: (qissaId, progress) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const updated = { ...currentUser, reading_progress: { ...currentUser.reading_progress, [qissaId]: progress } };
        set({ user: updated });
        if (get().isLoggedIn) supabase.from('profiles').update({ reading_progress: updated.reading_progress }).eq('id', updated.id);
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
        if (get().isLoggedIn) supabase.from('profiles').update({ collections: updated.collections }).eq('id', updated.id);
      },

      removeCollection: (id) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const updated = { ...currentUser, collections: currentUser.collections.filter((c) => c.id !== id) };
        set({ user: updated });
        if (get().isLoggedIn) supabase.from('profiles').update({ collections: updated.collections }).eq('id', updated.id);
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
        if (get().isLoggedIn) supabase.from('profiles').update({ collections: updated.collections }).eq('id', updated.id);
      },
    }),
    { name: 'noor-auth' }
  )
);

// Initialize Auth Listener
supabase.auth.onAuthStateChange(async (event, session) => {
  const store = useAuthStore.getState();
  if (event === 'SIGNED_IN' && session) {
    await store.syncProfile();
  } else if (event === 'SIGNED_OUT') {
    store.setUser(guestUser);
  }
});
