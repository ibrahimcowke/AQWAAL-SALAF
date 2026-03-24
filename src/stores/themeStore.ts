import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '../types';

interface ThemeState {
  mode: ThemeMode;
  fontSize: number; // rem multiplier
  readingMode: boolean; // distraction-free
  setMode: (mode: ThemeMode) => void;
  setFontSize: (size: number) => void;
  toggleReadingMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      fontSize: 1.35,
      readingMode: false,
      setMode: (mode) => {
        set({ mode });
        const root = document.documentElement;
        root.classList.remove('dark', 'paper');
        if (mode === 'dark') root.classList.add('dark');
        if (mode === 'paper') root.classList.add('paper');
      },
      setFontSize: (size) => set({ fontSize: size }),
      toggleReadingMode: () => set((s) => ({ readingMode: !s.readingMode })),
    }),
    { name: 'noor-theme' }
  )
);
