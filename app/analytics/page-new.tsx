"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AppHeader } from "@/components/app-header"
import { 
  TrendingUp, 
  Clock, 
  Target, 
  BarChart3, 
  Zap,
  Brain,
  FileText,
  ArrowUp,
  ArrowDown,
  Activity,
  Calendar,
  Sparkles,
  Eye,
  Download
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Area, AreaChart } from 'recharts'
import Link from 'next/link'

export default function AnalyticsPage() {
  const { user, isSignedIn, isLoaded } = useUser()
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn || !user) {
      router.push('/sign-in?redirect=/analytics')
      return
    }
    loadAnalytics()
  }, [isLoaded, isSignedIn, user, router])

  const loadAnalytics = async () => {
    try {
      if (!user) return
      
      const response = await fetch(`/api/articles?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles || [])
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate real metrics from actual articles
  const totalArticles = articles.length
  const totalWords = articles.reduce((sum, a) => sum + (a.wordCount || 0), 0)
  const avgWordsPerArticle = totalArticles > 0 ? Math.round(totalWords / totalArticles) : 0
  const avgTimePerArticle = 2 // minutes (estimated)
  const totalTimeSaved = Math.round((totalArticles * avgTimePerArticle) / 60) // hours

  // Calculate monthly articles
  const getMonthlyData = () => {
    const monthlyCount: { [key: string]: number } = {}
    articles.forEach(article => {
      const date = new Date(article.createdAt || article.$createdAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyCount[monthKey] = (monthlyCount[monthKey] || 0) + 1
    })
    
    return Object.entries(monthlyCount)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, count]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
        articles: count
      }))
  }

  // Calculate daily articles for last 30 days
  const getDailyData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return date.toISOString().split('T')[0]
    })

    const dailyCount: { [key: string]: number } = {}
    articles.forEach(article => {
      const date = new Date(article.createdAt || article.$createdAt)
      const dateKey = date.toISOString().split('T')[0]
      if (last30Days.includes(dateKey)) {
        dailyCount[dateKey] = (dailyCount[dateKey] || 0) + 1
      }
    })

    return last30Days.map((date, idx) => ({
      day: idx + 1,
      articles: dailyCount[date] || 0
    }))
  }

  // Get top performing articles
  const topArticles = articles
    .sort((a, b) => (b.wordCount || 0) - (a.wordCount || 0))
    .slice(0, 5)

  const monthlyData = getMonthlyData()
  const dailyData = getDailyData()

  // Calculate growth
  const currentMonthArticles = dailyData.slice(-7).reduce((sum, d) => sum + d.articles, 0)
  const previousMonthArticles = dailyData.slice(-14, -7).reduce((sum, d) => sum + d.articles, 0)
  const growthRate = previousMonthArticles > 0 
    ? ((currentMonthArticles - previousMonthArticles) / previousMonthArticles * 100) 
    : 100

  if (loading || !isLoaded) {
    return (
      <div className="page-background flex items-center justify-center min-h-screen">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 animate-pulse mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-background min-h-screen">
      <AppHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">Track your content performance and insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Articles</CardTitle>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-gray-900">{totalArticles}</div>
              <div className="flex items-center mt-2 text-sm">
                {growthRate >= 0 ? (
                  <>
                    <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-green-600 font-semibold">+{growthRate.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
                    <span className="text-red-600 font-semibold">{growthRate.toFixed(1)}%</span>
                  </>
                )}
                <span className="text-gray-500 ml-2">vs last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Words</CardTitle>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-gray-900">{totalWords.toLocaleString()}</div>
              <p className="text-sm text-gray-500 mt-2">Avg: {avgWordsPerArticle} per article</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Time Saved</CardTitle>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-gray-900">{totalTimeSaved}h</div>
              <p className="text-sm text-gray-500 mt-2">~{avgTimePerArticle} min per article</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-gray-900">{currentMonthArticles}</div>
              <p className="text-sm text-gray-500 mt-2">articles created</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Activity */}
          <Card className="border-2 border-gray-200 hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                Last 30 Days Activity
              </CardTitle>
              <CardDescription>Daily article generation</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={dailyData}>
                  <defs>
                    <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #3b82f6',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="articles" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fill="url(#colorArticles)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card className="border-2 border-gray-200 hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                Monthly Overview
              </CardTitle>
              <CardDescription>Article creation by month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #9333ea',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="articles" 
                    fill="url(#barGradient)" 
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9333ea" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Articles */}
        <Card className="border-2 border-gray-200 hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-600" />
                  Top Performing Articles
                </CardTitle>
                <CardDescription>Your most comprehensive content</CardDescription>
              </div>
              <Link href="/articles">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {topArticles.length > 0 ? (
              <div className="space-y-4">
                {topArticles.map((article, idx) => (
                  <div 
                    key={article.$id || idx}
                    className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(article.createdAt || article.$createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary" className="font-semibold">
                        {article.wordCount || 0} words
                      </Badge>
                      <Link href="/articles">
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No articles yet. Start creating!</p>
                <Link href="/blog-writer">
                  <Button className="mt-4">Create First Article</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
