import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { useContentStore } from '../stores/contentStore';
import QawlCard from '../components/ui/QawlCard';
import { TagBadge } from '../components/ui/Badge';
import { availableTags } from '../constants/content';

export default function Aqwaal() {
  const { getFilteredAqwaal, searchQuery, setSearchQuery, activeTag, setActiveTag } = useContentStore();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const tagParam = searchParams.get('tag');
    if (tagParam) setActiveTag(tagParam);
  }, []);

  const filtered = getFilteredAqwaal();

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="section-title text-2xl mb-1">أقوال السلف الصالح</h1>
        <p className="arabic-text text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {filtered.length} قول موثق من كبار العلماء
        </p>
      </motion.div>

      {/* Search + Filter */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث في الأقوال..."
          className="flex-1 px-4 py-2.5 rounded-2xl text-sm arabic-text outline-none transition-all"
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-card-border)',
            color: 'var(--color-text)',
            boxShadow: 'var(--neu-shadow-sm)',
          }}
          dir="rtl"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="neu-btn px-3 rounded-2xl flex items-center gap-1.5 text-xs arabic-text"
          style={{ color: showFilters ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
        >
          <Filter size={14} />
          <span className="hidden sm:inline">تصفية</span>
        </button>
      </div>

      {/* Tag filters */}
      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4">
          <div className="flex flex-wrap gap-2">
            <TagBadge label="الكل" active={!activeTag} onClick={() => setActiveTag('')} />
            {availableTags.map((tag) => (
              <TagBadge key={tag} label={tag} active={activeTag === tag} onClick={() => setActiveTag(activeTag === tag ? '' : tag)} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 arabic-text" style={{ color: 'var(--color-text-muted)' }}>
            لم يُعثر على نتائج
          </div>
        ) : (
          filtered.map((qawl, i) => <QawlCard key={qawl.id} qawl={qawl} index={i} />)
        )}
      </div>
    </div>
  );
}
