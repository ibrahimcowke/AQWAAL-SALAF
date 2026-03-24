import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, BookOpen, MessageSquareQuote, Users, ChevronLeft } from 'lucide-react';
import { useContentStore } from '../stores/contentStore';
import { Link } from 'react-router-dom';
import QawlCard from '../components/ui/QawlCard';

type TabType = 'aqwaal' | 'qisas' | 'scholars';

export default function Search() {
  const { 
    searchQuery, 
    setSearchQuery, 
    getFilteredAqwaal, 
    getFilteredQisas,
    scholars 
  } = useContentStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('aqwaal');

  const filteredAqwaal = getFilteredAqwaal();
  const filteredQisas = getFilteredQisas();
  const filteredScholars = scholars.filter(s => 
    s.name_ar.includes(searchQuery) || 
    (s.name_en && s.name_en.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.bio_ar && s.bio_ar.includes(searchQuery))
  );

  const clearSearch = () => {
    setSearchQuery('');
  };

  const counts = {
    aqwaal: filteredAqwaal.length,
    qisas: filteredQisas.length,
    scholars: filteredScholars.length
  };

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="section-title text-2xl mb-1">المحرك البحثي</h1>
        <p className="arabic-text text-sm" style={{ color: 'var(--color-text-muted)' }}>
          ابحث في مكنونات علم السلف الصالح
        </p>
      </motion.div>

      {/* Search Input Area */}
      <div className="mb-8 sticky top-16 z-30 pt-2 pb-4 bg-[var(--color-bg)]/80 backdrop-blur-md">
        <div className="relative">
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[var(--color-gold)]">
             <SearchIcon size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="كلمة دلالية، اسم عالم، موضوع..."
            className="w-full h-14 pr-12 pl-12 rounded-2xl arabic-text outline-none shadow-neu focus:shadow-neu-inset transition-all"
            style={{ 
              background: 'var(--color-card)', 
              color: 'var(--color-text)', 
              border: '1px solid var(--color-card-border)',
              fontSize: '1rem'
            }}
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 left-0 pl-4 flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
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
            <span className="arabic-text text-xs font-bold">
              {tab === 'aqwaal' ? 'أقوال' : tab === 'qisas' ? 'قصص' : 'علماء'}
              <span className="mr-1.5 opacity-60 text-[10px]">{counts[tab]}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Results Display */}
      <div className="min-h-[40vh]">
        {!searchQuery ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
            <SearchIcon size={48} className="mb-4" />
            <p className="arabic-text">ابدأ بالكتابة للبحث في المكتبة</p>
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
                  {filteredAqwaal.length === 0 && <p className="text-center arabic-text py-10 opacity-50">لا يوجد أقوال مطابقة</p>}
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
                              <h3 className="arabic-text font-bold text-sm mb-1 group-hover:text-[var(--color-primary)]">{qissa.title_ar}</h3>
                              <p className="arabic-text text-[10px] opacity-60 line-clamp-1">{qissa.summary_ar}</p>
                           </div>
                        </div>
                        <ChevronLeft size={16} className="text-[var(--color-text-muted)] rotate-180" />
                      </div>
                    </Link>
                  ))}
                  {filteredQisas.length === 0 && <p className="text-center arabic-text py-10 opacity-50">لا يوجد قصص مطابقة</p>}
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
                              <h3 className="arabic-text font-bold text-sm mb-1 group-hover:text-[var(--color-gold)]">{scholar.name_ar}</h3>
                              <p className="arabic-text text-[10px] opacity-60">{scholar.era}</p>
                           </div>
                        </div>
                        <ChevronLeft size={16} className="text-[var(--color-text-muted)] rotate-180" />
                      </div>
                    </Link>
                  ))}
                  {filteredScholars.length === 0 && <p className="text-center arabic-text py-10 opacity-50">لا يوجد علماء مطابقين</p>}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Recommended Keywords */}
      {!searchQuery && (
        <div className="mt-4">
            <h3 className="arabic-text text-xs mb-3 font-bold opacity-50">مواضيع مقترحة:</h3>
            <div className="flex flex-wrap gap-2">
                {['صبر', 'تقوى', 'زهد', 'علم', 'إخلاص', 'توبة', 'عمل صالح'].map(key => (
                    <button 
                      key={key} 
                      onClick={() => setSearchQuery(key)}
                      className="px-3 py-1.5 rounded-xl text-xs arabic-text"
                      style={{ background: 'var(--color-bg-alt)', color: 'var(--color-text-muted)' }}
                    >
                      #{key}
                    </button>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
