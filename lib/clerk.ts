import { auth, currentUser } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'

/**
 * Get the current authenticated user
 * Use this in server components and API routes
 */
export async function getCurrentUser() {
  try {
    const user = await currentUser()
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Get the current user's ID
 * Use this in server components and API routes
 */
export async function getCurrentUserId() {
  try {
    const { userId } = await auth()
    return userId
  } catch (error) {
    console.error('Error getting current user ID:', error)
    return null
  }
}

/**
 * Check if the user is authenticated
 * Use this in server components and API routes
 */
export async function isAuthenticated() {
  try {
    const { userId } = await auth()
    return !!userId
  } catch (error) {
    console.error('Error checking authentication:', error)
    return false
  }
}

/**
 * Get user metadata
 * Use this to get additional user information
 */
export async function getUserMetadata(userId: string) {
  try {
    const user = await clerkClient().users.getUser(userId)
    return {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
      publicMetadata: user.publicMetadata,
      privateMetadata: user.privateMetadata,
    }
  } catch (error) {
    console.error('Error getting user metadata:', error)
    return null
  }
}

/**
 * Update user metadata
 * Use this to store additional user information
 */
export async function updateUserMetadata(userId: string, metadata: Record<string, any>) {
  try {
    const user = await clerkClient().users.updateUser(userId, {
      publicMetadata: metadata
    })
    return user
  } catch (error) {
    console.error('Error updating user metadata:', error)
    return null
  }
}

/**
 * Types for user data
 */
export type UserProfile = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  fullName: string
  imageUrl: string
  createdAt: Date
  lastSignInAt: Date | null
  publicMetadata: Record<string, any>
  privateMetadata: Record<string, any>
}

/**
 * Hook equivalents for client components
 * Import these from @clerk/nextjs in your client components:
 * 
 * import { useUser, useAuth } from '@clerk/nextjs'
 * 
 * const { user, isLoaded, isSignedIn } = useUser()
 * const { userId, isLoaded: authLoaded, isSignedIn: authSignedIn } = useAuth()
 */
