import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode, FontMode } from '../types';

interface ThemeState {
  mode: ThemeMode;
  fontFamily: FontMode;
  fontSize: number; // rem multiplier
  readingMode: boolean; // distraction-free
  setMode: (mode: ThemeMode) => void;
  setFontFamily: (font: FontMode) => void;
  setFontSize: (size: number) => void;
  toggleReadingMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      fontFamily: 'amiri',
      fontSize: 1.35,
      readingMode: false,
      setMode: (mode) => {
        set({ mode });
        const root = document.documentElement;
        // Remove all possible theme classes
        root.classList.remove('dark', 'paper', 'midnight', 'emerald', 'sand', 'royal');
        if (mode !== 'light') {
          root.classList.add(mode);
        }
      },
      setFontFamily: (fontFamily) => {
        set({ fontFamily });
        const root = document.documentElement;
        root.classList.remove('font-amiri', 'font-scheherazade', 'font-tajawal', 'font-cairo', 'font-noto');
        root.classList.add(`font-${fontFamily}`);
      },
      setFontSize: (size) => set({ fontSize: size }),
      toggleReadingMode: () => set((s) => ({ readingMode: !s.readingMode })),
    }),
    { name: 'noor-theme' }
  )
);
