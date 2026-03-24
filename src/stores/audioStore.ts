import { create } from 'zustand';

interface AudioState {
  isPlaying: boolean;
  currentText: string;
  currentTitle: string;
  isPaused: boolean;
  utterance: SpeechSynthesisUtterance | null;
  speak: (text: string, title?: string) => void;
  stop: () => void;
  togglePause: () => void;
}

export const useAudioStore = create<AudioState>()((set, get) => ({
  isPlaying: false,
  isPaused: false,
  currentText: '',
  currentTitle: '',
  utterance: null,
  speak: (text, title = '') => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ar-SA';
    utter.rate = 0.85;
    utter.pitch = 1;
    // Prefer Arabic voice
    const voices = window.speechSynthesis.getVoices();
    const arVoice = voices.find((v) => v.lang.startsWith('ar'));
    if (arVoice) utter.voice = arVoice;
    utter.onend = () => set({ isPlaying: false, isPaused: false, utterance: null });
    window.speechSynthesis.speak(utter);
    set({ isPlaying: true, isPaused: false, currentText: text, currentTitle: title, utterance: utter });
  },
  stop: () => {
    window.speechSynthesis.cancel();
    set({ isPlaying: false, isPaused: false, utterance: null, currentText: '', currentTitle: '' });
  },
  togglePause: () => {
    const { isPlaying, isPaused } = get();
    if (!isPlaying) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      set({ isPaused: false });
    } else {
      window.speechSynthesis.pause();
      set({ isPaused: true });
    }
  },
}));
