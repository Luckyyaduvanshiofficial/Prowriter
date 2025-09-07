import { neon } from '@neondatabase/serverless'

// Ensure environment variables are available
const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL or NEON_DATABASE_URL environment variable is required')
}

// Create the database connection
export const sql = neon(databaseUrl)

// Database types based on our schema
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          plan: 'free' | 'pro' | 'admin'
          articles_generated_today: number
          last_generation_date: string | null
          subscription_id: string | null
          subscription_status: 'active' | 'inactive' | 'cancelled' | 'past_due'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          plan?: 'free' | 'pro' | 'admin'
          articles_generated_today?: number
          last_generation_date?: string | null
          subscription_id?: string | null
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'past_due'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          plan?: 'free' | 'pro' | 'admin'
          articles_generated_today?: number
          last_generation_date?: string | null
          subscription_id?: string | null
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'past_due'
          created_at?: string
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          meta_description: string | null
          topic: string
          model_a: string
          model_b: string
          use_case: string
          article_length: 'short' | 'medium' | 'long' | 'epic'
          ai_engine: 'qwen' | 'llama' | 'deepseek' | 'gemini'
          seo_keywords: string | null
          target_audience: string | null
          brand_voice: 'professional' | 'friendly' | 'technical' | 'casual' | 'journalistic'
          used_web_search: boolean
          used_serp_analysis: boolean
          word_count: number | null
          estimated_reading_time: number | null
          status: 'draft' | 'published' | 'archived'
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          meta_description?: string | null
          topic: string
          model_a?: string
          model_b?: string
          use_case?: string
          article_length?: 'short' | 'medium' | 'long' | 'epic'
          ai_engine?: 'qwen' | 'llama' | 'deepseek' | 'gemini'
          seo_keywords?: string | null
          target_audience?: string | null
          brand_voice?: 'professional' | 'friendly' | 'technical' | 'casual' | 'journalistic'
          used_web_search?: boolean
          used_serp_analysis?: boolean
          word_count?: number | null
          estimated_reading_time?: number | null
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          meta_description?: string | null
          topic?: string
          model_a?: string
          model_b?: string
          use_case?: string
          article_length?: 'short' | 'medium' | 'long' | 'epic'
          ai_engine?: 'qwen' | 'llama' | 'deepseek' | 'gemini'
          seo_keywords?: string | null
          target_audience?: string | null
          brand_voice?: 'professional' | 'friendly' | 'technical' | 'casual' | 'journalistic'
          used_web_search?: boolean
          used_serp_analysis?: boolean
          word_count?: number | null
          estimated_reading_time?: number | null
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      article_outlines: {
        Row: {
          id: string
          user_id: string
          article_id: string | null
          title: string
          outline_content: string
          topic: string
          content_type: string
          seo_keywords: string | null
          target_audience: string | null
          ai_engine: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          article_id?: string | null
          title: string
          outline_content: string
          topic: string
          content_type?: string
          seo_keywords?: string | null
          target_audience?: string | null
          ai_engine?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          article_id?: string | null
          title?: string
          outline_content?: string
          topic?: string
          content_type?: string
          seo_keywords?: string | null
          target_audience?: string | null
          ai_engine?: string
          created_at?: string
        }
      }
      usage_tracking: {
        Row: {
          id: string
          user_id: string
          date: string
          articles_generated: number
          outlines_generated: number
          api_calls_made: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date?: string
          articles_generated?: number
          outlines_generated?: number
          api_calls_made?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          articles_generated?: number
          outlines_generated?: number
          api_calls_made?: number
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          first_name: string | null
          last_name: string | null
          email_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          first_name?: string | null
          last_name?: string | null
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          first_name?: string | null
          last_name?: string | null
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Helper functions for common database operations
export class DatabaseQueries {
  // User operations
  static async createUser(email: string, passwordHash: string, firstName?: string, lastName?: string) {
    const userId = crypto.randomUUID()
    
    // Create user
    await sql`
      INSERT INTO users (id, email, password_hash, first_name, last_name)
      VALUES (${userId}, ${email}, ${passwordHash}, ${firstName || null}, ${lastName || null})
    `
    
    // Create profile
    await sql`
      INSERT INTO profiles (id, email, full_name)
      VALUES (${userId}, ${email}, ${firstName && lastName ? `${firstName} ${lastName}` : null})
    `
    
    return userId
  }
  
  static async getUserByEmail(email: string) {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email} LIMIT 1
    `
    return result[0] || null
  }
  
  static async getUserById(id: string) {
    const result = await sql`
      SELECT * FROM users WHERE id = ${id} LIMIT 1
    `
    return result[0] || null
  }
  
  static async getUserProfile(userId: string) {
    const result = await sql`
      SELECT * FROM profiles WHERE id = ${userId} LIMIT 1
    `
    return result[0] || null
  }
  
  // Article operations
  static async createArticle(article: Database['public']['Tables']['articles']['Insert']) {
    const articleId = article.id || crypto.randomUUID()
    const now = new Date().toISOString()
    
    await sql`
      INSERT INTO articles (
        id, user_id, title, content, meta_description, topic,
        model_a, model_b, use_case, article_length, ai_engine,
        seo_keywords, target_audience, brand_voice, used_web_search,
        used_serp_analysis, word_count, estimated_reading_time,
        status, created_at, updated_at
      ) VALUES (
        ${articleId}, ${article.user_id}, ${article.title}, ${article.content},
        ${article.meta_description || null}, ${article.topic},
        ${article.model_a || ''}, ${article.model_b || ''}, ${article.use_case || 'informative'},
        ${article.article_length || 'medium'}, ${article.ai_engine || 'qwen'},
        ${article.seo_keywords || null}, ${article.target_audience || null},
        ${article.brand_voice || 'friendly'}, ${article.used_web_search || false},
        ${article.used_serp_analysis || false}, ${article.word_count || null},
        ${article.estimated_reading_time || null}, ${article.status || 'draft'},
        ${article.created_at || now}, ${article.updated_at || now}
      )
    `
    
    return articleId
  }
  
  static async getArticlesByUser(userId: string, limit = 10, offset = 0) {
    const result = await sql`
      SELECT * FROM articles 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `
    return result
  }
  
  static async deleteArticle(articleId: string, userId: string) {
    await sql`
      DELETE FROM articles 
      WHERE id = ${articleId} AND user_id = ${userId}
    `
  }
  
  // Usage tracking
  static async incrementUsage(userId: string, type: 'articles' | 'outlines' = 'articles') {
    const today = new Date().toISOString().split('T')[0]
    
    await sql`
      INSERT INTO usage_tracking (user_id, date, articles_generated, outlines_generated, api_calls_made)
      VALUES (
        ${userId}, 
        ${today},
        ${type === 'articles' ? 1 : 0},
        ${type === 'outlines' ? 1 : 0},
        1
      )
      ON CONFLICT (user_id, date)
      DO UPDATE SET
        articles_generated = usage_tracking.articles_generated + ${type === 'articles' ? 1 : 0},
        outlines_generated = usage_tracking.outlines_generated + ${type === 'outlines' ? 1 : 0},
        api_calls_made = usage_tracking.api_calls_made + 1
    `
    
    // Update profile daily counter
    await sql`
      UPDATE profiles 
      SET 
        articles_generated_today = CASE 
          WHEN last_generation_date = ${today} THEN articles_generated_today + ${type === 'articles' ? 1 : 0}
          ELSE ${type === 'articles' ? 1 : 0}
        END,
        last_generation_date = ${today},
        updated_at = NOW()
      WHERE id = ${userId}
    `
  }
  
  static async getUserUsageStats(userId: string) {
    const today = new Date().toISOString().split('T')[0]
    const thisMonth = new Date().toISOString().slice(0, 7) + '-01'
    
    const profile = await sql`
      SELECT articles_generated_today, plan FROM profiles WHERE id = ${userId}
    `
    
    const monthlyUsage = await sql`
      SELECT COUNT(*) as count FROM articles 
      WHERE user_id = ${userId} AND created_at >= ${thisMonth}
    `
    
    const totalUsage = await sql`
      SELECT COUNT(*) as count FROM articles 
      WHERE user_id = ${userId}
    `
    
    const userProfile = profile[0] || { articles_generated_today: 0, plan: 'free' }
    const dailyLimit = userProfile.plan === 'free' ? 5 : userProfile.plan === 'pro' ? 25 : 999
    
    return {
      articles_today: userProfile.articles_generated_today,
      articles_this_month: parseInt(monthlyUsage[0]?.count || '0'),
      articles_total: parseInt(totalUsage[0]?.count || '0'),
      plan: userProfile.plan,
      daily_limit: dailyLimit
    }
  }
}