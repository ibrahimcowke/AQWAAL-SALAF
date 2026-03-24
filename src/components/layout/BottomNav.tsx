import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, MessageSquareQuote, Users, Heart, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: '/', icon: Home, label: t('home') },
    { path: '/aqwaal', icon: MessageSquareQuote, label: t('aqwaal') },
    { path: '/qisas', icon: BookOpen, label: t('qisas') },
    { path: '/scholars', icon: Users, label: t('scholars') },
    { path: '/favorites', icon: Heart, label: t('favorites') },
    { path: '/settings', icon: Settings, label: t('settings') },
  ];

  return (
    <motion.div 
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-[var(--color-bg)]/80 backdrop-blur-lg border-t border-[var(--color-card-border)] flex items-center justify-around px-2 pb-2"
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center gap-1 transition-all ${
              isActive ? 'text-[var(--color-primary)] scale-110' : 'text-[var(--color-text-muted)] opacity-90'
            }`}
          >
            <div
              className={`p-2 rounded-xl transition-all ${
                isActive ? 'bg-[var(--color-primary)]/10 shadow-sm' : ''
              }`}
            >
              <item.icon size={isActive ? 20 : 18} />
            </div>
            <span className={`arabic-text text-[9px] font-bold ${isActive ? 'opacity-100' : 'opacity-90'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </motion.div>
  );
}
