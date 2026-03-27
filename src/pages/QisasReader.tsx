import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ChevronRight, Share2, Heart, Volume2, BookOpen, Maximize2, Minimize2, CheckCircle2, Circle } from 'lucide-react';
import { useContentStore } from '../stores/contentStore';
import { useAuthStore } from '../stores/authStore';
import { useAudioStore } from '../stores/audioStore';
import { useThemeStore } from '../stores/themeStore';
import { useProgressStore } from '../stores/progressStore';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';


export default function QisasReader() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { qisas, getScholarById } = useContentStore();
  const { isFavoriteQissa, addFavoriteQissa, removeFavoriteQissa, saveReadingProgress } = useAuthStore();
  const { speak } = useAudioStore();
  const { fontSize, setFontSize, readingMode, toggleReadingMode } = useThemeStore();
  const { isRead, markAsRead, unmarkAsRead } = useProgressStore();
  
  const qissa = qisas.find((q) => q.id === id);
  const scholar = qissa?.scholar_id ? getScholarById(qissa.scholar_id) : null;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      if (qissa) {
        saveReadingProgress(qissa.id, scrollYProgress.get());
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [qissa]);

  if (!qissa) {
    return (
      <div className="page-container text-center py-20">
        <p className="arabic-text text-lg">{t('not_found_qissa')}</p>
        <button onClick={() => navigate(-1)} className="neu-btn px-6 py-2 mt-4 arabic-text">
          {t('back')}
        </button>
      </div>
    );
  }

  const isFav = isFavoriteQissa(qissa.id);
  const isSomali = i18n.language === 'so';

  const toggleFav = () => {
    if (isFav) {
      removeFavoriteQissa(qissa.id);
      toast.success(t('removed_from_favorites'), { icon: '💔', style: { fontFamily: 'Amiri, serif', direction: isSomali ? 'ltr' : 'rtl' } });
    } else {
      addFavoriteQissa(qissa.id);
      toast.success(t('added_to_favorites'), { icon: '❤️', style: { fontFamily: 'Amiri, serif', direction: isSomali ? 'ltr' : 'rtl' } });
    }
  };

  const handleShare = () => {
    const title = isSomali && qissa.title_so ? qissa.title_so : qissa.title_ar;
    const text = `${t('read_more')} "${title}"\n\n${t('app_name')}`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success(t('copied_success'), { style: { fontFamily: 'Amiri, serif', direction: isSomali ? 'ltr' : 'rtl' } });
    }
  };

  return (
    <div className={`page-container max-w-3xl ${readingMode ? 'pt-8' : 'pt-4'}`}>
      {/* Progress Bar */}
      <motion.div className="reading-progress" style={{ scaleX }} />

      {/* Top Controls */}
      {!readingMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm arabic-text group"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <ChevronRight size={20} className={`transition-transform ${isSomali ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
            {t('back')}
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFontSize(Math.max(1, fontSize - 0.1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs"
              style={{ background: 'var(--color-bg-alt)', color: 'var(--color-text)' }}
            >
              أ-
            </button>
            <button
              onClick={() => setFontSize(Math.min(2, fontSize + 0.1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ background: 'var(--color-bg-alt)', color: 'var(--color-text)' }}
            >
              أ+
            </button>
            <button
              onClick={toggleReadingMode}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--color-bg-alt)', color: 'var(--color-text)' }}
            >
              <Maximize2 size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {readingMode && (
        <button
          onClick={toggleReadingMode}
          className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full flex items-center justify-center glass-card"
          style={{ color: 'var(--color-primary)' }}
        >
          <Minimize2 size={20} />
        </button>
      )}

      <header className="mb-12 text-center">
        <h1 className={`font-bold text-3xl md:text-4xl leading-tight mb-4 ${isSomali ? '' : 'arabic-text'}`} style={{ color: 'var(--color-primary)' }}>
          {isSomali && qissa.title_so ? qissa.title_so : qissa.title_ar}
        </h1>
        {isSomali && qissa.title_ar && (
          <h2 className="text-xl md:text-2xl arabic-text mb-4 opacity-60">
            {qissa.title_ar}
          </h2>
        )}
        {!isSomali && qissa.title_so && (
          <h2 className="text-xl md:text-2xl font-sans mb-4 opacity-60">
            {qissa.title_so}
          </h2>
        )}
        <div className="flex items-center justify-center gap-3 text-xs arabic-text" style={{ color: 'var(--color-text-muted)' }}>
          {scholar && (
            <Link to={`/scholars/${scholar.id}`} className="flex items-center gap-1 hover:text-[var(--color-gold)]">
              <BookOpen size={14} />
              {i18n.language === 'so' && scholar.name_so ? scholar.name_so : scholar.name_ar}
            </Link>
          )}
          <span>•</span>
          <span>{t('minutes_read', { count: qissa.reading_time })}</span>
        </div>
        <div className="gold-divider mt-6 opacity-30" />
      </header>

      {/* Main Kitab Content */}
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mb-20 space-y-12"
      >
        <div className={`kitab-text whitespace-pre-wrap ${isSomali ? 'text-left font-sans' : 'text-right'}`} style={{ fontSize: `${fontSize}rem`, direction: isSomali ? 'ltr' : 'rtl' }}>
          {isSomali && qissa.content_so ? qissa.content_so : qissa.content_ar}
        </div>

        {isSomali && qissa.content_ar && (
          <div className="p-8 md:p-12 rounded-3xl bg-[var(--color-bg-alt)]/30 border-r-4 border-[var(--color-gold)] space-y-6">
            <p className="text-sm font-bold uppercase tracking-widest opacity-40 arabic-text text-right">النص الأصلي (باللغة العربية)</p>
            <div className="text-lg md:text-xl leading-relaxed arab-text text-right whitespace-pre-wrap" style={{ color: 'var(--color-text)', direction: 'rtl' }}>
              {qissa.content_ar}
            </div>
          </div>
        )}

        {!isSomali && qissa.content_so && (
          <div className="p-8 md:p-12 rounded-3xl bg-[var(--color-bg-alt)]/30 border-l-4 border-[var(--color-gold)] space-y-6">
            <p className="text-sm font-bold uppercase tracking-widest opacity-40">{t('somali_translation')}</p>
            <div className="text-lg md:text-xl leading-relaxed font-sans text-left whitespace-pre-wrap" style={{ color: 'var(--color-text)' }}>
              {qissa.content_so}
            </div>
          </div>
        )}
      </motion.article>

      {/* Source & Authenticity Info */}
      <section className="neu-card p-6 mb-12">
        <h3 className="arabic-text font-bold mb-4" style={{ color: 'var(--color-primary)' }}>{t('biography_stances')}</h3>
        <div className="space-y-3">
          <p className={`text-sm flex items-center gap-2 ${isSomali ? '' : 'arabic-text'}`}>
            <span className="font-bold opacity-60">📚 {t('source')}:</span>
            {isSomali && qissa.source_so ? qissa.source_so : qissa.source}
          </p>
          {qissa.authenticity_notes && (
            <p className={`text-sm border-r-2 pr-3 mt-2 ${isSomali ? '' : 'arabic-text'}`} style={{ borderColor: 'var(--color-gold)', color: 'var(--color-text-muted)' }}>
              <span className="font-bold mb-1 block">{t('authenticity')}:</span>
              {qissa.authenticity_notes}
            </p>
          )}
        </div>
      </section>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 flex gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => speak(qissa.content_ar, qissa.title_ar)}
          className="w-12 h-12 rounded-full glass-modal flex items-center justify-center"
          style={{ color: 'var(--color-primary)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
        >
          <Volume2 size={24} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleShare}
          className="w-12 h-12 rounded-full glass-modal flex items-center justify-center"
          style={{ color: 'var(--color-primary)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
        >
          <Share2 size={24} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => isRead(qissa.id) ? unmarkAsRead(qissa.id) : markAsRead(qissa.id)}
          className="w-12 h-12 rounded-full glass-modal flex items-center justify-center"
          style={{ 
            color: isRead(qissa.id) ? '#10b981' : 'var(--color-primary)', 
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            border: isRead(qissa.id) ? '2px solid #10b981' : 'none'
          }}
          title={isRead(qissa.id) ? 'إلغاء القراءة' : 'تمت القراءة'}
        >
          {isRead(qissa.id) ? <CheckCircle2 size={24} /> : <Circle size={24} />}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleFav}
          className="w-12 h-12 rounded-full glass-modal flex items-center justify-center"
          style={{ color: isFav ? '#dc2626' : 'var(--color-primary)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
        >
          <Heart size={24} fill={isFav ? '#dc2626' : 'none'} />
        </motion.button>
      </div>

      {/* Tags Footer */}
      <div className="mb-20 flex flex-wrap gap-2 justify-center">
        {qissa.tags.map(tag => (
          <span key={tag} className="text-xs arabic-text px-3 py-1 rounded-full" style={{ background: 'var(--color-bg-alt)', color: 'var(--color-text-muted)' }}>
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
