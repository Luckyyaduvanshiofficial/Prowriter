"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  CheckCircle
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth')
        return
      }

      setUser(user)

      // Get or create user profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email!,
            plan: 'free',
            articles_generated_today: 0
          })
          .select()
          .single()

        if (!createError) {
          setProfile(newProfile)
        }
      } else if (!error) {
        setProfile(profile)
      }

      // Get user articles
      const { data: userArticles } = await supabase
        .from('articles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      setArticles(userArticles || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
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
    return null
  }

  const dailyLimit = profile.plan === 'free' ? 5 : profile.plan === 'pro' ? 25 : 999
  const articlesUsed = profile.articles_generated_today || 0
  const progressPercentage = (articlesUsed / dailyLimit) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
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
              <Badge 
                variant={profile.plan === 'free' ? 'secondary' : 'default'}
                className={profile.plan === 'pro' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : ''}
              >
                {profile.plan === 'pro' && <Crown className="w-3 h-3 mr-1" />}
                {profile.plan.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-600 hover:text-gray-900">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user.email?.split('@')[0]}! 👋
              </h1>
              <p className="text-xl text-gray-600">
                Ready to create some amazing AI content?
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/generate">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Article
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Usage Stats */}
          <Card className="border-0 shadow-premium">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Daily Usage</CardTitle>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {articlesUsed} / {dailyLimit}
              </div>
              <Progress value={progressPercentage} className="mb-2" />
              <p className="text-sm text-gray-600">
                {dailyLimit - articlesUsed} articles remaining today
              </p>
            </CardContent>
          </Card>

          {/* Total Articles */}
          <Card className="border-0 shadow-premium">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Total Articles</CardTitle>
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {articles.length}
              </div>
              <p className="text-sm text-gray-600">
                Articles created this week
              </p>
            </CardContent>
          </Card>

          {/* Plan Status */}
          <Card className="border-0 shadow-premium">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Plan Status</CardTitle>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  profile.plan === 'pro' 
                    ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' 
                    : 'bg-gradient-to-br from-gray-500 to-gray-600'
                }`}>
                  <Crown className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2 capitalize">
                {profile.plan}
              </div>
              {profile.plan === 'free' ? (
                <Link href="/pricing">
                  <Button size="sm" variant="outline" className="text-blue-600 border-blue-200">
                    Upgrade Plan
                  </Button>
                </Link>
              ) : (
                <p className="text-sm text-gray-600">Active subscription</p>
              )}
            </CardContent>
          </Card>

          {/* Performance */}
          <Card className="border-0 shadow-premium">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Performance</CardTitle>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                98%
              </div>
              <p className="text-sm text-gray-600">
                Average SEO score
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Create Article */}
          <Card className="lg:col-span-2 border-0 shadow-premium bg-gradient-to-br from-white to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                  <PenTool className="w-5 h-5 text-white" />
                </div>
                Quick Actions
              </CardTitle>
              <CardDescription className="text-base">
                Get started with creating your next high-converting article
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Link href="/generate">
                <Card className="border-2 border-transparent hover:border-blue-200 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">Generate New Article</h3>
                        <p className="text-gray-600">Create expert-level AI model comparison content in minutes</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/articles">
                  <Button variant="outline" className="w-full h-auto py-4 border-2">
                    <div className="text-center">
                      <FileText className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                      <div className="font-medium">My Articles</div>
                    </div>
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full h-auto py-4 border-2">
                  <div className="text-center">
                    <Download className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <div className="font-medium">Bulk Export</div>
                  </div>
                </Button>
                
                {profile.plan === 'free' && (
                  <Link href="/pricing">
                    <Button variant="outline" className="w-full h-auto py-4 border-2 border-yellow-200 bg-yellow-50 hover:bg-yellow-100">
                      <div className="text-center">
                        <Crown className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                        <div className="font-medium text-yellow-700">Upgrade</div>
                      </div>
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Plan Status */}
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className={`w-5 h-5 mr-2 ${profile.plan === 'pro' ? 'text-yellow-600' : 'text-gray-400'}`} />
                {profile.plan === 'free' ? 'Starter Plan' : 'Pro Plan'}
              </CardTitle>
              <CardDescription>
                {profile.plan === 'free' 
                  ? 'Perfect for getting started with AI content'
                  : 'Unlimited power for serious content creators'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {profile.plan === 'free' ? (
                <div className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      5 articles per day
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      All AI models
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      SEO optimization
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Article storage
                    </div>
                  </div>
                  <Link href="/pricing">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Pro
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      25 articles per day
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Priority AI access
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Advanced templates
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Premium support
                    </div>
                  </div>
                  <Badge className="w-full justify-center bg-gradient-to-r from-green-500 to-green-600 text-white">
                    ✓ Active Pro Subscription
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Articles */}
        <Card className="border-0 shadow-premium">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-3">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  Recent Articles
                </CardTitle>
                <CardDescription className="mt-2">
                  Your latest generated content, ready to publish
                </CardDescription>
              </div>
              <Link href="/articles">
                <Button variant="outline">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {articles.length > 0 ? (
              <div className="space-y-4">
                {articles.slice(0, 3).map((article) => (
                  <Card key={article.id} className="border border-gray-200 hover:border-blue-200 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center">
                              <Brain className="w-4 h-4 mr-1" />
                              {article.model_a} vs {article.model_b}
                            </span>
                            <span className="flex items-center">
                              <Target className="w-4 h-4 mr-1" />
                              {article.use_case}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {new Date(article.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {article.content?.substring(0, 150)}...
                          </p>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          <Button variant="outline" size="sm" className="whitespace-nowrap">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="whitespace-nowrap">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Get started by creating your first AI comparison article. 
                  It takes less than 3 minutes to generate expert-level content.
                </p>
                <Link href="/generate">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <PenTool className="w-5 h-5 mr-2" />
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
