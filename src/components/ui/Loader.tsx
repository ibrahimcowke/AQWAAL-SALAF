interface LoaderProps {
  fullPage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loader({ fullPage = false, size = 'md' }: LoaderProps) {
  const sizes = { sm: 32, md: 48, lg: 64 };
  const px = sizes[size];

  const svg = (
    <svg width={px} height={px} viewBox="0 0 50 50" style={{ animation: 'spin 1.5s linear infinite' }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <circle cx="25" cy="25" r="20" fill="none" stroke="var(--color-gold)" strokeWidth="3" strokeLinecap="round"
        strokeDasharray="94" strokeDashoffset="20" />
      <circle cx="25" cy="25" r="12" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round"
        strokeDasharray="56" strokeDashoffset="14" style={{ animationDirection: 'reverse', animation: 'spin 1s linear infinite reverse' }} />
      <text x="25" y="29" textAnchor="middle" fontSize="10" fill="var(--color-gold)" fontFamily="Amiri, serif">ن</text>
    </svg>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="flex flex-col items-center gap-4">
          {svg}
          <p className="arabic-text text-sm" style={{ color: 'var(--color-text-muted)' }}>جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  return <div className="flex items-center justify-center py-8">{svg}</div>;
}
