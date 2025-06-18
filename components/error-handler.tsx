'use client'

import { useEffect } from 'react'

export function ErrorHandler() {
  useEffect(() => {
    // Suppress Supabase authentication errors in development
    const originalConsoleError = console.error
    
    console.error = (...args) => {
      // Filter out known Supabase auth errors
      const message = args[0]?.toString() || ''
      
      if (
        message.includes('Failed to fetch') ||
        message.includes('ERR_NAME_NOT_RESOLVED') ||
        message.includes('supabase.co') ||
        message.includes('AuthRetryableFetchError') ||
        message.includes('refresh_token')
      ) {
        // Only show a warning once for auth issues
        if (!window.__supabaseWarningShown) {
          console.warn('⚠️ Supabase authentication is not configured. Using mock client for development.')
          window.__supabaseWarningShown = true
        }
        return
      }
      
      // Show other errors normally
      originalConsoleError.apply(console, args)
    }
    
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason
      if (error?.message?.includes('supabase') || error?.message?.includes('Failed to fetch')) {
        event.preventDefault()
        return
      }
    }
    
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    
    return () => {
      console.error = originalConsoleError
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])
  
  return null
}

// Add to global window type
declare global {
  interface Window {
    __supabaseWarningShown?: boolean
  }
}
