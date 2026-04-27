import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Loader from '../components/ui/Loader';

// Helper to handle dynamic import failures (common after new deployments)
const lazyRetry = (componentImport: () => Promise<any>) => {
  return lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      // Check if the error is a "Failed to fetch" or similar network error for modules
      console.error('Lazy loading error, reloading page:', error);
      window.location.reload();
      return { default: () => null };
    }
  });
};

const Home = lazyRetry(() => import('../pages/Home'));
const Aqwaal = lazyRetry(() => import('../pages/Aqwaal'));
const AqwalDetail = lazyRetry(() => import('../pages/AqwalDetail'));
const Qisas = lazyRetry(() => import('../pages/Qisas'));
const QisasReader = lazyRetry(() => import('../pages/QisasReader'));
const Scholars = lazyRetry(() => import('../pages/Scholars'));
const ScholarProfile = lazyRetry(() => import('../pages/ScholarProfile'));
const Search = lazyRetry(() => import('../pages/Search'));
const Favorites = lazyRetry(() => import('../pages/Favorites'));
const AudioLibrary = lazyRetry(() => import('../pages/AudioLibrary'));
const Settings = lazyRetry(() => import('../pages/Settings'));
const Timeline = lazyRetry(() => import('../pages/Timeline'));

import ScrollToTop from '../components/ui/ScrollToTop';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<Loader fullPage />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="aqwaal" element={<Aqwaal />} />
            <Route path="aqwaal/:id" element={<AqwalDetail />} />
            <Route path="qisas" element={<Qisas />} />
            <Route path="qisas/:id" element={<QisasReader />} />
            <Route path="scholars" element={<Scholars />} />
            <Route path="scholars/:id" element={<ScholarProfile />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="search" element={<Search />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="audio" element={<AudioLibrary />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
