-- ============================================
-- SAFE Update Script for 3D Menu App
-- ============================================
-- Run this script to fix the "relation already exists" error.
-- It will only create tables/columns if they are missing.
-- ============================================

-- 1. Create dishes table ONLY if it doesn't exist
CREATE TABLE IF NOT EXISTS public.dishes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    model_url TEXT NOT NULL,
    thumbnail_url TEXT,
    model_file_size INTEGER,
    polygon_count INTEGER,
    generation_status TEXT DEFAULT 'ready',
    kiri_task_id TEXT,
    generated_from_photos INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0
);

-- 2. Add missing columns to 'dishes' (if you created it earlier)
DO $$
BEGIN
    -- Try to add columns if they don't exist
    BEGIN
        ALTER TABLE public.dishes ADD COLUMN generation_status TEXT DEFAULT 'ready';
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.dishes ADD COLUMN kiri_task_id TEXT;
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.dishes ADD COLUMN generated_from_photos INTEGER DEFAULT 0;
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.dishes ADD COLUMN model_file_size INTEGER;
    EXCEPTION WHEN duplicate_column THEN END;

    BEGIN
        ALTER TABLE public.dishes ADD COLUMN polygon_count INTEGER;
    EXCEPTION WHEN duplicate_column THEN END;
END $$;

-- 3. Create model_generations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.model_generations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    task_id TEXT NOT NULL UNIQUE,
    model_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'uploading',
    progress INTEGER DEFAULT 0,
    kiri_task_id TEXT,
    photo_count INTEGER,
    error_message TEXT,
    raw_model_url TEXT,
    cleaned_model_url TEXT,
    dish_id UUID REFERENCES public.dishes(id),
    processing_started_at TIMESTAMP WITH TIME ZONE,
    processing_completed_at TIMESTAMP WITH TIME ZONE,
    total_processing_time INTEGER
);

-- 4. Enable RLS (safe to run multiple times)
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_generations ENABLE ROW LEVEL SECURITY;

-- 5. Reset Policies (Drop first to avoid "policy already exists" error)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.dishes;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.dishes;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.dishes;

CREATE POLICY "Enable read access for all users" ON public.dishes FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.dishes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.dishes FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable read access for all users" ON public.model_generations;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.model_generations;

CREATE POLICY "Enable read access for all users" ON public.model_generations FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.model_generations FOR INSERT TO authenticated WITH CHECK (true);

-- 6. Verify setup
SELECT 
    'Dishes Table' as table_name, 
    COUNT(*) as row_count 
FROM public.dishes
UNION ALL
SELECT 
    'Generations Table' as table_name, 
    COUNT(*) as row_count 
FROM public.model_generations;
