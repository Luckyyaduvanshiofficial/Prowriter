"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { AIProviderSelector } from "@/components/ai-provider-selector"
import { useUser, useClerk } from "@/lib/auth-context"
import { 
  Menu, 
  X, 
  Brain, 
  PenTool, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  Crown,
  Sparkles,
  ChevronRight,
  Bot
} from "lucide-react"

interface MobileNavProps {
  user?: any
  profile?: any
  selectedAIModel?: string
  onAIModelChange?: (modelId: string) => void
}

export function MobileNav({ 
  user, 
  profile, 
  selectedAIModel, 
  onAIModelChange 
}: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { user: clerkUser, isSignedIn } = useUser()
  const { signOut } = useClerk()
  
  // Use the passed user prop if available, otherwise use Clerk user
  const currentUser = user || clerkUser
  
  const handleSignOut = async () => {
    try {
      await signOut()
      setOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }
  
  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: BarChart3,
      description: 'Overview & stats'
    },
    {
      name: 'Blog Writer',
      href: '/blog-writer',
      icon: PenTool,
      description: 'Create new articles'
    },
    {
      name: 'Articles',
      href: '/articles',
      icon: FileText,
      description: 'Manage content'
    },
    {
      name: 'Pricing',
      href: '/pricing',
      icon: Crown,
      description: 'Plans & billing'
    }
  ]

  const handleNavClick = () => {
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="flex items-center space-x-2" onClick={handleNavClick}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Kutumbhcraft</span>
            </Link>
            {profile && (
              <Badge 
                variant={profile.plan === 'free' ? 'secondary' : 'default'}
                className={profile.plan === 'pro' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : ''}
              >
                {profile.plan === 'pro' && <Crown className="w-3 h-3 mr-1" />}
                {profile.plan?.toUpperCase()}
              </Badge>
            )}
          </div>

          {/* User Profile Section */}
          {isSignedIn && user && profile && (
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user.firstName?.charAt(0) || user.emailAddresses?.[0]?.emailAddress?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.fullName || user.emailAddresses?.[0]?.emailAddress}
                  </p>
                  <p className="text-xs text-gray-500">
                    {profile.plan === 'pro' ? 'Pro Member' : 'Free Plan'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link key={item.name} href={item.href} onClick={handleNavClick}>
                  <div className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                      <div>
                        <p className={`text-sm font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* AI Provider Selection */}
          {isSignedIn && profile && (
            <div className="p-4 border-t">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 mb-3">
                  <Bot className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">AI Engine</span>
                </div>
                <AIProviderSelector
                  selectedModel={selectedAIModel}
                  onModelSelect={onAIModelChange}
                  userTier={profile?.plan === 'pro' ? 'pro' : 'free'}
                  variant="compact"
                />
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {user && profile && (
            <div className="p-4 border-t bg-gray-50 space-y-3">
              <Link href="/blog-writer" onClick={handleNavClick}>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Article
                </Button>
              </Link>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="flex-1">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          )}

          {/* Call to Action for Non-Users */}
          {!isSignedIn && (
            <div className="p-4 border-t bg-gray-50 space-y-3">
              <Link href="/sign-up" onClick={handleNavClick}>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/sign-in" onClick={handleNavClick}>
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}