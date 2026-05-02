import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Share2, Heart, Volume2, Quote, Users, Sparkles, Info, X, Copy, Check, BookOpen, Layers } from 'lucide-react';
import { useContentStore } from '../stores/contentStore';
import { useAuthStore } from '../stores/authStore';
import { useAudioStore } from '../stores/audioStore';
import { GradeBadge } from '../components/ui/Badge';
import QuoteDesigner from '../components/features/QuoteDesigner';
import QawlCard from '../components/ui/QawlCard';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

export default function AqwalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { aqwaal, getScholarById } = useContentStore();
  const { isFavoriteQawl, addFavoriteQawl, removeFavoriteQawl, addRecentlyViewedQawl } = useAuthStore();
  const { speak } = useAudioStore();

  const [showDesigner, setShowDesigner] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [copied, setCopied] = useState(false);

  const { i18n, t } = useTranslation();
  const currentLang = i18n.language;
  const isArabic = currentLang === 'ar';
  const isSomali = currentLang === 'so';

  const qawl = aqwaal.find((a) => a.id === id);
  const scholar = qawl ? getScholarById(qawl.scholar_id) : null;

  useEffect(() => {
    if (qawl) {
      addRecentlyViewedQawl(qawl.id);
    }
  }, [qawl, addRecentlyViewedQawl]);

  // Navigation Logic
  const currentIndex = aqwaal.findIndex(a => a.id === id);
  const prevQawl = currentIndex > 0 ? aqwaal[currentIndex - 1] : null;
  const nextQawl = currentIndex < aqwaal.length - 1 ? aqwaal[currentIndex + 1] : null;

  const prevId = prevQawl?.id;
  const nextId = nextQawl?.id;

  // Related Quotes
  const relatedAqwaal = qawl 
    ? aqwaal
        .filter(a => a.id !== qawl.id && (a.scholar_id === qawl.scholar_id || a.tags.some(t => qawl.tags.includes(t))))
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
    : [];

  if (!qawl) {
    return (
      <div className="page-container text-center py-20">
        <p className={`text-lg mb-4 ${isArabic ? 'arabic-text' : ''}`}>{t('not_found')}</p>
        <button onClick={() => navigate(-1)} className={`neu-btn px-6 py-2 ${isArabic ? 'arabic-text' : ''}`}>
          {t('back')}
        </button>
      </div>
    );
  }

  const isFav = isFavoriteQawl(qawl.id);
  const displayText = isSomali && qawl.text_so ? qawl.text_so : qawl.text_ar;
  const displayScholarName = isSomali && qawl.scholar_name_so ? qawl.scholar_name_so : qawl.scholar_name_ar;
  const explanation = isSomali ? qawl.explanation_so : qawl.explanation_ar;

  const toggleFav = () => {
    if (isFav) {
      removeFavoriteQawl(qawl.id);
      toast.success(t('removed_from_favorites'), { icon: '💔' });
    } else {
      addFavoriteQawl(qawl.id);
      toast.success(t('added_to_favorites'), { icon: '❤️' });
    }
  };

  const handleShare = () => {
    const text = `"${displayText}"\n— ${displayScholarName}\n\n${t('app_name')}`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success(isSomali ? 'Waa la koobiyeyay' : 'تم النسخ بنجاح');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(qawl.text_ar);
    setCopied(true);
    toast.success(t('copied_success'));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyWithSource = () => {
    const textToCopy = `"${qawl.text_ar}"\n\n— ${qawl.scholar_name_ar || t('unknown_scholar')}\n📚 ${qawl.source}`;
    navigator.clipboard.writeText(textToCopy);
    toast.success(t('copy_with_source_success'));
  };

  const handleAudio = () => {
    speak(displayText, `${t('aqwaal')}: ${displayScholarName}`);
  };

  return (
    <div className="page-container">
      <Helmet>
        <title>{t('app_name')} | {displayScholarName}</title>
        <meta name="description" content={qawl.text_ar.substring(0, 160)} />
      </Helmet>

      <motion.button
        initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className={`flex items-center gap-1 text-sm mb-6 group ${isArabic ? 'arabic-text' : ''}`}
        style={{ color: 'var(--color-text-muted)' }}
      >
        {isArabic ? <ChevronRight size={18} /> : <ChevronRight size={18} className="rotate-180" />}
        {t('back_to_quotes')}
      </motion.button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="neu-card p-8 md:p-12 mb-8 relative overflow-hidden"
      >
        {/* Large decorative quotes */}
        <Quote
          size={80}
          className={`absolute top-4 opacity-5 ${isArabic ? 'right-4' : 'left-4'}`}
          style={{ color: 'var(--color-gold)', transform: 'rotate(180deg)' }}
        />

        <div className="text-center relative z-10">
          <div className="flex justify-center mb-6">
            <GradeBadge grade={qawl.grade} />
          </div>

          <h2 
            className="qawl-text text-2xl md:text-3xl leading-relaxed mb-4" 
            style={{ 
              color: 'var(--color-primary)',
              direction: 'rtl',
              textAlign: 'center'
            }}>
            {qawl.text_ar}
          </h2>

          {qawl.text_so && (
            <div className={`mt-6 mb-8 p-4 rounded-2xl bg-[var(--color-bg-alt)]/30 border-l-4 border-[var(--color-gold)] ${isArabic ? 'text-right' : 'text-left'}`}>
              <p className="text-sm font-bold uppercase tracking-widest opacity-40 mb-2">{t('somali_translation')}</p>
              <p className="text-lg md:text-xl leading-relaxed font-sans" style={{ color: 'var(--color-text)' }}>
                {qawl.text_so}
              </p>
            </div>
          )}

          <div className="gold-divider mb-8 opacity-50" />

          <div className="flex flex-col items-center gap-4">
            <Link to={`/scholars/${qawl.scholar_id}`} className="group">
              <span className={`badge-scholar text-base px-6 py-2 transition-transform group-hover:scale-105 ${isArabic ? 'arabic-text' : ''}`}>
                {displayScholarName}
              </span>
            </Link>
            {qawl.source && (
              <p className={`text-sm ${isArabic ? 'arabic-text' : ''}`} style={{ color: 'var(--color-text-muted)', direction: isArabic ? 'rtl' : 'ltr' }}>
                📚 {isSomali && qawl.source_so ? qawl.source_so : qawl.source}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Expanded Action Bar (Mirror of QawlCard) */}
      <div className={`flex items-center justify-between flex-wrap gap-4 mb-12 p-4 md:p-6 rounded-3xl bg-[var(--color-card)] border border-[var(--color-card-border)] shadow-lg ${isArabic ? '' : 'flex-row-reverse'}`} style={{ direction: isArabic ? 'rtl' : 'ltr' }}>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleAudio}
            className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all ${
              useAudioStore.getState().currentText === qawl.text_ar && useAudioStore.getState().isPlaying 
              ? 'animate-pulse scale-110 shadow-lg' : 'hover:scale-110'
            }`}
            style={{ 
              color: useAudioStore.getState().currentText === qawl.text_ar && useAudioStore.getState().isPlaying 
                ? 'var(--color-primary)' : 'var(--color-text)', 
              background: useAudioStore.getState().currentText === qawl.text_ar && useAudioStore.getState().isPlaying 
                ? 'var(--color-gold)' : 'var(--color-card-border)' 
            }}
            title={t('audio')}
          >
            <Volume2 size={20} className="md:w-6 md:h-6" />
          </button>
          <button
            onClick={handleShare}
            className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-110"
            style={{ color: 'var(--color-text)', background: 'var(--color-bg-alt)', border: '1px solid var(--color-card-border)' }}
            title={t('share')}
          >
            <Share2 size={20} className="md:w-6 md:h-6" />
          </button>
          <button
            onClick={handleCopyWithSource}
            className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-110"
            style={{ color: 'var(--color-primary)', background: 'var(--color-bg-alt)', border: '1px solid var(--color-primary-light)' }}
            title={t('copy_with_source')}
          >
            <BookOpen size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {prevId && (
            <button
              onClick={() => navigate(`/aqwaal/${prevId}`)}
              className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-110"
              style={{ color: 'var(--color-text-muted)', background: 'var(--color-bg-alt)', border: '1px solid var(--color-card-border)' }}
              title={t('previous_qawl')}
            >
              <ChevronRight size={20} className={`md:w-6 md:h-6 ${isArabic ? '' : 'rotate-180'}`} />
            </button>
          )}
          {nextId && (
            <button
              onClick={() => navigate(`/aqwaal/${nextId}`)}
              className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-110"
              style={{ color: 'var(--color-text-muted)', background: 'var(--color-bg-alt)', border: '1px solid var(--color-card-border)' }}
              title={t('next_qawl')}
            >
              <ChevronRight size={20} className={`md:w-6 md:h-6 ${isArabic ? 'rotate-180' : ''}`} />
            </button>
          )}

          <div className="w-px h-10 bg-[var(--color-card-border)] mx-1" />

          {explanation && (
            <button
              onClick={() => setShowExplanation(true)}
              className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-110"
              style={{ color: 'var(--color-gold)', background: 'var(--color-bg-alt)', border: '1px solid rgba(184, 134, 11, 0.2)' }}
              title={t('explanation')}
            >
              <Info size={20} className="md:w-6 md:h-6" />
            </button>
          )}
          <button
            onClick={() => setShowDesigner(true)}
            className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-110"
            style={{ color: 'var(--color-gold)', background: 'var(--color-bg-alt)', border: '1px solid rgba(184, 134, 11, 0.2)' }}
            title={t('design_card')}
          >
            <Sparkles size={20} className="md:w-6 md:h-6" />
          </button>

          <div className="w-px h-10 bg-[var(--color-card-border)] mx-1" />

          <button
            onClick={handleCopy}
            className="px-4 py-2.5 md:py-3 rounded-2xl bg-[var(--color-bg-alt)] border border-[var(--color-card-border)] flex items-center gap-2 text-xs md:text-sm font-bold transition-all hover:border-[var(--color-primary)]/30"
          >
            {copied ? <Check size={16} className="text-green-500 md:w-5 md:h-5" /> : <Copy size={16} className="md:w-5 md:h-5" />}
            <span className={`hidden sm:inline ${isArabic ? 'arabic-text' : ''}`}>{t('copy')}</span>
          </button>
          
          <button
            onClick={toggleFav}
            className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: isFav ? 'rgba(220, 38, 38, 0.1)' : 'var(--color-bg-alt)',
              border: isFav ? '1px solid rgba(220, 38, 38, 0.2)' : '1px solid var(--color-card-border)'
            }}
          >
            <Heart size={20} className="md:w-6 md:h-6" fill={isFav ? '#dc2626' : 'none'} stroke={isFav ? '#dc2626' : 'var(--color-text-muted)'} />
          </button>
        </div>
      </div>

      {/* Scholar Bio Snippet */}
      {scholar && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="neu-card p-6"
        >
          <div className={`flex items-center gap-3 mb-4 ${isArabic ? '' : 'flex-row-reverse'}`}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
              style={{ background: 'var(--color-primary)' }}
            >
              <Users size={20} />
            </div>
            <div className={isArabic ? 'text-right' : 'text-left'}>
              <h3 className={`font-bold ${isArabic ? 'arabic-text' : ''}`} style={{ color: 'var(--color-primary)' }}>
                {t('about_scholar', { name: displayScholarName })}
              </h3>
              <p className={`text-xs ${isArabic ? 'arabic-text' : ''}`} style={{ color: 'var(--color-text-muted)' }}>
                {t(scholar.era)} • {t('died_year')}: {scholar.death_year || (isArabic ? 'غير معروف' : 'Unknown')}
              </p>
            </div>
          </div>
          <p className={`text-sm leading-relaxed mb-4 line-clamp-3 ${isArabic ? 'arabic-text' : ''}`} style={{ color: 'var(--color-text)', direction: isArabic ? 'rtl' : 'ltr' }}>
            {isSomali && scholar.bio_so ? scholar.bio_so : scholar.bio_ar}
          </p>
          <Link
            to={`/scholars/${scholar.id}`}
            className={`text-xs font-bold flex items-center gap-1 ${isArabic ? 'arabic-text' : 'flex-row-reverse'}`}
            style={{ color: 'var(--color-gold)' }}
          >
            {t('view_full_bio')} <ChevronRight size={14} className={isArabic ? '' : 'rotate-180'} />
          </Link>
        </motion.div>
      )}

      {/* Tags */}
      <div className="mt-8 flex flex-wrap gap-2 justify-center mb-12">
        {qawl.tags.map((tag) => (
          <Link
            key={tag}
            to={`/aqwaal?tag=${tag}`}
            className="px-4 py-2 rounded-xl text-xs arabic-text transition-all hover:scale-105"
            style={{ background: 'var(--color-bg-alt)', color: 'var(--color-text-muted)' }}
          >
            #{tag}
          </Link>
        ))}
      </div>

      {/* Related Quotes */}
      {relatedAqwaal.length > 0 && (
        <div className="mb-12">
          <div className={`flex items-center gap-2 mb-6 ${isArabic ? 'flex-row-reverse' : ''}`}>
            <Layers size={20} style={{ color: 'var(--color-primary)' }} />
            <h3 className={`font-bold text-lg ${isArabic ? 'arabic-text' : ''}`}>
              {t('related_quotes', { defaultValue: isArabic ? 'أقوال مشابهة' : isSomali ? 'Odhaahyo La Xiriira' : 'Related Quotes' })}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            {relatedAqwaal.map((relatedQawl, index) => (
              <QawlCard key={relatedQawl.id} qawl={relatedQawl} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Explanation Modal */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowExplanation(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[var(--color-card)] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-card-border)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`p-6 border-b border-[var(--color-card-border)] flex items-center justify-between bg-[var(--color-bg-alt)]/50 ${isArabic ? '' : 'flex-row-reverse'}`}>
                <div className={`flex items-center gap-3 ${isArabic ? '' : 'flex-row-reverse'}`}>
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-gold)]/10 flex items-center justify-center text-[var(--color-gold)]">
                    <Info size={20} />
                  </div>
                  <h3 className={`font-bold text-lg ${isArabic ? 'arabic-text' : ''}`}>{t('explanation_title')}</h3>
                </div>
                <button 
                  onClick={() => setShowExplanation(false)}
                  className="p-2 rounded-xl hover:bg-[var(--color-bg-alt)] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8 max-h-[60vh] overflow-y-auto space-y-8">
                <div className={isArabic ? 'text-right' : 'text-left'}>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3" style={{ color: 'var(--color-primary)' }}>Arabic / العربية</p>
                  <p className="qawl-text text-xl leading-loose text-[var(--color-text)]" style={{ direction: 'rtl' }}>
                    {qawl.explanation_ar}
                  </p>
                </div>

                {qawl.explanation_so && (
                  <div className={`pt-6 border-t border-[var(--color-card-border)]/50 ${isArabic ? 'text-right' : 'text-left'}`}>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3" style={{ color: 'var(--color-gold)' }}>Somali / Soomaali</p>
                    <p className="text-lg leading-relaxed text-[var(--color-text)] font-sans">
                      {qawl.explanation_so}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 bg-[var(--color-bg-alt)]/30 border-t border-[var(--color-card-border)] text-center">
                <p className="text-[10px] opacity-40 uppercase tracking-widest font-bold">
                  {displayScholarName} — {qawl.source}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDesigner && (
          <QuoteDesigner 
            text={displayText} 
            author={displayScholarName || 'Salaf Scholar'} 
            onClose={() => setShowDesigner(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
