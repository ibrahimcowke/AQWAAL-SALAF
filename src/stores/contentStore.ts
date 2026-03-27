import { create } from 'zustand';
import { scholarsData, aqwaalData, qisasData } from '../data/seed';
import type { Qawl, Qissa, Scholar } from '../types';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

interface ContentState {
  aqwaal: Qawl[];
  qisas: Qissa[];
  scholars: Scholar[];
  searchQuery: string;
  activeTag: string;
  activeScholarId: string;
  dailyQawl: Qawl | null;
  isLoading: boolean;
  error: string | null;
  setSearchQuery: (q: string) => void;
  setActiveTag: (tag: string) => void;
  setActiveScholarId: (id: string) => void;
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
  aqwaal: aqwaalData,
  qisas: qisasData,
  scholars: scholarsData,
  searchQuery: '',
  activeTag: '',
  activeScholarId: '',
  dailyQawl: null,
  isLoading: false,
  error: null,

  setSearchQuery: (q) => set({ searchQuery: q }),
  setActiveTag: (tag) => set({ activeTag: tag }),
  setActiveScholarId: (id) => set({ activeScholarId: id }),

  fetchContent: async () => {
    // Only set loading if we don't have any data yet
    if (get().aqwaal.length === 0) {
      set({ isLoading: true, error: null });
    }

    const scholarsCol = collection(db, 'scholars');
    const aqwaalCol = collection(db, 'aqwaal');
    const qisasCol = collection(db, 'qisas');

    // Real-time listeners
    onSnapshot(scholarsCol, (snapshot) => {
      const scholars = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Scholar));
      set({ scholars: scholars.length > 0 ? scholars : scholarsData, isLoading: false });
    }, (error) => {
      console.error("Scholars listener error:", error);
      set({ error: error.message, isLoading: false });
    });

    onSnapshot(aqwaalCol, (snapshot) => {
      const aqwaal = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Qawl));
      set({ aqwaal: aqwaal.length > 0 ? aqwaal : aqwaalData, isLoading: false });
      get().initDailyQawl();
    }, (error) => {
      console.error("Aqwaal listener error:", error);
      set({ error: error.message, isLoading: false });
    });

    onSnapshot(qisasCol, (snapshot) => {
      const qisas = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Qissa));
      set({ qisas: qisas.length > 0 ? qisas : qisasData, isLoading: false });
    }, (error) => {
      console.error("Qisas listener error:", error);
      set({ error: error.message, isLoading: false });
    });

    // We don't necessarily need to return unsubs if the store lives for the app lifetime,
    // but it's good practice if we ever need to cleanup.
  },

  getScholarById: (id) => get().scholars.find((s) => s.id === id || s.id === id), 
  getAqwaalByScholar: (scholarId) => get().aqwaal.filter((a) => a.scholar_id === scholarId),
  getQisasByScholar: (scholarId) => get().qisas.filter((q) => q.scholar_id === scholarId),
  
  getFilteredAqwaal: () => {
    const { aqwaal, searchQuery, activeTag, activeScholarId } = get();
    return aqwaal.filter((a) => {
      const matchesSearch =
        !searchQuery ||
        a.text_ar.includes(searchQuery) ||
        (a.scholar_name_ar && a.scholar_name_ar.includes(searchQuery)) ||
        a.tags.some((t) => t.includes(searchQuery));
      const matchesTag = !activeTag || a.tags.includes(activeTag);
      const matchesScholar = !activeScholarId || a.scholar_id === activeScholarId;
      return matchesSearch && matchesTag && matchesScholar;
    });
  },

  getFilteredQisas: () => {
    const { qisas, searchQuery, activeTag, activeScholarId } = get();
    return qisas.filter((q) => {
      const matchesSearch =
        !searchQuery ||
        q.title_ar.includes(searchQuery) ||
        q.content_ar.includes(searchQuery) ||
        q.summary_ar?.includes(searchQuery) ||
        q.tags.some((t) => t.includes(searchQuery));
      const matchesTag = !activeTag || q.tags.includes(activeTag);
      const matchesScholar = !activeScholarId || q.scholar_id === activeScholarId;
      return matchesSearch && matchesTag && matchesScholar;
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
