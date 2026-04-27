import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

interface AudioButtonProps {
  text: string;
  lang?: string;
  className?: string;
}

export default function AudioButton({ text, lang = 'ar', className = '' }: AudioButtonProps) {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!window.speechSynthesis) {
      setIsSupported(false);
    }
  }, []);

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const speak = () => {
    if (!isSupported) {
      toast.error(t('audio_not_supported'));
      return;
    }

    if (isPlaying) {
      stop();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find an Arabic voice
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
    
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }
    
    utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (e) => {
      console.error('SpeechSynthesis Error:', e);
      setIsPlaying(false);
      toast.error(t('audio_error'));
    };

    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) return null;

  return (
    <button
      onClick={speak}
      className={`p-2 rounded-full transition-all ${
        isPlaying 
        ? 'bg-[var(--color-primary)] text-white scale-110 shadow-lg' 
        : 'bg-[var(--color-bg-alt)] text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]'
      } ${className}`}
      title={isPlaying ? t('stop') : t('audio')}
    >
      {isPlaying ? (
        <VolumeX size={18} className="animate-pulse" />
      ) : (
        <Volume2 size={18} />
      )}
    </button>
  );
}
