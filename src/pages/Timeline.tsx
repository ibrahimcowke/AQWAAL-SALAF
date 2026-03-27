import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useContentStore } from '../stores/contentStore';
import { scholarEras } from '../constants/content';
import { Scroll, Users, ArrowLeft, History } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Timeline() {
  const { scholars } = useContentStore();
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === 'ar';
  const isSomali = i18n.language === 'so';

  // Group scholars by era
  const groupedScholars = scholarEras.reduce((acc, era) => {
    const eraScholars = scholars.filter(s => s.era === era);
    if (eraScholars.length > 0) {
      acc.push({ era, scholars: eraScholars });
    }
    return acc;
  }, [] as { era: string, scholars: any[] }[]);

  return (
    <div className="page-container max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <motion.div initial={{ opacity: 0, x: isArabic ? 20 : -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <History size={24} />
                </div>
                <h1 className={`section-title text-2xl m-0 ${isArabic ? 'arabic-text' : ''}`}>{t('timeline_title')}</h1>
            </div>
            <p className={`text-sm opacity-60 ${isArabic ? 'arabic-text' : ''}`}>{t('timeline_subtitle')}</p>
        </motion.div>
        <Link to="/scholars" className={`neu-btn px-4 py-2 flex items-center gap-2 text-xs font-bold ${isArabic ? 'arabic-text' : ''}`}>
            <ArrowLeft size={16} className={isArabic ? '' : 'rotate-180'} />
            {t('scholars')}
        </Link>
      </div>

      <div className="relative">
        {/* Central Line */}
        <div className={`absolute top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--color-gold)] via-[var(--color-primary)] to-transparent rounded-full opacity-20 hidden md:block ${isArabic ? 'right-8' : 'left-8'}`} />

        <div className="space-y-16">
          {groupedScholars.map((group) => (
            <div key={group.era} className="relative">
              {/* Era Marker */}
              <div className={`sticky top-20 z-10 mb-8 ${isArabic ? 'md:pr-12' : 'md:pl-12'}`}>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-[var(--color-primary)] text-white shadow-lg font-bold text-lg ${isArabic ? 'arabic-text' : ''}`}
                >
                    <Scroll size={20} className="text-[var(--color-gold)]" />
                    {isArabic ? 'عصر ' : ''}{t(group.era)}{isSomali ? ' - Casrigii' : ''}
                </motion.div>
              </div>

              {/* Scholar Nodes */}
              <div className={`space-y-6 ${isArabic ? 'md:pr-12' : 'md:pl-12'}`}>
                {group.scholars.map((scholar, sIdx) => (
                  <motion.div
                    key={scholar.id}
                    initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: sIdx * 0.1 }}
                  >
                    <Link to={`/scholars/${scholar.id}`} className="block group">
                        <div className={`neu-card p-6 relative flex flex-col md:flex-row md:items-center gap-6 group-hover:bg-[var(--color-bg-alt)] transition-all ${isArabic ? '' : 'flex-row-reverse md:flex-row'}`}>
                            {/* Connector Dot */}
                            <div className={`absolute top-1/2 w-6 h-6 rounded-full bg-white border-4 border-[var(--color-primary)] hidden md:block group-hover:scale-110 transition-transform -translate-y-1/2 ${isArabic ? '-right-3' : '-left-3'}`} />
                            
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-bg-alt)] to-[var(--color-card-border)] flex items-center justify-center text-[var(--color-primary)] group-hover:from-[var(--color-primary)] group-hover:text-white transition-all shadow-inner shrink-0">
                                <Users size={32} />
                            </div>

                            <div className={`flex-1 ${isArabic ? 'text-right' : 'text-left'}`}>
                                <span className={`text-[10px] font-bold text-[var(--color-gold)] opacity-80 mb-1 block ${isArabic ? 'arabic-text' : ''}`}>
                                    {t('died_year')}: {scholar.death_year || (isArabic ? 'غير معروف' : 'Unknown')}
                                </span>
                                <h3 className={`font-bold text-xl mb-2 group-hover:text-[var(--color-primary)] transition-colors ${isArabic ? 'arabic-text' : ''}`}>
                                    {isSomali && scholar.name_so ? scholar.name_so : scholar.name_ar}
                                </h3>
                                <p className={`text-sm opacity-60 line-clamp-2 leading-relaxed ${isArabic ? 'arabic-text' : ''}`}>
                                    {isSomali && scholar.bio_so ? scholar.bio_so : scholar.bio_ar}
                                </p>
                            </div>
                        </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completion Marker */}
      <div className="mt-20 py-20 text-center border-t border-dashed border-[var(--color-card-border)] opacity-20">
          <History size={48} className="mx-auto mb-4" />
          <p className={`font-bold ${isArabic ? 'arabic-text' : ''}`}>{t('timeline_ended')}</p>
      </div>
    </div>
  );
}
