import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, LogIn, UserPlus, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate auth success for demo
    const mockUser = {
      id: 'user-' + Date.now(),
      email,
      displayName: name || 'مستخدم نور السلف',
      favorites_aqwaal: [],
      favorites_qisas: [],
      reading_progress: {},
      theme: 'light' as const,
      font_size: 1.35,
      collections: [],
    };
    
    setUser(mockUser);
    toast.success(isLogin ? 'تم تسجيل الدخول بنجاح' : 'تم إنشاء الحساب بنجاح', {
      style: { fontFamily: 'Amiri, serif', direction: 'rtl' }
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
                <div className="text-3xl font-bold">ن</div>
            </div>
            <h1 className="arabic-text font-bold text-2xl mb-2" style={{ color: 'var(--color-primary)' }}>
                {isLogin ? 'مرحباً بك مجدداً' : 'انضم إلينا'}
            </h1>
            <p className="arabic-text text-sm opacity-60">
                {isLogin ? 'سجل دخولك لمتابعة قراءاتك' : 'أنشئ حساباً لحفظ مفضلتك عبر الأجهزة'}
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
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-gold)]" size={18} />
                <input
                  type="text"
                  placeholder="الاسم الكامل"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 pr-12 pl-4 rounded-xl bg-[var(--color-bg-alt)] arabic-text outline-none border-2 border-transparent focus:border-[var(--color-gold)] transition-all"
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-gold)]" size={18} />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 pr-12 pl-4 rounded-xl bg-[var(--color-bg-alt)] arabic-text outline-none border-2 border-transparent focus:border-[var(--color-gold)] transition-all"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-gold)]" size={18} />
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 pr-12 pl-4 rounded-xl bg-[var(--color-bg-alt)] arabic-text outline-none border-2 border-transparent focus:border-[var(--color-gold)] transition-all"
              required
            />
          </div>

          <button type="submit" className="w-full h-14 rounded-2xl neu-btn-primary flex items-center justify-center gap-2 font-bold arabic-text transition-all active:scale-[0.98] shadow-lg">
            {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
            {isLogin ? 'دخول' : 'إنشاء حساب'}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-4">
            <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="arabic-text text-sm font-bold flex items-center gap-2"
                style={{ color: 'var(--color-gold)' }}
            >
                {isLogin ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب بالفعل؟ سجل دخولك'}
                <ArrowRight size={16} className="rotate-180" />
            </button>
            
            <div className="gold-divider w-full opacity-30 my-2" />
            
            <button 
                onClick={handleGuest}
                className="arabic-text text-xs opacity-60 flex items-center gap-2 hover:opacity-100 transition-opacity"
            >
                التصفح كضيف <Globe size={14} />
            </button>
        </div>
      </motion.div>

      <div className="mt-12 flex items-center gap-4 opacity-40">
          <div className="flex items-center gap-1.5 arabic-text text-[10px]">
              <ShieldCheck size={14} />
              بياناتك مشفرة وآمنة
          </div>
          <span className="w-1 h-1 rounded-full bg-gray-400" />
          <div className="arabic-text text-[10px]">نور السلف © ٢٠٢٤</div>
      </div>
    </div>
  );
}
