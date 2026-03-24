import { useState } from 'react';
import { Heart, Share2, Volume2, BookOpen, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Qawl } from '../../types';
import { GradeBadge } from './Badge';
import { useAuthStore } from '../../stores/authStore';
import { useAudioStore } from '../../stores/audioStore';
import QuoteDesigner from '../features/QuoteDesigner';
import toast from 'react-hot-toast';

interface QawlCardProps {
  qawl: Qawl;
  index?: number;
  compact?: boolean;
}

export default function QawlCard({ qawl, index = 0, compact = false }: QawlCardProps) {
  const { addFavoriteQawl, removeFavoriteQawl, isFavoriteQawl } = useAuthStore();
  const { speak, playbackRate, setPlaybackRate } = useAudioStore();
  const [showDesigner, setShowDesigner] = useState(false);
  const isFav = isFavoriteQawl(qawl.id);

  const togglePlaybackRate = (e: React.MouseEvent) => {
    e.preventDefault();
    const rates = [0.8, 1, 1.2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    toast.success(`سرعة القراءة: ${nextRate}x`, { 
      duration: 1000,
      style: { fontFamily: 'Tajawal, sans-serif', direction: 'rtl', fontSize: '12px' } 
    });
  };

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFav) {
      removeFavoriteQawl(qawl.id);
      toast.success('تم الإزالة من المفضلة', { icon: '💔', style: { fontFamily: 'Amiri, serif', direction: 'rtl' } });
    } else {
      addFavoriteQawl(qawl.id);
      toast.success('تم الحفظ في المفضلة', { icon: '❤️', style: { fontFamily: 'Amiri, serif', direction: 'rtl' } });
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const text = `"${qawl.text_ar}"\n— ${qawl.scholar_name_ar}\n\nنور السلف`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('تم نسخ القول', { style: { fontFamily: 'Amiri, serif', direction: 'rtl' } });
    }
  };

  const handleAudio = (e: React.MouseEvent) => {
    e.preventDefault();
    speak(qawl.text_ar, `قول: ${qawl.scholar_name_ar}`);
  };

  const handleDesign = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDesigner(true);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: index * 0.03 
        }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="h-full"
      >
        <Link to={`/aqwaal/${qawl.id}`} className="block">
          <div
            className="neu-card p-5 cursor-pointer group relative overflow-hidden"
            style={{ background: 'var(--color-card)' }}
          >
            {/* Decorative corner */}
            <div
              className="absolute top-0 left-0 w-12 h-12 opacity-10"
              style={{
                background: 'linear-gradient(135deg, var(--color-gold), transparent)',
                borderRadius: '0 0 100% 0',
              }}
            />

            {/* Quote mark */}
            <div className="arabic-text text-5xl leading-none mb-2 opacity-15" style={{ color: 'var(--color-gold)' }}>"</div>

            {/* Main text */}
            <p
              className={`qawl-text leading-loose text-right ${compact ? 'line-clamp-3' : ''}`}
              style={{
                color: 'var(--color-text)',
                fontSize: compact ? '1.15rem' : '1.3rem',
              }}
            >
              {qawl.text_ar}
            </p>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                {qawl.scholar_name_ar && (
                  <span className="badge-scholar flex items-center gap-1">
                    <BookOpen size={10} />
                    {qawl.scholar_name_ar}
                  </span>
                )}
                <GradeBadge grade={qawl.grade} />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDesign}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ color: 'var(--color-gold)', background: 'var(--color-bg-alt)', border: '1px solid rgba(184, 134, 11, 0.2)' }}
                  title="تصميم بطاقة"
                >
                  <Sparkles size={14} />
                </button>
                <button
                  onClick={handleAudio}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    useAudioStore.getState().currentText === qawl.text_ar && useAudioStore.getState().isPlaying 
                    ? 'animate-pulse scale-110 shadow-lg' : 'hover:scale-110'
                  }`}
                  style={{ 
                    color: useAudioStore.getState().currentText === qawl.text_ar && useAudioStore.getState().isPlaying 
                      ? 'var(--color-primary)' : 'var(--color-text)', 
                    background: useAudioStore.getState().currentText === qawl.text_ar && useAudioStore.getState().isPlaying 
                      ? 'var(--color-gold)' : 'var(--color-card-border)' 
                  }}
                  title="استمع"
                >
                  <Volume2 size={14} />
                </button>
                <button
                  onClick={togglePlaybackRate}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110 arabic-text text-[10px] font-bold"
                  style={{ color: 'var(--color-text)', background: 'var(--color-card-border)' }}
                  title="سرعة القراءة"
                >
                  {playbackRate}x
                </button>
                <button
                  onClick={handleShare}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ color: 'var(--color-text)', background: 'var(--color-bg-alt)', border: '1px solid rgba(184, 134, 11, 0.2)' }}
                  title="مشاركة"
                >
                  <Share2 size={14} />
                </button>
                <button
                  onClick={toggleFav}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: isFav ? 'rgba(220, 38, 38, 0.1)' : 'var(--color-bg-alt)',
                  }}
                  title={isFav ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
                >
                  <Heart size={14} fill={isFav ? '#dc2626' : 'none'} stroke={isFav ? '#dc2626' : 'var(--color-text-muted)'} />
                </button>
              </div>
            </div>

            {/* Source */}
            {!compact && qawl.source && (
              <p className="mt-2 text-xs arabic-text" style={{ color: 'var(--color-text-muted)' }}>
                📚 {qawl.source}
              </p>
            )}
          </div>
        </Link>
      </motion.div>

      <AnimatePresence>
        {showDesigner && (
          <QuoteDesigner 
            text={qawl.text_ar} 
            author={qawl.scholar_name_ar || 'عالم من السلف'} 
            onClose={() => setShowDesigner(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
