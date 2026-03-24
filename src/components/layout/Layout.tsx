import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import AudioBar from '../ui/AudioBar';
import { useThemeStore } from '../../stores/themeStore';
import { useEffect } from 'react';

export default function Layout() {
  const { mode } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'paper');
    if (mode === 'dark') root.classList.add('dark');
    if (mode === 'paper') root.classList.add('paper');
  }, [mode]);

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <Navbar />
      <main className="pt-16 pb-20">
        <Outlet />
      </main>
      <BottomNav />
      <AudioBar />
    </div>
  );
}
