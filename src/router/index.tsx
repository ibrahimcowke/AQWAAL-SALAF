import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Loader from '../components/ui/Loader';

const Home = lazy(() => import('../pages/Home'));
const Aqwaal = lazy(() => import('../pages/Aqwaal'));
const AqwalDetail = lazy(() => import('../pages/AqwalDetail'));
const Qisas = lazy(() => import('../pages/Qisas'));
const QisasReader = lazy(() => import('../pages/QisasReader'));
const Scholars = lazy(() => import('../pages/Scholars'));
const ScholarProfile = lazy(() => import('../pages/ScholarProfile'));
const Search = lazy(() => import('../pages/Search'));
const Favorites = lazy(() => import('../pages/Favorites'));
const AudioLibrary = lazy(() => import('../pages/AudioLibrary'));
const Settings = lazy(() => import('../pages/Settings'));
const Timeline = lazy(() => import('../pages/Timeline'));

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
