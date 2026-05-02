import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useContentStore } from '../stores/contentStore';
import { TagBadge } from '../components/ui/Badge';
import QissaCard from '../components/ui/QissaCard';

export default function Qisas() {
  const { t } = useTranslation();
  const { qisas, activeTag, setActiveTag } = useContentStore();

  const filtered = activeTag ? qisas.filter((q) => q.tags.includes(activeTag)) : qisas;

  const tags = Array.from(new Set(qisas.flatMap((q) => q.tags)));

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="section-title text-2xl mb-1">{t('qisas')}</h1>
        <p className="arabic-text text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {t('qisas_subtitle')}
        </p>
      </motion.div>

      {/* Filter Tags */}
      <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          <TagBadge label={t('all')} active={!activeTag} onClick={() => setActiveTag('')} />
          {tags.map((tag) => (
            <TagBadge key={tag} label={tag} active={activeTag === tag} onClick={() => setActiveTag(tag)} />
          ))}
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {filtered.map((qissa, i) => (
          <QissaCard key={qissa.id} qissa={qissa} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="arabic-text text-lg" style={{ color: 'var(--color-text-muted)' }}>
            {t('not_found_qissa')}
          </p>
        </div>
      )}
    </div>
  );
}
