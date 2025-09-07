import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'
import { DatabaseQueries } from './neon'

// Ensure JWT secret is available
const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET or NEXTAUTH_SECRET environment variable is required')
}

export interface User {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  fullName?: string
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface UserWithProfile extends User {
  profile: {
    plan: 'free' | 'pro' | 'admin'
    articlesGeneratedToday: number
    lastGenerationDate?: string | null
    subscriptionId?: string | null
    subscriptionStatus: 'active' | 'inactive' | 'cancelled' | 'past_due'
  }
}

export interface AuthTokenPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(userId: string, email: string): string {
  const payload: AuthTokenPayload = {
    userId,
    email
  }
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d' // Token expires in 7 days
  })
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload
    return decoded
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

/**
 * Get the current user from request headers
 */
export async function getCurrentUser(request: NextRequest): Promise<User | null> {
  try {
    // Check for Authorization header
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const payload = verifyToken(token)
      
      if (payload) {
        const user = await DatabaseQueries.getUserById(payload.userId)
        if (user) {
          return {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            fullName: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : null,
            emailVerified: user.email_verified,
            createdAt: user.created_at,
            updatedAt: user.updated_at
          }
        }
      }
    }
    
    // Check for session cookie
    const sessionToken = request.cookies.get('session-token')?.value
    if (sessionToken) {
      const payload = verifyToken(sessionToken)
      
      if (payload) {
        const user = await DatabaseQueries.getUserById(payload.userId)
        if (user) {
          return {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            fullName: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : null,
            emailVerified: user.email_verified,
            createdAt: user.created_at,
            updatedAt: user.updated_at
          }
        }
      }
    }
    
    return null
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
  return user?.id || null
}

/**
 * Get user with profile information
 */
export async function getCurrentUserWithProfile(request: NextRequest): Promise<UserWithProfile | null> {
  try {
    const user = await getCurrentUser(request)
    if (!user) return null
    
    const profile = await DatabaseQueries.getUserProfile(user.id)
    if (!profile) return null
    
    return {
      ...user,
      profile: {
        plan: profile.plan,
        articlesGeneratedToday: profile.articles_generated_today,
        lastGenerationDate: profile.last_generation_date,
        subscriptionId: profile.subscription_id,
        subscriptionStatus: profile.subscription_status
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
 * Register a new user
 */
export async function registerUser(
  email: string, 
  password: string, 
  firstName?: string, 
  lastName?: string
): Promise<{ user: User; token: string } | { error: string }> {
  try {
    // Check if user already exists
    const existingUser = await DatabaseQueries.getUserByEmail(email)
    if (existingUser) {
      return { error: 'User already exists with this email' }
    }
    
    // Hash password
    const passwordHash = await hashPassword(password)
    
    // Create user
    const userId = await DatabaseQueries.createUser(email, passwordHash, firstName, lastName)
    
    // Get the created user
    const user = await DatabaseQueries.getUserById(userId)
    if (!user) {
      return { error: 'Failed to create user' }
    }
    
    // Generate token
    const token = generateToken(userId, email)
    
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        fullName: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : null,
        emailVerified: user.email_verified,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      },
      token
    }
  } catch (error) {
    console.error('Error registering user:', error)
    return { error: 'Failed to register user' }
  }
}

/**
 * Sign in a user
 */
export async function signInUser(
  email: string, 
  password: string
): Promise<{ user: User; token: string } | { error: string }> {
  try {
    // Get user by email
    const user = await DatabaseQueries.getUserByEmail(email)
    if (!user) {
      return { error: 'Invalid email or password' }
    }
    
    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return { error: 'Invalid email or password' }
    }
    
    // Generate token
    const token = generateToken(user.id, user.email)
    
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        fullName: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : null,
        emailVerified: user.email_verified,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      },
      token
    }
  } catch (error) {
    console.error('Error signing in user:', error)
    return { error: 'Failed to sign in' }
  }
}

/**
 * Middleware helper to protect routes
 */
export async function requireAuth(request: NextRequest): Promise<User | Response> {
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