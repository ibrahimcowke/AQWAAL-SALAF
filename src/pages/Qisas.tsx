import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, ChevronLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { useContentStore } from '../stores/contentStore';
import { useProgressStore } from '../stores/progressStore';
import { TagBadge } from '../components/ui/Badge';

export default function Qisas() {
  const { qisas, activeTag, setActiveTag } = useContentStore();
  const { isRead } = useProgressStore();

  const filtered = activeTag ? qisas.filter((q) => q.tags.includes(activeTag)) : qisas;

  const tags = Array.from(new Set(qisas.flatMap((q) => q.tags)));

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="section-title text-2xl mb-1">القصص والسير</h1>
        <p className="arabic-text text-sm" style={{ color: 'var(--color-text-muted)' }}>
          عِبَر ومواقف من حياة سلفنا الصالح
        </p>
      </motion.div>

      {/* Filter Tags */}
      <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          <TagBadge label="الكل" active={!activeTag} onClick={() => setActiveTag('')} />
          {tags.map((tag) => (
            <TagBadge key={tag} label={tag} active={activeTag === tag} onClick={() => setActiveTag(tag)} />
          ))}
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {filtered.map((qissa, i) => (
          <motion.div
            key={qissa.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={`/qisas/${qissa.id}`} className="group">
              <div className="neu-card p-5 relative overflow-hidden transition-all group-hover:shadow-card-hover group-hover:-translate-y-1">
                {/* Visual Accent */}
                <div
                  className="absolute top-0 right-0 w-1.5 h-full opacity-30"
                  style={{ background: 'var(--color-gold)' }}
                />

                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{ background: 'var(--color-bg-alt)', color: 'var(--color-primary)' }}
                  >
                    {qissa.scholar_id ? <BookOpen size={20} /> : <Sparkles size={20} />}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-[10px] arabic-text" style={{ color: 'var(--color-text-muted)' }}>
                      <Clock size={12} />
                      {qissa.reading_time} دقائق قراءة
                    </div>
                    {isRead(qissa.id) && (
                      <div className="flex items-center gap-1 text-[10px] arabic-text text-emerald-600 font-bold">
                        <CheckCircle2 size={12} />
                        تمت القراءة
                      </div>
                    )}
                  </div>
                </div>

                <h2 className="arabic-text font-bold text-lg mb-2 transition-colors group-hover:text-[var(--color-primary)]">
                  {qissa.title_ar}
                </h2>

                <p className="arabic-text text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: 'var(--color-text-muted)' }}>
                  {qissa.summary_ar}
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
                    اقرأ المزيد <ChevronLeft size={14} />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="arabic-text text-lg" style={{ color: 'var(--color-text-muted)' }}>
            لا توجد قصص بهذا التصنيف حالياً
          </p>
        </div>
      )}
    </div>
  );
}
