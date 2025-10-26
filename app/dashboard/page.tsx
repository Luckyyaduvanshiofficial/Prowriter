"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AppHeader } from "@/components/app-header"
import {
  PenTool,
  FileText,
  Crown,
  TrendingUp,
  Calendar,
  Settings,
  LogOut,
  Zap,
  BarChart3,
  Target,
  Clock,
  ArrowRight,
  Brain,
  Layers,
  Star,
  Plus,
  Download,
  Eye,
  CheckCircle,
  GitCompare,
  Type,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const { user, isSignedIn, isLoaded } = useUser()
  const [profile, setProfile] = useState<any>(null)
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    console.log('📊 Dashboard useEffect:', { isLoaded, isSignedIn, hasUser: !!user })
    
    // Don't redirect if still loading
    if (!isLoaded) {
      console.log('⏳ Still loading auth state...')
      return
    }
    
    if (!isSignedIn || !user) {
      console.log('❌ Not signed in, redirecting to sign-in')
      // Add a small delay to ensure auth state is fully loaded
      const timer = setTimeout(() => {
        router.push('/sign-in?redirect=/dashboard')
      }, 500)
      return () => clearTimeout(timer)
    }
    
    console.log('✅ User signed in, loading data')
    loadUserData()
  }, [isLoaded, isSignedIn, user, router])

  const loadUserData = async () => {
    setError(null) // Clear any previous errors
    
    try {
      console.log('Loading user data for:', user?.id)
      
      if (!user) {
        console.log('No user found')
        setLoading(false)
        return
      }

      console.log('User found:', user.email)

      // Fetch real user profile and articles data
      const [profileResponse, articlesResponse] = await Promise.all([
        fetch(`/api/user-profile?userId=${user.id}`).catch(err => {
          console.error('Profile API error:', err)
          return null
        }),
        fetch(`/api/articles?userId=${user.id}`).catch(err => {
          console.error('Articles API error:', err)
          return null
        })
      ])
      
      if (profileResponse && profileResponse.ok) {
        try {
          const { profile } = await profileResponse.json()
          setProfile(profile)
        } catch (err) {
          console.error('Error parsing profile response:', err)
          // Use fallback profile
          setProfile({
            id: user.id,
            email: user.email || '',
            plan: 'free',
            articles_generated_today: 0,
            articles_limit: 5,
            full_name: user.name || 'User'
          })
        }
      } else {
        // Fallback profile if API fails (using Appwrite user structure)
        const fallbackProfile = {
          id: user.id,
          email: user.email || '',
          plan: 'free',
          articles_generated_today: 0,
          articles_limit: 5,
          full_name: user.name || 'User'
        }
        setProfile(fallbackProfile)
      }
      
      if (articlesResponse && articlesResponse.ok) {
        try {
          const { articles } = await articlesResponse.json()
          setArticles(articles || [])
        } catch (err) {
          console.error('Error parsing articles response:', err)
          setArticles([])
        }
      } else {
        // Fallback articles if API fails
        setArticles([])
      }
    } catch (error: any) {
      console.error('Error loading user data:', error)
      setError(error?.message || 'Failed to load dashboard data. Please refresh the page.')
      
      // Fallback to demo mode (using Appwrite user structure)
      const mockProfile = {
        id: user?.id || 'demo-user',
        email: user?.email || 'demo@prowriter.ai',
        plan: 'free',
        articles_generated_today: 0,
        full_name: user?.name || 'Demo User'
      }
      setProfile(mockProfile)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  // handleSignOut is no longer needed as Clerk handles authentication
  // The AppHeader component uses Clerk's UserButton which includes sign out functionality

  if (loading || !isLoaded) {
    return (
      <div className="page-background flex items-center justify-center">
        <div className="text-center">
          <div className="icon-container-lg gradient-primary mx-auto mb-4 animate-pulse">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Show error state if there's an error
  if (error && !profile) {
    return (
      <div className="page-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <span className="mr-2">⚠️</span> Error Loading Dashboard
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              We encountered an issue loading your dashboard. This could be due to a network error or server issue.
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => window.location.reload()} className="w-full">
                Retry
              </Button>
              <Button variant="outline" onClick={() => router.push('/sign-in')} className="w-full">
                Back to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="page-background flex items-center justify-center">
        <div className="text-center">
          <div className="icon-container-lg bg-blue-100 mx-auto mb-4">
            <Brain className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Dashboard...</h2>
          <p className="text-gray-600 mb-4">Setting up your workspace</p>
          <div className="animate-pulse">
            <div className="h-2 bg-blue-200 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  const dailyLimit = profile.plan === 'free' ? 5 : profile.plan === 'pro' ? 25 : 999
  const articlesUsed = profile.articles_generated_today || 0
  const progressPercentage = (articlesUsed / dailyLimit) * 100

  // Calculate monthly articles accurately
  const getMonthlyArticles = () => {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    
    return articles.filter(article => {
      const created = new Date(article.createdAt || article.$createdAt || article.created_at)
      return created >= monthStart
    }).length
  }

  // Calculate last month's articles for growth comparison
  const getLastMonthArticles = () => {
    const now = new Date()
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
    
    return articles.filter(article => {
      const created = new Date(article.createdAt || article.$createdAt || article.created_at)
      return created >= lastMonthStart && created <= lastMonthEnd
    }).length
  }

  // Calculate growth rate
  const getGrowthRate = () => {
    const thisMonth = getMonthlyArticles()
    const lastMonth = getLastMonthArticles()
    
    if (lastMonth === 0) return thisMonth > 0 ? 100 : 0
    return ((thisMonth - lastMonth) / lastMonth * 100)
  }

  const monthlyArticles = getMonthlyArticles()
  const growthRate = getGrowthRate()
  const isGrowthPositive = growthRate >= 0

  return (
    <div className="page-background">
      {/* Use new AppHeader component */}
      <AppHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner - Shows non-critical errors */}
        {error && profile && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-yellow-600 text-xl">⚠️</span>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  Some data couldn't be loaded
                </h3>
                <p className="mt-1 text-sm text-yellow-700">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setError(null)
                    loadUserData()
                  }}
                  className="mt-2"
                >
                  Try Again
                </Button>
              </div>
              <button 
                onClick={() => setError(null)}
                className="ml-3 flex-shrink-0 text-yellow-600 hover:text-yellow-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-gray-600">Generate expert-level AI comparison articles in minutes.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Articles Today</p>
                  <p className="text-2xl font-bold text-gray-900">{articlesUsed}/{dailyLimit}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <Progress value={progressPercentage} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Articles</p>
                  <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Plan</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">{profile.plan}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  {profile.plan === 'pro' ? (
                    <Crown className="w-6 h-6 text-purple-600" />
                  ) : (
                    <Star className="w-6 h-6 text-purple-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{monthlyArticles}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {isGrowthPositive ? (
                      <>
                        <ArrowUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600">
                          +{Math.abs(growthRate).toFixed(1)}%
                        </span>
                      </>
                    ) : (
                      <>
                        <ArrowDown className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-600">
                          {growthRate.toFixed(1)}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>Start generating content or manage your articles</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/blog-writer">
                <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <PenTool className="w-6 h-6" />
                  <span>AI Blog Writer</span>
                </Button>
              </Link>

              <Link href="/canvas-writer">
                <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700">
                  <Type className="w-6 h-6" />
                  <span>Canvas Writer</span>
                </Button>
              </Link>
              
              <Link href="/generate">
                <Button 
                  variant="outline" 
                  className="w-full h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:bg-gray-50"
                >
                  <GitCompare className="w-6 h-6" />
                  <span>Model Comparison</span>
                </Button>
              </Link>
              
              <Link href="/articles">
                <Button 
                  variant="outline" 
                  className="w-full h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:bg-gray-50"
                >
                  <FileText className="w-6 h-6" />
                  <span>Article History</span>
                </Button>
              </Link>

              <Link href="/analytics">
                <Button 
                  variant="outline" 
                  className="w-full h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:bg-gray-50"
                >
                  <BarChart3 className="w-6 h-6" />
                  <span>Analytics</span>
                </Button>
              </Link>

              <Link href="/settings">
                <Button 
                  variant="outline" 
                  className="w-full h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:bg-gray-50"
                >
                  <Settings className="w-6 h-6" />
                  <span>Settings</span>
                </Button>
              </Link>
              
              <Link href="/pricing">
                <Button 
                  variant="outline" 
                  className="w-full h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:bg-gray-50"
                >
                  <Crown className="w-6 h-6" />
                  <span>Upgrade Plan</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                Daily Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-gray-900 mb-1">{articlesUsed}</div>
                <div className="text-sm text-gray-600">of {dailyLimit} articles used</div>
              </div>
              <Progress value={progressPercentage} className="mb-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining:</span>
                  <span className="font-medium">{dailyLimit - articlesUsed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Resets:</span>
                  <span className="font-medium">Tomorrow</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Articles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-600" />
                Recent Articles
              </div>
              <Link href="/articles">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {articles.length > 0 ? (
              <div className="space-y-4">
                {articles.slice(0, 5).map((article) => (
                  <div key={article.$id || article.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{article.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{new Date(article.createdAt || article.created_at || article.$createdAt).toLocaleDateString()}</span>
                          {article.wordCount && (
                            <>
                              <span>•</span>
                              <span>{article.wordCount} words</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                      <Badge variant="secondary" className="capitalize">
                        {article.status || 'draft'}
                      </Badge>
                      <Link href="/articles">
                        <Button variant="ghost" size="sm" title="View article">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                {articles.length > 5 && (
                  <div className="text-center pt-2">
                    <Link href="/articles">
                      <Button variant="outline" size="sm">
                        View {articles.length - 5} More Articles
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">No articles yet</p>
                <Link href="/blog-writer">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Article
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
