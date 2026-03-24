// ─── TYPE DEFINITIONS FOR NOOR AL-SALAF ───────────────────────────────────

export type ContentGrade = 'authentic' | 'hasan' | 'weak' | 'unknown';
export type ThemeMode = 'light' | 'dark' | 'paper' | 'midnight' | 'emerald' | 'sand' | 'royal';
export type FontMode = 'amiri' | 'scheherazade' | 'tajawal' | 'cairo' | 'noto';
export type ScholarEra = 'صحابة' | 'تابعون' | 'أتباع التابعين' | 'علماء متأخرون';

export interface Scholar {
  id: string;
  name_ar: string;
  name_en: string;
  era: ScholarEra;
  bio_ar: string;
  death_year?: string;
  reliability: string;
  image?: string;
  tags?: string[];
}

export interface Qawl {
  id: string;
  text_ar: string;
  scholar_id: string;
  scholar_name_ar?: string;
  source: string;
  grade: ContentGrade;
  tags: string[];
  created_at: string;
  audio_url?: string;
}

export interface Qissa {
  id: string;
  title_ar: string;
  content_ar: string;
  scholar_id?: string;
  scholar_name_ar?: string;
  summary_ar: string;
  source: string;
  authenticity_notes?: string;
  reading_time: number; // minutes
  tags: string[];
  created_at: string;
  audio_url?: string;
  image_url?: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  displayName?: string;
  favorites_aqwaal: string[];
  favorites_qisas: string[];
  reading_progress: Record<string, number>; // qissa_id -> scroll%
  theme: ThemeMode;
  font_size: number;
  role?: 'admin' | 'user';
  collections: Collection[];
}

export interface Collection {
  id: string;
  name_ar: string;
  aqwaal_ids: string[];
  qisas_ids: string[];
  created_at: string;
}

export interface AudioItem {
  id: string;
  content_id: string;
  content_type: 'qawl' | 'qissa';
  title_ar: string;
  audio_url: string;
  duration?: number;
}
