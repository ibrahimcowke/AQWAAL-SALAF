-- =========================================================
-- NOOR AL-SALAF: COMPLETE CLEAN SLATE RESET & SETUP
-- WARNING: THIS WILL DELETE ALL DATA IN YOUR DATABASE!
-- =========================================================

-- 0. Cleanup Old State (CASCADE handles dependencies)
DROP TABLE IF EXISTS public.aqwaal CASCADE;
DROP TABLE IF EXISTS public.qisas CASCADE;
DROP TABLE IF EXISTS public.scholars CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Scholars Table
CREATE TABLE public.scholars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar TEXT NOT NULL,
  name_en TEXT,
  era TEXT NOT NULL,
  bio_ar TEXT,
  death_year TEXT,
  reliability TEXT,
  image TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Aqwaal (Sayings) Table
CREATE TABLE public.aqwaal (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text_ar TEXT NOT NULL,
  text_en TEXT,
  scholar_id UUID REFERENCES public.scholars(id) ON DELETE SET NULL,
  scholar_name_ar TEXT, 
  scholar_name_en TEXT,
  source TEXT,
  grade TEXT DEFAULT 'unknown',
  tags TEXT[],
  audio_url TEXT,
  embedding vector(1536), -- For Semantic Search
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Qisas (Stories) Table
CREATE TABLE public.qisas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_ar TEXT NOT NULL,
  content_ar TEXT NOT NULL,
  scholar_id UUID REFERENCES public.scholars(id) ON DELETE SET NULL,
  scholar_name_ar TEXT,
  summary_ar TEXT,
  source TEXT,
  authenticity_notes TEXT,
  reading_time INTEGER DEFAULT 5,
  tags TEXT[],
  image_url TEXT,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. User Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  favorites_aqwaal UUID[] DEFAULT '{}',
  favorites_qisas UUID[] DEFAULT '{}',
  reading_progress JSONB DEFAULT '{}'::jsonb,
  collections JSONB DEFAULT '[]'::jsonb,
  theme TEXT DEFAULT 'light',
  font_size NUMERIC DEFAULT 1.35,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Row Level Security (RLS)

ALTER TABLE public.scholars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read scholars" ON public.scholars FOR SELECT USING (true);
CREATE POLICY "Allow admin manage scholars" ON public.scholars FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE public.aqwaal ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read aqwaal" ON public.aqwaal FOR SELECT USING (true);
CREATE POLICY "Allow admin manage aqwaal" ON public.aqwaal FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE public.qisas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read qisas" ON public.qisas FOR SELECT USING (true);
CREATE POLICY "Allow admin manage qisas" ON public.qisas FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 7. Functions & Triggers

-- Handle Profile Creation on User Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Semantic Search Function
CREATE OR REPLACE FUNCTION search_aqwaal (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  text_ar text,
  text_en text,
  scholar_name_ar text,
  scholar_name_en text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    aqwaal.id,
    aqwaal.text_ar,
    aqwaal.text_en,
    aqwaal.scholar_name_ar,
    aqwaal.scholar_name_en,
    1 - (aqwaal.embedding <=> query_embedding) AS similarity
  FROM public.aqwaal
  WHERE 1 - (aqwaal.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
