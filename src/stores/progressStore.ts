import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  readStories: string[]; // qissa_ids
  searchHistory: string[];
  markAsRead: (id: string) => void;
  unmarkAsRead: (id: string) => void;
  isRead: (id: string) => boolean;
  addSearchQuery: (query: string) => void;
  clearSearchHistory: () => void;
  lastVisit: string;
  updateLastVisit: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      readStories: [],
      searchHistory: [],
      lastVisit: new Date().toISOString(),
      
      markAsRead: (id) => set((s) => ({
        readStories: s.readStories.includes(id) ? s.readStories : [...s.readStories, id]
      })),
      
      unmarkAsRead: (id) => set((s) => ({
        readStories: s.readStories.filter(rid => rid !== id)
      })),
      
      isRead: (id) => get().readStories.includes(id),
      
      addSearchQuery: (query) => {
        if (!query.trim()) return;
        set((s) => {
          const filtered = s.searchHistory.filter(q => q !== query);
          return { searchHistory: [query, ...filtered].slice(0, 10) };
        });
      },
      
      clearSearchHistory: () => set({ searchHistory: [] }),
      
      updateLastVisit: () => set({ lastVisit: new Date().toISOString() }),
    }),
    { name: 'noor-progress' }
  )
);
