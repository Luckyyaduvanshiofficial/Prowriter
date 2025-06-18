"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { AppHeader } from "@/components/app-header"
import { 
  ArrowLeft, 
  Loader2, 
  Sparkles, 
  Save, 
  Copy, 
  Download,
  Crown,
  Zap,
  Globe,
  Search,
  TrendingUp,
  Settings,
  ChevronDown,
  ChevronUp,
  Info
} from "lucide-react"
import Link from "next/link"
import { getAvailableModels, AI_MODELS, getModelById } from "@/lib/ai-providers"

const AI_MODEL_NAMES = [
  "GPT-4",
  "GPT-4 Turbo", 
  "Claude 3.5 Sonnet",
  "Claude 3 Opus",
  "Claude 3 Haiku",
  "Gemini Pro",
  "Gemini Ultra", 
  "LLaMA 3.1 405B",
  "LLaMA 3.1 70B",
  "Qwen 2.5 72B Instruct",
  "DeepSeek V2.5",
  "Mistral Large",
  "Command R+",
  "Perplexity Sonar"
]

const USE_CASES = [
  { id: "coding", name: "Coding & Development", icon: "💻" },
  { id: "chat", name: "Chat & Conversation", icon: "💬" },
  { id: "reasoning", name: "Logic & Reasoning", icon: "🧠" },
  { id: "writing", name: "Content Writing", icon: "✍️" }
]

export default function GeneratePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Get available models based on user's plan
  const [availableModels, setAvailableModels] = useState<any[]>([])
  
  // Form state
  const [modelA, setModelA] = useState("")
  const [modelB, setModelB] = useState("")
  const [useCase, setUseCase] = useState("")
  const [aiEngine, setAiEngine] = useState("qwen-72b")
  const [articleLength, setArticleLength] = useState("medium")
  const [temperature, setTemperature] = useState([0.7])
  
  // Generated content
  const [generatedContent, setGeneratedContent] = useState("")
  const [articleTitle, setArticleTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [webResearchMetadata, setWebResearchMetadata] = useState<any>(null)
  
  // Web search features
  const [includeWebSearch, setIncludeWebSearch] = useState(false)
  const [includeSerpAnalysis, setIncludeSerpAnalysis] = useState(false)
  const [webSearchDepth, setWebSearchDepth] = useState(5)
  const [includeRecentNews, setIncludeRecentNews] = useState(false)
  const [seoKeywords, setSeoKeywords] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [contentType, setContentType] = useState("comparison")
  const [brandVoice, setBrandVoice] = useState("friendly")
  
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  // Update available models when profile changes
  useEffect(() => {
    if (profile) {
      const userTier = profile.plan === 'pro' ? 'pro' : 'free'
      const models = getAvailableModels(userTier)
      setAvailableModels(models)
      
      // Set default AI engine if current selection is not available
      if (!models.some(model => model.id === aiEngine)) {
        setAiEngine(models[0]?.id || 'qwen-72b')
      }
    }
  }, [profile, aiEngine])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const checkUser = async () => {
    try {
      console.log('Checking user authentication for generate page...')
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.log('No user found, using demo mode for generate page')
        // For demo purposes, create a mock user and profile
        const mockUser = {
          id: 'demo-user',
          email: 'demo@prowriter.miniai.online'
        }
        const mockProfile = {
          id: 'demo-user',
          email: 'demo@prowriter.miniai.online',
          plan: 'free',
          articles_generated_today: 2,
          full_name: 'Demo User'
        }
        setUser(mockUser)
        setProfile(mockProfile)
        setLoading(false)
        return
      }

      console.log('User found:', user.email)
      setUser(user)

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        // Fallback to mock profile
        const mockProfile = {
          id: user.id,
          email: user.email!,
          plan: 'free',
          articles_generated_today: 0
        }
        setProfile(mockProfile)
      } else {
        console.log('Profile found:', profile)
        setProfile(profile)
      }
    } catch (error) {
      console.error('Error in checkUser:', error)
      // Fallback to demo mode
      const mockUser = {
        id: 'demo-user',
        email: 'demo@prowriter.miniai.online'
      }
      const mockProfile = {
        id: 'demo-user',
        email: 'demo@prowriter.miniai.online',
        plan: 'free',
        articles_generated_today: 2
      }
      setUser(mockUser)
      setProfile(mockProfile)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!profile) return

    const dailyLimit = profile.plan === 'free' ? 5 : profile.plan === 'pro' ? 25 : 999
    
    if (profile.articles_generated_today >= dailyLimit) {
      alert("You've reached your daily limit. Upgrade to Pro for more articles!")
      return
    }

    setGenerating(true)
    
    try {
      const topic = `${modelA} vs ${modelB} for ${USE_CASES.find(uc => uc.id === useCase)?.name}`
      
      // Check if we're in demo mode or if API is not available
      if (user?.id === 'demo-user') {
        // Generate demo content
        const demoContent = `
<article>
<h1>${modelA} vs ${modelB}: The Ultimate AI Comparison for ${USE_CASES.find(uc => uc.id === useCase)?.name}</h1>

<meta name="description" content="Comprehensive comparison between ${modelA} and ${modelB} for ${USE_CASES.find(uc => uc.id === useCase)?.name}. Expert analysis, benchmarks, and recommendations.">

<h2>Introduction</h2>
<p>In the rapidly evolving landscape of artificial intelligence, choosing the right model for your specific needs can be challenging. This comprehensive comparison between <strong>${modelA}</strong> and <strong>${modelB}</strong> will help you make an informed decision for ${USE_CASES.find(uc => uc.id === useCase)?.name} applications.</p>

<h2>Performance Analysis</h2>
<p><strong>${modelA}</strong> demonstrates exceptional capabilities in several key areas:</p>
<ul>
<li>Advanced reasoning and problem-solving</li>
<li>Natural language understanding</li>
<li>Context retention and coherence</li>
<li>Task-specific optimization</li>
</ul>

<p><strong>${modelB}</strong> excels in different aspects:</p>
<ul>
<li>Speed and efficiency</li>
<li>Specialized domain knowledge</li>
<li>Resource optimization</li>
<li>Consistent output quality</li>
</ul>

<h2>Use Case Comparison</h2>
<p>For ${USE_CASES.find(uc => uc.id === useCase)?.name} specifically:</p>

<h3>${modelA} Strengths:</h3>
<p>Excellent performance in complex reasoning tasks, with superior ability to handle nuanced requirements and provide detailed explanations.</p>

<h3>${modelB} Strengths:</h3>
<p>Optimized for efficiency and speed, making it ideal for high-throughput applications while maintaining quality.</p>

<h2>Benchmarks and Metrics</h2>
<p>Based on comprehensive testing across multiple evaluation frameworks:</p>
<ul>
<li><strong>Accuracy:</strong> ${modelA} 94.2% vs ${modelB} 91.8%</li>
<li><strong>Speed:</strong> ${modelA} 2.3s vs ${modelB} 1.7s average response time</li>
<li><strong>Cost Efficiency:</strong> ${modelB} offers 30% better cost-per-token ratio</li>
<li><strong>Reliability:</strong> Both models achieve 99.9% uptime</li>
</ul>

<h2>Recommendations</h2>
<p><strong>Choose ${modelA} if:</strong></p>
<ul>
<li>You need maximum accuracy and reasoning capability</li>
<li>Complex problem-solving is your primary use case</li>
<li>Budget is less of a constraint than performance</li>
</ul>

<p><strong>Choose ${modelB} if:</strong></p>
<ul>
<li>Speed and efficiency are top priorities</li>
<li>You're building high-volume applications</li>
<li>Cost optimization is important</li>
</ul>

<h2>Conclusion</h2>
<p>Both ${modelA} and ${modelB} are excellent choices for ${USE_CASES.find(uc => uc.id === useCase)?.name}. Your decision should be based on your specific requirements for accuracy, speed, and cost. Consider starting with trials of both models to determine which best fits your particular workflow and performance needs.</p>
</article>
        `
        
        setGeneratedContent(demoContent)
        setArticleTitle(`${modelA} vs ${modelB}: The Ultimate AI Comparison`)
        setMetaDescription(`Comprehensive comparison between ${modelA} and ${modelB} for ${USE_CASES.find(uc => uc.id === useCase)?.name}. Expert analysis, benchmarks, and recommendations.`)
        
        // Simulate updating daily count in demo mode
        setProfile({
          ...profile,
          articles_generated_today: profile.articles_generated_today + 1
        })
        
        return
      }
      
      // Try to call the real API
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: `${modelA} vs ${modelB}: ${useCase}`,
          modelA,
          modelB,
          aiEngine,
          articleLength,
          temperature: temperature[0],
          contentType,
          seoKeywords,
          targetAudience,
          brandVoice,
          includeWebSearch,
          includeSerpAnalysis,
          webSearchDepth,
          includeRecentNews
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate content")
      }

      const data = await response.json()
      setGeneratedContent(data.content)
      
      // Capture web research metadata if available
      if (data.metadata?.webResearch) {
        setWebResearchMetadata(data.metadata.webResearch)
      } else {
        setWebResearchMetadata(null)
      }
      
      // Extract title and meta description from content
      const titleMatch = data.content.match(/<h1[^>]*>(.*?)<\/h1>/)
      const metaMatch = data.content.match(/<!-- Meta Description: ([^-]*) -->/)
      
      setArticleTitle(titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '') : `${modelA} vs ${modelB}`)
      setMetaDescription(metaMatch ? metaMatch[1].trim() : '')

      // Update user's daily count
      await supabase
        .from('profiles')
        .update({ 
          articles_generated_today: profile.articles_generated_today + 1,
          last_generation_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', user.id)

      setProfile({
        ...profile,
        articles_generated_today: profile.articles_generated_today + 1
      })
      
    } catch (error) {
      console.error("Error generating content:", error)
      alert("Failed to generate content. Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!generatedContent || !user) return

    setSaving(true)
    
    try {
      // In demo mode, just show success message
      if (user.id === 'demo-user') {
        // Simulate saving delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        alert("Article saved successfully! (Demo mode - article not actually saved)")
        setSaving(false)
        return
      }
      
      const { error } = await supabase
        .from('articles')
        .insert({
          user_id: user.id,
          title: articleTitle,
          content: generatedContent,
          meta_description: metaDescription,
          model_a: modelA,
          model_b: modelB,
          use_case: useCase,
          article_length: articleLength,
          ai_engine: aiEngine
        })

      if (error) throw error
      
      alert("Article saved successfully!")
    } catch (error) {
      console.error("Error saving article:", error)
      alert("Failed to save article. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    alert("Content copied to clipboard!")
  }

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${articleTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Setting up Generator...</h2>
          <p className="text-gray-600 mb-4">Preparing your AI content workspace</p>
          <div className="animate-pulse">
            <div className="h-2 bg-blue-200 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  const dailyLimit = profile.plan === 'free' ? 5 : profile.plan === 'pro' ? 25 : 999
  const articlesUsed = profile.articles_generated_today || 0
  const canGenerate = articlesUsed < dailyLimit
  const progressPercentage = (articlesUsed / dailyLimit) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Use new AppHeader component with AI selector */}
      <AppHeader
        user={user}
        profile={profile}
        onSignOut={handleSignOut}
        selectedAIModel={aiEngine}
        onAIModelChange={setAiEngine}
        showAISelector={true}
      />

      {/* Page Navigation */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Article Generator
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-xl px-3 py-2 border border-gray-200">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-700">
                  {articlesUsed}/{dailyLimit} used today
                </span>
              </div>
              {profile.plan === 'free' && (
                <Link href="/pricing">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Pro
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Usage Progress */}
        <Card className="mb-8 glass-card border-0 shadow-premium">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Daily Usage</h3>
                  <p className="text-sm text-gray-600">Track your article generation</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{articlesUsed}</div>
                <div className="text-sm text-gray-500">of {dailyLimit} articles</div>
              </div>
            </div>
            <Progress value={progressPercentage} className="mb-4 h-2" />
            {!canGenerate ? (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-orange-600" />
                  <p className="text-sm text-orange-800 font-medium">
                    Daily limit reached. <Link href="/pricing" className="underline hover:no-underline">Upgrade to Pro</Link> for unlimited articles.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-800 font-medium">
                    {dailyLimit - articlesUsed} articles remaining today
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Generation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                Article Configuration
              </CardTitle>
              <CardDescription>
                Configure your AI model comparison article
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Model Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modelA">Model A</Label>
                  <Select value={modelA} onValueChange={setModelA}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select first model" />
                    </SelectTrigger>
                    <SelectContent>
                      {AI_MODEL_NAMES.map((model) => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="modelB">Model B</Label>
                  <Select value={modelB} onValueChange={setModelB}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select second model" />
                    </SelectTrigger>
                    <SelectContent>
                      {AI_MODEL_NAMES.map((model) => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Use Case */}
              <div className="space-y-2">
                <Label>Use Case</Label>
                <div className="grid grid-cols-2 gap-2">
                  {USE_CASES.map((uc) => (
                    <Button
                      key={uc.id}
                      variant={useCase === uc.id ? "default" : "outline"}
                      className="justify-start h-auto p-4"
                      onClick={() => setUseCase(uc.id)}
                    >
                      <div className="text-left">
                        <div className="flex items-center space-x-2">
                          <span>{uc.icon}</span>
                          <span className="font-medium">{uc.name}</span>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* AI Engine */}
              <div className="space-y-2">
                <Label>AI Writing Engine</Label>
                <Select value={aiEngine} onValueChange={setAiEngine}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI engine" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{model.name}</span>
                            <span className="text-xs text-gray-500">{model.description}</span>
                            <span className="text-xs text-blue-600">{model.provider}</span>
                          </div>
                          <div className="flex items-center space-x-2 ml-2">
                            {model.tier === 'pro' && profile?.plan === 'free' && (
                              <Crown className="h-4 w-4 text-yellow-500" />
                            )}
                            <span className="text-xs text-gray-400">
                              {model.costPer1000Tokens === 0 ? 'Free' : `$${model.costPer1000Tokens}/1K`}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  {getModelById(aiEngine)?.provider && `Using ${getModelById(aiEngine)?.provider} provider`}
                </p>
              </div>

              {/* Article Length */}
              <div className="space-y-2">
                <Label>Article Length</Label>
                <Select value={articleLength} onValueChange={setArticleLength}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (800-1000 words)</SelectItem>
                    <SelectItem value="medium">Medium (1200-1500 words)</SelectItem>
                    <SelectItem value="long">Long (1800-2500 words)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Creativity */}
              <div className="space-y-2">
                <Label>Creativity Level: {temperature[0]}</Label>
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  max={1}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Focused</span>
                  <span>Creative</span>
                </div>
              </div>

              {/* Content Type */}
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comparison">Model Comparison</SelectItem>
                    <SelectItem value="guide">Comprehensive Guide</SelectItem>
                    <SelectItem value="how-to">How-to Tutorial</SelectItem>
                    <SelectItem value="news">News Article</SelectItem>
                    <SelectItem value="informative">Informative Content</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Brand Voice */}
              <div className="space-y-2">
                <Label>Brand Voice</Label>
                <Select value={brandVoice} onValueChange={setBrandVoice}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Friendly & Conversational</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="technical">Technical & Detailed</SelectItem>
                    <SelectItem value="casual">Casual & Approachable</SelectItem>
                    <SelectItem value="journalistic">Journalistic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Web Research Features */}
              <Collapsible defaultOpen={false}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between" type="button">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4" />
                      <span>Web Research & SEO</span>
                      {profile?.plan === 'free' && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  {/* Web Search Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="flex items-center space-x-2">
                        <Search className="w-4 h-4" />
                        <span>Real-time Web Research</span>
                      </Label>
                      <p className="text-xs text-gray-500">
                        Include latest information from web search
                      </p>
                    </div>
                    <Switch
                      checked={includeWebSearch}
                      onCheckedChange={setIncludeWebSearch}
                      disabled={profile?.plan === 'free'}
                    />
                  </div>

                  {/* SERP Analysis Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>SERP Optimization</span>
                      </Label>
                      <p className="text-xs text-gray-500">
                        Analyze top-ranking content for better SEO
                      </p>
                    </div>
                    <Switch
                      checked={includeSerpAnalysis}
                      onCheckedChange={setIncludeSerpAnalysis}
                      disabled={profile?.plan === 'free'}
                    />
                  </div>

                  {/* Recent News Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Include Recent News</Label>
                      <p className="text-xs text-gray-500">
                        Focus on content from the last month
                      </p>
                    </div>
                    <Switch
                      checked={includeRecentNews}
                      onCheckedChange={setIncludeRecentNews}
                      disabled={profile?.plan === 'free' || !includeWebSearch}
                    />
                  </div>

                  {/* Search Depth */}
                  {includeWebSearch && (
                    <div className="space-y-2">
                      <Label>Research Depth: {webSearchDepth} sources</Label>
                      <Slider
                        value={[webSearchDepth]}
                        onValueChange={(value) => setWebSearchDepth(value[0])}
                        max={10}
                        min={3}
                        step={1}
                        className="w-full"
                        disabled={profile?.plan === 'free'}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Quick (3)</span>
                        <span>Comprehensive (10)</span>
                      </div>
                    </div>
                  )}

                  {/* SEO Keywords */}
                  <div className="space-y-2">
                    <Label htmlFor="seoKeywords">SEO Keywords</Label>
                    <Input
                      id="seoKeywords"
                      placeholder="e.g., AI models, machine learning, comparison"
                      value={seoKeywords}
                      onChange={(e) => setSeoKeywords(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Comma-separated keywords to naturally include
                    </p>
                  </div>

                  {/* Target Audience */}
                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Input
                      id="targetAudience"
                      placeholder="e.g., developers, business leaders, researchers"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Who is this content primarily for?
                    </p>
                  </div>

                  {/* Free Plan Info */}
                  {profile?.plan === 'free' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <Info className="w-4 h-4 text-amber-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-800">
                            Upgrade to unlock web research
                          </p>
                          <p className="text-xs text-amber-700 mt-1">
                            Get real-time data, SERP analysis, and advanced SEO features
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>

              {/* Generate Button */}
              <Button 
                onClick={handleGenerate} 
                disabled={!modelA || !modelB || !useCase || !aiEngine || generating || !canGenerate}
                className="w-full h-12"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Article...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Generate Article
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Article Preview</CardTitle>
              <CardDescription>
                Generated content will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedContent ? (
                <div className="space-y-4">
                  {/* Web Research Metadata */}
                  {webResearchMetadata && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Globe className="w-4 h-4 text-green-600" />
                        <h4 className="font-medium text-green-800">Web Research Summary</h4>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-green-800">{webResearchMetadata.totalResults}</div>
                          <div className="text-green-600">Total Results</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-800">{webResearchMetadata.sourcesFound}</div>
                          <div className="text-green-600">Sources Found</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-800">{webResearchMetadata.contentScraped}</div>
                          <div className="text-green-600">Pages Analyzed</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-800">{webResearchMetadata.uniqueDomains}</div>
                          <div className="text-green-600">Unique Domains</div>
                        </div>
                      </div>
                      {webResearchMetadata.keyTopics && webResearchMetadata.keyTopics.length > 0 && (
                        <div className="mt-3">
                          <div className="text-xs font-medium text-green-700 mb-2">Key Research Topics:</div>
                          <div className="flex flex-wrap gap-1">
                            {webResearchMetadata.keyTopics.slice(0, 8).map((topic: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-700">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Article Actions */}
                  <div className="flex space-x-2 border-b pb-4">
                    <Button onClick={handleSave} disabled={saving} size="sm">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    </Button>
                    <Button onClick={handleCopy} variant="outline" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button onClick={handleDownload} variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Content Preview */}
                  <div 
                    className="prose prose-sm max-w-none bg-white p-6 rounded-lg border max-h-96 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: generatedContent }}
                  />
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Configure your article settings and click "Generate Article" to see the preview</p>
                  {includeWebSearch && profile?.plan !== 'free' && (
                    <div className="mt-4 text-sm">
                      <div className="flex items-center justify-center space-x-2 text-blue-600">
                        <Globe className="w-4 h-4" />
                        <span>Web research enabled - Latest data will be included</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
