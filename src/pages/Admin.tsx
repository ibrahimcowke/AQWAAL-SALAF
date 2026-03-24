import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Plus, Edit, Trash2, CheckCircle, AlertTriangle, BookOpen, MessageSquareQuote, Users, Save, X } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useContentStore } from '../stores/contentStore';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

type AdminTab = 'aqwaal' | 'qisas' | 'scholars';

export default function Admin() {
  const { isAdmin } = useAuthStore();
  const { aqwaal, qisas, scholars, fetchContent } = useContentStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('aqwaal');
  const [isEditing, setIsEditing] = useState(false);
  const [editType, setEditType] = useState<'qawl' | 'qissa' | 'scholar'>('qawl');
  const [formData, setFormData] = useState<any>({});

  // Simple hardcoded security for demo/local
  if (!isAdmin && window.location.hostname !== 'localhost') {
    return (
      <div className="page-container flex flex-col items-center justify-center py-20 text-center">
        <Shield size={64} className="text-red-500 mb-6 opacity-20" />
        <h1 className="arabic-text font-bold text-2xl mb-2">منطقة محظورة</h1>
        <p className="arabic-text text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
          ليست لديك الصلاحيات الكافية للوصول إلى لوحة الإدارة
        </p>
        <button onClick={() => window.history.back()} className="neu-btn px-8 py-2 arabic-text font-bold">
          العودة
        </button>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const table = editType === 'qawl' ? 'aqwaal' : editType === 'qissa' ? 'qisas' : 'scholars';
    
    try {
      const { error } = await supabase.from(table).insert([{
        ...formData,
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;

      toast.success('تم الحفظ بنجاح', { style: { fontFamily: 'Amiri, serif', direction: 'rtl' } });
      await fetchContent(); 
      setIsEditing(false);
      setFormData({});
    } catch (err: any) {
      toast.error(`خطأ في الحفظ: ${err.message}`);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id: string, table: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;
    
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      toast.success('تم الحذف بنجاح');
      await fetchContent();
    } catch (err: any) {
      toast.error(`خطأ في الحذف: ${err.message}`);
    }
  };

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                <Shield size={24} />
            </div>
            <h1 className="section-title text-2xl m-0">لوحة التحكم السلفية</h1>
        </div>
        <p className="arabic-text text-sm" style={{ color: 'var(--color-text-muted)' }}>
          إدارة المحتوى، توثيق المصادر، ومتابعة النشاط
        </p>
      </motion.div>

      {/* Admin Tabs */}
      <div className="flex gap-2 mb-8 bg-white/50 backdrop-blur-sm p-1 rounded-2xl shadow-sm border border-[var(--color-card-border)]">
          {[
            { id: 'aqwaal', label: 'الأقوال', icon: MessageSquareQuote },
            { id: 'qisas', label: 'القصص', icon: BookOpen },
            { id: 'scholars', label: 'العلماء', icon: Users },
          ].map(tab => (
            <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as AdminTab); setIsEditing(false); }}
                className={`flex-1 flex flex-col md:flex-row items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                    activeTab === tab.id 
                    ? 'bg-[var(--color-primary)] text-white shadow-md scale-[1.02]' 
                    : 'text-[var(--color-text-muted)] hover:bg-white'
                }`}
            >
                <tab.icon size={18} />
                <span className="arabic-text text-xs font-bold">{tab.label}</span>
            </button>
          ))}
      </div>

      {/* Action Bar */}
      {!isEditing && (
        <div className="mb-6 flex justify-between items-center">
            <h2 className="arabic-text font-bold text-sm opacity-50">
                قائمة {activeTab === 'aqwaal' ? 'الأقوال' : activeTab === 'qisas' ? 'القصص' : 'العلماء'} الموثقة
            </h2>
            <button 
                onClick={() => {
                   setEditType(activeTab === 'aqwaal' ? 'qawl' : activeTab === 'qisas' ? 'qissa' : 'scholar');
                   setIsEditing(true);
                   setFormData({});
                }}
                className="neu-btn px-4 py-2 flex items-center gap-2 text-[var(--color-primary)] transition-all hover:scale-105 active:scale-95"
            >
                <Plus size={18} />
                <span className="arabic-text text-xs font-bold">إضافة جديد</span>
            </button>
        </div>
      )}

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {isEditing ? (
            <motion.div
                key="edit-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="neu-card p-6 md:p-8"
            >
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-dashed border-[var(--color-card-border)]">
                    <h3 className="arabic-text font-bold text-lg flex items-center gap-2">
                        <Plus size={20} className="text-[var(--color-gold)]" />
                        إضافة {editType === 'qawl' ? 'قول مأثور' : editType === 'qissa' ? 'قصة جديدة' : 'عالم جديد'}
                    </h3>
                    <button onClick={() => setIsEditing(false)} className="w-10 h-10 rounded-xl bg-red-50 text-red-400 flex items-center justify-center">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    {editType === 'qawl' && (
                        <>
                            <div className="space-y-2">
                                <label className="arabic-text text-sm font-bold opacity-60 px-1">نص القول:</label>
                                <textarea 
                                    name="text_ar"
                                    className="w-full p-4 rounded-2xl bg-[var(--color-bg-alt)] arabic-text outline-none border-2 border-transparent focus:border-[var(--color-gold)] transition-all"
                                    rows={4}
                                    placeholder="أدخل نص القول هنا..."
                                    required
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="arabic-text text-sm font-bold opacity-60 px-1">العالم القائل:</label>
                                    <select name="scholar_id" className="w-full p-3 rounded-xl bg-[var(--color-bg-alt)] arabic-text outline-none" onChange={handleInputChange} required>
                                        <option value="">اختر العالم...</option>
                                        {scholars.map(s => <option key={s.id} value={s.id}>{s.name_ar}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="arabic-text text-sm font-bold opacity-60 px-1">درجة القول:</label>
                                    <select name="grade" className="w-full p-3 rounded-xl bg-[var(--color-bg-alt)] arabic-text outline-none" onChange={handleInputChange} required>
                                        <option value="authentic">صحيح</option>
                                        <option value="hasan">حسن</option>
                                        <option value="weak">ضعيف</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="arabic-text text-sm font-bold opacity-60 px-1">المصدر:</label>
                                <input name="source" type="text" className="w-full p-4 rounded-xl bg-[var(--color-bg-alt)] arabic-text outline-none" placeholder="اسم الكتاب، الجزء، والصفحة" onChange={handleInputChange} required />
                            </div>
                        </>
                    )}

                    {editType === 'qissa' && (
                        <>
                            <div className="space-y-2">
                                <label className="arabic-text text-sm font-bold opacity-60 px-1">عنوان القصة:</label>
                                <input name="title_ar" type="text" className="w-full p-4 rounded-2xl bg-[var(--color-bg-alt)] arabic-text outline-none" onChange={handleInputChange} required />
                            </div>
                            <div className="space-y-2">
                                <label className="arabic-text text-sm font-bold opacity-60 px-1">محتوى القصة:</label>
                                <textarea name="content_ar" className="w-full p-4 rounded-2xl bg-[var(--color-bg-alt)] arabic-text min-h-[300px] outline-none" onChange={handleInputChange} required />
                            </div>
                        </>
                    )}

                    {editType === 'scholar' && (
                        <>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="arabic-text text-sm font-bold opacity-60 px-1">الاسم بالعربية:</label>
                                    <input name="name_ar" type="text" className="w-full p-4 rounded-xl bg-[var(--color-bg-alt)] arabic-text outline-none" onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="arabic-text text-sm font-bold opacity-60 px-1">الاسم بالإنجليزية:</label>
                                    <input name="name_en" type="text" className="w-full p-4 rounded-xl bg-[var(--color-bg-alt)] arabic-text outline-none" dir="ltr" onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="arabic-text text-sm font-bold opacity-60 px-1">العصر:</label>
                                <select name="era" className="w-full p-3 rounded-xl bg-[var(--color-bg-alt)] arabic-text outline-none" onChange={handleInputChange} required>
                                    <option value="صحابة">صحابة</option>
                                    <option value="تابعون">تابعون</option>
                                    <option value="أتباع التابعين">أتباع التابعين</option>
                                    <option value="علماء متأخرون">علماء متأخرون</option>
                                </select>
                            </div>
                        </>
                    )}

                    <button type="submit" className="w-full py-4 rounded-2xl neu-btn-primary flex items-center justify-center gap-3 text-lg font-bold arabic-text transition-all active:scale-[0.98] shadow-lg">
                        <Save size={24} />
                        حفظ ونشر المحتوى
                    </button>
                </form>
            </motion.div>
        ) : (
            <motion.div
                key="list-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
            >
                {activeTab === 'aqwaal' && aqwaal.map(item => (
                    <AdminItem key={item.id} title={item.text_ar} sub={item.scholar_name_ar || 'عالم مجهول'} verified onDelete={() => handleDelete(item.id, 'aqwaal')} />
                ))}
                {activeTab === 'qisas' && qisas.map(item => (
                    <AdminItem key={item.id} title={item.title_ar} sub={item.source} verified onDelete={() => handleDelete(item.id, 'qisas')} />
                ))}
                {activeTab === 'scholars' && scholars.map(item => (
                    <AdminItem key={item.id} title={item.name_ar} sub={item.era} verified onDelete={() => handleDelete(item.id, 'scholars')} />
                ))}
                
                {activeTab === 'aqwaal' && aqwaal.length === 0 && <EmptyState label="لا توجد أقوال حالياً" />}
                {activeTab === 'qisas' && qisas.length === 0 && <EmptyState label="لا توجد قصص حالياً" />}
                {activeTab === 'scholars' && scholars.length === 0 && <EmptyState label="لا يوجد علماء حالياً" />}
            </motion.div>
        )}
      </AnimatePresence>

      {/* Security Notice */}
      <div className="mt-12 p-4 rounded-2xl flex items-center gap-3 bg-[var(--color-bg-alt)] opacity-40">
          <AlertTriangle size={20} className="text-[var(--color-gold)]" />
          <p className="arabic-text text-[10px] m-0">
              يتم تسجيل جميع العمليات السحابية في لوحة الإدارة لأغراض التدقيق. يرجى التأكد من توثيق المصادر قبل النشر.
          </p>
      </div>
    </div>
  );
}

function AdminItem({ title, sub, verified, onDelete }: { title: string; sub: string; verified?: boolean; onDelete: () => void }) {
    return (
        <div className="neu-card p-4 flex items-center justify-between group bg-white">
            <div className="flex items-center gap-4 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-alt)] flex items-center justify-center text-[var(--color-primary)] opacity-50">
                    {verified ? <CheckCircle size={20} className="text-emerald-500" /> : <AlertTriangle size={20} />}
                </div>
                <div className="overflow-hidden">
                    <h4 className="arabic-text font-bold text-sm truncate max-w-xs">{title}</h4>
                    <p className="arabic-text text-[10px] opacity-60">{sub}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-10 group-hover:opacity-100 transition-all">
                <button className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                    <Edit size={16} />
                </button>
                <button onClick={onDelete} className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}

function EmptyState({ label }: { label: string }) {
    return (
        <div className="py-20 text-center opacity-30">
            <p className="arabic-text font-bold">{label}</p>
        </div>
    );
}
