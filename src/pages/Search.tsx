import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useContentStore } from '../stores/contentStore';
import { useProgressStore } from '../stores/progressStore';
import { Link } from 'react-router-dom';
import QawlCard from '../components/ui/QawlCard';
import { History as HistoryIcon, Search as SearchIcon, X, BookOpen, MessageSquareQuote, Users, ChevronLeft } from 'lucide-react';

type TabType = 'aqwaal' | 'qisas' | 'scholars';

export default function Search() {
  const { t, i18n } = useTranslation();
  const { 
    searchQuery, 
    setSearchQuery, 
    getFilteredAqwaal, 
    getFilteredQisas,
    scholars 
  } = useContentStore();
  
  const { searchHistory, addSearchQuery, clearSearchHistory } = useProgressStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('aqwaal');

  const filteredAqwaal = getFilteredAqwaal();
  const filteredQisas = getFilteredQisas();
  
  const query = searchQuery.toLowerCase();
  const filteredScholars = scholars.filter(s => 
    s.name_ar.includes(searchQuery) || 
    (s.name_so && s.name_so.toLowerCase().includes(query)) ||
    (s.name_en && s.name_en.toLowerCase().includes(query)) ||
    (s.bio_ar && s.bio_ar.includes(searchQuery)) ||
    (s.bio_so && s.bio_so.toLowerCase().includes(query))
  );

  const clearSearch = () => {
    setSearchQuery('');
  };

  const counts = {
    aqwaal: filteredAqwaal.length,
    qisas: filteredQisas.length,
    scholars: filteredScholars.length
  };

  const isArabic = i18n.language === 'ar';
  const isSomali = i18n.language === 'so';

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="section-title text-2xl mb-1">{t('search_title')}</h1>
        <p className={`text-sm ${isArabic ? 'arabic-text' : ''}`} style={{ color: 'var(--color-text-muted)' }}>
          {t('search_subtitle')}
        </p>
      </motion.div>

      {/* Search Input Area */}
      <div className="mb-8 sticky top-16 z-30 pt-2 pb-4 bg-[var(--color-bg)]/80 backdrop-blur-md">
        <div className="relative">
          <div className={`${isArabic ? 'right-0 pr-4' : 'left-0 pl-4'} absolute inset-y-0 flex items-center pointer-events-none text-[var(--color-gold)]`}>
             <SearchIcon size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search_placeholder')}
            className={`w-full h-14 rounded-2xl outline-none shadow-neu focus:shadow-neu-inset transition-all ${isArabic ? 'arabic-text pr-12 pl-12' : 'pl-12 pr-12'}`}
            style={{ 
              background: 'var(--color-card)', 
              color: 'var(--color-text)', 
              border: '1px solid var(--color-card-border)',
              fontSize: '1rem'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addSearchQuery(searchQuery);
            }}
            dir={isArabic ? 'rtl' : 'ltr'}
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className={`${isArabic ? 'left-0 pl-4' : 'right-0 pr-4'} absolute inset-y-0 flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)]`}
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-[var(--color-bg-alt)] p-1.5 rounded-2xl">
        {(['aqwaal', 'qisas', 'scholars'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
              activeTab === tab
                ? 'bg-[var(--color-primary)] text-white shadow-lg'
                : 'text-[var(--color-text-muted)] hover:bg-white/10'
            }`}
          >
            {tab === 'aqwaal' && <MessageSquareQuote size={16} />}
            {tab === 'qisas' && <BookOpen size={16} />}
            {tab === 'scholars' && <Users size={16} />}
            <span className={`text-xs font-bold ${isArabic ? 'arabic-text' : ''}`}>
              {t(tab)}
              <span className={`${isArabic ? 'mr-1.5' : 'ml-1.5'} opacity-60 text-[10px]`}>{counts[tab]}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Results Display */}
      <div className="min-h-[40vh]">
        {!searchQuery ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
            <SearchIcon size={48} className="mb-4" />
            <p className={isArabic ? 'arabic-text' : ''}>{t('start_searching')}</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'aqwaal' && (
                <div className="space-y-4">
                  {filteredAqwaal.map((qawl, i) => (
                    <QawlCard key={qawl.id} qawl={qawl} index={i} compact />
                  ))}
                  {filteredAqwaal.length === 0 && <p className="text-center py-10 opacity-50 arabic-text">{t('not_found_qawl')}</p>}
                </div>
              )}

              {activeTab === 'qisas' && (
                <div className="grid gap-4">
                  {filteredQisas.map((qissa) => (
                    <Link key={qissa.id} to={`/qisas/${qissa.id}`}>
                      <div className="neu-card p-4 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-alt)] flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                              <BookOpen size={18} />
                           </div>
                           <div>
                              <h3 className={`font-bold text-sm mb-1 group-hover:text-[var(--color-primary)] ${isSomali ? '' : 'arabic-text'}`}>
                                {isSomali && qissa.title_so ? qissa.title_so : qissa.title_ar}
                              </h3>
                              <p className={`text-[10px] opacity-60 line-clamp-1 ${isSomali ? '' : 'arabic-text'}`}>
                                {isSomali && qissa.summary_so ? qissa.summary_so : qissa.summary_ar}
                              </p>
                           </div>
                        </div>
                        <ChevronLeft size={16} className={`text-[var(--color-text-muted)] ${isSomali ? '' : 'rotate-180'}`} />
                      </div>
                    </Link>
                  ))}
                  {filteredQisas.length === 0 && <p className="text-center py-10 opacity-50 arabic-text">{t('not_found_qissa')}</p>}
                </div>
              )}

              {activeTab === 'scholars' && (
                <div className="grid gap-4">
                   {filteredScholars.map((scholar) => (
                    <Link key={scholar.id} to={`/scholars/${scholar.id}`}>
                      <div className="neu-card p-4 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-md">
                              <Users size={18} />
                           </div>
                           <div>
                              <h3 className={`font-bold text-sm mb-1 group-hover:text-[var(--color-gold)] ${isSomali ? '' : 'arabic-text'}`}>
                                {isSomali && scholar.name_so ? scholar.name_so : scholar.name_ar}
                              </h3>
                              <p className={`text-[10px] opacity-60 ${isSomali ? '' : 'arabic-text'}`}>{scholar.era}</p>
                           </div>
                        </div>
                        <ChevronLeft size={16} className={`text-[var(--color-text-muted)] ${isSomali ? '' : 'rotate-180'}`} />
                      </div>
                    </Link>
                  ))}
                  {filteredScholars.length === 0 && <p className="text-center py-10 opacity-50 arabic-text">{t('not_found')}</p>}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Recent & Recommended */}
      {!searchQuery && (
        <div className="space-y-6">
            {searchHistory.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-xs font-bold opacity-50 flex items-center gap-2 ${isArabic ? 'arabic-text' : ''}`}>
                    <HistoryIcon size={14} />
                    {t('recent_searches')}:
                  </h3>
                  <button onClick={clearSearchHistory} className={`text-[10px] text-red-500 opacity-50 hover:opacity-100 ${isArabic ? 'arabic-text' : ''}`}>{isArabic ? 'مسح الكل' : 'Masax dhamaantood'}</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map(q => (
                    <button 
                      key={q} 
                      onClick={() => setSearchQuery(q)}
                      className={`px-4 py-2 rounded-xl text-xs border border-[var(--color-card-border)] bg-[var(--color-bg-alt)]/30 hover:bg-[var(--color-bg-alt)] transition-colors ${isArabic ? 'arabic-text' : ''}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
                <h3 className={`text-xs mb-3 font-bold opacity-50 ${isArabic ? 'arabic-text' : ''}`}>{t('suggested_topics')}:</h3>
                <div className="flex flex-wrap gap-2">
                    {['صبر', 'تقوى', 'زهد', 'علم', 'إخلاص', 'توبة', 'عمل صالح'].map(key => (
                        <button 
                          key={key} 
                          onClick={() => { setSearchQuery(key); addSearchQuery(key); }}
                          className="px-3 py-1.5 rounded-xl text-xs arabic-text"
                          style={{ background: 'var(--color-bg-alt)', color: 'var(--color-text-muted)' }}
                        >
                          #{key}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
