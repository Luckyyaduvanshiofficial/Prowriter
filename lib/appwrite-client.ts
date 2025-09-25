'use client'

// Appwrite Client Configuration for Frontend
import { Client, Account, Databases } from 'appwrite'

// Get Appwrite configuration from environment variables
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || ''
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || ''

// Only warn about missing configuration in development
if (typeof window !== 'undefined' && (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID)) {
  console.warn('Warning: NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID environment variables should be configured')
}

// Initialize Appwrite Client for Client-side operations
const client = new Client()

// Only configure if environment variables are available
if (APPWRITE_ENDPOINT && APPWRITE_PROJECT_ID) {
  client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
}

// Initialize services for client-side
export const account = new Account(client)
export const databases = new Databases(client)

// Database and Collection IDs (same as server-side)
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'prowriter_db'

export const COLLECTIONS = {
  PROFILES: process.env.NEXT_PUBLIC_APPWRITE_PROFILES_COLLECTION_ID || 'profiles',
  ARTICLES: process.env.NEXT_PUBLIC_APPWRITE_ARTICLES_COLLECTION_ID || 'articles', 
  USAGE_TRACKING: process.env.NEXT_PUBLIC_APPWRITE_USAGE_COLLECTION_ID || 'usage_tracking',
  ARTICLE_OUTLINES: process.env.NEXT_PUBLIC_APPWRITE_OUTLINES_COLLECTION_ID || 'article_outlines'
}

// Client-side authentication helpers
export class AppwriteClientAuth {
  
  /**
   * Sign up a new user
   */
  static async signUp(email: string, password: string, name?: string) {
    try {
      const user = await account.create('unique()', email, password, name)
      
      // Automatically sign in after registration
      const session = await account.createEmailSession(email, password)
      
      return { user, session }
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  /**
   * Sign in existing user
   */
  static async signIn(email: string, password: string) {
    try {
      const session = await account.createEmailSession(email, password)
      const user = await account.get()
      
      return { user, session }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  /**
   * Sign out current user
   */
  static async signOut() {
    try {
      await account.deleteSession('current')
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser() {
    try {
      return await account.get()
    } catch (error) {
      return null
    }
  }

  /**
   * Check authentication status
   */
  static async isAuthenticated() {
    try {
      await account.get()
      return true
    } catch (error) {
      return false
    }
  }
}

// Export client for other uses
export { client }
export default client