import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Users, BookOpen, MessageSquareQuote, Calendar, Info, Scroll } from 'lucide-react';
import { useContentStore } from '../stores/contentStore';
import QawlCard from '../components/ui/QawlCard';
import { Helmet } from 'react-helmet-async';

export default function ScholarProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getScholarById, getAqwaalByScholar, getQisasByScholar } = useContentStore();

  const scholar = getScholarById(id || '');
  const aqwaal = getAqwaalByScholar(id || '');
  const qisas = getQisasByScholar(id || '');

  if (!scholar) {
    return (
      <div className="page-container text-center py-20">
        <p className="arabic-text text-lg">العالم غير موجود</p>
        <button onClick={() => navigate(-1)} className="neu-btn px-6 py-2 mt-4 arabic-text">
          رجوع
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Helmet>
        <title>{scholar.name_ar} | سير أعلام السلف</title>
        <meta name="description" content={scholar.bio_ar.substring(0, 160)} />
      </Helmet>
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm arabic-text mb-6 group"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
        العودة للعلماء
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
            
            <h1 className="arabic-text font-bold text-3xl mb-2" style={{ color: 'var(--color-primary)' }}>
                {scholar.name_ar}
            </h1>
            <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: 'var(--color-text-muted)', fontFamily: 'Inter, sans-serif' }}>
                {scholar.name_en}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-6">
                <div className="flex items-center gap-1.5 text-xs arabic-text px-4 py-1.5 rounded-full bg-[var(--color-bg-alt)]">
                    <Calendar size={14} className="text-[var(--color-gold)]" />
                    توفي {scholar.death_year || 'غير معروف'}
                </div>
                <div className="flex items-center gap-1.5 text-xs arabic-text px-4 py-1.5 rounded-full bg-[var(--color-bg-alt)]">
                    <Scroll size={14} className="text-[var(--color-gold)]" />
                    {scholar.era}
                </div>
            </div>

            <div className="gold-divider w-full max-w-md opacity-30 mb-6" />

            <div className="flex items-start gap-2 text-right">
                <Info size={18} className="mt-1 flex-shrink-0 text-[var(--color-gold)]" />
                <p className="arabic-text text-sm leading-loose max-w-2xl" style={{ color: 'var(--color-text)' }}>
                    {scholar.bio_ar}
                </p>
            </div>
        </div>
      </motion.div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="neu-card p-4 flex flex-col items-center text-center">
              <MessageSquareQuote size={20} className="mb-1 text-[var(--color-primary)] opacity-60" />
              <span className="text-xl font-bold">{aqwaal.length}</span>
              <span className="text-[10px] arabic-text font-bold" style={{ color: 'var(--color-text-muted)' }}>مقولة موثقة</span>
          </div>
          <div className="neu-card p-4 flex flex-col items-center text-center">
              <BookOpen size={20} className="mb-1 text-[var(--color-primary)] opacity-60" />
              <span className="text-xl font-bold">{qisas.length}</span>
              <span className="text-[10px] arabic-text font-bold" style={{ color: 'var(--color-text-muted)' }}>قصة سيرة</span>
          </div>
      </div>

      {/* Scholar's Aqwaal */}
      <div className="mb-10">
          <h2 className="section-title mb-6 flex items-center gap-2">
            <MessageSquareQuote size={20} />
            أقوال {scholar.name_ar}
          </h2>
          {aqwaal.length > 0 ? (
            <div className="space-y-4">
               {aqwaal.map((qawl, i) => (
                 <QawlCard key={qawl.id} qawl={qawl} index={i} />
               ))}
            </div>
          ) : (
            <p className="arabic-text text-sm py-4 text-center opacity-50">لا توجد أقوال مسجلة حالياً</p>
          )}
      </div>

      {/* Scholar's Qisas */}
      <div className="mb-12">
          <h2 className="section-title mb-6 flex items-center gap-2">
            <BookOpen size={20} />
            سير ومواقف
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
                          <h3 className="arabic-text font-bold text-sm">{qissa.title_ar}</h3>
                       </div>
                       <ChevronRight size={16} className="text-[var(--color-text-muted)] rotate-180" />
                    </motion.div>
                 </Link>
               ))}
            </div>
          ) : (
            <p className="arabic-text text-sm py-4 text-center opacity-50">لا توجد قصص مسجلة حالياً</p>
          )}
      </div>
    </div>
  );
}
