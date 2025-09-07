-- =====================================================
-- NEON DATABASE SCHEMA FOR PROWRITER AI PLATFORM
-- =====================================================
-- Run these commands in your Neon SQL Editor or via CLI
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CREATE USERS TABLE
-- This is the main authentication table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREATE PROFILES TABLE
-- This extends the users with additional profile information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
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

-- 3. CREATE ARTICLES TABLE
-- This stores all generated articles with comprehensive metadata
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
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

-- 4. CREATE ARTICLE OUTLINES TABLE
-- This stores generated outlines for articles
CREATE TABLE IF NOT EXISTS article_outlines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  outline_content TEXT NOT NULL,
  topic TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'informative',
  seo_keywords TEXT DEFAULT '',
  target_audience TEXT DEFAULT '',
  ai_engine TEXT DEFAULT 'qwen',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CREATE USAGE TRACKING TABLE
-- This tracks daily usage for plan enforcement
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  articles_generated INTEGER DEFAULT 0,
  outlines_generated INTEGER DEFAULT 0,
  api_calls_made INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, date)
);

-- 6. CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_articles_user_id ON articles(user_id);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_use_case ON articles(use_case);
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON profiles(plan);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_date ON usage_tracking(user_id, date);

-- 7. CREATE FUNCTION FOR AUTOMATIC PROFILE CREATION
-- This function automatically creates a profile when a user signs up
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, CONCAT(COALESCE(NEW.first_name, ''), ' ', COALESCE(NEW.last_name, '')));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. CREATE TRIGGER FOR AUTOMATIC PROFILE CREATION
DROP TRIGGER IF EXISTS on_user_created ON users;
CREATE TRIGGER on_user_created
  AFTER INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- 9. CREATE FUNCTION TO UPDATE TIMESTAMPS
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. CREATE TRIGGERS FOR UPDATING TIMESTAMPS
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 11. CREATE FUNCTION TO RESET DAILY COUNTERS
CREATE OR REPLACE FUNCTION reset_daily_counters()
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET articles_generated_today = 0
  WHERE last_generation_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- 12. CREATE FUNCTION TO GET USER USAGE STATS
CREATE OR REPLACE FUNCTION get_user_usage_stats(user_uuid UUID)
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
  FROM profiles p
  LEFT JOIN (
    SELECT user_id, COUNT(*) as monthly_count
    FROM articles
    WHERE created_at >= date_trunc('month', CURRENT_DATE)
    AND user_id = user_uuid
    GROUP BY user_id
  ) monthly ON p.id = monthly.user_id
  LEFT JOIN (
    SELECT user_id, COUNT(*) as total_count
    FROM articles
    WHERE user_id = user_uuid
    GROUP BY user_id
  ) total ON p.id = total.user_id
  WHERE p.id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
-- Database schema created successfully! Your Prowriter AI platform database is ready.
-- 
-- Next steps:
-- 1. Make sure you have your DATABASE_URL configured in your .env file
-- 2. The application will automatically connect to this database
-- 3. User registration will automatically create profiles
-- 4. Articles and usage tracking will be automatically handled
-- =====================================================