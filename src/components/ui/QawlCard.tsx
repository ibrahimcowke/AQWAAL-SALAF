import { useState } from 'react';
import { Heart, Share2, Volume2, BookOpen, Sparkles, Info, X, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Qawl } from '../../types';
import { GradeBadge } from './Badge';
import { useAuthStore } from '../../stores/authStore';
import { useAudioStore } from '../../stores/audioStore';
import QuoteDesigner from '../features/QuoteDesigner';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

interface QawlCardProps {
  qawl: Qawl;
  index?: number;
  compact?: boolean;
}

export default function QawlCard({ qawl, index = 0, compact = false }: QawlCardProps) {
  const { addFavoriteQawl, removeFavoriteQawl, isFavoriteQawl } = useAuthStore();
  const { speak } = useAudioStore();
  const [showDesigner, setShowDesigner] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [copied, setCopied] = useState(false);
  const isFav = isFavoriteQawl(qawl.id);

  const { i18n, t } = useTranslation();
  const currentLang = i18n.language;
  const isArabic = currentLang === 'ar';
  const isSomali = currentLang === 'so';

  const displayText = isSomali && qawl.text_so ? qawl.text_so : qawl.text_ar;
  const displayScholarName = isSomali && qawl.scholar_name_so ? qawl.scholar_name_so : qawl.scholar_name_ar;
  const explanation = isSomali ? qawl.explanation_so : qawl.explanation_ar;



  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFav) {
      removeFavoriteQawl(qawl.id);
      toast.success(isArabic ? 'تمت الإزالة من المفضلة' : 'Laga saaray kuwa la jecel yahay', { icon: '💔' });
    } else {
      addFavoriteQawl(qawl.id);
      toast.success(isArabic ? 'تمت الإضافة إلى المفضلة' : 'Waa la xafiday', { icon: '❤️' });
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const text = `"${displayText}"\n— ${displayScholarName}\n\n${t('app_name')}`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success(t('share') === 'share' ? 'Copied' : 'Waa la koobiyeeyay');
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(qawl.text_ar);
    setCopied(true);
    toast.success(t('copied_success') || 'تم النسخ بنجاح');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyWithSource = (e: React.MouseEvent) => {
    e.preventDefault();
    const textToCopy = `"${qawl.text_ar}"\n\n— ${qawl.scholar_name_ar || t('unknown_scholar')}\n📚 ${qawl.source}`;
    navigator.clipboard.writeText(textToCopy);
    toast.success(t('copy_with_source_success') || 'تم النسخ مع المصدر');
  };

  const handleAudio = (e: React.MouseEvent) => {
    e.preventDefault();
    speak(displayText, `${t('aqwaal')}: ${displayScholarName}`);
  };

  const handleDesign = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDesigner(true);
  };

  const handleOpenExplanation = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowExplanation(true);
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
        <Link to={`/aqwaal/${qawl.id}`} className="block h-full">
          <div
            className="neu-card p-5 h-full cursor-pointer group relative overflow-hidden flex flex-col"
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
            <div className="flex-grow">
              <p
                className={`qawl-text leading-loose ${isArabic ? 'text-right' : 'text-left'} ${compact ? 'line-clamp-3' : ''}`}
                style={{
                  color: 'var(--color-text)',
                  fontSize: compact ? '1.15rem' : '1.3rem',
                  direction: isArabic ? 'rtl' : 'ltr'
                }}
              >
                {displayText}
              </p>
            </div>

            {/* Footer Area */}
            <div className="mt-6 pt-4 border-t border-[var(--color-card-border)] space-y-4">
              <div 
                className="flex items-center justify-between flex-wrap gap-2"
                style={{ direction: isArabic ? 'rtl' : 'ltr' }}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  {displayScholarName && (
                    <span className="badge-scholar flex items-center gap-1">
                      <BookOpen size={10} />
                      {displayScholarName}
                    </span>
                  )}
                  <GradeBadge grade={qawl.grade} />
                </div>

                <div className="flex items-center gap-2">
                  {explanation && (
                    <button
                      onClick={handleOpenExplanation}
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                      style={{ color: 'var(--color-gold)', background: 'var(--color-bg-alt)', border: '1px solid rgba(184, 134, 11, 0.2)' }}
                      title={t('explanation') || 'الشرح'}
                    >
                      <Info size={14} />
                    </button>
                  )}
                  <button
                    onClick={handleDesign}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                    style={{ color: 'var(--color-gold)', background: 'var(--color-bg-alt)', border: '1px solid rgba(184, 134, 11, 0.2)' }}
                    title="تصميم بطاقة"
                  >
                    <Sparkles size={14} />
                  </button>
                </div>
              </div>

              {/* Action Buttons Hub */}
              <div className="flex items-center justify-between gap-2">
                 <div className="flex items-center gap-2">
                    <button
                      onClick={handleAudio}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
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
                      <Volume2 size={16} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                      style={{ color: 'var(--color-text)', background: 'var(--color-bg-alt)', border: '1px solid var(--color-card-border)' }}
                      title={t('share')}
                    >
                      <Share2 size={16} />
                    </button>
                    <button
                      onClick={handleCopyWithSource}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                      style={{ color: 'var(--color-primary)', background: 'var(--color-bg-alt)', border: '1px solid var(--color-primary-light)' }}
                      title={t('copy_with_source')}
                    >
                      <BookOpen size={16} />
                    </button>
                 </div>

                 <div className="flex items-center gap-2">
                   <button
                      onClick={handleCopy}
                      className="px-3 py-1.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-card-border)] flex items-center gap-2 text-[10px] font-bold transition-all hover:border-[var(--color-primary)]/30"
                    >
                      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                      <span className="hidden sm:inline">{t('copy')}</span>
                    </button>
                    <button
                      onClick={toggleFav}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        background: isFav ? 'rgba(220, 38, 38, 0.1)' : 'var(--color-bg-alt)',
                        border: isFav ? '1px solid rgba(220, 38, 38, 0.2)' : '1px solid var(--color-card-border)'
                      }}
                    >
                      <Heart size={16} fill={isFav ? '#dc2626' : 'none'} stroke={isFav ? '#dc2626' : 'var(--color-text-muted)'} />
                    </button>
                 </div>
              </div>

              {!compact && qawl.source && (
                <p className="text-[10px] opacity-40 arabic-text" style={{ textAlign: isArabic ? 'right' : 'left' }}>
                  📚 {isSomali && qawl.source_so ? qawl.source_so : qawl.source}
                </p>
              )}
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Explanation Modal */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowExplanation(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[var(--color-card)] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-card-border)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-[var(--color-card-border)] flex items-center justify-between bg-[var(--color-bg-alt)]/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-gold)]/10 flex items-center justify-center text-[var(--color-gold)]">
                    <Info size={20} />
                  </div>
                  <h3 className="arabic-text font-bold text-lg">{isArabic ? 'شرح الأثر' : 'Sharaxa Xikmadda'}</h3>
                </div>
                <button 
                  onClick={() => setShowExplanation(false)}
                  className="p-2 rounded-xl hover:bg-[var(--color-bg-alt)] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8 max-h-[60vh] overflow-y-auto">
                <p 
                  className={`text-lg leading-relaxed text-[var(--color-text)] opacity-80 ${isArabic ? 'font-amiri text-right' : 'font-sans text-left'}`}
                  style={{ direction: isArabic ? 'rtl' : 'ltr' }}
                >
                  {explanation}
                </p>
              </div>

              <div className="p-6 bg-[var(--color-bg-alt)]/30 border-t border-[var(--color-card-border)]">
                <p className="text-[10px] opacity-40 text-center uppercase tracking-widest font-bold">
                  {displayScholarName} — {qawl.source}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDesigner && (
          <QuoteDesigner 
            text={displayText} 
            author={displayScholarName || 'Salaf Scholar'} 
            onClose={() => setShowDesigner(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
