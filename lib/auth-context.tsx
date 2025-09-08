'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { UserWithProfile } from '@/lib/auth'

interface AuthContextType {
  user: UserWithProfile | null
  isLoaded: boolean
  isSignedIn: boolean
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserWithProfile | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loading, setLoading] = useState(true)

  const isSignedIn = !!user

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      setUser(null)
    } finally {
      setIsLoaded(true)
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      window.location.href = '/sign-in'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const value: AuthContextType = {
    user,
    isLoaded,
    isSignedIn,
    signOut,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Compatibility hook for Clerk migration
export function useUser() {
  const { user, isLoaded, isSignedIn } = useAuth()
  
  return {
    user: user ? {
      id: user.id,
      emailAddresses: [{ emailAddress: user.email }],
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      imageUrl: '', // Add avatar support later if needed
      publicMetadata: {
        plan: user.profile.plan,
        articlesGeneratedToday: user.profile.articlesGeneratedToday
      }
    } : null,
    isLoaded,
    isSignedIn
  }
}

// Compatibility hook for Clerk auth
export function useClerk() {
  const { signOut } = useAuth()
  
  return {
    signOut
  }
}