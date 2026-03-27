import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useContentStore } from '../stores/contentStore';
import QawlCard from '../components/ui/QawlCard';
import { TagBadge } from '../components/ui/Badge';
import { availableTags } from '../constants/content';

export default function Aqwaal() {
  const { t, i18n } = useTranslation();
  const { getFilteredAqwaal, searchQuery, setSearchQuery, activeTag, setActiveTag } = useContentStore();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const tagParam = searchParams.get('tag');
    if (tagParam) setActiveTag(tagParam);
  }, []);

  const filtered = getFilteredAqwaal();
  const isArabic = i18n.language === 'ar';

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="section-title text-2xl mb-1">{t('aqwaal')}</h1>
        <p className="arabic-text text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {filtered.length} {t('stats_aqwaal')}
        </p>
      </motion.div>

      {/* Search + Filter */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('search_placeholder')}
          className={`flex-1 px-4 py-2.5 rounded-2xl text-sm outline-none transition-all ${isArabic ? 'arabic-text' : ''}`}
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-card-border)',
            color: 'var(--color-text)',
            boxShadow: 'var(--neu-shadow-sm)',
          }}
          dir={isArabic ? 'rtl' : 'ltr'}
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`neu-btn px-3 rounded-2xl flex items-center gap-1.5 text-xs ${isArabic ? 'arabic-text' : ''}`}
          style={{ color: showFilters ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
        >
          <Filter size={14} />
          <span className="hidden sm:inline">{t('filter')}</span>
        </button>
      </div>

      {/* Tag filters */}
      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4">
          <div className="flex flex-wrap gap-2">
            <TagBadge label={t('all')} active={!activeTag} onClick={() => setActiveTag('')} />
            {availableTags.map((tag) => (
              <TagBadge key={tag} label={tag} active={activeTag === tag} onClick={() => setActiveTag(activeTag === tag ? '' : tag)} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-16 arabic-text" style={{ color: 'var(--color-text-muted)' }}>
            {t('not_found_qawl')}
          </div>
        ) : (
          filtered.map((qawl, i) => <QawlCard key={qawl.id} qawl={qawl} index={i} />)
        )}
      </div>
    </div>
  );
}
