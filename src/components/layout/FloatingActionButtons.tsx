import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronUp, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContentStore } from '../../stores/contentStore';
import { useTranslation } from 'react-i18next';

export default function FloatingActionButtons() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { aqwaal } = useContentStore();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRandom = () => {
    if (aqwaal.length > 0) {
      const random = aqwaal[Math.floor(Math.random() * aqwaal.length)];
      navigate(`/aqwaal/${random.id}`);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isArabic = i18n.language === 'ar';

  return (
    <div className={`fixed bottom-24 z-40 flex flex-col gap-3 ${isArabic ? 'left-6' : 'right-6'}`}>
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
            className="w-12 h-12 rounded-2xl bg-[var(--color-card)] border border-[var(--color-card-border)] text-[var(--color-primary)] flex items-center justify-center shadow-lg hover:bg-[var(--color-primary)] hover:text-white transition-all"
            title={t('scroll_to_top')}
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleRandom}
        className="w-14 h-14 rounded-3xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-xl hover:shadow-[var(--color-primary)]/20 transition-all group overflow-hidden relative"
        title={t('random_quote')}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        <Quote size={24} className="group-hover:rotate-12 transition-transform" />
        <Sparkles size={12} className="absolute top-3 right-3 text-[var(--color-gold)] animate-pulse" />
      </motion.button>
    </div>
  );
}
