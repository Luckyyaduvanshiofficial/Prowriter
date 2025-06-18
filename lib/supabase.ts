import { createClient } from '@supabase/supabase-js'

// Fallback values for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://localhost:3000'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key'

// Create a mock client when environment variables are not configured
const createSupabaseClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('⚠️ Supabase environment variables not configured. Using mock client.')
    
    // Return a mock client that doesn't make network requests
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      },
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: new Error('Supabase not configured') }),
        update: () => ({ data: null, error: new Error('Supabase not configured') }),
        delete: () => ({ data: null, error: new Error('Supabase not configured') })
      })
    } as any
  }
  
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()

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
          meta_description: string
          model_a: string
          model_b: string
          use_case: string
          article_length: string
          ai_engine: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          meta_description: string
          model_a: string
          model_b: string
          use_case: string
          article_length: string
          ai_engine: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          meta_description?: string
          model_a?: string
          model_b?: string
          use_case?: string
          article_length?: string
          ai_engine?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
