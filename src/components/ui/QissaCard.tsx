import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, ChevronLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProgressStore } from '../../stores/progressStore';
import type { Qissa } from '../../types';

interface QissaCardProps {
  qissa: Qissa;
  index: number;
}

export default function QissaCard({ qissa, index }: QissaCardProps) {
  const { t, i18n } = useTranslation();
  const { isRead } = useProgressStore();
  const isSomali = i18n.language === 'so';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/qisas/${qissa.id}`} className="group">
        <div className="neu-card p-5 relative overflow-hidden transition-all group-hover:shadow-card-hover group-hover:-translate-y-1 h-full flex flex-col">
          {/* Visual Accent */}
          <div
            className="absolute top-0 right-0 w-1.5 h-full opacity-30"
            style={{ background: 'var(--color-gold)' }}
          />

          <div className="flex items-start justify-between mb-4">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'var(--color-bg-alt)', color: 'var(--color-primary)' }}
            >
              {qissa.scholar_id ? <BookOpen size={20} /> : <Sparkles size={20} />}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-[10px] arabic-text" style={{ color: 'var(--color-text-muted)' }}>
                <Clock size={12} />
                {t('minutes_read', { count: qissa.reading_time })}
              </div>
              {isRead(qissa.id) && (
                <div className="flex items-center gap-1 text-[10px] arabic-text text-emerald-600 font-bold">
                  <CheckCircle2 size={12} />
                  {t('read_status', { defaultValue: isSomali ? 'Waa la akhriyay' : 'مقروء' })}
                </div>
              )}
            </div>
          </div>

          <h2 className={`font-bold text-lg mb-2 transition-colors group-hover:text-[var(--color-primary)] ${isSomali ? '' : 'arabic-text'}`}>
            {isSomali && qissa.title_so ? qissa.title_so : qissa.title_ar}
          </h2>

          <p className={`text-sm leading-relaxed mb-4 line-clamp-3 ${isSomali ? '' : 'arabic-text'}`} style={{ color: 'var(--color-text-muted)' }}>
            {isSomali && qissa.summary_so ? qissa.summary_so : qissa.summary_ar}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex gap-1.5 flex-wrap">
              {qissa.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] arabic-text px-2 py-0.5 rounded-lg"
                  style={{ background: 'rgba(200, 169, 106, 0.1)', color: 'var(--color-gold)' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <span className="flex items-center gap-1 text-xs arabic-text font-bold" style={{ color: 'var(--color-primary)' }}>
              {t('read_more')} <ChevronLeft size={14} className={isSomali ? 'rotate-180' : ''} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
