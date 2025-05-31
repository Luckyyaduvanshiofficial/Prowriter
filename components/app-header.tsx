"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AIProviderSelector } from "@/components/ai-provider-selector"
import { MobileNav } from "@/components/mobile-nav"
import { 
  Brain, 
  Crown, 
  Settings, 
  LogOut,
  Bot
} from "lucide-react"

interface AppHeaderProps {
  user?: any
  profile?: any
  onSignOut?: () => void
  selectedAIModel?: string
  onAIModelChange?: (modelId: string) => void
  showAISelector?: boolean
}

export function AppHeader({ 
  user, 
  profile, 
  onSignOut, 
  selectedAIModel, 
  onAIModelChange,
  showAISelector = false
}: AppHeaderProps) {
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
            {profile && (
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
            {/* AI Model Selector for Desktop */}
            {showAISelector && user && profile && selectedAIModel && onAIModelChange && (
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
            {onSignOut && (
              <Button variant="ghost" size="sm" onClick={onSignOut} className="text-gray-600 hover:text-gray-900">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <MobileNav
              user={user}
              profile={profile}
              onSignOut={onSignOut}
              selectedAIModel={selectedAIModel}
              onAIModelChange={onAIModelChange}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
