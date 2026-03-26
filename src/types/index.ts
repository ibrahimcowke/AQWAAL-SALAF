// ─── TYPE DEFINITIONS FOR NOOR AL-SALAF ───────────────────────────────────

export type ContentGrade = 'authentic' | 'hasan' | 'weak' | 'unknown';
export type ThemeMode = 'light' | 'dark' | 'paper' | 'midnight' | 'emerald' | 'sand' | 'royal';
export type FontMode = 'amiri' | 'scheherazade' | 'tajawal' | 'cairo' | 'noto';
export type ScholarEra = 'صحابة' | 'تابعون' | 'أتباع التابعين' | 'علماء متأخرون';

export interface Scholar {
  id: string;
  name_ar: string;
  name_en: string;
  name_so?: string; // Somali name
  era: ScholarEra;
  bio_ar: string;
  bio_so?: string; // Somali bio
  death_year?: string;
  reliability: string;
  reliability_so?: string; // Somali reliability description
  image?: string;
  tags?: string[];
}

export interface Qawl {
  id: string;
  text_ar: string;
  text_so?: string; // Somali translation
  scholar_id: string;
  scholar_name_ar?: string;
  scholar_name_so?: string; // Somali scholar name
  source: string;
  source_so?: string; // Somali source description
  grade: ContentGrade;
  tags: string[];
  explanation_ar?: string; // Arabic explanation/sharh
  explanation_so?: string; // Somali explanation
  created_at: string;
  audio_url?: string;
}

export interface Qissa {
  id: string;
  title_ar: string;
  title_so?: string;
  content_ar: string;
  content_so?: string;
  scholar_id?: string;
  scholar_name_ar?: string;
  scholar_name_so?: string;
  summary_ar: string;
  summary_so?: string;
  source: string;
  source_so?: string;
  authenticity_notes?: string;
  authenticity_notes_so?: string;
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
