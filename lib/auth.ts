import { account, serverDatabases, DATABASE_ID, COLLECTIONS } from './appwrite'
import { ID, Query } from 'appwrite'
export interface User {
  id: string
  email: string
  name?: string
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}
export async function signUp(email: string, password: string, name?: string) {
  try {
    // Check if user already exists by trying to create account
    const user = await account.create(ID.unique(), email, password, name)
    
    // Create session
    await account.createEmailPasswordSession(email, password)
    
    // Create user profile (with error handling for duplicates)
    await createUserProfile(user.$id, email, name)
    
    return { success: true, user }
  } catch (error: any) {
    // Handle specific Appwrite errors
    if (error.code === 409) {
      return { success: false, error: 'An account with this email already exists' }
    }
    if (error.code === 429) {
      return { success: false, error: 'Too many requests. Please wait a moment and try again.' }
    }
    return { success: false, error: error.message || 'Failed to create account' }
  }
}
export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password)
    return { success: true, session }
  } catch (error: any) {
    // Handle specific Appwrite errors
    if (error.code === 401) {
      return { success: false, error: 'Invalid email or password' }
    }
    if (error.code === 429) {
      return { success: false, error: 'Too many login attempts. Please wait a moment and try again.' }
    }
    return { success: false, error: error.message || 'Failed to sign in' }
  }
}
export async function signOut() {
  try {
    await account.deleteSession('current')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
export async function getCurrentUser(): Promise<User | null> {
  try {
    console.log('🔍 getCurrentUser: Calling account.get()...')
    const user = await account.get()
    console.log('✅ getCurrentUser: Success!', { id: user.$id, email: user.email })
    return {
      id: user.$id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerification,
      createdAt: user.$createdAt,
      updatedAt: user.$updatedAt,
    }
  } catch (error: any) {
    console.log('❌ getCurrentUser: Failed', { code: error?.code, message: error?.message })
    return null
  }
}

export async function getCurrentUserId(request?: Request): Promise<string | null> {
  try {
    const user = await getCurrentUser()
    return user?.id || null
  } catch (error) {
    return null
  }
}
async function createUserProfile(userId: string, email: string, name?: string) {
  try {
    // Check if profile already exists to avoid duplicates
    const existing = await getUserProfile(userId)
    if (existing) {
      console.log('Profile already exists for user:', userId)
      return
    }
    
    await serverDatabases.createDocument(DATABASE_ID, COLLECTIONS.USERS, ID.unique(), {
      userId,
      email,
      name: name || '',
      plan: 'free',
      articlesGeneratedToday: 0,
      subscriptionStatus: 'inactive',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  } catch (error: any) {
    // Only log if it's not a duplicate error
    if (error.code !== 409) {
      console.error('Create profile error:', error)
    }
  }
}
export async function getUserProfile(userId: string) {
  try {
    // Add timeout protection
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database query timeout')), 10000)
    )
    
    const queryPromise = serverDatabases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS,
      [Query.equal('userId', userId), Query.limit(1)]
    )
    
    const response = await Promise.race([queryPromise, timeoutPromise]) as any
    
    if (!response || !response.documents || response.documents.length === 0) {
      return null
    }
    
    // Return only essential fields to prevent memory issues
    const doc = response.documents[0]
    return {
      $id: doc.$id,
      userId: doc.userId,
      email: doc.email || '',
      name: doc.name || '',
      plan: doc.plan || 'free',
      articlesGeneratedToday: doc.articlesGeneratedToday || 0,
      subscriptionStatus: doc.subscriptionStatus || 'inactive',
      createdAt: doc.createdAt || doc.$createdAt,
      updatedAt: doc.updatedAt || doc.$updatedAt,
      lastGenerationDate: doc.lastGenerationDate || null
    }
  } catch (error: any) {
    console.error('getUserProfile error:', error?.message || error)
    return null
  }
}
export async function updateUserProfile(userId: string, data: any) {
  try {
    const profile = await getUserProfile(userId)
    if (!profile) return { success: false, error: 'Profile not found' }
    await serverDatabases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      profile.$id,
      { ...data, updatedAt: new Date().toISOString() }
    )
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
