"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AIProviderSelector } from "@/components/ai-provider-selector"
import { MobileNav } from "@/components/mobile-nav"
import { 
  SignInButton, 
  SignUpButton, 
  UserButton, 
  SignedIn, 
  SignedOut,
  useUser 
} from "@clerk/nextjs"
import { 
  Brain, 
  Crown, 
  Settings,
  Bot
} from "lucide-react"

interface AppHeaderProps {
  selectedAIModel?: string
  onAIModelChange?: (modelId: string) => void
  showAISelector?: boolean
}

export function AppHeader({ 
  selectedAIModel, 
  onAIModelChange,
  showAISelector = false
}: AppHeaderProps) {
  const { user, isSignedIn } = useUser()
  
  // Mock user profile for demo - you can replace this with actual user data from your database
  const profile = isSignedIn ? {
    plan: user?.publicMetadata?.plan || 'free',
    articlesUsed: user?.publicMetadata?.articlesUsed || 0,
    articlesLimit: user?.publicMetadata?.articlesLimit || 5
  } : null

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Prowriter AI</span>
            </Link>
            
            <SignedIn>
              {profile && (
                <Badge 
                  variant={profile.plan === 'free' ? 'secondary' : 'default'}
                  className={profile.plan === 'pro' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : ''}
                >
                  {profile.plan === 'pro' && <Crown className="w-3 h-3 mr-1" />}
                  {profile.plan.toUpperCase()}
                </Badge>
              )}
            </SignedIn>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <SignedIn>
              {/* AI Model Selector for Desktop */}
              {showAISelector && profile && selectedAIModel && onAIModelChange && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg border">
                  <Bot className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600 mr-2">AI Engine:</span>
                  <AIProviderSelector
                    selectedModel={selectedAIModel}
                    onModelSelect={onAIModelChange}
                    userTier={profile?.plan === 'pro' ? 'pro' : 'free'}
                    variant="compact"
                  />
                </div>
              )}
              
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">
                  Get Started
                </Button>
              </SignUpButton>
            </SignedOut>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <SignedIn>
              <MobileNav
                user={user}
                profile={profile}
                selectedAIModel={selectedAIModel}
                onAIModelChange={onAIModelChange}
              />
            </SignedIn>
            
            <SignedOut>
              <div className="flex items-center space-x-2">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  )
}
