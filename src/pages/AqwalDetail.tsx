import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Share2, Heart, Volume2, Quote, Users } from 'lucide-react';
import { useContentStore } from '../stores/contentStore';
import { useAuthStore } from '../stores/authStore';
import { useAudioStore } from '../stores/audioStore';
import { GradeBadge } from '../components/ui/Badge';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

export default function AqwalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { aqwaal, getScholarById } = useContentStore();
  const { isFavoriteQawl, addFavoriteQawl, removeFavoriteQawl } = useAuthStore();
  const { speak } = useAudioStore();

  const qawl = aqwaal.find((a) => a.id === id);
  const scholar = qawl ? getScholarById(qawl.scholar_id) : null;

  if (!qawl) {
    return (
      <div className="page-container text-center py-20">
        <p className="arabic-text text-lg mb-4">القول غير موجود</p>
        <button onClick={() => navigate(-1)} className="neu-btn px-6 py-2 arabic-text">
          رجوع
        </button>
      </div>
    );
  }

  const isFav = isFavoriteQawl(qawl.id);

  const toggleFav = () => {
    if (isFav) {
      removeFavoriteQawl(qawl.id);
      toast.success('تم الإزالة من المفضلة', { icon: '💔', style: { fontFamily: 'Amiri, serif', direction: 'rtl' } });
    } else {
      addFavoriteQawl(qawl.id);
      toast.success('تم الحفظ في المفضلة', { icon: '❤️', style: { fontFamily: 'Amiri, serif', direction: 'rtl' } });
    }
  };

  const handleShare = () => {
    const text = `"${qawl.text_ar}"\n— ${qawl.scholar_name_ar}\n\nنور السلف`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('تم نسخ القول', { style: { fontFamily: 'Amiri, serif', direction: 'rtl' } });
    }
  };

  return (
    <div className="page-container">
      <Helmet>
        <title>قول {qawl.scholar_name_ar} | نور السلف</title>
        <meta name="description" content={qawl.text_ar.substring(0, 160)} />
      </Helmet>
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm arabic-text mb-6 group"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
        العودة للأقوال
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
          className="absolute top-4 right-4 opacity-5"
          style={{ color: 'var(--color-gold)', transform: 'rotate(180deg)' }}
        />

        <div className="text-center relative z-10">
          <div className="flex justify-center mb-6">
            <GradeBadge grade={qawl.grade} />
          </div>

          <h2 className="qawl-text text-2xl md:text-3xl leading-relaxed mb-8" style={{ color: 'var(--color-text)' }}>
            {qawl.text_ar}
          </h2>

          <div className="gold-divider mb-8 opacity-50" />

          <div className="flex flex-col items-center gap-4">
            <Link to={`/scholars/${qawl.scholar_id}`} className="group">
              <span className="badge-scholar text-base px-6 py-2 transition-transform group-hover:scale-105">
                {qawl.scholar_name_ar}
              </span>
            </Link>
            {qawl.source && (
              <p className="arabic-text text-sm" style={{ color: 'var(--color-text-muted)' }}>
                📚 المصدر: {qawl.source}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Floating Action Bar (Mobile-style center actions) */}
      <div className="flex justify-center gap-4 mb-12">
        <button
          onClick={() => speak(qawl.text_ar, `قول: ${qawl.scholar_name_ar}`)}
          className="neu-btn w-14 h-14 flex items-center justify-center rounded-2xl"
          style={{ color: 'var(--color-primary)' }}
        >
          <Volume2 size={24} />
        </button>
        <button
          onClick={handleShare}
          className="neu-btn w-14 h-14 flex items-center justify-center rounded-2xl"
          style={{ color: 'var(--color-primary)' }}
        >
          <Share2 size={24} />
        </button>
        <button
          onClick={toggleFav}
          className="neu-btn w-14 h-14 flex items-center justify-center rounded-2xl"
          style={{ color: isFav ? '#dc2626' : 'var(--color-primary)' }}
        >
          <Heart size={24} fill={isFav ? '#dc2626' : 'none'} />
        </button>
      </div>

      {/* Scholar Bio Snippet */}
      {scholar && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="neu-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{ background: 'var(--color-primary)' }}
            >
              <Users size={20} />
            </div>
            <div>
              <h3 className="arabic-text font-bold" style={{ color: 'var(--color-primary)' }}>
                عن {scholar.name_ar}
              </h3>
              <p className="text-xs arabic-text" style={{ color: 'var(--color-text-muted)' }}>
                {scholar.era} • توفي {scholar.death_year}
              </p>
            </div>
          </div>
          <p className="arabic-text text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: 'var(--color-text)' }}>
            {scholar.bio_ar}
          </p>
          <Link
            to={`/scholars/${scholar.id}`}
            className="text-xs arabic-text font-bold flex items-center gap-1"
            style={{ color: 'var(--color-gold)' }}
          >
            عرض السيرة كاملة <ChevronRight size={14} />
          </Link>
        </motion.div>
      )}

      {/* Tags */}
      <div className="mt-8 flex flex-wrap gap-2 justify-center">
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
    </div>
  );
}
