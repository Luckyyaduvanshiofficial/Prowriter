// Appwrite Configuration for Prowriter AI Platform
import { Client, Account, Databases, Users, Query, ID } from 'node-appwrite'

// Appwrite configuration
const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || ''
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || ''
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || ''

// Only validate environment variables during runtime, not build time
const isBuilding = process.env.NODE_ENV === 'development' && !process.env.APPWRITE_ENDPOINT
if (!isBuilding && (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID)) {
  console.warn('Warning: APPWRITE_ENDPOINT and APPWRITE_PROJECT_ID environment variables should be configured for full functionality')
}

// Initialize Appwrite Client for Server-side operations
const client = new Client()

// Only set endpoint and project if available
if (APPWRITE_ENDPOINT && APPWRITE_PROJECT_ID) {
  client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)

  // Add API key for server-side operations (admin access)
  if (APPWRITE_API_KEY) {
    client.setKey(APPWRITE_API_KEY)
  }
}

// Initialize services
export const account = new Account(client)
export const databases = new Databases(client) 
export const users = new Users(client)

// Database and Collection IDs
export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'prowriter_db'

export const COLLECTIONS = {
  PROFILES: process.env.APPWRITE_PROFILES_COLLECTION_ID || 'profiles',
  ARTICLES: process.env.APPWRITE_ARTICLES_COLLECTION_ID || 'articles', 
  USAGE_TRACKING: process.env.APPWRITE_USAGE_COLLECTION_ID || 'usage_tracking',
  ARTICLE_OUTLINES: process.env.APPWRITE_OUTLINES_COLLECTION_ID || 'article_outlines'
}

// Types based on current Neon schema, adapted for Appwrite
export interface AppwriteProfile {
  $id?: string
  userId: string // Reference to Appwrite Auth user ID
  email: string
  fullName?: string
  avatarUrl?: string
  plan: 'free' | 'pro' | 'admin'
  articlesGeneratedToday: number
  lastGenerationDate?: string
  subscriptionId?: string
  subscriptionStatus: 'active' | 'inactive' | 'cancelled' | 'past_due'
  $createdAt?: string
  $updatedAt?: string
}

export interface AppwriteArticle {
  $id?: string
  userId: string // Reference to Appwrite Auth user ID
  title: string
  content: string
  metaDescription?: string
  topic: string
  modelA?: string
  modelB?: string
  useCase: string
  articleLength: string
  aiEngine: string
  seoKeywords?: string
  targetAudience?: string
  brandVoice: string
  usedWebSearch: boolean
  usedSerpAnalysis: boolean
  wordCount?: number
  estimatedReadingTime?: number
  status: 'draft' | 'published' | 'archived'
  publishedAt?: string
  $createdAt?: string
  $updatedAt?: string
}

export interface AppwriteUsageTracking {
  $id?: string
  userId: string // Reference to Appwrite Auth user ID
  date: string
  articlesGenerated: number
  outlinesGenerated: number
  apiCallsMade: number
  $createdAt?: string
}

export interface AppwriteArticleOutline {
  $id?: string
  userId: string // Reference to Appwrite Auth user ID
  articleId?: string
  title: string
  outlineContent: string
  topic: string
  contentType: string
  seoKeywords?: string
  targetAudience?: string
  aiEngine: string
  $createdAt?: string
}

// Appwrite Database Operations Class
export class AppwriteQueries {
  
  // Profile operations
  static async createProfile(profile: Omit<AppwriteProfile, '$id' | '$createdAt' | '$updatedAt'>): Promise<string> {
    try {
      const result = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.PROFILES,
        ID.unique(),
        profile
      )
      return result.$id
    } catch (error) {
      console.error('Error creating profile:', error)
      throw error
    }
  }

  static async getProfileByUserId(userId: string): Promise<AppwriteProfile | null> {
    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PROFILES,
        [Query.equal('userId', userId), Query.limit(1)]
      )
      return result.documents[0] as AppwriteProfile || null
    } catch (error) {
      console.error('Error getting profile:', error)
      return null
    }
  }

  static async updateProfile(profileId: string, updates: Partial<AppwriteProfile>): Promise<void> {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.PROFILES,
        profileId,
        updates
      )
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  // Article operations
  static async createArticle(article: Omit<AppwriteArticle, '$id' | '$createdAt' | '$updatedAt'>): Promise<string> {
    try {
      const result = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.ARTICLES,
        ID.unique(),
        article
      )
      return result.$id
    } catch (error) {
      console.error('Error creating article:', error)
      throw error
    }
  }

  static async getArticlesByUser(userId: string, limit = 10, offset = 0): Promise<AppwriteArticle[]> {
    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ARTICLES,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      )
      return result.documents as AppwriteArticle[]
    } catch (error) {
      console.error('Error getting articles:', error)
      return []
    }
  }

  static async deleteArticle(articleId: string, userId: string): Promise<void> {
    try {
      // First verify the article belongs to the user
      const article = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.ARTICLES,
        articleId
      ) as AppwriteArticle

      if (article.userId !== userId) {
        throw new Error('Unauthorized: Article does not belong to user')
      }

      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.ARTICLES,
        articleId
      )
    } catch (error) {
      console.error('Error deleting article:', error)
      throw error
    }
  }

  // Usage tracking operations
  static async incrementUsage(userId: string, type: 'articles' | 'outlines' = 'articles'): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Try to get existing usage record for today
      const existingUsage = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USAGE_TRACKING,
        [
          Query.equal('userId', userId),
          Query.equal('date', today),
          Query.limit(1)
        ]
      )

      if (existingUsage.documents.length > 0) {
        // Update existing record
        const usage = existingUsage.documents[0] as AppwriteUsageTracking
        const updates: Partial<AppwriteUsageTracking> = {
          apiCallsMade: usage.apiCallsMade + 1
        }
        
        if (type === 'articles') {
          updates.articlesGenerated = usage.articlesGenerated + 1
        } else {
          updates.outlinesGenerated = usage.outlinesGenerated + 1
        }

        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.USAGE_TRACKING,
          usage.$id!,
          updates
        )
      } else {
        // Create new record
        const newUsage: Omit<AppwriteUsageTracking, '$id' | '$createdAt'> = {
          userId,
          date: today,
          articlesGenerated: type === 'articles' ? 1 : 0,
          outlinesGenerated: type === 'outlines' ? 1 : 0,
          apiCallsMade: 1
        }

        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.USAGE_TRACKING,
          ID.unique(),
          newUsage
        )
      }

      // Also update profile for quick access
      const profile = await this.getProfileByUserId(userId)
      if (profile) {
        const updates: Partial<AppwriteProfile> = {
          lastGenerationDate: today
        }

        if (type === 'articles') {
          // Reset daily count if it's a new day, otherwise increment
          if (profile.lastGenerationDate === today) {
            updates.articlesGeneratedToday = profile.articlesGeneratedToday + 1
          } else {
            updates.articlesGeneratedToday = 1
          }
        }

        await this.updateProfile(profile.$id!, updates)
      }
    } catch (error) {
      console.error('Error incrementing usage:', error)
      throw error
    }
  }

  static async getUserUsageStats(userId: string): Promise<{
    articles_today: number
    articles_this_month: number
    articles_total: number
    plan: 'free' | 'pro' | 'admin'
    daily_limit: number
  }> {
    try {
      const profile = await this.getProfileByUserId(userId)
      if (!profile) {
        throw new Error('Profile not found')
      }

      // Get monthly usage
      const currentMonth = new Date().toISOString().substring(0, 7) // YYYY-MM format
      const monthlyUsage = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USAGE_TRACKING,
        [
          Query.equal('userId', userId),
          Query.greaterThanEqual('date', `${currentMonth}-01`),
          Query.lessThanEqual('date', `${currentMonth}-31`)
        ]
      )

      // Calculate total articles this month
      const articlesThisMonth = monthlyUsage.documents.reduce(
        (total, doc) => total + (doc as AppwriteUsageTracking).articlesGenerated,
        0
      )

      // Get total articles count
      const totalArticles = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ARTICLES,
        [Query.equal('userId', userId)]
      )

      // Determine daily limits based on plan
      const dailyLimit = profile.plan === 'free' ? 5 : profile.plan === 'pro' ? 100 : 1000

      return {
        articles_today: profile.articlesGeneratedToday,
        articles_this_month: articlesThisMonth,
        articles_total: totalArticles.total,
        plan: profile.plan,
        daily_limit: dailyLimit
      }
    } catch (error) {
      console.error('Error getting usage stats:', error)
      throw error
    }
  }
}

// Export client for other uses
export { client }
export default client