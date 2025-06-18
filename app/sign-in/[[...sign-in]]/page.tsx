import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back to Prowriter AI
          </h1>
          <p className="text-gray-600">
            Sign in to continue creating amazing content
          </p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
              card: 'shadow-lg border-0',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
            }
          }}
        />
      </div>
    </div>
  )
}
