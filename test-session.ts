// Test Appwrite Session After Sign-In
// Open browser console and run this to check if session exists

import { account } from '@/lib/appwrite'

async function testSession() {
  try {
    console.log('🔍 Testing Appwrite session...')
    const user = await account.get()
    console.log('✅ Session active! User:', user)
    return user
  } catch (error) {
    console.error('❌ No active session:', error)
    return null
  }
}

// Run test
testSession()
