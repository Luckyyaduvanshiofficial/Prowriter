import { useUser as useAuthUser } from '@/lib/auth-context'

// Updated user hook that uses our custom auth system
export const useSafeUser = () => {
  const { user, isSignedIn, isLoaded } = useAuthUser()
  
  return {
    user,
    isSignedIn,
    isLoaded
  }
}

// Export the same hook for consistency
export const useUser = useSafeUser

// Placeholder for user button (can be implemented later)
export const SafeUserButton = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}
