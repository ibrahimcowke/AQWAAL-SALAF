import { motion } from 'framer-motion';
import { Volume2, Play, Pause, Square, Music, Headphones, BookOpen, Quote } from 'lucide-react';
import { useAudioStore } from '../stores/audioStore';
import { useContentStore } from '../stores/contentStore';
import { Link } from 'react-router-dom';

export default function AudioLibrary() {
  const { aqwaal, qisas } = useContentStore();
  const { isPlaying, isPaused, currentText, speak, stop, togglePause } = useAudioStore();

  const allItems = [
    ...aqwaal.map(a => ({ id: a.id, title: `قول: ${a.scholar_name_ar}`, text: a.text_ar, type: 'qawl' as const })),
    ...qisas.map(q => ({ id: q.id, title: q.title_ar, text: q.content_ar, type: 'qissa' as const }))
  ];

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="section-title text-2xl mb-1">المكتبة الصوتية</h1>
        <p className="arabic-text text-sm" style={{ color: 'var(--color-text-muted)' }}>
          استمع إلى درر السلف الصالح بصوت آلي واضح
        </p>
      </motion.div>

      {/* Currently Playing Card */}
      {isPlaying && (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="neu-card p-6 mb-8 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))' }}
        >
            <div className="absolute inset-0 opacity-10 islamic-pattern" />
            <div className="relative z-10 flex flex-col items-center text-center text-white">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center bg-white/10 mb-4 shadow-inner">
                    <Headphones size={32} />
                </div>
                <h2 className="arabic-text font-bold mb-1">جارٍ الاستماع الآن</h2>
                <div className="gold-divider w-full max-w-[100px] mb-4 opacity-50" />
                
                <div className="flex items-center gap-6 mb-4">
                    <button onClick={stop} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                        <Square size={20} />
                    </button>
                    <button 
                        onClick={togglePause} 
                        className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[var(--color-primary)] shadow-lg hover:scale-105 transition-transform"
                    >
                        {isPaused ? <Play size={32} fill="currentColor" stroke="none" className="mr-1" /> : <Pause size={32} fill="currentColor" stroke="none" />}
                    </button>
                    <div className="w-10 h-10" /> {/* Spacer */}
                </div>
            </div>
        </motion.div>
      )}

      {/* List items */}
      <h2 className="section-title mb-4 flex items-center gap-2">
          <Music size={20} />
          العناصر المتاحة
      </h2>

      <div className="grid gap-3">
          {allItems.map((item, i) => {
              const active = isPlaying && currentText === item.text;
              return (
                <motion.div
                    key={`${item.type}-${item.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`neu-card p-4 flex items-center justify-between group transition-all ${active ? 'border-[var(--color-gold)] scale-[1.02]' : ''}`}
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div 
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-[var(--color-gold)] text-[var(--color-primary)]' : 'bg-[var(--color-bg-alt)] text-[var(--color-text-muted)]'}`}
                        >
                            {item.type === 'qawl' ? <Quote size={18} /> : <BookOpen size={18} />}
                        </div>
                        <div className="overflow-hidden">
                            <h3 className={`arabic-text font-bold text-sm truncate ${active ? 'text-[var(--color-primary)]' : ''}`}>{item.title}</h3>
                            <p className="arabic-text text-[10px] opacity-40 truncate">{item.text.substring(0, 50)}...</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => speak(item.text, item.title)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${active ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-bg-alt)] opacity-0 group-hover:opacity-100'}`}
                    >
                        {active && !isPaused ? <Pause size={18} fill="currentColor" stroke="none" /> : <Play size={18} fill="currentColor" stroke="none" className="mr-0.5" />}
                    </button>
                </motion.div>
              );
          })}
      </div>
    </div>
  );
}
