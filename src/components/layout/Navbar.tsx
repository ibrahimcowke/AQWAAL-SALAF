import { useThemeStore } from '../../stores/themeStore';
import { Sun, Moon, BookOpen, Search, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { mode, setMode, readingMode } = useThemeStore();
  const location = useLocation();
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  if (readingMode) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass-card flex items-center justify-between px-4 md:px-8 border-b border-white/20">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white font-bold shadow-lg">
            ن
          </div>
          <span className="arabic-text font-bold text-lg hidden md:block" style={{ color: 'var(--color-primary)' }}>
            {t('app_name')}
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleLanguage}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-white/20 active:scale-90 relative"
          style={{ background: 'var(--color-card-border)' }}
          title="Change Language"
        >
          <Globe size={20} style={{ color: 'var(--color-text)' }} />
          <span className="text-[8px] absolute -bottom-1 font-bold uppercase" style={{ color: 'var(--color-text)' }}>{i18n.language === 'ar' ? 'عربي' : 'EN'}</span>
        </button>

        <button
          onClick={() => setMode(mode === 'light' ? 'dark' : mode === 'dark' ? 'paper' : 'light')}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-white/20 active:scale-90"
          style={{ background: 'var(--color-card-border)' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {mode === 'light' && <Sun size={20} className="text-orange-500" />}
              {mode === 'dark' && <Moon size={20} className="text-blue-400" />}
              {mode === 'paper' && <BookOpen size={20} className="text-amber-700" />}
            </motion.div>
          </AnimatePresence>
        </button>

        <Link
          to="/search"
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-white/40 active:scale-90"
          style={{ color: location.pathname === '/search' ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
        >
          <Search size={20} />
        </Link>
      </div>
    </nav>
  );
}
