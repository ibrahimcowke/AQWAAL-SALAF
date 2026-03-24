import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, MessageSquareQuote, Users, Search, Quote, Sparkles, ChevronLeft } from 'lucide-react';
import { useContentStore } from '../stores/contentStore';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { dailyQawl } = useContentStore();
  
  const { t } = useTranslation();

  

  const categories = [
    { id: 'aqwaal', title: t('aqwaal'), sub: 'حكم واقتباسات موثقة', icon: MessageSquareQuote, color: 'var(--color-primary)', count: 22 },
    { id: 'qisas', title: t('qisas'), sub: 'روايات مؤصلة ومفيدة', icon: BookOpen, color: 'var(--color-gold)', count: 6 },
    { id: 'scholars', title: t('scholars'), sub: 'تراجم ومواقف', icon: Users, color: '#10b981', count: 10 },
    { id: 'search', title: t('search'), sub: 'ابحث بالكلمة أو العالم', icon: Search, color: '#6366f1', count: null },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="page-container pb-28">
      {/* Hero / Daily Wisdom */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-10 relative"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--color-gold)]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
        
        <div className="neu-card p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Quote size={80} style={{ color: 'var(--color-gold)' }} />
          </div>

          <div className="flex items-center gap-2 mb-6 text-[var(--color-gold)]">
            <Sparkles size={18} />
            <span className="arabic-text font-bold text-sm tracking-wide">{t('daily_qawl')}</span>
            <div className="h-px flex-1 bg-[var(--color-gold)]/20 mr-2" />
          </div>

          {dailyQawl ? (
            <div className="text-center">
              <h2 className="qawl-text text-xl md:text-2xl leading-relaxed mb-6" style={{ color: 'var(--color-text)' }}>
                {dailyQawl.text_ar}
              </h2>
              <Link to={`/scholars/${dailyQawl.scholar_id}`} className="inline-block">
                <span className="badge-scholar">{dailyQawl.scholar_name_ar}</span>
              </Link>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center animate-pulse">
              <div className="text-[var(--color-text-muted)] arabic-text">جاري استحضار الحكمة...</div>
            </div>
          )}
        </div>
      </motion.section>

      {/* Categories Grid */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title text-xl m-0">{t('categories')}</h2>
          <Link to="/aqwaal" className="text-xs arabic-text font-bold opacity-40 hover:opacity-100 flex items-center gap-1 transition-all">
            {t('all')} <ChevronLeft size={14} />
          </Link>
        </div>
        
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {categories.map((cat) => (
            <motion.div key={cat.id} variants={item}>
              <Link to={`/${cat.id === 'search' ? 'search' : cat.id}`}>
                <div className="neu-card p-5 flex items-center justify-between group h-full hover:shadow-card-hover transition-all">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110"
                      style={{ background: cat.color }}
                    >
                      <cat.icon size={24} />
                    </div>
                    <div>
                      <h3 className="arabic-text font-bold text-lg mb-0.5 group-hover:text-[var(--color-primary)] transition-colors">
                        {cat.title}
                      </h3>
                      <p className="arabic-text text-xs opacity-50">{cat.sub}</p>
                    </div>
                  </div>
                  {cat.count && (
                    <div className="bg-[var(--color-bg-alt)] px-3 py-1 rounded-full">
                      <span className="text-[10px] font-bold opacity-30">{cat.count}</span>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Quick Links / Tags */}
      <section>
        <h2 className="section-title text-xl mb-6">{t('quick_links')}</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {['زهد', 'صبر', 'تقوى', 'علم', 'محبة', 'توبة', 'آخرة', 'إخلاص'].map((tag) => (
            <Link
              key={tag}
              to={`/aqwaal?tag=${tag}`}
              className="neu-btn px-4 py-2 rounded-2xl arabic-text font-bold text-xs hover:scale-105 transition-transform"
              style={{ color: 'var(--color-text-muted)' }}
            >
              #{tag}
            </Link>
          ))}
        </div>
      </section>

      {/* Admin Link (Localhost only for now) */}
      <div className="mt-12 text-center">
            <Link 
                to="/admin" 
                className="text-[10px] arabic-text opacity-10 hover:opacity-100 transition-opacity"
            >
                لوحة الإدارة ←
            </Link>
      </div>
    </div>
  );
}
