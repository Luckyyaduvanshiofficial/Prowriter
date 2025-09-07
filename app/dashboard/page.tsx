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
  Type
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const { user, isSignedIn, isLoaded } = useUser()
  const [profile, setProfile] = useState<any>(null)
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
      return
    }
    
    if (isSignedIn && user) {
      loadUserData()
    }
  }, [isLoaded, isSignedIn, user, router])

  const loadUserData = async () => {
    try {
      console.log('Loading user data for:', user?.id)
      
      if (!user) {
        console.log('No user found')
        setLoading(false)
        return
      }

      console.log('User found:', user.emailAddresses[0]?.emailAddress)

      // Fetch real user profile and articles data
      const [profileResponse, articlesResponse] = await Promise.all([
        fetch('/api/user-profile'),
        fetch('/api/articles')
      ])
      
      if (profileResponse.ok) {
        const { profile } = await profileResponse.json()
        setProfile(profile)
      } else {
        // Fallback profile if API fails
        const fallbackProfile = {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          plan: user.publicMetadata?.plan || 'free',
          articles_generated_today: user.publicMetadata?.articlesUsed || 2,
          articles_limit: user.publicMetadata?.plan === 'pro' ? 25 : 5,
          full_name: user.fullName || user.firstName + ' ' + user.lastName || 'User'
        }
        setProfile(fallbackProfile)
      }
      
      if (articlesResponse.ok) {
        const { articles } = await articlesResponse.json()
        setArticles(articles)
      } else {
        // Fallback articles if API fails
        const fallbackArticles = [
          {
            id: 1,
            title: "Getting Started with AI Content Generation",
            created_at: new Date().toISOString(),
            status: "published",
            word_count: 1250
          }
        ]
        setArticles(fallbackArticles)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      // Fallback to demo mode
      const mockProfile = {
        id: 'demo-user',
        email: 'demo@prowriter.miniai.online',
        plan: 'free',
        articles_generated_today: 2,
        full_name: 'Demo User'
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Use new AppHeader component */}
      <AppHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User'}!
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
                  <p className="text-2xl font-bold text-gray-900">47</p>
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
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {articles.length > 0 ? (
              <div className="space-y-4">
                {articles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{article.title}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(article.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{article.status}</Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">No articles yet</p>
                <Link href="/generate">
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
