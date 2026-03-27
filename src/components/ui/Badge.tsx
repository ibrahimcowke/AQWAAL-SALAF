import type { ContentGrade } from '../../types';

import { useTranslation } from 'react-i18next';

interface BadgeProps {
  grade?: ContentGrade;
  label?: string;
  variant?: 'scholar' | 'era' | 'tag';
}

export function GradeBadge({ grade = 'unknown' }: { grade: ContentGrade }) {
  const { t } = useTranslation();
  
  const gradeStyles: Record<ContentGrade, string> = {
    authentic: 'badge-authentic',
    hasan: 'badge-hasan',
    weak: 'badge-weak',
    unknown: 'badge-scholar',
  };

  return <span className={gradeStyles[grade]}>{t(grade)}</span>;
}

export function EtaBadge({ label }: { label: string }) {
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs arabic-text font-medium"
      style={{
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
        color: 'var(--color-gold)',
      }}
    >
      {label}
    </span>
  );
}

export function TagBadge({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 rounded-full text-xs arabic-text transition-all duration-200"
      style={{
        background: active ? 'var(--color-primary)' : 'var(--color-bg-alt)',
        color: active ? 'var(--color-gold)' : 'var(--color-text-muted)',
        border: `1px solid ${active ? 'var(--color-gold)' : 'transparent'}`,
      }}
    >
      {label}
    </button>
  );
}

export default function Badge({ grade, label, variant = 'tag' }: BadgeProps) {
  if (grade) return <GradeBadge grade={grade} />;
  if (variant === 'scholar') return <span className="badge-scholar">{label}</span>;
  return <TagBadge label={label || ''} />;
}
