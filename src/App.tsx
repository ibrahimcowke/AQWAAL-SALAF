import { useEffect } from 'react';
import AppRouter from './router';
import { Toaster } from 'react-hot-toast';
import { useContentStore } from './stores/contentStore';
import { useAuthStore } from './stores/authStore';
import { Loader2 } from 'lucide-react';
import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

function App() {
  const { fetchContent, isLoading, aqwaal } = useContentStore();
  const { initializeAuth } = useAuthStore();
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    initializeAuth();
    fetchContent();
  }, [fetchContent, initializeAuth]);

  if (isLoading && aqwaal.length === 0) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--color-bg)] z-50">
        <Loader2 className="w-10 h-10 text-[var(--color-primary)] animate-spin mb-4" />
        <p className={`text-sm opacity-60 ${isArabic ? 'arabic-text' : ''}`}>
            {t('loading_treasures')}
        </p>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <AppRouter />
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--color-card)',
            color: 'var(--color-text)',
            borderRadius: '1rem',
            border: '1px solid var(--color-card-border)',
            boxShadow: 'var(--neu-shadow-sm)',
            fontFamily: isArabic ? 'Amiri, serif' : 'Inter, sans-serif',
            direction: isArabic ? 'rtl' : 'ltr',
          },
        }}
      />
    </HelmetProvider>
  );
}

export default App;
