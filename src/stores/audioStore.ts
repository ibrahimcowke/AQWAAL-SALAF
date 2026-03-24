import { create } from 'zustand';
import toast from 'react-hot-toast';

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
  testVoice: () => void;
}

export const useAudioStore = create<AudioState>()((set, get) => ({
  isPlaying: false,
  isPaused: false,
  currentText: '',
  currentTitle: '',
  playbackRate: 0.85,
  utterance: null,
  speak: (text, title = '') => {
    if (!window.speechSynthesis) {
      toast.error('المتصفح لا يدعم خاصية القراءة الصوتية');
      return;
    }

    window.speechSynthesis.cancel();
    
    const startSpeaking = () => {
      const { playbackRate } = get();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ar-SA';
      utter.rate = playbackRate;
      utter.pitch = 1;
      
      const voices = window.speechSynthesis.getVoices();
      const arVoices = voices.filter((v) => v.lang.startsWith('ar'));
      
      if (arVoices.length === 0 && voices.length > 0) {
        // Fallback if no specific Arabic voice but system has voices
        console.warn('No Arabic voice found, using default');
      } else {
        const bestVoice = arVoices.find(v => v.name.includes('Natural')) || arVoices[0];
        if (bestVoice) utter.voice = bestVoice;
      }

      utter.onstart = () => set({ isPlaying: true, isPaused: false });
      utter.onend = () => set({ isPlaying: false, isPaused: false, utterance: null });
      utter.onerror = (err) => {
        console.error('TTS Error:', err);
        set({ isPlaying: false, isPaused: false, utterance: null });
      };

      window.speechSynthesis.speak(utter);
      set({ currentText: text, currentTitle: title, utterance: utter });
    };

    // Handle async voice loading
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        startSpeaking();
        window.speechSynthesis.onvoiceschanged = null; // Clean up
      };
    } else {
      startSpeaking();
    }
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
  testVoice: () => {
    if (!window.speechSynthesis) {
      toast.error('Speech Synthesis not supported');
      return;
    }
    const voices = window.speechSynthesis.getVoices();
    const arVoices = voices.filter(v => v.lang.startsWith('ar'));
    
    if (voices.length === 0) {
      toast.error('No voices found. Try reloading or wait a moment.');
    } else if (arVoices.length === 0) {
      toast.error(`Found ${voices.length} voices, but NO Arabic voice found.`);
      console.log('Voices available:', voices.map(v => `${v.name} (${v.lang})`));
    } else {
      toast.success(`Success! Found ${arVoices.length} Arabic voices.`);
      get().speak('اختبار القراءة الصوتية. هل تسمعني؟', 'اختبار');
    }
  }
}));
