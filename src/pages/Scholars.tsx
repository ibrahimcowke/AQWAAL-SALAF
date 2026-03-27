import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, ChevronLeft, Calendar, Scroll, History } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useContentStore } from '../stores/contentStore';
import { useState } from 'react';
import type { ScholarEra } from '../types';
import { scholarEras } from '../constants/content';

export default function Scholars() {
  const { t, i18n } = useTranslation();
  const { scholars } = useContentStore();
  const [activeEra, setActiveEra] = useState<ScholarEra | 'all'>('all');

  const filtered = activeEra === 'all' ? scholars : scholars.filter((s) => s.era === activeEra);
  const isSomali = i18n.language === 'so';

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="section-title text-2xl mb-1">{t('scholars')}</h1>
          <p className="arabic-text text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {t('scholars_subtitle')}
          </p>
        </div>
        <Link to="/timeline" className="neu-btn px-6 py-2.5 flex items-center gap-2 text-xs arabic-text font-bold bg-amber-50 text-amber-700 hover:scale-105 transition-all">
            <History size={16} />
            {t('timeline_view')}
        </Link>
      </motion.div>

      {/* Era Tabs */}
      <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setActiveEra('all')}
            className={`px-5 py-2.5 rounded-2xl text-xs arabic-text font-bold transition-all ${
              activeEra === 'all'
                ? 'bg-[var(--color-primary)] text-white shadow-md'
                : 'bg-[var(--color-bg-alt)] text-[var(--color-text-muted)]'
            }`}
          >
            {t('all_eras')}
          </button>
          {scholarEras.map((era) => (
            <button
              key={era}
              onClick={() => setActiveEra(era as ScholarEra)}
              className={`px-5 py-2.5 rounded-2xl text-xs arabic-text font-bold transition-all ${
                activeEra === era
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'bg-[var(--color-bg-alt)] text-[var(--color-text-muted)]'
              }`}
            >
              {era}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((scholar, i) => (
          <motion.div
            key={scholar.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={`/scholars/${scholar.id}`} className="group block h-full">
              <div className="neu-card p-5 h-full relative overflow-hidden flex flex-col group-hover:-translate-y-1 transition-transform">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-2 h-2 rounded-full m-3 opacity-30" style={{ background: 'var(--color-gold)' }} />
                
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))' }}
                  >
                    <Users size={28} />
                  </div>
                  <div>
                    <h2 className={`font-bold text-lg leading-tight group-hover:text-[var(--color-primary)] transition-colors ${isSomali ? '' : 'arabic-text'}`}>
                      {isSomali && scholar.name_so ? scholar.name_so : scholar.name_ar}
                    </h2>
                    <p className="text-[10px] uppercase font-medium tracking-wider" style={{ color: 'var(--color-text-muted)', fontFamily: 'Inter, sans-serif' }}>
                      {scholar.name_en}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className={`flex items-center gap-2 text-[11px] ${isSomali ? '' : 'arabic-text'}`} style={{ color: 'var(--color-text-muted)' }}>
                    <Scroll size={12} className="opacity-50" />
                    <span className="font-bold opacity-80">{t('era_label')}:</span> {scholar.era}
                  </div>
                  <div className={`flex items-center gap-2 text-[11px] ${isSomali ? '' : 'arabic-text'}`} style={{ color: 'var(--color-text-muted)' }}>
                    <Calendar size={12} className="opacity-50" />
                    <span className="font-bold opacity-80">{t('death_label')}:</span> {scholar.death_year || t('unknown')}
                  </div>
                </div>

                <p className={`text-xs leading-relaxed line-clamp-2 mb-4 mt-auto ${isSomali ? '' : 'arabic-text'}`} style={{ color: 'var(--color-text-muted)' }}>
                  {isSomali && scholar.bio_so ? scholar.bio_so : scholar.bio_ar}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-card-border)] border-dashed">
                   <div className="flex gap-1">
                      {scholar.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[9px] arabic-text px-2 py-0.5 rounded-md" style={{ background: 'rgba(30, 58, 52, 0.05)', color: 'var(--color-primary)' }}>
                          {tag}
                        </span>
                      ))}
                   </div>
                   <span className={`flex items-center gap-1 text-[10px] font-bold ${isSomali ? '' : 'arabic-text'}`} style={{ color: 'var(--color-gold)' }}>
                      {t('view_bio')} <ChevronLeft size={12} className={isSomali ? 'rotate-180' : ''} />
                   </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
