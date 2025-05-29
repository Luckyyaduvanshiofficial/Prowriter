-- =====================================================
-- SUPABASE DATABASE SCHEMA FOR AI BLOG WRITER PLATFORM
-- =====================================================
-- Run these commands in your Supabase SQL Editor
-- =====================================================

-- 1. CREATE PROFILES TABLE
-- This extends the auth.users with additional profile information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'admin')),
  articles_generated_today INTEGER DEFAULT 0,
  last_generation_date DATE DEFAULT CURRENT_DATE,
  subscription_id TEXT, -- For Stripe subscription tracking
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREATE ARTICLES TABLE
-- This stores all generated articles with comprehensive metadata
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  meta_description TEXT,
  topic TEXT NOT NULL,
  
  -- Article generation parameters
  model_a TEXT DEFAULT '',
  model_b TEXT DEFAULT '',
  use_case TEXT NOT NULL DEFAULT 'informative',
  article_length TEXT DEFAULT 'medium' CHECK (article_length IN ('short', 'medium', 'long', 'epic')),
  ai_engine TEXT DEFAULT 'qwen' CHECK (ai_engine IN ('qwen', 'llama', 'deepseek', 'gemini')),
  
  -- SEO and targeting
  seo_keywords TEXT DEFAULT '',
  target_audience TEXT DEFAULT '',
  brand_voice TEXT DEFAULT 'friendly' CHECK (brand_voice IN ('professional', 'friendly', 'technical', 'casual', 'journalistic')),
  
  -- Premium features
  used_web_search BOOLEAN DEFAULT FALSE,
  used_serp_analysis BOOLEAN DEFAULT FALSE,
  
  -- Content metadata
  word_count INTEGER,
  estimated_reading_time INTEGER, -- in minutes
  
  -- Status and publishing
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREATE ARTICLE OUTLINES TABLE
-- This stores generated outlines for articles
CREATE TABLE IF NOT EXISTS public.article_outlines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  outline_content TEXT NOT NULL,
  topic TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'informative',
  seo_keywords TEXT DEFAULT '',
  target_audience TEXT DEFAULT '',
  ai_engine TEXT DEFAULT 'qwen',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CREATE USAGE TRACKING TABLE
-- This tracks daily usage for plan enforcement
CREATE TABLE IF NOT EXISTS public.usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  articles_generated INTEGER DEFAULT 0,
  outlines_generated INTEGER DEFAULT 0,
  api_calls_made INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, date)
);

-- 5. CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_articles_user_id ON public.articles(user_id);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_use_case ON public.articles(use_case);
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON public.profiles(plan);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_date ON public.usage_tracking(user_id, date);

-- 6. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_outlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- 7. CREATE RLS POLICIES FOR PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 8. CREATE RLS POLICIES FOR ARTICLES
CREATE POLICY "Users can view own articles" ON public.articles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own articles" ON public.articles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own articles" ON public.articles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own articles" ON public.articles
  FOR DELETE USING (auth.uid() = user_id);

-- 9. CREATE RLS POLICIES FOR ARTICLE OUTLINES
CREATE POLICY "Users can view own outlines" ON public.article_outlines
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own outlines" ON public.article_outlines
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own outlines" ON public.article_outlines
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own outlines" ON public.article_outlines
  FOR DELETE USING (auth.uid() = user_id);

-- 10. CREATE RLS POLICIES FOR USAGE TRACKING
CREATE POLICY "Users can view own usage" ON public.usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage" ON public.usage_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage" ON public.usage_tracking
  FOR UPDATE USING (auth.uid() = user_id);

-- 11. CREATE FUNCTIONS FOR AUTOMATIC PROFILE CREATION
-- This function automatically creates a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. CREATE TRIGGER FOR AUTOMATIC PROFILE CREATION
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 13. CREATE FUNCTION TO UPDATE DAILY USAGE
CREATE OR REPLACE FUNCTION public.increment_daily_usage(user_uuid UUID, usage_type TEXT DEFAULT 'articles')
RETURNS VOID AS $$
BEGIN
  -- Update or insert usage tracking for today
  INSERT INTO public.usage_tracking (user_id, date, articles_generated, outlines_generated, api_calls_made)
  VALUES (
    user_uuid, 
    CURRENT_DATE,
    CASE WHEN usage_type = 'articles' THEN 1 ELSE 0 END,
    CASE WHEN usage_type = 'outlines' THEN 1 ELSE 0 END,
    1
  )
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    articles_generated = usage_tracking.articles_generated + CASE WHEN usage_type = 'articles' THEN 1 ELSE 0 END,
    outlines_generated = usage_tracking.outlines_generated + CASE WHEN usage_type = 'outlines' THEN 1 ELSE 0 END,
    api_calls_made = usage_tracking.api_calls_made + 1;

  -- Also update the profiles table for quick access
  UPDATE public.profiles 
  SET 
    articles_generated_today = CASE 
      WHEN last_generation_date = CURRENT_DATE THEN articles_generated_today + CASE WHEN usage_type = 'articles' THEN 1 ELSE 0 END
      ELSE CASE WHEN usage_type = 'articles' THEN 1 ELSE 0 END
    END,
    last_generation_date = CURRENT_DATE,
    updated_at = NOW()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. CREATE FUNCTION TO RESET DAILY COUNTERS
CREATE OR REPLACE FUNCTION public.reset_daily_counters()
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles 
  SET articles_generated_today = 0
  WHERE last_generation_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. CREATE FUNCTION TO GET USER USAGE STATS
CREATE OR REPLACE FUNCTION public.get_user_usage_stats(user_uuid UUID)
RETURNS TABLE(
  articles_today INTEGER,
  articles_this_month INTEGER,
  articles_total INTEGER,
  plan TEXT,
  daily_limit INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(p.articles_generated_today, 0)::INTEGER as articles_today,
    COALESCE(monthly.monthly_count, 0)::INTEGER as articles_this_month,
    COALESCE(total.total_count, 0)::INTEGER as articles_total,
    p.plan,
    CASE 
      WHEN p.plan = 'free' THEN 5
      WHEN p.plan = 'pro' THEN 25
      WHEN p.plan = 'admin' THEN 999
      ELSE 5
    END::INTEGER as daily_limit
  FROM public.profiles p
  LEFT JOIN (
    SELECT user_id, COUNT(*) as monthly_count
    FROM public.articles
    WHERE created_at >= date_trunc('month', CURRENT_DATE)
    AND user_id = user_uuid
    GROUP BY user_id
  ) monthly ON p.id = monthly.user_id
  LEFT JOIN (
    SELECT user_id, COUNT(*) as total_count
    FROM public.articles
    WHERE user_id = user_uuid
    GROUP BY user_id
  ) total ON p.id = total.user_id
  WHERE p.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16. INSERT SAMPLE DATA (OPTIONAL - for testing)
-- Uncomment these lines if you want to test with sample data

/*
-- Sample profile (replace with your actual user ID from auth.users)
INSERT INTO public.profiles (id, email, full_name, plan) 
VALUES ('00000000-0000-0000-0000-000000000000', 'demo@rankllms.com', 'Demo User', 'pro')
ON CONFLICT (id) DO NOTHING;

-- Sample article
INSERT INTO public.articles (user_id, title, content, topic, use_case, ai_engine, seo_keywords, word_count)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Sample AI Blog Article',
  '<h1>Sample Article</h1><p>This is a sample article generated by our AI Blog Writer.</p>',
  'AI Content Generation',
  'informative',
  'qwen',
  'AI, content generation, blog writing',
  150
) ON CONFLICT DO NOTHING;
*/

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
-- Tables created successfully! Your AI Blog Writer platform database is ready.
-- 
-- Next steps:
-- 1. Run this entire script in your Supabase SQL Editor
-- 2. Verify all tables are created in the Database > Tables section
-- 3. Test the RLS policies by signing up a new user
-- 4. Your application should now be able to save and retrieve articles
-- =====================================================
