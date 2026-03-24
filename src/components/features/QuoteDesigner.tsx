import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, X, Type, Palette, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface QuoteDesignerProps {
  text: string;
  author: string;
  onClose: () => void;
}

const BACKGROUNDS = [
  { id: 'glass', name: 'زجاجي', style: 'linear-gradient(135deg, #1e3a34, #12211e)' },
  { id: 'gold', name: 'ملكي', style: 'linear-gradient(135deg, #b8860b, #daa520)' },
  { id: 'dark', name: 'ليل', style: 'linear-gradient(135deg, #0f172a, #1e293b)' },
  { id: 'mint', name: 'ريحان', style: 'linear-gradient(135deg, #4ade80, #166534)' },
  { id: 'sepia', name: 'قديم', style: 'linear-gradient(135deg, #78350f, #451a03)' },
];

const FONTS = [
  { id: 'amiri', name: 'أميري', family: 'Amiri, serif' },
  { id: 'scheherazade', name: 'شهرزاد', family: "'Scheherazade New', serif" },
  { id: 'aref', name: 'رقعة', family: "'Aref Ruqaa', serif" },
];

export default function QuoteDesigner({ text, author, onClose }: QuoteDesignerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bg, setBg] = useState(BACKGROUNDS[0]);
  const [font, setFont] = useState(FONTS[0]);
  const [padding, setPadding] = useState(60);
  const [fontSize, setFontSize] = useState(32);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set dimensions for Instagram Square (1080x1080)
    canvas.width = 1080;
    canvas.height = 1080;

    // 1. Draw Background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    const colors = bg.style.match(/#[a-fA-F0-0]{6}/g) || ['#1e3a34', '#12211e'];
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Decorative Patterns (Subtle)
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // 3. Draw Text
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Auto-wrap text
    const maxWidth = canvas.width - (padding * 4);
    const lineHeight = fontSize * 3.5;
    ctx.font = `${fontSize * 2}px ${font.family}`;
    
    const words = text.split(' ');
    let line = '';
    const lines = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    const totalHeight = lines.length * lineHeight;
    let y = (canvas.height - totalHeight) / 2;

    lines.forEach((l) => {
      ctx.fillText(l, canvas.width / 2, y);
      y += lineHeight;
    });

    // 4. Draw Author
    ctx.font = `italic ${fontSize * 1.2}px ${font.family}`;
    ctx.globalAlpha = 0.7;
    ctx.fillText(`— ${author}`, canvas.width / 2, y + 60);
    ctx.globalAlpha = 1.0;

    // 5. Branding
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillText('نور السلف | NOOR AL-SALAF', canvas.width / 2, canvas.height - 80);
  };

  useEffect(() => {
    // Wait for fonts to load
    document.fonts.ready.then(() => drawCanvas());
  }, [bg, font, fontSize, padding, text, author]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `noor-salaf-quote-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('تم تحميل الصورة بنجاح');
  };

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
    >
        <div className="bg-[var(--color-bg)] w-full max-w-5xl rounded-3xl overflow-hidden flex flex-col md:flex-row h-[90vh] shadow-2xl">
            {/* Canvas Preview Area */}
            <div className="flex-1 bg-[#111] flex items-center justify-center p-6 relative overflow-hidden group">
                <canvas 
                    ref={canvasRef} 
                    className="max-w-full max-h-full shadow-2xl rounded-lg border border-white/10"
                    style={{ aspectRatio: '1/1' }}
                />
                
                <button 
                    onClick={onClose}
                    className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all z-10"
                >
                    <X size={24} />
                </button>

                <div className="absolute bottom-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={handleDownload} className="neu-btn-primary px-6 py-2 flex items-center gap-2">
                        <Download size={20} />
                        <span className="arabic-text font-bold">تحميل الصورة</span>
                    </button>
                </div>
            </div>

            {/* Controls Panel */}
            <div className="w-full md:w-80 bg-[var(--color-card)] border-r border-[var(--color-card-border)] p-6 overflow-y-auto">
                <div className="flex items-center gap-2 mb-8 text-[var(--color-primary)]">
                    <Sparkles size={20} />
                    <h2 className="arabic-text font-bold text-lg m-0">مصمم البطاقات</h2>
                </div>

                <div className="space-y-8">
                    {/* Backgrounds */}
                    <div className="space-y-3">
                        <label className="arabic-text text-xs font-bold opacity-60 flex items-center gap-2">
                            <Palette size={14} />
                            اختر الخلفية:
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {BACKGROUNDS.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setBg(item)}
                                    className={`w-full aspect-square rounded-lg transition-all ${bg.id === item.id ? 'ring-2 ring-[var(--color-primary)] ring-offset-2' : ''}`}
                                    style={{ background: item.style }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Fonts */}
                    <div className="space-y-3">
                        <label className="arabic-text text-xs font-bold opacity-60 flex items-center gap-2">
                            <Type size={14} />
                            نوع الخط:
                        </label>
                        <div className="flex flex-col gap-2">
                            {FONTS.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setFont(item)}
                                    className={`w-full py-2 px-4 rounded-xl arabic-text text-sm border-2 transition-all text-right ${
                                        font.id === item.id 
                                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]' 
                                        : 'border-transparent bg-[var(--color-bg-alt)] opacity-60'
                                    }`}
                                    style={{ fontFamily: item.family }}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sizing Controls */}
                    <div className="space-y-4 pt-4 border-t border-dashed border-[var(--color-card-border)]">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="arabic-text text-[10px] font-bold opacity-60">حجم الخط</label>
                                <span className="text-[10px] font-mono">{fontSize}px</span>
                            </div>
                            <input 
                                type="range" min="20" max="60" value={fontSize} 
                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                className="w-full accent-[var(--color-primary)]"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="arabic-text text-[10px] font-bold opacity-60">الهوامش</label>
                                <span className="text-[10px] font-mono">{padding}px</span>
                            </div>
                            <input 
                                type="range" min="40" max="120" value={padding} 
                                onChange={(e) => setPadding(parseInt(e.target.value))}
                                className="w-full accent-[var(--color-primary)]"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-12 space-y-2">
                    <button onClick={handleDownload} className="w-full py-4 rounded-2xl neu-btn-primary flex items-center justify-center gap-3 font-bold arabic-text transition-all active:scale-95 shadow-lg">
                        <Download size={20} />
                        حفظ ومشاركة
                    </button>
                    <p className="arabic-text text-[10px] text-center opacity-40">
                        الأبعاد محسنة لـ Instagram و Facebook
                    </p>
                </div>
            </div>
        </div>
    </motion.div>
  );
}
