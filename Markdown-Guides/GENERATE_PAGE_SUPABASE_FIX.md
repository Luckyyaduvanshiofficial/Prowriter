# Generate Page - Supabase to Appwrite Migration

## Problem
The `/app/generate/page.tsx` file was still using old Supabase authentication references instead of the new Appwrite auth-context system.

## Issues Found
1. ❌ Direct `supabase.auth.getUser()` calls
2. ❌ `supabase.from('profiles')` database queries
3. ❌ Manual user state management with `setUser()`
4. ❌ Demo mode fallback logic that's no longer needed
5. ❌ Wrong props passed to `AppHeader` component

## Changes Made

### 1. Import Changes
```typescript
// Before
import { useUser } from "@/lib/auth-context"

// After
import { useAuth } from "@/lib/auth-context"
```

### 2. Component State
```typescript
// Before
const [user, setUser] = useState<any>(null)
const [profile, setProfile] = useState<any>(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  checkUser() // Manual supabase check
}, [])

// After
const { user: clerkUser, loading: authLoading } = useAuth()
const [profile, setProfile] = useState<any>(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  if (!authLoading) {
    loadProfile() // Load from Appwrite API
  }
}, [authLoading, clerkUser])
```

### 3. User Profile Loading
```typescript
// Before - Direct Supabase queries
const { data: { user } } = await supabase.auth.getUser()
const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

// After - API call to Appwrite
const loadProfile = async () => {
  if (!clerkUser) {
    setLoading(false)
    return
  }

  try {
    const response = await fetch(`/api/user-profile?userId=${clerkUser.id}`)
    if (response.ok) {
      const data = await response.json()
      setProfile(data.profile)
    }
  } catch (error) {
    console.error('Error loading profile:', error)
    // Fallback profile
    setProfile({
      id: clerkUser.id,
      email: clerkUser.email,
      plan: 'free',
      articles_generated_today: 0
    })
  } finally {
    setLoading(false)
  }
}
```

### 4. Removed Demo Mode Logic
```typescript
// Removed ~100 lines of demo content generation
// Now relies on actual API calls only
```

### 5. Article Generation
```typescript
// Updated to pass userId for credit tracking
body: JSON.stringify({
  userId: clerkUser?.id, // Pass userId to API for tracking
  topic: `${modelA} vs ${modelB}: ${useCase}`,
  // ... other fields
})

// Added profile reload after generation
if (clerkUser?.id) {
  const profileResponse = await fetch(`/api/user-profile?userId=${clerkUser.id}`)
  if (profileResponse.ok) {
    const profileData = await profileResponse.json()
    if (profileData.profile) {
      setProfile(profileData.profile)
      console.log('✅ Profile reloaded with updated count:', profileData.profile.articles_generated_today)
    }
  }
}
```

### 6. Save Article Function
```typescript
// Before
const { error } = await supabase.from('articles').insert({...})

// After
const response = await fetch('/api/save-article', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: clerkUser.id,
    title: articleTitle,
    content: generatedContent,
    // ... other fields
  })
})
```

### 7. AppHeader Component
```typescript
// Before - Wrong props
<AppHeader
  user={user}
  profile={profile}
  onSignOut={handleSignOut}
  selectedAIModel={aiEngine}
  onAIModelChange={setAiEngine}
  showAISelector={true}
/>

// After - Correct props (gets user from context)
<AppHeader
  selectedAIModel={aiEngine}
  onAIModelChange={setAiEngine}
  showAISelector={true}
/>
```

### 8. Loading States
```typescript
// Now properly checks both auth loading and local loading
if (loading || authLoading) {
  return <LoadingSpinner />
}

if (!clerkUser || !profile) {
  return <SignInPrompt />
}
```

## Benefits

### ✅ Consistency
- Now matches the auth pattern used in other pages (blog-writer, dashboard, etc.)
- No more mixed Supabase/Appwrite code

### ✅ Credit Tracking
- Article count now properly increments in database
- Profile reloads after generation to show updated count
- Survives page reloads

### ✅ Simplified Code
- Removed ~100 lines of demo mode logic
- Removed manual state management
- Uses centralized auth-context

### ✅ Better UX
- Proper loading states
- Clear sign-in prompts for unauthenticated users
- Real-time article count updates

## Testing

1. ✅ Navigate to `/generate` page
2. ✅ Should show sign-in prompt if not authenticated
3. ✅ Should load user profile from Appwrite
4. ✅ Generate article - count should increment
5. ✅ Reload page - count should persist
6. ✅ Save article - should use Appwrite API

## Files Modified
- `/app/generate/page.tsx` - Complete migration from Supabase to Appwrite

## Related Files
- `/lib/auth-context.tsx` - Auth provider used
- `/lib/auth.ts` - Appwrite auth functions
- `/app/api/user-profile/route.ts` - Profile API
- `/app/api/save-article/route.ts` - Save article API
- `/app/api/generate-content/route.ts` - Generation API with credit tracking

## Migration Complete ✅
The generate page is now fully migrated to Appwrite and follows the same auth pattern as the rest of the application.
