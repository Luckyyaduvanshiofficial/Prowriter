import { useUser as useClerkUser } from '@clerk/nextjs'

// Mock user hook for when Clerk is not configured
const useMockUser = () => {
  return {
    user: null,
    isSignedIn: false,
    isLoaded: true,
  }
}

// Check if Clerk is properly configured
const isClerkConfigured = () => {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  return publishableKey && publishableKey.startsWith('pk_')
}

// Export a safe user hook that falls back to mock when Clerk isn't configured
export const useSafeUser = () => {
  if (typeof window !== 'undefined' && isClerkConfigured()) {
    try {
      return useClerkUser()
    } catch (error) {
      console.warn('Clerk not configured properly, using mock auth')
      return useMockUser()
    }
  }
  return useMockUser()
}

// Export other safe auth utilities
export const SafeUserButton = ({ children }: { children: React.ReactNode }) => {
  if (isClerkConfigured()) {
    try {
      const { UserButton } = require('@clerk/nextjs')
      return <UserButton />
    } catch (error) {
      console.warn('Clerk UserButton not available')
    }
  }
  return <div>{children}</div>
}
