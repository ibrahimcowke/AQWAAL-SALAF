import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, BookOpen, MessageSquareQuote, Plus, Trash2, ChevronLeft, FolderHeart } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useContentStore } from '../stores/contentStore';
import { Link } from 'react-router-dom';
import QawlCard from '../components/ui/QawlCard';
import toast from 'react-hot-toast';

export default function Favorites() {
  const { user, removeFavoriteQawl, removeFavoriteQissa, addCollection, removeCollection } = useAuthStore();
  const { aqwaal, qisas } = useContentStore();
  const [activeTab, setActiveTab] = useState<'aqwaal' | 'qisas' | 'collections'>('aqwaal');
  const [newCollName, setNewCollName] = useState('');
  const [showAddColl, setShowAddColl] = useState(false);

  const favAqwaal = aqwaal.filter((a) => user?.favorites_aqwaal.includes(a.id));
  const favQisas = qisas.filter((q) => user?.favorites_qisas.includes(q.id));

  const handleAddColl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollName.trim()) return;
    addCollection(newCollName.trim());
    setNewCollName('');
    setShowAddColl(false);
    toast.success('تم إنشاء المجموعة بنجاح', { style: { fontFamily: 'Amiri, serif', direction: 'rtl' } });
  };

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="section-title text-2xl mb-1">المفضلة والمجموعات</h1>
        <p className="arabic-text text-sm" style={{ color: 'var(--color-text-muted)' }}>
          كنوزك العلمية المختارة بعناية
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-[var(--color-bg-alt)] p-1 rounded-2xl">
        {[
          { id: 'aqwaal', label: 'أقوال', icon: MessageSquareQuote, count: favAqwaal.length },
          { id: 'qisas', label: 'قصص', icon: BookOpen, count: favQisas.length },
          { id: 'collections', label: 'مجموعاتي', icon: FolderHeart, count: user?.collections.length || 0 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-white text-[var(--color-primary)] shadow-sm'
                : 'text-[var(--color-text-muted)] hover:bg-white/50'
            }`}
          >
            <tab.icon size={18} />
            <span className="arabic-text text-[10px] font-bold">
              {tab.label} ({tab.count})
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'aqwaal' && (
            <div className="space-y-4">
              {favAqwaal.length > 0 ? (
                favAqwaal.map((qawl, i) => <QawlCard key={qawl.id} qawl={qawl} index={i} compact />)
              ) : (
                <EmptyState icon={<MessageSquareQuote size={48} />} title="لا توجد أقوال مفضلة بعد" sub="اضغط على القلب لحفظ الأقوال التي تعجبك" />
              )}
            </div>
          )}

          {activeTab === 'qisas' && (
            <div className="grid gap-4">
              {favQisas.length > 0 ? (
                favQisas.map((qissa) => (
                  <Link key={qissa.id} to={`/qisas/${qissa.id}`}>
                    <div className="neu-card p-4 flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                          <Heart size={18} fill="currentColor" />
                        </div>
                        <div>
                          <h3 className="arabic-text font-bold text-sm mb-1">{qissa.title_ar}</h3>
                          <p className="arabic-text text-[10px] opacity-60 line-clamp-1">{qissa.summary_ar}</p>
                        </div>
                      </div>
                      <ChevronLeft size={16} className="text-[var(--color-text-muted)] rotate-180" />
                    </div>
                  </Link>
                ))
              ) : (
                <EmptyState icon={<BookOpen size={48} />} title="لا توجد قصص مفضلة بعد" sub="احفظ القصص والسير لتتمكن من قراءتها لاحقاً" />
              )}
            </div>
          )}

          {activeTab === 'collections' && (
            <div className="space-y-4">
              <button
                onClick={() => setShowAddColl(!showAddColl)}
                className="w-full h-14 border-2 border-dashed border-[var(--color-card-border)] rounded-2xl flex items-center justify-center gap-2 text-[var(--color-primary)] hover:border-[var(--color-gold)] transition-colors"
              >
                <Plus size={20} />
                <span className="arabic-text font-bold">إنشاء مجموعة جديدة</span>
              </button>

              <AnimatePresence>
                {showAddColl && (
                  <motion.form
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={handleAddColl}
                    className="neu-card p-4 overflow-hidden"
                  >
                    <input
                      type="text"
                      value={newCollName}
                      onChange={(e) => setNewCollName(e.target.value)}
                      placeholder="اسم المجموعة (مثلاً: الصبر، التزكية...)"
                      className="w-full px-4 py-2.5 rounded-xl arabic-text outline-none bg-[var(--color-bg-alt)] mb-3"
                      autoFocus
                    />
                    <div className="flex gap-2">
                        <button type="submit" className="neu-btn-primary flex-1 py-2 arabic-text text-sm">حفظ</button>
                        <button type="button" onClick={() => setShowAddColl(false)} className="neu-btn flex-1 py-2 arabic-text text-sm">إلغاء</button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="grid gap-4">
                {user?.collections.map((coll) => (
                  <div key={coll.id} className="neu-card p-4 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-gold)]/10 flex items-center justify-center text-[var(--color-gold)]">
                        <FolderHeart size={18} />
                      </div>
                      <div>
                        <h3 className="arabic-text font-bold text-sm">{coll.name_ar}</h3>
                        <p className="arabic-text text-[10px] opacity-60">
                          {coll.aqwaal_ids.length + coll.qisas_ids.length} عناصـر
                        </p>
                      </div>
                    </div>
                    <button
                        onClick={() => removeCollection(coll.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {(!user?.collections || user.collections.length === 0) && !showAddColl && (
                   <p className="arabic-text text-xs text-center py-4 opacity-40 italic">ليست لديك مجموعات مخصصة بعد</p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
      <div className="mb-4">{icon}</div>
      <h3 className="arabic-text font-bold mb-1">{title}</h3>
      <p className="arabic-text text-xs">{sub}</p>
    </div>
  );
}
