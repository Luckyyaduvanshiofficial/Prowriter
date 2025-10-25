/**
 * Simple client-side rate limiter to prevent excessive API calls
 */

const rateLimitStore = new Map<string, number>()

export function checkRateLimit(key: string, limitMs: number = 5000): boolean {
  const now = Date.now()
  const lastCall = rateLimitStore.get(key)
  
  if (lastCall && now - lastCall < limitMs) {
    return false // Rate limited
  }
  
  rateLimitStore.set(key, now)
  return true // Allowed
}

export function getRateLimitTimeRemaining(key: string, limitMs: number = 5000): number {
  const now = Date.now()
  const lastCall = rateLimitStore.get(key)
  
  if (!lastCall) return 0
  
  const elapsed = now - lastCall
  const remaining = limitMs - elapsed
  
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0
}

export function clearRateLimit(key: string): void {
  rateLimitStore.delete(key)
}
