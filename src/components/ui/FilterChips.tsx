import { useTranslation } from 'react-i18next';
import { TagBadge } from './Badge';

interface FilterItem {
  id: string;
  name_ar: string;
  name_so?: string;
}

interface FilterChipsProps {
  items: FilterItem[];
  activeId: string;
  onSelect: (id: string) => void;
  allLabel: string;
}

export function FilterChips({ items, activeId, onSelect, allLabel }: FilterChipsProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const isSomali = i18n.language === 'so';

  return (
    <div 
      className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 gap-2 hide-scrollbar" 
      style={{ direction: isArabic ? 'rtl' : 'ltr' }}
    >
      <div className="flex-shrink-0">
        <TagBadge 
          label={allLabel} 
          active={!activeId} 
          onClick={() => onSelect('')} 
        />
      </div>
      {items.map((item) => (
        <div key={item.id} className="flex-shrink-0">
          <TagBadge 
            label={(isSomali && item.name_so) ? item.name_so : item.name_ar} 
            active={activeId === item.id} 
            onClick={() => onSelect(activeId === item.id ? '' : item.id)} 
          />
        </div>
      ))}
    </div>
  );
}
