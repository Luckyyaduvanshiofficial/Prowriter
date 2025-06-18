"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to sign-in page since we're using Clerk now
    router.push('/sign-in')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <div className="w-8 h-8 text-white" />
        </div>
        <p className="text-gray-600">Redirecting to sign in...</p>
      </div>
    </div>
  )
}
