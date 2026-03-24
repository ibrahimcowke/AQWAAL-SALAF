import { useEffect } from 'react';
import AppRouter from './router';
import { Toaster } from 'react-hot-toast';
import { useContentStore } from './stores/contentStore';
import { Loader2 } from 'lucide-react';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  const { fetchContent, isLoading, error } = useContentStore();

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  if (isLoading && !error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--color-bg)] z-50">
        <Loader2 className="w-10 h-10 text-[var(--color-primary)] animate-spin mb-4" />
        <p className="arabic-text text-sm opacity-60">جاري تحميل كنوز السلف...</p>
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
            fontFamily: 'Amiri, serif',
            direction: 'rtl',
          },
        }}
      />
    </HelmetProvider>
  );
}

export default App;
