import { create } from 'zustand';
import { scholarsData, aqwaalData, qisasData } from '../data/seed';
import type { Qawl, Qissa, Scholar } from '../types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

interface ContentState {
  aqwaal: Qawl[];
  qisas: Qissa[];
  scholars: Scholar[];
  searchQuery: string;
  activeTag: string;
  dailyQawl: Qawl | null;
  isLoading: boolean;
  error: string | null;
  setSearchQuery: (q: string) => void;
  setActiveTag: (tag: string) => void;
  fetchContent: () => Promise<void>;
  getScholarById: (id: string) => Scholar | undefined;
  getAqwaalByScholar: (scholarId: string) => Qawl[];
  getQisasByScholar: (scholarId: string) => Qissa[];
  getFilteredAqwaal: () => Qawl[];
  getFilteredQisas: () => Qissa[];
  initDailyQawl: () => void;
  refreshDailyQawl: () => void;
}

export const useContentStore = create<ContentState>()((set, get) => ({
  aqwaal: [],
  qisas: [],
  scholars: [],
  searchQuery: '',
  activeTag: '',
  dailyQawl: null,
  isLoading: false,
  error: null,

  setSearchQuery: (q) => set({ searchQuery: q }),
  setActiveTag: (tag) => set({ activeTag: tag }),

  fetchContent: async () => {
    set({ isLoading: true, error: null });
    try {
      const scholarsCol = collection(db, 'scholars');
      const aqwaalCol = collection(db, 'aqwaal');
      const qisasCol = collection(db, 'qisas');

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firestore operation timed out after 5 seconds')), 5000)
      );

      const [scholarsSnap, aqwaalSnap, qisasSnap] = await Promise.race([
        Promise.all([
          getDocs(scholarsCol),
          getDocs(aqwaalCol),
          getDocs(qisasCol)
        ]),
        timeoutPromise
      ]) as any;

      const scholars = scholarsSnap.docs.map((doc: any) => ({ ...doc.data(), id: doc.id } as Scholar));
      const aqwaal = aqwaalSnap.docs.map((doc: any) => ({ ...doc.data(), id: doc.id } as Qawl));
      const qisas = qisasSnap.docs.map((doc: any) => ({ ...doc.data(), id: doc.id } as Qissa));

      // Fallback to seed data if Firestore is empty (mostly for initial setup)
      if (scholars.length === 0 && aqwaal.length === 0 && qisas.length === 0) {
        set({
          scholars: scholarsData,
          aqwaal: aqwaalData,
          qisas: qisasData,
          isLoading: false
        });
      } else {
        set({
          scholars,
          aqwaal,
          qisas,
          isLoading: false
        });
      }
      
      get().initDailyQawl();
    } catch (error: any) {
      console.error('Error fetching content:', error);
      set({ 
        error: error.message,
        isLoading: false,
        // Fallback to static data on error so the app remains functional
        scholars: scholarsData,
        aqwaal: aqwaalData,
        qisas: qisasData
      });
      get().initDailyQawl();
    }
  },

  getScholarById: (id) => get().scholars.find((s) => s.id === id || s.id === id), 
  getAqwaalByScholar: (scholarId) => get().aqwaal.filter((a) => a.scholar_id === scholarId),
  getQisasByScholar: (scholarId) => get().qisas.filter((q) => q.scholar_id === scholarId),
  
  getFilteredAqwaal: () => {
    const { aqwaal, searchQuery, activeTag } = get();
    return aqwaal.filter((a) => {
      const matchesSearch =
        !searchQuery ||
        a.text_ar.includes(searchQuery) ||
        (a.scholar_name_ar && a.scholar_name_ar.includes(searchQuery)) ||
        a.tags.some((t) => t.includes(searchQuery));
      const matchesTag = !activeTag || a.tags.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  },

  getFilteredQisas: () => {
    const { qisas, searchQuery, activeTag } = get();
    return qisas.filter((q) => {
      const matchesSearch =
        !searchQuery ||
        q.title_ar.includes(searchQuery) ||
        q.content_ar.includes(searchQuery) ||
        q.summary_ar?.includes(searchQuery) ||
        q.tags.some((t) => t.includes(searchQuery));
      const matchesTag = !activeTag || q.tags.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  },

  initDailyQawl: () => {
    const { aqwaal } = get();
    if (aqwaal.length === 0) return;

    const today = new Date().toDateString();
    const stored = localStorage.getItem('noor-daily-qawl');
    
    if (stored) {
      try {
        const { date, id } = JSON.parse(stored);
        if (date === today) {
          const found = aqwaal.find((a) => a.id === id);
          if (found) { set({ dailyQawl: found }); return; }
        }
      } catch (e) {
        // Fallback to random if parse fails
      }
    }

    const random = aqwaal[Math.floor(Math.random() * aqwaal.length)];
    localStorage.setItem('noor-daily-qawl', JSON.stringify({ date: today, id: random.id }));
    set({ dailyQawl: random });
  },
  refreshDailyQawl: () => {
    const { aqwaal } = get();
    if (aqwaal.length === 0) return;
    const random = aqwaal[Math.floor(Math.random() * aqwaal.length)];
    const today = new Date().toDateString();
    localStorage.setItem('noor-daily-qawl', JSON.stringify({ date: today, id: random.id }));
    set({ dailyQawl: random });
  },
}));
