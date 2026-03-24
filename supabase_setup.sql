-- ==========================================
-- NOOR AL-SALAF: COMPLETE SUPABASE SETUP
-- ==========================================

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Scholars Table
CREATE TABLE IF NOT EXISTS scholars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar TEXT NOT NULL,
  name_en TEXT,
  era TEXT NOT NULL, -- صحابة, تابعون, etc.
  bio_ar TEXT,
  death_year TEXT,
  reliability TEXT,
  image TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Aqwaal (Sayings) Table
CREATE TABLE IF NOT EXISTS aqwaal (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text_ar TEXT NOT NULL,
  text_en TEXT,
  scholar_id UUID REFERENCES scholars(id) ON DELETE SET NULL,
  scholar_name_ar TEXT, 
  scholar_name_en TEXT,
  source TEXT,
  grade TEXT DEFAULT 'unknown', -- authentic, hasan, weak
  tags TEXT[],
  audio_url TEXT,
  embedding vector(1536), -- For Semantic Search (OpenAI standard)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Qisas (Stories) Table
CREATE TABLE IF NOT EXISTS qisas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_ar TEXT NOT NULL,
  content_ar TEXT NOT NULL,
  scholar_id UUID REFERENCES scholars(id) ON DELETE SET NULL,
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

-- 4. User Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
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

-- 5. Row Level Security (RLS)

-- Scholars
ALTER TABLE scholars ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read scholars" ON scholars;
CREATE POLICY "Allow public read scholars" ON scholars FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow admin manage scholars" ON scholars;
CREATE POLICY "Allow admin manage scholars" ON scholars FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Aqwaal
ALTER TABLE aqwaal ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read aqwaal" ON aqwaal;
CREATE POLICY "Allow public read aqwaal" ON aqwaal FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow admin manage aqwaal" ON aqwaal;
CREATE POLICY "Allow admin manage aqwaal" ON aqwaal FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Qisas
ALTER TABLE qisas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read qisas" ON qisas;
CREATE POLICY "Allow public read qisas" ON qisas FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow admin manage qisas" ON qisas;
CREATE POLICY "Allow admin manage qisas" ON qisas FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 6. Functions & Triggers

-- Handle Profile Creation on User Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
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
  FROM aqwaal
  WHERE 1 - (aqwaal.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- 7. Storage Buckets Hint
-- Buckets to create manually in Supabase Dashboard:
-- 'scholars', 'aqwaal-audio', 'qisas-images'
