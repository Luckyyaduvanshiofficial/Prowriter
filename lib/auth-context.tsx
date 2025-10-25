'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getCurrentUser, signOut as appwriteSignOut, User } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  isLoaded: boolean
  isSignedIn: boolean
  signOut: () => Promise<void>
  loading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loading, setLoading] = useState(true)

  const isSignedIn = !!user

  const fetchUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
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
      await appwriteSignOut()
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
    loading,
    refreshUser: fetchUser
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

// Compatibility hook for previous implementation
export function useUser() {
  const { user, isLoaded, isSignedIn } = useAuth()
  
  return {
    user: user ? {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
    } : null,
    isLoaded,
    isSignedIn
  }
}
export function useClerk() {
  const { signOut } = useAuth()
  
  return {
    signOut
  }
}