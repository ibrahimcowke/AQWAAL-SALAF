import { create } from 'zustand';

interface AudioState {
  isPlaying: boolean;
  currentText: string;
  currentTitle: string;
  isPaused: boolean;
  playbackRate: number;
  utterance: SpeechSynthesisUtterance | null;
  speak: (text: string, title?: string) => void;
  stop: () => void;
  togglePause: () => void;
  setPlaybackRate: (rate: number) => void;
}

export const useAudioStore = create<AudioState>()((set, get) => ({
  isPlaying: false,
  isPaused: false,
  currentText: '',
  currentTitle: '',
  playbackRate: 0.85,
  utterance: null,
  speak: (text, title = '') => {
    window.speechSynthesis.cancel();
    const { playbackRate } = get();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ar-SA';
    utter.rate = playbackRate;
    utter.pitch = 1;
    
    // Advanced Voice Selection
    const voices = window.speechSynthesis.getVoices();
    const arVoices = voices.filter((v) => v.lang.startsWith('ar'));
    // Prioritize natural sounding voices if available
    const bestVoice = arVoices.find(v => v.name.includes('Natural')) || arVoices[0];
    if (bestVoice) utter.voice = bestVoice;

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
  setPlaybackRate: (rate: number) => {
    set({ playbackRate: rate });
    const { utterance, isPlaying } = get();
    if (utterance && isPlaying) {
      // Re-trigger speech with new rate if currently playing
      const text = get().currentText;
      const wasPaused = get().isPaused;
      window.speechSynthesis.cancel();
      const newUtter = new SpeechSynthesisUtterance(text);
      newUtter.lang = 'ar-SA';
      newUtter.rate = rate;
      const voices = window.speechSynthesis.getVoices();
      const arVoice = voices.find((v) => v.lang.startsWith('ar'));
      if (arVoice) newUtter.voice = arVoice;
      newUtter.onend = () => set({ isPlaying: false, isPaused: false, utterance: null });
      window.speechSynthesis.speak(newUtter);
      if (wasPaused) window.speechSynthesis.pause();
      set({ utterance: newUtter });
    }
  },
}));
