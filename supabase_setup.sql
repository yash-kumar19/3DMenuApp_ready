-- ============================================
-- Supabase Database Setup for 3D Menu App
-- ============================================
-- Run this in your Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query → Paste & Run)
-- ============================================

-- 1. Create dishes table
CREATE TABLE public.dishes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Basic Info
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    
    -- 3D Model Info
    model_url TEXT NOT NULL,
    thumbnail_url TEXT,
    model_file_size INTEGER,
    polygon_count INTEGER,
    
    -- Generation Metadata
    generation_status TEXT DEFAULT 'ready',
    kiri_task_id TEXT,
    generated_from_photos INTEGER DEFAULT 0,
    
    -- Display Settings
    is_active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0
);

-- 2. Create indexes for faster queries
CREATE INDEX idx_dishes_category ON public.dishes(category);
CREATE INDEX idx_dishes_active ON public.dishes(is_active);
CREATE INDEX idx_dishes_featured ON public.dishes(featured);

-- 3. Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.dishes
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- 4. Create model_generations table (for tracking processing)
CREATE TABLE public.model_generations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Task Info
    task_id TEXT NOT NULL UNIQUE,
    model_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'uploading',
    progress INTEGER DEFAULT 0,
    
    -- Processing Details
    kiri_task_id TEXT,
    photo_count INTEGER,
    error_message TEXT,
    
    -- Results
    raw_model_url TEXT,
    cleaned_model_url TEXT,
    dish_id UUID REFERENCES public.dishes(id),
    
    -- Metadata
    processing_started_at TIMESTAMP WITH TIME ZONE,
    processing_completed_at TIMESTAMP WITH TIME ZONE,
    total_processing_time INTEGER -- seconds
);

-- 5. Create indexes for model_generations
CREATE INDEX idx_generations_status ON public.model_generations(status);
CREATE INDEX idx_generations_task_id ON public.model_generations(task_id);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_generations ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS Policies for dishes table
CREATE POLICY "Enable read access for all users" ON public.dishes
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.dishes
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON public.dishes
    FOR UPDATE TO authenticated USING (true);

-- 8. Create RLS Policies for model_generations table
CREATE POLICY "Enable read access for all users" ON public.model_generations
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.model_generations
    FOR INSERT TO authenticated WITH CHECK (true);

-- 9. Insert sample data for testing
INSERT INTO public.dishes (name, description, price, category, model_url, thumbnail_url)
VALUES (
    'Sample Gourmet Burger',
    'A delicious wagyu burger with premium toppings',
    12.99,
    'Burgers',
    'https://storage.googleapis.com/kiri-engine/sample-burger.glb',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
);

-- 10. Verify setup
SELECT 
    'Dishes Table' as table_name, 
    COUNT(*) as row_count 
FROM public.dishes
UNION ALL
SELECT 
    'Generations Table' as table_name, 
    COUNT(*) as row_count 
FROM public.model_generations;

-- Success! You should see:
-- Dishes Table | 1
-- Generations Table | 0
