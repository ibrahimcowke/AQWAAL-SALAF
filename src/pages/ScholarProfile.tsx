import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Users, BookOpen, MessageSquareQuote, Calendar, Info, Scroll } from 'lucide-react';
import { useContentStore } from '../stores/contentStore';
import QawlCard from '../components/ui/QawlCard';
import { Helmet } from 'react-helmet-async';

import { useTranslation } from 'react-i18next';

export default function ScholarProfile() {
  const { i18n, t } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const { id } = useParams();
  const navigate = useNavigate();
  const { getScholarById, getAqwaalByScholar, getQisasByScholar } = useContentStore();

  const scholar = getScholarById(id || '');
  const aqwaal = getAqwaalByScholar(id || '');
  const qisas = getQisasByScholar(id || '');

  if (!scholar) {
    return (
      <div className="page-container text-center py-20">
        <p className="arabic-text text-lg">{t('not_found')}</p>
        <button onClick={() => navigate(-1)} className="neu-btn px-6 py-2 mt-4 arabic-text">
          {t('back')}
        </button>
      </div>
    );
  }

  const isSomali = i18n.language === 'so';

  return (
    <div className="page-container">
      <Helmet>
        <title>{isSomali && scholar.name_so ? scholar.name_so : scholar.name_ar} | {t('app_name')}</title>
        <meta name="description" content={scholar.bio_ar.substring(0, 160)} />
      </Helmet>
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm arabic-text mb-6 group"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {isArabic ? <ChevronRight size={18} /> : <ChevronRight size={18} className="rotate-180" />}
        {t('back_to_scholars')}
      </motion.button>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="neu-card p-6 md:p-10 mb-8 relative overflow-hidden"
      >
        {/* Background Islamic Pattern */}
        <div className="absolute inset-0 opacity-5 islamic-pattern" />

        <div className="relative z-10 flex flex-col items-center text-center">
            <div
                className="w-24 h-24 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))' }}
            >
                <Users size={48} />
            </div>
            
            <h1 className={`font-bold text-3xl mb-2 ${isSomali ? '' : 'arabic-text'}`} style={{ color: 'var(--color-primary)' }}>
                {isSomali && scholar.name_so ? scholar.name_so : scholar.name_ar}
            </h1>
            <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: 'var(--color-text-muted)', fontFamily: 'Inter, sans-serif' }}>
                {scholar.name_en}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-6">
                <div className={`flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-full bg-[var(--color-bg-alt)] ${isSomali ? '' : 'arabic-text'}`}>
                    <Calendar size={14} className="text-[var(--color-gold)]" />
                    {t('death_label')} {scholar.death_year || t('unknown')}
                </div>
                <div className={`flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-full bg-[var(--color-bg-alt)] ${isSomali ? '' : 'arabic-text'}`}>
                    <Scroll size={14} className="text-[var(--color-gold)]" />
                    {t('era_label')} {scholar.era}
                </div>
            </div>

            <div className="gold-divider w-full max-w-md opacity-30 mb-6" />

            <div className={`flex items-start gap-2 mb-6 ${isSomali ? 'text-left' : 'text-right'}`} style={{ direction: isSomali ? 'ltr' : 'rtl' }}>
                <Info size={18} className={`mt-1 flex-shrink-0 text-[var(--color-gold)] ${isSomali ? 'mr-1' : ''}`} />
                <p className={`text-xl leading-loose max-w-2xl ${isSomali ? 'font-sans' : 'arabic-text'}`} style={{ color: 'var(--color-text)' }}>
                    {isSomali && scholar.bio_so ? scholar.bio_so : scholar.bio_ar}
                </p>
            </div>

            {isSomali && scholar.bio_ar && (
                <div className="flex flex-col items-center w-full max-w-2xl text-right bg-[var(--color-bg-alt)]/30 p-6 rounded-2xl border-r-4 border-[var(--color-gold)]">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3 arabic-text">السيرة بالأصل (العربية)</p>
                    <p className="text-lg leading-relaxed arabic-text" style={{ color: 'var(--color-text)', direction: 'rtl' }}>
                        {scholar.bio_ar}
                    </p>
                </div>
            )}

            {!isSomali && scholar.bio_so && (
                <div className="flex flex-col items-center w-full max-w-2xl text-left bg-[var(--color-bg-alt)]/30 p-6 rounded-2xl border-l-4 border-[var(--color-gold)]">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">{t('somali_translation')}</p>
                    <p className="text-lg leading-relaxed font-sans" style={{ color: 'var(--color-text)' }}>
                        {scholar.bio_so}
                    </p>
                </div>
            )}
        </div>
      </motion.div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="neu-card p-4 flex flex-col items-center text-center">
              <MessageSquareQuote size={20} className="mb-1 text-[var(--color-primary)] opacity-60" />
              <span className="text-xl font-bold">{aqwaal.length}</span>
              <span className="text-[10px] arabic-text font-bold" style={{ color: 'var(--color-text-muted)' }}>{t('stats_aqwaal')}</span>
          </div>
          <div className="neu-card p-4 flex flex-col items-center text-center">
              <BookOpen size={20} className="mb-1 text-[var(--color-primary)] opacity-60" />
              <span className="text-xl font-bold">{qisas.length}</span>
              <span className="text-[10px] arabic-text font-bold" style={{ color: 'var(--color-text-muted)' }}>{t('stats_qisas')}</span>
          </div>
      </div>

      {/* Scholar's Aqwaal */}
      <div className="mb-10">
          <h2 className="section-title mb-6 flex items-center gap-2">
            <MessageSquareQuote size={20} />
            {t('aqwaal_by', { name: isSomali && scholar.name_so ? scholar.name_so : scholar.name_ar })}
          </h2>
          {aqwaal.length > 0 ? (
            <div className="space-y-4">
               {aqwaal.map((qawl, i) => (
                 <QawlCard key={qawl.id} qawl={qawl} index={i} />
               ))}
            </div>
          ) : (
            <p className="text-sm py-4 text-center opacity-50 arabic-text">{t('no_aqwaal')}</p>
          )}
      </div>

      {/* Scholar's Qisas */}
      <div className="mb-12">
          <h2 className="section-title mb-6 flex items-center gap-2">
            <BookOpen size={20} />
            {t('biography_stances')}
          </h2>
          {qisas.length > 0 ? (
            <div className="grid gap-4">
               {qisas.map((qissa, i) => (
                 <Link key={qissa.id} to={`/qisas/${qissa.id}`}>
                    <motion.div
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: i * 0.1 }}
                       className="neu-card p-4 flex items-center justify-between"
                    >
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-alt)] flex items-center justify-center text-[var(--color-primary)]">
                             <BookOpen size={16} />
                          </div>
                          <h3 className={`font-bold text-sm ${isSomali ? '' : 'arabic-text'}`}>
                            {isSomali && qissa.title_so ? qissa.title_so : qissa.title_ar}
                          </h3>
                       </div>
                       <ChevronRight size={16} className={`text-[var(--color-text-muted)] ${isSomali ? '' : 'rotate-180'}`} />
                    </motion.div>
                 </Link>
               ))}
            </div>
          ) : (
            <p className="text-sm py-4 text-center opacity-50 arabic-text">{t('no_qisas')}</p>
          )}
      </div>
    </div>
  );
}
