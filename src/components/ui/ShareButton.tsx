import { Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  className?: string;
}

export default function ShareButton({ title, text, url, className = '' }: ShareButtonProps) {
  const { t } = useTranslation();

  const handleShare = async () => {
    const shareData = {
      title,
      text: `${text}\n\n— ${title}`,
      url: url || window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share Error:', err);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
        toast.success(t('copied_success'));
      } catch (err) {
        toast.error(t('share_error'));
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`p-2 rounded-full bg-[var(--color-bg-alt)] text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-all ${className}`}
      title={t('share')}
    >
      <Share2 size={18} />
    </button>
  );
}
