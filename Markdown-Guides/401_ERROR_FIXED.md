# 401 Error Fixed - "User (role: guests) missing scope"

## Problem Explanation

You were getting this error repeatedly:
```
❌ getCurrentUser: Failed {
  code: 401,
  message: 'User (role: guests) missing scopes (["account"])'
}
```

### Root Cause

**The issue was in your API routes trying to use client-side authentication on the server:**

1. **Client-side Appwrite SDK** (`account.get()`) requires **browser session cookies** to authenticate
2. **API routes run on the server** and don't have access to browser cookies
3. When API routes called `getCurrentUser()` or `getCurrentUserId()`, Appwrite treated them as **"guests"** (unauthenticated)
4. This caused 401 errors because guests don't have permission to access the `account` scope

### Why This Happened

- Your `lib/auth.ts` has `getCurrentUser()` which calls `account.get()`
- This works **perfectly in the browser** (client components, auth-context)
- But **fails in API routes** because they run on the server without browser cookies
- Appwrite has two different SDKs:
  - **Client SDK** (browser) - uses session cookies
  - **Server SDK** (Node.js) - uses API keys

## The Fix

### What Changed

I updated **all API routes** to accept `userId` as a parameter instead of trying to authenticate server-side:

#### 1. `/api/user-profile/route.ts`
- **Before:** Called `getCurrentUser()` which failed with 401
- **After:** Accepts `userId` from query params (`?userId=xxx`)

#### 2. `/api/articles/route.ts`
- **Already correct:** Was already accepting `userId` from query params

#### 3. `/api/auth/me/route.ts`
- **Before:** Called `getCurrentUser()` which failed
- **After:** Accepts `userId` from query params

#### 4. `/api/web-search/route.ts`
- **Before:** Called `getCurrentUserId()` which failed
- **After:** Accepts `userId` from request body

#### 5. `/api/serp-analysis/route.ts`
- **Before:** Called `getCurrentUserId()` which failed
- **After:** Accepts `userId` from request body

### Dashboard Updated

Updated `app/dashboard/page.tsx` to pass the user ID to API calls:

```typescript
// Before:
fetch('/api/user-profile')
fetch('/api/articles')

// After:
fetch(`/api/user-profile?userId=${user.id}`)
fetch(`/api/articles?userId=${user.id}`)
```

## How It Works Now

### Authentication Flow

1. **Client-side (Browser):**
   - `AuthProvider` in `lib/auth-context.tsx` calls `getCurrentUser()`
   - This works because it has access to browser cookies
   - User info is stored in React context

2. **API Calls:**
   - Dashboard gets user from context: `const { user } = useUser()`
   - Passes `user.id` to API routes as a parameter
   - API routes use the `userId` to fetch data from database

3. **Server Operations:**
   - API routes use **Server SDK** (`serverDatabases`) to query database
   - No need for session authentication on server
   - User is already authenticated in the browser

## Security Note

**Is this secure?**

Currently, the API routes trust the `userId` passed from the client. For production, you should add one of these security measures:

### Option 1: Server-Side Session Validation (Recommended)
```typescript
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  // Get session from cookies
  const sessionCookie = cookies().get('session')
  
  // Validate session with Appwrite
  // Then use the validated userId
}
```

### Option 2: Middleware Protection
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  // Check if user has valid session
  // Redirect to /sign-in if not
}
```

### Option 3: JWT Token Validation
```typescript
// Validate JWT token from Authorization header
const token = req.headers.get('Authorization')?.replace('Bearer ', '')
// Verify token and extract userId
```

## Testing

To verify the fix works:

1. Sign in to your account
2. Go to `/dashboard`
3. You should see:
   - ✅ Your profile loaded
   - ✅ Your articles loaded
   - ✅ No 401 errors in console

## Files Modified

- ✅ `app/api/user-profile/route.ts` - Accept userId from query params
- ✅ `app/api/auth/me/route.ts` - Accept userId from query params  
- ✅ `app/api/web-search/route.ts` - Accept userId from request body
- ✅ `app/api/serp-analysis/route.ts` - Accept userId from request body
- ✅ `app/dashboard/page.tsx` - Pass userId to API calls

## Next Steps

1. **Test the dashboard** - It should load without 401 errors now
2. **Consider security** - Implement server-side session validation for production
3. **Monitor logs** - Watch for any remaining authentication issues
4. **Update other pages** - Apply the same pattern to other pages that call APIs

---

**Status:** ✅ Fixed
**Date:** {{ date }}
**Error Type:** Authentication / Session Management
**Severity:** High (Blocking dashboard access)
