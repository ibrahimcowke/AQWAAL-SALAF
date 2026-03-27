import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, LogIn, UserPlus, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function Auth() {
  const { t, i18n } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const isArabic = i18n.language === 'ar';

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate auth success for demo
    const mockUser = {
      id: 'user-' + Date.now(),
      email,
      displayName: name || t('default_user_name'),
      favorites_aqwaal: [],
      favorites_qisas: [],
      reading_progress: {},
      theme: 'light' as const,
      font_size: 1.35,
      collections: [],
    };
    
    setUser(mockUser);
    toast.success(isLogin ? t('login_success') : t('signup_success'), {
      style: { fontFamily: isArabic ? 'Amiri, serif' : 'Inter, sans-serif', direction: isArabic ? 'rtl' : 'ltr' }
    });
    navigate('/');
  };

  const handleGuest = () => {
    navigate('/');
  };

  return (
    <div className="page-container min-h-[80vh] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md neu-card p-8 md:p-10"
      >
        <div className="text-center mb-8">
            <div 
                className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-white mb-6 shadow-xl islamic-pattern"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))' }}
            >
                <div className="text-3xl font-bold">{isArabic ? 'ن' : 'N'}</div>
            </div>
            <h1 className={`font-bold text-2xl mb-2 ${isArabic ? 'arabic-text' : ''}`} style={{ color: 'var(--color-primary)' }}>
                {isLogin ? t('welcome_back') : t('join_us')}
            </h1>
            <p className={`text-sm opacity-60 ${isArabic ? 'arabic-text' : ''}`}>
                {isLogin ? t('login_subtitle') : t('signup_subtitle')}
            </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <User className={`absolute top-1/2 -translate-y-1/2 text-[var(--color-gold)] ${isArabic ? 'right-4' : 'left-4'}`} size={18} />
                <input
                  type="text"
                  placeholder={t('full_name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full h-12 rounded-xl bg-[var(--color-bg-alt)] outline-none border-2 border-transparent focus:border-[var(--color-gold)] transition-all ${isArabic ? 'pr-12 pl-4 arabic-text text-right' : 'pl-12 pr-4 text-left'}`}
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className={`absolute top-1/2 -translate-y-1/2 text-[var(--color-gold)] ${isArabic ? 'right-4' : 'left-4'}`} size={18} />
            <input
              type="email"
              placeholder={t('email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full h-12 rounded-xl bg-[var(--color-bg-alt)] outline-none border-2 border-transparent focus:border-[var(--color-gold)] transition-all ${isArabic ? 'pr-12 pl-4 arabic-text text-right' : 'pl-12 pr-4 text-left'}`}
              required
            />
          </div>

          <div className="relative">
            <Lock className={`absolute top-1/2 -translate-y-1/2 text-[var(--color-gold)] ${isArabic ? 'right-4' : 'left-4'}`} size={18} />
            <input
              type="password"
              placeholder={t('password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full h-12 rounded-xl bg-[var(--color-bg-alt)] outline-none border-2 border-transparent focus:border-[var(--color-gold)] transition-all ${isArabic ? 'pr-12 pl-4 arabic-text text-right' : 'pl-12 pr-4 text-left'}`}
              required
            />
          </div>

          <button type="submit" className={`w-full h-14 rounded-2xl neu-btn-primary flex items-center justify-center gap-2 font-bold transition-all active:scale-[0.98] shadow-lg ${isArabic ? 'arabic-text' : ''}`}>
            {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
            {isLogin ? t('login_btn') : t('signup_btn')}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-4">
            <button 
                onClick={() => setIsLogin(!isLogin)} 
                className={`text-sm font-bold flex items-center gap-2 ${isArabic ? 'arabic-text' : 'flex-row-reverse'}`}
                style={{ color: 'var(--color-gold)' }}
            >
                {isLogin ? t('no_account_cta') : t('has_account_cta')}
                <ArrowRight size={16} className={isArabic ? 'rotate-180' : ''} />
            </button>
            
            <div className="gold-divider w-full opacity-30 my-2" />
            
            <button 
                onClick={handleGuest}
                className={`text-xs opacity-60 flex items-center gap-2 hover:opacity-100 transition-opacity ${isArabic ? 'arabic-text' : 'flex-row-reverse'}`}
            >
                {t('browse_as_guest')} <Globe size={14} />
            </button>
        </div>
      </motion.div>

      <div className={`mt-12 flex items-center gap-4 opacity-40 ${isArabic ? '' : 'flex-row-reverse'}`}>
          <div className={`flex items-center gap-1.5 text-[10px] ${isArabic ? 'arabic-text' : ''}`}>
              <ShieldCheck size={14} />
              {t('data_secure_notice')}
          </div>
          <span className="w-1 h-1 rounded-full bg-gray-400" />
          <div className={`text-[10px] ${isArabic ? 'arabic-text' : ''}`}>{t('app_name')} © ٢٠٢٤</div>
      </div>
    </div>
  );
}
