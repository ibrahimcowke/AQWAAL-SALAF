import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, MessageSquareQuote, Users, Search, Quote, Sparkles, ChevronLeft, Share2, HelpCircle } from 'lucide-react';
import { useContentStore } from '../stores/contentStore';
import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
  const { dailyQawl, refreshDailyQawl, aqwaal } = useContentStore();
  
  const { t, i18n } = useTranslation();

  const [randomQawl, setRandomQawl] = useState<any>(null);

  useEffect(() => {
    if (aqwaal.length > 0) {
      // Pick a random qawl that is not the daily one if possible
      const available = aqwaal.filter(a => a.id !== dailyQawl?.id);
      const pool = available.length > 0 ? available : aqwaal;
      const random = pool[Math.floor(Math.random() * pool.length)];
      setRandomQawl(random);
    }
  }, [aqwaal, dailyQawl]);

  

  const categories = [
    { 
      id: 'aqwaal', 
      title: t('aqwaal'), 
      sub: t('aqwaal_sub'), 
      icon: MessageSquareQuote, 
      color: 'var(--color-primary)', 
      count: 80 
    },
    { 
      id: 'qisas', 
      title: t('qisas'), 
      sub: t('qisas_sub'), 
      icon: BookOpen, 
      color: 'var(--color-gold)', 
      count: 12 
    },
    { 
      id: 'scholars', 
      title: t('scholars'), 
      sub: t('scholars_sub'), 
      icon: Users, 
      color: '#10b981', 
      count: 19 
    },
    { 
      id: 'quiz', 
      title: i18n.language === 'so' ? 'Kediska' : i18n.language === 'ar' ? 'الاختبارات' : 'Quiz', 
      sub: i18n.language === 'so' ? 'Tijaabi aqoontaada' : i18n.language === 'ar' ? 'اختبر معرفتك' : 'Test your knowledge', 
      icon: HelpCircle, 
      color: '#ec4899', 
      count: 5 
    },
    { 
      id: 'search', 
      title: t('search'), 
      sub: t('search_sub'), 
      icon: Search, 
      color: '#6366f1', 
      count: null 
    },
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

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-[var(--color-gold)]">
              <Sparkles size={18} />
              <span className={`font-bold text-sm tracking-wide ${i18n.language === 'ar' ? 'arabic-text' : ''}`}>{t('daily_qawl')}</span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => {
                  const shareData = {
                    title: t('app_name'),
                    text: t('slogan'),
                    url: window.location.origin,
                  };
                  if (navigator.share) navigator.share(shareData);
                  else {
                    navigator.clipboard.writeText(`${shareData.title} - ${shareData.text}\n${shareData.url}`);
                    toast.success(t('copied_success'));
                  }
                }}
                className="p-2 rounded-full hover:bg-[var(--color-primary)]/10 transition-colors text-[var(--color-primary)]/60 hover:text-[var(--color-primary)]"
                title={t('share')}
              >
                <Share2 size={16} />
              </button>
              <button 
                onClick={() => refreshDailyQawl()}
                className="p-2 rounded-full hover:bg-[var(--color-gold)]/10 transition-colors text-[var(--color-gold)]/60 hover:text-[var(--color-gold)]"
                title={t('refresh')}
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          {dailyQawl ? (
            <div className="text-center">
              <h2 
                className={`qawl-text text-xl md:text-2xl leading-relaxed mb-6 ${i18n.language === 'ar' ? 'text-right' : 'text-center'}`} 
                style={{ color: 'var(--color-text)', direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}
              >
                {i18n.language === 'so' && dailyQawl.text_so ? dailyQawl.text_so : dailyQawl.text_ar}
              </h2>
              <Link to={`/scholars/${dailyQawl.scholar_id}`} className="inline-block">
                <span className={`badge-scholar ${i18n.language === 'ar' ? 'arabic-text' : ''}`}>
                  {i18n.language === 'so' && dailyQawl.scholar_name_so ? dailyQawl.scholar_name_so : dailyQawl.scholar_name_ar}
                </span>
              </Link>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center animate-pulse">
              <div className={`text-[var(--color-text-muted)] ${i18n.language === 'ar' ? 'arabic-text' : ''}`}>
                {t('daily_fetching')}
              </div>
            </div>
          )}
        </div>
      </motion.section>

      {/* Categories Grid */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`section-title text-xl m-0 ${i18n.language === 'ar' ? 'arabic-text' : ''}`}>{t('categories')}</h2>
          <Link to="/aqwaal" className={`text-xs font-bold opacity-40 hover:opacity-100 flex items-center gap-1 transition-all ${i18n.language === 'ar' ? 'arabic-text' : ''}`}>
            {t('all')} <ChevronLeft size={14} className={i18n.language === 'ar' ? '' : 'rotate-180'} />
          </Link>
        </div>
        
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
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
                      <h3 className={`font-bold text-lg mb-0.5 group-hover:text-[var(--color-primary)] transition-colors ${i18n.language === 'ar' ? 'arabic-text' : ''}`}>
                        {cat.title}
                      </h3>
                      <p className={`text-xs opacity-50 ${i18n.language === 'ar' ? 'arabic-text' : ''}`}>{cat.sub}</p>
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

      {/* Random Quote Widget */}
      <section className="mb-12">
        <div className="neu-card p-6 bg-gradient-to-br from-[var(--color-gold)]/5 to-transparent border-none">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[var(--color-primary)]">
              <Quote size={20} />
              <h2 className={`font-bold text-lg m-0 ${i18n.language === 'ar' ? 'arabic-text' : ''}`}>{t('random_quote')}</h2>
            </div>
            <button 
              onClick={() => {
                const available = aqwaal.filter(a => a.id !== randomQawl?.id);
                const pool = available.length > 0 ? available : aqwaal;
                setRandomQawl(pool[Math.floor(Math.random() * pool.length)]);
              }}
              className="p-2 rounded-full hover:bg-[var(--color-primary)]/10 transition-colors text-[var(--color-primary)]/60 hover:text-[var(--color-primary)] flex items-center gap-2"
              title={t('refresh')}
            >
              <span className={`text-[10px] font-bold uppercase tracking-widest hidden sm:inline ${i18n.language === 'ar' ? 'arabic-text' : ''}`}>{t('refresh')}</span>
              <RefreshCw size={14} />
            </button>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
                {randomQawl ? (
                  <>
                    <p className={`qawl-text text-lg italic opacity-80 mb-2 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`} style={{ direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}>
                        “{i18n.language === 'so' && randomQawl.text_so ? randomQawl.text_so : randomQawl.text_ar}”
                    </p>
                    <span className={`text-xs opacity-50 ${i18n.language === 'ar' ? 'arabic-text' : ''}`}>— {i18n.language === 'so' && randomQawl.scholar_name_so ? randomQawl.scholar_name_so : randomQawl.scholar_name_ar}</span>
                  </>
                ) : (
                  <div className="h-12 animate-pulse bg-[var(--color-bg-alt)] rounded-lg w-full" />
                )}
            </div>
            <Link 
                to={randomQawl ? `/aqwaal/${randomQawl.id}` : "/aqwaal"} 
                className={`neu-btn px-6 py-2 rounded-xl text-sm whitespace-nowrap ${i18n.language === 'ar' ? 'arabic-text' : ''}`}
                style={{ color: 'var(--color-primary)' }}
            >
                {t('read_more')}
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links / Tags */}
      <section>
        <h2 className={`section-title text-xl mb-6 ${i18n.language === 'ar' ? 'arabic-text' : ''}`}>{t('quick_links')}</h2>
        <div className="flex flex-wrap gap-2 md:gap-4 justify-center max-w-4xl mx-auto">
          {[
            { key: 'tag_zuhd', search: 'زهد' },
            { key: 'tag_sabr', search: 'صبر' },
            { key: 'tag_taqwa', search: 'تقوى' },
            { key: 'tag_ilm', search: 'علم' },
            { key: 'tag_mahabbah', search: 'محبة' },
            { key: 'tag_tawbah', search: 'توبة' },
            { key: 'tag_akhirah', search: 'آخرة' },
            { key: 'tag_ikhlas', search: 'إخلاص' }
          ].map((tag, i) => (
            <motion.div
              key={tag.key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
            >
              <Link
                to={`/aqwaal?tag=${tag.search}`}
                className={`neu-btn px-6 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2 ${i18n.language === 'ar' ? 'arabic-text' : 'flex-row-reverse'}`}
                style={{ color: 'var(--color-text-muted)' }}
              >
                <Sparkles size={12} className="opacity-40" />
                #{t(tag.key)}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Admin Link (Localhost only for now) */}
      <div className="mt-12 text-center">
            <Link 
                to="/admin" 
                className="text-[10px] arabic-text opacity-10 hover:opacity-100 transition-opacity"
            >
                {t('admin_panel')} ←
            </Link>
      </div>
    </div>
  );
}
