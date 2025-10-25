"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AIProviderSelector } from "@/components/ai-provider-selector"
import { MobileNav } from "@/components/mobile-nav"
import { useUser, useClerk } from "@/lib/auth-context"
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
  const { signOut } = useClerk()
  
  // User profile for display (Appwrite structure)
  const profile = isSignedIn && user ? {
    plan: 'free', // Will be fetched from user profile API
    articlesUsed: 0,
    articlesLimit: 5
  } : null

  const userInitials = user ? 
    user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 
    user.email?.[0]?.toUpperCase() || 'U'
    : 'U'

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
            
            {isSignedIn && profile && (
              <Badge 
                variant={profile.plan === 'free' ? 'secondary' : 'default'}
                className={profile.plan === 'pro' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : ''}
              >
                {profile.plan === 'pro' && <Crown className="w-3 h-3 mr-1" />}
                {profile.plan.toUpperCase()}
              </Badge>
            )}
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <>
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
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuItem className="flex flex-col items-start">
                      <div className="font-medium">{user?.name || 'User'}</div>
                      <div className="text-sm text-muted-foreground">{user?.email}</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/pricing">Pricing</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            {isSignedIn ? (
              <MobileNav
                user={user}
                profile={profile}
                selectedAIModel={selectedAIModel}
                onAIModelChange={onAIModelChange}
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
