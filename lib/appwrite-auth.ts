// Appwrite Authentication for Prowriter AI Platform
import { NextRequest } from 'next/server'
import { account, users, AppwriteQueries } from './appwrite'
import { ID } from 'node-appwrite'

export interface AppwriteUser {
  $id: string
  name: string
  email: string
  emailVerification: boolean
  prefs: any
  $createdAt: string
  $updatedAt: string
}

export interface UserWithProfile extends AppwriteUser {
  profile: {
    plan: 'free' | 'pro' | 'admin'
    articlesGeneratedToday: number
    lastGenerationDate?: string | null
    subscriptionId?: string | null
    subscriptionStatus: 'active' | 'inactive' | 'cancelled' | 'past_due'
  }
}

/**
 * Get current user from request session
 */
export async function getCurrentUser(request: NextRequest): Promise<AppwriteUser | null> {
  try {
    // Get session token from cookie
    const sessionToken = request.cookies.get('session')?.value
    
    if (!sessionToken) {
      return null
    }

    // Set session for this request
    const sessionClient = account.client.setSession(sessionToken)
    const sessionAccount = new (account.constructor as any)(sessionClient)
    
    // Get current user
    const user = await sessionAccount.get()
    return user as AppwriteUser
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Get current user ID from request
 */
export async function getCurrentUserId(request: NextRequest): Promise<string | null> {
  const user = await getCurrentUser(request)
  return user?.$id || null
}

/**
 * Get user with profile information
 */
export async function getCurrentUserWithProfile(request: NextRequest): Promise<UserWithProfile | null> {
  try {
    const user = await getCurrentUser(request)
    if (!user) return null
    
    const profile = await AppwriteQueries.getProfileByUserId(user.$id)
    if (!profile) return null
    
    return {
      ...user,
      profile: {
        plan: profile.plan,
        articlesGeneratedToday: profile.articlesGeneratedToday,
        lastGenerationDate: profile.lastGenerationDate,
        subscriptionId: profile.subscriptionId,
        subscriptionStatus: profile.subscriptionStatus
      }
    }
  } catch (error) {
    console.error('Error getting user with profile:', error)
    return null
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const user = await getCurrentUser(request)
  return !!user
}

/**
 * Create a new user account with Appwrite Auth
 */
export async function registerUser(
  email: string, 
  password: string, 
  name?: string
): Promise<{ user: AppwriteUser; session: any } | { error: string }> {
  try {
    // Create account with Appwrite
    const user = await account.create(
      ID.unique(),
      email,
      password,
      name
    )

    // Create session for the new user
    const session = await account.createEmailSession(email, password)

    // Create user profile in our database
    await AppwriteQueries.createProfile({
      userId: user.$id,
      email: user.email,
      fullName: name || '',
      plan: 'free',
      articlesGeneratedToday: 0,
      subscriptionStatus: 'inactive'
    })

    return {
      user: user as AppwriteUser,
      session
    }
  } catch (error: any) {
    console.error('Error registering user:', error)
    
    // Handle specific Appwrite errors
    if (error.code === 409) {
      return { error: 'User already exists with this email' }
    }
    
    if (error.code === 400) {
      return { error: 'Invalid email or password format' }
    }
    
    return { error: 'Failed to register user' }
  }
}

/**
 * Sign in a user with email and password
 */
export async function signInUser(
  email: string, 
  password: string
): Promise<{ user: AppwriteUser; session: any } | { error: string }> {
  try {
    // Create session
    const session = await account.createEmailSession(email, password)
    
    // Get user details
    const user = await account.get()

    // Ensure user has a profile
    let profile = await AppwriteQueries.getProfileByUserId(user.$id)
    if (!profile) {
      // Create profile if it doesn't exist (for existing users)
      await AppwriteQueries.createProfile({
        userId: user.$id,
        email: user.email,
        fullName: user.name || '',
        plan: 'free',
        articlesGeneratedToday: 0,
        subscriptionStatus: 'inactive'
      })
    }

    return {
      user: user as AppwriteUser,
      session
    }
  } catch (error: any) {
    console.error('Error signing in user:', error)
    
    if (error.code === 401) {
      return { error: 'Invalid email or password' }
    }
    
    return { error: 'Failed to sign in' }
  }
}

/**
 * Sign out the current user
 */
export async function signOutUser(): Promise<void> {
  try {
    await account.deleteSession('current')
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

/**
 * Middleware helper to protect routes
 */
export async function requireAuth(request: NextRequest): Promise<AppwriteUser | Response> {
  const user = await getCurrentUser(request)
  
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  return user
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' }
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' }
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' }
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' }
  }
  
  return { valid: true }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string, resetUrl: string): Promise<void> {
  try {
    await account.createRecovery(email, resetUrl)
  } catch (error) {
    console.error('Error requesting password reset:', error)
    throw error
  }
}

/**
 * Complete password reset
 */
export async function completePasswordReset(
  userId: string, 
  secret: string, 
  password: string, 
  passwordAgain: string
): Promise<void> {
  try {
    await account.updateRecovery(userId, secret, password, passwordAgain)
  } catch (error) {
    console.error('Error completing password reset:', error)
    throw error
  }
}

/**
 * Update user password
 */
export async function updatePassword(
  oldPassword: string,
  newPassword: string
): Promise<void> {
  try {
    await account.updatePassword(newPassword, oldPassword)
  } catch (error) {
    console.error('Error updating password:', error)
    throw error
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  name?: string,
  email?: string
): Promise<AppwriteUser> {
  try {
    let user = await account.get()
    
    if (name && name !== user.name) {
      user = await account.updateName(name)
    }
    
    if (email && email !== user.email) {
      user = await account.updateEmail(email, '') // Password required for email update
    }
    
    return user as AppwriteUser
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}