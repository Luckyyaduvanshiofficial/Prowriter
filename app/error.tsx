'use client'

import { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Application Error:', error)
    }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong!
          </h2>
          <p className="text-gray-600 mb-6">
            We encountered an unexpected error. Please try again.
          </p>
          <button
            onClick={reset}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  )
}
