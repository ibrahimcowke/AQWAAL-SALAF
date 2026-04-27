import { motion } from 'framer-motion';
import { Sun, Moon, BookOpen, Scaling, Globe, Shield, Github, Mail, Bell, ChevronLeft, Scroll, Cloud, Leaf, Sunrise, Crown, Volume2, Waves, Heart } from 'lucide-react';
import { useAudioStore } from '../stores/audioStore';
import { useThemeStore } from '../stores/themeStore';
import { useProgressStore } from '../stores/progressStore';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { migrateDataToFirestore } from '../firebase/migrate';

export default function Settings() {
  const { mode, setMode, fontFamily, setFontFamily, fontSize, setFontSize, readingMode, toggleReadingMode } = useThemeStore();
  const { clearSearchHistory } = useProgressStore();
  const { t, i18n } = useTranslation();

  const handleClearCache = () => {
    localStorage.clear();
    toast.success(t('cache_cleared') || 'تم مسح البيانات المحلية بنجاح', { style: { fontFamily: 'Amiri, serif', direction: 'rtl' } });
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="page-container max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="section-title text-2xl mb-1">{t('settings')}</h1>
        <p className="arabic-text text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {t('settings_subtitle')}
        </p>
      </motion.div>

      {/* Language Settings */}
      <section className="mb-8">
        <h2 className="arabic-text font-bold text-sm mb-4 opacity-40">{t('language')}</h2>
        <div className="neu-card p-5">
            <div className="flex items-center gap-3 mb-6">
                <Globe size={20} className="text-[var(--color-gold)]" />
                <div>
                    <h3 className="arabic-text font-bold text-sm">{t('select_language')}</h3>
                </div>
            </div>
            
            <div className="flex gap-3">
                {[
                  { id: 'ar', label: t('ar') },
                  { id: 'en', label: t('en') },
                  { id: 'so', label: t('so') },
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                        i18n.changeLanguage(lang.id);
                        toast.success(lang.id === 'ar' ? 'تم تغيير اللغة' : lang.id === 'so' ? 'Luuqadda waa la beddelay' : 'Language changed');
                    }}
                    className={`flex-1 py-3 rounded-2xl border-2 transition-all font-bold text-xs ${
                      i18n.language === lang.id
                        ? 'border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-primary)]'
                        : 'border-transparent bg-[var(--color-bg-alt)] opacity-70 hover:opacity-100'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
            </div>
        </div>
      </section>

      {/* Visual Settings */}
      <section className="mb-8">
        <h2 className="arabic-text font-bold text-sm mb-4 opacity-40">{t('appearance')}</h2>
        
        <div className="space-y-4">
          <div className="neu-card p-5">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Sun size={20} className="text-[var(--color-gold)]" />
                    <span className="arabic-text font-bold">{t('display_mode')}</span>
                </div>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
                {[
                  { id: 'light', label: t('theme_light'), color: '#F5F3EF', icon: Sun },
                  { id: 'dark', label: t('theme_dark'), color: '#0E1F1B', icon: Moon },
                  { id: 'paper', label: t('theme_paper'), color: '#F2ECD8', icon: Scroll },
                  { id: 'midnight', label: t('theme_midnight'), color: '#030712', icon: Cloud },
                  { id: 'emerald', label: t('theme_emerald'), color: '#064E3B', icon: Leaf },
                  { id: 'sand', label: t('theme_sand'), color: '#FEF3C7', icon: Sunrise },
                  { id: 'royal', label: t('theme_royal'), color: '#2E1065', icon: Crown },
                  { id: 'sepia', label: t('theme_sepia'), color: '#E3D5B8', icon: BookOpen },
                  { id: 'ocean', label: t('theme_ocean'), color: '#0C4A6E', icon: Waves },
                  { id: 'rose', label: t('theme_rose'), color: '#FFF1F2', icon: Heart },
                  { id: 'mint', label: t('theme_mint'), color: '#ECFDF5', icon: Leaf },
                ].map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => setMode(item.id as any)}
                    className={`flex flex-col items-center gap-2 p-2 rounded-2xl transition-all border-2 ${
                      mode === item.id
                        ? 'border-[var(--color-gold)] shadow-md translate-y-[-2px]'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div 
                      className="w-10 h-10 rounded-full border border-[var(--color-card-border)] flex items-center justify-center transition-transform hover:rotate-12"
                      style={{ backgroundColor: item.color }}
                    >
                      <item.icon size={16} className={`${mode === item.id ? 'opacity-100' : 'opacity-40'}`} style={{ color: mode === item.id ? 'var(--color-gold)' : 'var(--color-text-muted)' }} />
                    </div>
                    <span className="arabic-text text-[9px] font-bold truncate w-full text-center">{item.label}</span>
                  </button>
                ))}
            </div>
          </div>

          <div className="neu-card p-5">
              <div className="flex items-center gap-3 mb-4">
                  <BookOpen size={20} className="text-[var(--color-gold)]" />
                  <span className="arabic-text font-bold">{t('font_family')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'amiri', label: t('font_amiri'), class: 'font-amiri' },
                    { id: 'scheherazade', label: t('font_scheherazade'), class: 'font-scheherazade' },
                    { id: 'tajawal', label: t('font_tajawal'), class: 'font-tajawal' },
                    { id: 'cairo', label: t('font_cairo'), class: 'font-cairo' },
                    { id: 'noto', label: t('font_noto'), class: 'font-noto' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFontFamily(f.id as any)}
                      className={`px-4 py-2 rounded-xl border transition-all arabic-text text-sm ${
                        fontFamily === f.id
                          ? 'border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-primary)] font-bold'
                          : 'border-[var(--color-card-border)] bg-[var(--color-bg-alt)] opacity-60'
                      } ${f.class}`}
                    >
                      {f.label}
                    </button>
                  ))}
              </div>
          </div>

          <div className="neu-card p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <Scaling size={20} className="text-[var(--color-gold)]" />
                  <div>
                      <h3 className="arabic-text font-bold text-sm">{t('font_size')}</h3>
                      <p className="arabic-text text-[10px] opacity-60">{t('font_size_desc')}</p>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <button onClick={() => setFontSize(Math.max(1, fontSize - 0.1))} className="w-10 h-10 rounded-xl bg-[var(--color-bg-alt)] flex items-center justify-center text-lg font-bold">أ-</button>
                  <span className="text-sm font-bold w-12 text-center">{(fontSize * 100).toFixed(0)}%</span>
                  <button onClick={() => setFontSize(Math.min(2, fontSize + 0.1))} className="w-10 h-10 rounded-xl bg-[var(--color-bg-alt)] flex items-center justify-center text-lg font-bold">أ+</button>
              </div>
          </div>

          <div className="neu-card p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <Shield size={20} className="text-[var(--color-gold)]" />
                  <div>
                      <h3 className="arabic-text font-bold text-sm">{t('reading_mode')}</h3>
                      <p className="arabic-text text-[10px] opacity-60">{t('reading_mode_desc')}</p>
                  </div>
              </div>
            <button onClick={toggleReadingMode} className={`w-12 h-6 rounded-full transition-colors relative ${readingMode ? 'bg-[var(--color-primary)]' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${readingMode ? 'right-7' : 'right-1'}`} />
            </button>
          </div>

          <div className="neu-card p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <Bell size={20} className="text-[var(--color-gold)]" />
                  <div>
                      <h3 className="arabic-text font-bold text-sm">{t('notifications')}</h3>
                      <p className="arabic-text text-[10px] opacity-60">{t('notifications_desc')}</p>
                  </div>
              </div>
              <input type="time" defaultValue="08:00" className="bg-[var(--color-bg-alt)] border-none rounded-lg p-2 text-xs arabic-text" />
          </div>

          <div className="neu-card p-5">
              <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                      <Volume2 size={20} className="text-[var(--color-gold)]" />
                      <div>
                          <h3 className="arabic-text font-bold text-sm">{t('audio_settings')}</h3>
                          <p className="arabic-text text-[10px] opacity-60">{t('audio_settings_desc')}</p>
                      </div>
                  </div>
                  <button 
                    onClick={() => useAudioStore.getState().testVoice()}
                    className="px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white arabic-text font-bold text-xs shadow-md active:scale-95 transition-all"
                  >
                    {t('start_test')}
                  </button>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{t('playback_speed')}</span>
                        <span className="text-xs font-mono font-bold text-[var(--color-primary)]">{useAudioStore.getState().playbackRate}x</span>
                    </div>
                    <input 
                        type="range" min="0.5" max="1.5" step="0.1" 
                        value={useAudioStore.getState().playbackRate} 
                        onChange={(e) => useAudioStore.getState().setPlaybackRate(parseFloat(e.target.value))}
                        className="w-full accent-[var(--color-primary)]"
                    />
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-bg-alt)] border border-dashed border-[var(--color-gold)]/20">
                    <p className="arabic-text text-[9px] opacity-70 leading-relaxed">
                        💡 {t('audio_note')}
                    </p>
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* App Info */}
      <section className="mb-8">
        <h2 className="arabic-text font-bold text-sm mb-4 opacity-40">{t('about')}</h2>
        <div className="neu-card overflow-hidden">
            <div className="p-5 border-b border-[var(--color-card-border)] flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-white font-bold">ن</div>
                <div>
                   <h3 className="arabic-text font-bold text-sm">{t('app_name')} — إصدار 1.1.0</h3>
                   <p className="arabic-text text-[10px] opacity-60">{t('slogan')}</p>
                </div>
            </div>
            
            <button className="w-full p-4 flex items-center justify-between hover:bg-[var(--color-bg-alt)] transition-colors text-right">
                <div className="flex items-center gap-3">
                    <Globe size={18} className="text-[var(--color-gold)]" />
                    <span className="arabic-text text-sm">{t('website')}</span>
                </div>
                <ChevronLeft size={16} className={`${i18n.language === 'ar' ? 'rotate-180' : ''} opacity-30`} />
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-[var(--color-bg-alt)] transition-colors text-right">
                <div className="flex items-center gap-3">
                    <Shield size={18} className="text-[var(--color-gold)]" />
                    <span className="arabic-text text-sm">{t('privacy_policy')}</span>
                </div>
                <ChevronLeft size={16} className={`${i18n.language === 'ar' ? 'rotate-180' : ''} opacity-30`} />
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-[var(--color-bg-alt)] transition-colors text-right">
                <div className="flex items-center gap-3">
                    <Mail size={18} className="text-[var(--color-gold)]" />
                    <span className="arabic-text text-sm">{t('contact_us')}</span>
                </div>
                <ChevronLeft size={16} className={`${i18n.language === 'ar' ? 'rotate-180' : ''} opacity-30`} />
            </button>
        </div>
      </section>

      {/* System Actions */}
      <section className="mb-12">
          <button 
            onClick={async () => {
                const res = await migrateDataToFirestore();
                if (res.success) {
                    toast.success(t('sync_success'));
                } else {
                    toast.error(t('sync_failed'));
                }
            }}
            className="w-full py-4 rounded-2xl bg-[var(--color-primary)] text-white arabic-text font-bold text-sm shadow-md active:scale-[0.98] transition-all mb-4"
          >
              <div className="flex items-center justify-center gap-2">
                <Cloud size={18} />
                <span>{t('sync_data')} (Admin)</span>
              </div>
          </button>
          <button 
            onClick={handleClearCache}
            className="w-full py-4 rounded-2xl bg-red-50 text-red-600 arabic-text font-bold text-sm shadow-sm active:scale-[0.98] transition-all mb-4"
          >
              {t('clear_data')}
          </button>
          <button 
            onClick={() => { clearSearchHistory(); toast.success(t('cache_cleared')); }}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 arabic-text font-bold text-sm hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all"
          >
              {t('clear_search_history')}
          </button>
          <p className="text-center mt-3 text-[10px] arabic-text opacity-40">
              {t('clear_data_desc')}
          </p>
      </section>

      {/* Social Footer */}
      <div className="flex justify-center gap-6 pb-10 opacity-30">
          <Github size={20} />
          <Mail size={20} />
          <Bell size={20} />
      </div>
    </div>
  );
}
