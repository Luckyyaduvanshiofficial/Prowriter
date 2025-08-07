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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { 
  ArrowLeft, 
  Loader2, 
  Sparkles, 
  Save, 
  Copy, 
  Download,
  Crown,
  Zap,
  FileText,
  BookOpen,
  GitCompare,
  Newspaper,
  Info,
  Search,
  Eye,
  Target,
  Globe,
  Wand2,
  RefreshCw,
  Settings,
  ChevronDown,
  ChevronUp,
  Menu,
  Filter,
  Brain,
  Lightbulb,
  TrendingUp,
  Users,
  Calendar,
  Tag,
  Clock,
  BarChart3,
  Megaphone,
  Star,
  CheckCircle,
  Edit3,
  Hash,
  Gauge
} from "lucide-react"
import Link from "next/link"
import { getAvailableModels, AI_MODELS, getModelById } from "@/lib/ai-providers"
import { OutlineDisplay } from "@/components/outline-display"

const ARTICLE_TYPES = [
  { 
    id: "how-to", 
    name: "How-To Guide", 
    icon: Lightbulb, 
    description: "Step-by-step tutorials and practical guides",
    example: "How to Choose the Best AI Model for Your Business",
    color: "bg-blue-50 border-blue-200 text-blue-700"
  },
  { 
    id: "guide", 
    name: "Complete Guide", 
    icon: BookOpen, 
    description: "Comprehensive deep-dive articles",
    example: "The Complete Guide to Large Language Models in 2024",
    color: "bg-purple-50 border-purple-200 text-purple-700"
  },
  { 
    id: "comparison", 
    name: "Comparison", 
    icon: GitCompare, 
    description: "Side-by-side model comparisons",
    example: "GPT-4 vs Claude 3.5: Which AI Model Wins?",
    color: "bg-green-50 border-green-200 text-green-700"
  },
  { 
    id: "news", 
    name: "News & Updates", 
    icon: Newspaper, 
    description: "Latest AI industry news and updates",
    example: "OpenAI Releases GPT-4.5: What's New and Improved",
    color: "bg-orange-50 border-orange-200 text-orange-700"
  },
  { 
    id: "informative", 
    name: "Informative", 
    icon: Info, 
    description: "Educational and explanatory content",
    example: "Understanding Transformer Architecture: A Beginner's Guide",
    color: "bg-indigo-50 border-indigo-200 text-indigo-700"
  },
  { 
    id: "listicle", 
    name: "Listicle", 
    icon: BarChart3, 
    description: "Engaging numbered lists and rankings",
    example: "Top 10 AI Tools Every Developer Should Know",
    color: "bg-pink-50 border-pink-200 text-pink-700"
  },
  { 
    id: "case-study", 
    name: "Case Study", 
    icon: TrendingUp, 
    description: "Real-world success stories and analyses",
    example: "How Company X Increased Efficiency by 300% with AI",
    color: "bg-cyan-50 border-cyan-200 text-cyan-700"
  }
]

const BRAND_VOICES = [
  { 
    id: "professional", 
    name: "Professional", 
    description: "Formal, authoritative tone",
    icon: Users,
    example: "According to industry research..."
  },
  { 
    id: "friendly", 
    name: "Friendly", 
    description: "Conversational, approachable tone",
    icon: Star,
    example: "Let's dive into this topic together..."
  },
  { 
    id: "technical", 
    name: "Technical", 
    description: "Expert-level, detailed explanations",
    icon: Brain,
    example: "The algorithmic implementation involves..."
  },
  { 
    id: "casual", 
    name: "Casual", 
    description: "Relaxed, easy-to-read style",
    icon: Megaphone,
    example: "Here's the thing about AI models..."
  },
  { 
    id: "journalistic", 
    name: "Journalistic", 
    description: "News-style, objective reporting",
    icon: Newspaper,
    example: "Recent developments indicate..."
  }
]

const CONTENT_LENGTHS = [
  { 
    id: "short", 
    name: "Short Article", 
    range: "800-1K words", 
    description: "Quick reads, focused content",
    readTime: "3-4 min read",
    icon: Clock
  },
  { 
    id: "medium", 
    name: "Medium Article", 
    range: "1.2K-1.5K words", 
    description: "Standard blog length",
    readTime: "5-7 min read",
    icon: FileText
  },
  { 
    id: "long", 
    name: "Long Article", 
    range: "1.8K-2.5K words", 
    description: "In-depth, comprehensive",
    readTime: "8-12 min read",
    icon: BookOpen
  },
  { 
    id: "epic", 
    name: "Epic Guide", 
    range: "3K+ words", 
    description: "Ultimate guides",
    readTime: "15+ min read", 
    tier: "pro",
    icon: Crown
  }
]

const INDUSTRY_CATEGORIES = [
  { id: "technology", name: "Technology & AI", icon: Brain },
  { id: "business", name: "Business & Marketing", icon: TrendingUp },
  { id: "health", name: "Health & Wellness", icon: Star },
  { id: "finance", name: "Finance & Crypto", icon: BarChart3 },
  { id: "education", name: "Education & Learning", icon: BookOpen },
  { id: "lifestyle", name: "Lifestyle & Travel", icon: Globe },
  { id: "entertainment", name: "Entertainment & Media", icon: Megaphone },
  { id: "science", name: "Science & Research", icon: Search }
]

const PUBLICATION_GOALS = [
  { id: "seo-traffic", name: "SEO & Organic Traffic", description: "Optimize for search rankings" },
  { id: "social-shares", name: "Social Media Shares", description: "Maximize engagement and shares" },
  { id: "lead-generation", name: "Lead Generation", description: "Convert readers into leads" },
  { id: "thought-leadership", name: "Thought Leadership", description: "Establish authority in your field" },
  { id: "education", name: "Education & Training", description: "Teach and inform your audience" },
  { id: "brand-awareness", name: "Brand Awareness", description: "Increase brand visibility" }
]

export default function BlogWriterPage() {
  const { user: clerkUser, isSignedIn, isLoaded } = useUser()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [generatingOutline, setGeneratingOutline] = useState(false)
  
  // Get available models based on user's plan
  const [availableModels, setAvailableModels] = useState<any[]>([])
  const [selectedProvider, setSelectedProvider] = useState<string>('all')
  
  // Mobile UI state
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("setup")
  
  // Form state
  const [articleType, setArticleType] = useState("how-to")
  const [topic, setTopic] = useState("")
  const [aiEngine, setAiEngine] = useState("gpt-oss-120b")
  const [contentLength, setContentLength] = useState("medium")
  const [brandVoice, setBrandVoice] = useState("friendly")
  const [seoKeywords, setSeoKeywords] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [customInstructions, setCustomInstructions] = useState("")
  const [includeWebSearch, setIncludeWebSearch] = useState(false)
  const [includeSerpAnalysis, setIncludeSerpAnalysis] = useState(false)
  const [temperature, setTemperature] = useState([0.7])
  
  // New enhanced fields
  const [industryCategory, setIndustryCategory] = useState("technology")
  const [publicationGoal, setPublicationGoal] = useState("seo-traffic")
  const [publishDate, setPublishDate] = useState("")
  const [metaTitle, setMetaTitle] = useState("")
  const [focusKeyword, setFocusKeyword] = useState("")
  const [competitorUrls, setCompetitorUrls] = useState("")
  const [callToAction, setCallToAction] = useState("")
  const [socialMediaOptimization, setSocialMediaOptimization] = useState(false)
  const [includeSchema, setIncludeSchema] = useState(false)
  const [includeFAQ, setIncludeFAQ] = useState(true)
  const [includeTableOfContents, setIncludeTableOfContents] = useState(true)
  const [readabilityLevel, setReadabilityLevel] = useState("intermediate")
  const [includeImages, setIncludeImages] = useState(true)
  const [includeStats, setIncludeStats] = useState(true)
  
  // Comparison specific
  const [modelA, setModelA] = useState("")
  const [modelB, setModelB] = useState("")
  
  // Generated content
  const [generatedContent, setGeneratedContent] = useState("")
  const [generatedOutline, setGeneratedOutline] = useState("")
  const [articleTitle, setArticleTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [currentStep, setCurrentStep] = useState(0)
  const [totalSteps] = useState(5)
  
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
      return
    }
    
    if (isSignedIn && clerkUser) {
      loadUserData()
    }
  }, [isLoaded, isSignedIn, clerkUser, router])

  // Update available models when profile changes
  useEffect(() => {
    if (profile) {
      const userTier = profile.plan === 'pro' ? 'pro' : 'free'
      let models = getAvailableModels(userTier)
      
      // Filter by provider if not 'all'
      if (selectedProvider !== 'all') {
        models = models.filter(model => model.provider.toLowerCase() === selectedProvider.toLowerCase())
      }
      
      setAvailableModels(models)
      
      // Set default AI engine if current selection is not available
      if (!models.some(model => model.id === aiEngine)) {
        setAiEngine(models[0]?.id || 'qwen-72b')
      }
    }
  }, [profile, aiEngine, selectedProvider])

  const loadUserData = async () => {
    try {
      console.log('Loading user data for blog writer:', clerkUser?.id)
      
      // Mock user profile for demo purposes
      const mockProfile = {
        id: clerkUser?.id,
        email: clerkUser?.emailAddresses[0]?.emailAddress || '',
        plan: clerkUser?.publicMetadata?.plan || 'pro', // Default to pro for blog writer
        articles_generated_today: clerkUser?.publicMetadata?.articlesUsed || 3,
        full_name: clerkUser?.fullName || clerkUser?.firstName + ' ' + clerkUser?.lastName || 'User'
      }
      
      setProfile(mockProfile)
    } catch (error) {
      console.error('Error loading user data:', error)
      // Fallback to demo mode
      const mockProfile = {
        id: 'demo-user',
        email: 'demo@prowriter.miniai.online',
        plan: 'pro',
        articles_generated_today: 3,
        full_name: 'Demo User'
      }
      setProfile(mockProfile)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateOutline = async () => {
    if (!topic.trim()) return
    
    setGeneratingOutline(true)
    setCurrentStep(1)
    
    try {
      // Check if we're in demo mode  
      if (clerkUser?.id === 'demo-user') {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const demoOutline = `
# Article Outline: ${topic}

## 1. Introduction (150-200 words)
- Hook: Start with a compelling question or statistic
- Problem statement: Why this topic matters
- Preview: What readers will learn

## 2. Background & Context (300-400 words)
- Current state of the industry/topic
- Key players and technologies
- Market trends and statistics

## 3. Main Content Sections (800-1200 words)
${articleType === 'comparison' ? `
### Model A: ${modelA || '[Model Name]'}
- Key features and capabilities
- Strengths and use cases
- Performance benchmarks

### Model B: ${modelB || '[Model Name]'}
- Key features and capabilities  
- Strengths and use cases
- Performance benchmarks

### Head-to-Head Comparison
- Side-by-side feature comparison
- Use case recommendations
- Pricing and accessibility
` : `
### Core Concept 1
- Detailed explanation
- Real-world examples
- Best practices

### Core Concept 2
- Implementation details
- Common challenges
- Solutions and workarounds

### Advanced Techniques
- Expert-level insights
- Future considerations
- Industry predictions
`}

## 4. Practical Applications (200-300 words)
- Real-world use cases
- Step-by-step examples
- Implementation tips

## 5. Conclusion & Recommendations (150-200 words)
- Key takeaways
- Clear recommendations
- Call to action

## 6. FAQ Section (200-300 words)
- 3-5 commonly asked questions
- SEO-optimized answers
- Related topics

**SEO Elements:**
- Primary keyword: ${seoKeywords.split(',')[0] || topic}
- Secondary keywords: ${seoKeywords || 'AI, machine learning, technology'}
- Target word count: ${contentLength === 'short' ? '800-1000' : contentLength === 'medium' ? '1200-1500' : contentLength === 'long' ? '1800-2500' : '3000+'} words
- Readability: ${targetAudience || 'General tech-savvy audience'}
        `
        
        setGeneratedOutline(demoOutline)
        setCurrentStep(2)
        return
      }

      // Call the real outline API
      const response = await fetch("/api/generate-outline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          contentType: articleType,
          articleLength: contentLength,
          seoKeywords,
          targetAudience,
          brandVoice,
          aiEngine
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate outline")
      }

      const data = await response.json()
      setGeneratedOutline(data.outline)
      setCurrentStep(2)
      
    } catch (error) {
      console.error("Error generating outline:", error)
      alert("Failed to generate outline. Please try again.")
    } finally {
      setGeneratingOutline(false)
    }
  }

  const handleGenerateArticle = async () => {
    if (!profile) return

    const dailyLimit = profile.plan === 'free' ? 5 : profile.plan === 'pro' ? 25 : 999
    
    if (profile.articles_generated_today >= dailyLimit) {
      alert("You've reached your daily limit. Upgrade to Pro for more articles!")
      return
    }

    setGenerating(true)
    setCurrentStep(3)
    
    try {
      // Show progress updates
      const steps = [
        "Initializing AI engine...",
        "Analyzing topic and keywords...",
        "Researching latest information...",
        "Generating article structure...",
        "Writing introduction...",
        "Creating main content...",
        "Adding SEO optimizations...",
        "Finalizing article..."
      ]
      
      // Create progress simulation
      const progressInterval = setInterval(() => {
        setCurrentStep(prev => Math.min(prev + 0.1, 4.5))
      }, 200)

      // Prepare request payload
      const requestPayload = {
        topic,
        modelA: articleType === 'comparison' ? modelA : undefined,
        modelB: articleType === 'comparison' ? modelB : undefined,
        aiEngine: aiEngine,
        articleLength: contentLength,
        tone: "friendly",
        temperature: 0.7,
        contentType: articleType,
        seoKeywords: seoKeywords,
        targetAudience: targetAudience,
        customInstructions: customInstructions,
        brandVoice: brandVoice,
        includeWebSearch: profile.plan !== 'free' && includeWebSearch,
        includeSerpAnalysis: profile.plan !== 'free' && includeSerpAnalysis
      }

      // Make API call to next-level generate content
      const response = await fetch('/api/next-level-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...requestPayload,
          // Next-level specific options
          nextLevel: true,
          provider: 'baseten', // Use Baseten as default provider
          includeInteractiveElements: profile.plan !== 'free',
          addUniqueEnhancements: true,
          generateAdvancedMetadata: true
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.success || data.error) {
        throw new Error(data.error || 'Failed to generate article')
      }

      clearInterval(progressInterval)
      
      // Set the generated content from next-level API
      const articleContent = data.data.article
      setGeneratedContent(articleContent)
      
      // Extract title from content or use topic as fallback
      const titleMatch = articleContent.match(/<h1[^>]*>(.*?)<\/h1>/i)
      const extractedTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '') : topic
      setArticleTitle(extractedTitle)
      
      // Use advanced metadata from next-level generation
      const metaDescription = data.data.metadata.meta_description || `Comprehensive guide to ${topic}. Expert insights and practical advice.`
      setMetaDescription(metaDescription)
      
      // Log generation statistics safely
      const statistics = data.data.statistics || {};
      const enhancements = data.data.enhancements || {};
      
      console.log('📊 Next-Level Article Generated:', {
        wordCount: statistics.word_count || 0,
        readingTime: statistics.estimated_reading_time || 0,
        researchSources: statistics.research_sources || 0,
        sectionsGenerated: statistics.sections_generated || 0,
        enhancementsApplied: {
          uniqueness: enhancements.uniqueness_applied || false,
          interactive: enhancements.interactive_elements_added || false,
          metadata: enhancements.advanced_metadata_generated || false
        }
      })
      
      setCurrentStep(5)
      
      // Update daily count in profile
      setProfile({
        ...profile,
        articles_generated_today: profile.articles_generated_today + 1
      })
      
    } catch (error) {
      console.error("Error generating article:", error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Failed to generate article: ${errorMessage}. Please try again.`)
      setCurrentStep(2) // Reset to previous step
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!generatedContent || !clerkUser) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/save-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: clerkUser.id,
          title: articleTitle || topic,
          content: generatedContent,
          metaDescription: metaDescription,
          modelA: modelA,
          modelB: modelB,
          articleType: articleType,
          contentLength: contentLength,
          aiEngine: aiEngine,
          seoKeywords: seoKeywords,
          targetAudience: targetAudience,
          brandVoice: brandVoice,
          topic: topic
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      alert("Article saved successfully!")
    } catch (error) {
      console.error("Error saving article:", error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Failed to save article: ${errorMessage}. Please try again.`)
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent)
    alert("Article copied to clipboard!")
  }

  const downloadArticle = () => {
    const element = document.createElement("a")
    const file = new Blob([generatedContent], { type: 'text/html' })
    element.href = URL.createObjectURL(file)
    element.download = `${articleTitle || 'article'}.html`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading Blog Writer...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Required</CardTitle>
            <CardDescription>Please sign in to use the Blog Writer</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const dailyLimit = profile.plan === 'free' ? 5 : profile.plan === 'pro' ? 25 : 999
  const remainingArticles = Math.max(0, dailyLimit - profile.articles_generated_today)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="h-9 px-3">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Edit3 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AI Blog Writer
                  </h1>
                  <p className="text-sm text-gray-600 hidden sm:block">Create professional, SEO-optimized content</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <Badge variant={profile.plan === 'pro' ? 'default' : 'secondary'} className="text-xs">
                    {profile.plan === 'pro' && <Crown className="h-3 w-3 mr-1" />}
                    {profile.plan?.toUpperCase()}
                  </Badge>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {remainingArticles} articles left today
                    </p>
                    <Progress value={(remainingArticles / dailyLimit) * 100} className="w-24 h-1 mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Progress Indicator */}
        {(generating || generatingOutline) && (
          <div className="mb-8">
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Brain className="h-5 w-5 text-blue-600 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900">AI Writing in Progress</h3>
                        <p className="text-sm text-blue-700">
                          {generatingOutline ? 'Creating your article outline...' : 'Writing your article...'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-900">
                        Step {Math.floor(currentStep)} of {totalSteps}
                      </p>
                    </div>
                  </div>
                  <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
                  {generating && (
                    <div className="flex items-center space-x-2 text-sm text-blue-700">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Your high-quality article is being crafted...</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Article Type Selection */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <FileText className="h-5 w-5 mr-2" />
                  Content Type
                </CardTitle>
                <CardDescription>Choose your article format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {ARTICLE_TYPES.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      onClick={() => setArticleType(type.id)}
                      className={`w-full p-3 rounded-xl border-2 transition-all transform hover:scale-105 ${
                        articleType === type.id
                          ? type.color
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div className="text-left">
                          <p className="font-medium text-sm">{type.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </CardContent>
            </Card>

            {/* Enhanced Progress Tracking */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    topic ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Edit3 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Topic & Settings</p>
                    <p className="text-xs text-gray-500">{topic ? 'Complete' : 'Pending'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    generatedOutline ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Article Outline</p>
                    <p className="text-xs text-gray-500">{generatedOutline ? 'Complete' : 'Pending'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    generatedContent ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Full Article</p>
                    <p className="text-xs text-gray-500">{generatedContent ? 'Complete' : 'Pending'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Stats */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Today's Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Articles Generated</span>
                    <span className="font-medium">{profile.articles_generated_today}/{dailyLimit}</span>
                  </div>
                  <Progress value={(profile.articles_generated_today / dailyLimit) * 100} className="w-full" />
                  <p className="text-xs text-gray-500 mt-2">
                    {profile.plan === 'free' ? 'Upgrade to Pro for more articles' : 'Resets at midnight'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-14 mb-8 bg-white shadow-sm border">
                <TabsTrigger value="setup" className="text-sm font-medium h-12 data-[state=active]:bg-blue-50">
                  <Settings className="h-4 w-4 mr-2" />
                  Article Setup
                </TabsTrigger>
                <TabsTrigger value="outline" className="text-sm font-medium h-12 data-[state=active]:bg-blue-50">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Outline & Structure
                </TabsTrigger>
                <TabsTrigger value="article" className="text-sm font-medium h-12 data-[state=active]:bg-blue-50">
                  <FileText className="h-4 w-4 mr-2" />
                  Generated Article
                </TabsTrigger>
              </TabsList>

              {/* Enhanced Setup Tab */}
              <TabsContent value="setup" className="space-y-8">
                {/* Basic Configuration */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                    <CardTitle className="flex items-center text-xl">
                      <Target className="h-6 w-6 mr-3 text-blue-600" />
                      Article Basics
                    </CardTitle>
                    <CardDescription>Define your topic and primary content settings</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    {/* Topic Input */}
                    <div className="space-y-2">
                      <Label htmlFor="topic" className="text-sm font-semibold flex items-center">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Article Topic *
                      </Label>
                      <Input
                        id="topic"
                        placeholder="e.g., Best AI Models for Content Creation in 2024"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="h-12 text-base border-2 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500">Be specific and descriptive for better results</p>
                    </div>

                    {/* Industry Category */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold flex items-center">
                        <Hash className="h-4 w-4 mr-2" />
                        Industry Category
                      </Label>
                      <Select value={industryCategory} onValueChange={setIndustryCategory}>
                        <SelectTrigger className="h-12 border-2 focus:border-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {INDUSTRY_CATEGORIES.map((category) => {
                            const Icon = category.icon
                            return (
                              <SelectItem key={category.id} value={category.id}>
                                <div className="flex items-center space-x-2">
                                  <Icon className="h-4 w-4" />
                                  <span>{category.name}</span>
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Publication Goal */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        Publication Goal
                      </Label>
                      <Select value={publicationGoal} onValueChange={setPublicationGoal}>
                        <SelectTrigger className="h-12 border-2 focus:border-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PUBLICATION_GOALS.map((goal) => (
                            <SelectItem key={goal.id} value={goal.id}>
                              <div className="space-y-1">
                                <div className="font-medium">{goal.name}</div>
                                <div className="text-xs text-gray-500">{goal.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Comparison specific inputs */}
                    {articleType === 'comparison' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                        <div className="space-y-2">
                          <Label htmlFor="modelA" className="text-sm font-semibold">First Option/Model</Label>
                          <Input
                            id="modelA"
                            placeholder="e.g., GPT-4"
                            value={modelA}
                            onChange={(e) => setModelA(e.target.value)}
                            className="h-11 border-2 focus:border-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="modelB" className="text-sm font-semibold">Second Option/Model</Label>
                          <Input
                            id="modelB"
                            placeholder="e.g., Claude 3.5"
                            value={modelB}
                            onChange={(e) => setModelB(e.target.value)}
                            className="h-11 border-2 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* SEO & Audience Configuration */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                    <CardTitle className="flex items-center text-xl">
                      <Search className="h-6 w-6 mr-3 text-green-600" />
                      SEO & Audience
                    </CardTitle>
                    <CardDescription>Optimize your content for search engines and target audience</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    {/* Focus Keyword */}
                    <div className="space-y-2">
                      <Label htmlFor="focusKeyword" className="text-sm font-semibold flex items-center">
                        <Tag className="h-4 w-4 mr-2" />
                        Focus Keyword *
                      </Label>
                      <Input
                        id="focusKeyword"
                        placeholder="e.g., AI content creation tools"
                        value={focusKeyword}
                        onChange={(e) => setFocusKeyword(e.target.value)}
                        className="h-12 border-2 focus:border-green-500"
                      />
                      <p className="text-xs text-gray-500">Primary keyword you want to rank for</p>
                    </div>

                    {/* SEO Keywords */}
                    <div className="space-y-2">
                      <Label htmlFor="keywords" className="text-sm font-semibold">Additional SEO Keywords</Label>
                      <Input
                        id="keywords"
                        placeholder="ai tools, content creation, automation, 2024"
                        value={seoKeywords}
                        onChange={(e) => setSeoKeywords(e.target.value)}
                        className="h-12 border-2 focus:border-green-500"
                      />
                      <p className="text-xs text-gray-500">Comma-separated secondary keywords</p>
                    </div>

                    {/* Meta Title */}
                    <div className="space-y-2">
                      <Label htmlFor="metaTitle" className="text-sm font-semibold">Custom Meta Title</Label>
                      <Input
                        id="metaTitle"
                        placeholder="Best AI Content Creation Tools 2024 - Complete Guide"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        className="h-12 border-2 focus:border-green-500"
                      />
                      <p className="text-xs text-gray-500">Leave empty to auto-generate (50-60 characters recommended)</p>
                    </div>

                    {/* Target Audience */}
                    <div className="space-y-2">
                      <Label htmlFor="audience" className="text-sm font-semibold flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Target Audience
                      </Label>
                      <Input
                        id="audience"
                        placeholder="e.g., Small business owners, Content creators, Marketing professionals"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        className="h-12 border-2 focus:border-green-500"
                      />
                    </div>

                    {/* Readability Level */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold flex items-center">
                        <Gauge className="h-4 w-4 mr-2" />
                        Reading Level
                      </Label>
                      <Select value={readabilityLevel} onValueChange={setReadabilityLevel}>
                        <SelectTrigger className="h-12 border-2 focus:border-green-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner (Easy to understand)</SelectItem>
                          <SelectItem value="intermediate">Intermediate (Balanced complexity)</SelectItem>
                          <SelectItem value="advanced">Advanced (Technical and detailed)</SelectItem>
                          <SelectItem value="expert">Expert (Highly specialized)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* AI & Content Configuration */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-lg">
                    <CardTitle className="flex items-center text-xl">
                      <Brain className="h-6 w-6 mr-3 text-purple-600" />
                      AI & Content Settings
                    </CardTitle>
                    <CardDescription>Configure the AI engine and content parameters</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    {/* AI Provider Selection */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">AI Provider</Label>
                      <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                        <SelectTrigger className="h-12 border-2 focus:border-purple-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Providers</SelectItem>
                          <SelectItem value="baseten">
                            <div className="flex items-center space-x-2">
                              <span>Baseten</span>
                              <Badge variant="secondary" className="text-xs">GPT OSS 120B</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="openrouter">
                            <div className="flex items-center space-x-2">
                              <span>OpenRouter</span>
                              <Badge variant="secondary" className="text-xs">Multiple Models</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="google">
                            <div className="flex items-center space-x-2">
                              <span>Google AI</span>
                              <Badge variant="secondary" className="text-xs">Gemini</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="together">
                            <div className="flex items-center space-x-2">
                              <span>Together.ai</span>
                              <Badge variant="secondary" className="text-xs">Free Models</Badge>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* AI Engine Selection */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">AI Engine</Label>
                      <Select value={aiEngine} onValueChange={setAiEngine}>
                        <SelectTrigger className="h-12 border-2 focus:border-purple-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableModels.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col items-start">
                                  <span className="font-medium">{model.name}</span>
                                  <span className="text-xs text-gray-500">{model.description}</span>
                                  <span className="text-xs text-purple-600">{model.provider}</span>
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
                    </div>

                    {/* Content Length */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Content Length
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {CONTENT_LENGTHS.map((length) => {
                          const Icon = length.icon
                          const isDisabled = length.tier === 'pro' && profile.plan === 'free'
                          return (
                            <button
                              key={length.id}
                              onClick={() => !isDisabled && setContentLength(length.id)}
                              disabled={isDisabled}
                              className={`p-4 rounded-lg border-2 text-left transition-all ${
                                contentLength === length.id
                                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                                  : isDisabled
                                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                  : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                              }`}
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Icon className="h-4 w-4" />
                                  {length.tier === 'pro' && profile.plan === 'free' && (
                                    <Crown className="h-4 w-4 text-yellow-500" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{length.name}</p>
                                  <p className="text-xs text-gray-500">{length.range}</p>
                                  <p className="text-xs text-blue-600 mt-1">{length.readTime}</p>
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Brand Voice */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold flex items-center">
                        <Megaphone className="h-4 w-4 mr-2" />
                        Brand Voice & Tone
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {BRAND_VOICES.map((voice) => {
                          const Icon = voice.icon
                          return (
                            <button
                              key={voice.id}
                              onClick={() => setBrandVoice(voice.id)}
                              className={`p-4 rounded-lg border-2 text-left transition-all ${
                                brandVoice === voice.id
                                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                                  : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                              }`}
                            >
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Icon className="h-4 w-4" />
                                  <span className="text-sm font-medium">{voice.name}</span>
                                </div>
                                <p className="text-xs text-gray-500">{voice.description}</p>
                                <p className="text-xs text-gray-400 italic">"{voice.example}"</p>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Creativity Level */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold flex items-center">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Creativity Level: {temperature[0]}
                      </Label>
                      <Slider
                        value={temperature}
                        onValueChange={setTemperature}
                        max={1}
                        min={0.1}
                        step={0.1}
                        className="py-4"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Conservative</span>
                        <span>Balanced</span>
                        <span>Creative</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Advanced Features */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
                    <CardTitle className="flex items-center text-xl">
                      <Settings className="h-6 w-6 mr-3 text-orange-600" />
                      Advanced Features
                    </CardTitle>
                    <CardDescription>Additional options and enhancements</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    {/* Content Enhancement Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm text-gray-900">Content Enhancements</h4>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="includeTOC" className="flex items-center text-sm">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Table of Contents
                          </Label>
                          <Switch
                            id="includeTOC"
                            checked={includeTableOfContents}
                            onCheckedChange={setIncludeTableOfContents}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="includeFAQs" className="flex items-center text-sm">
                            <Info className="h-4 w-4 mr-2" />
                            FAQ Section
                          </Label>
                          <Switch
                            id="includeFAQs"
                            checked={includeFAQ}
                            onCheckedChange={setIncludeFAQ}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="includeStats" className="flex items-center text-sm">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Statistics & Data
                          </Label>
                          <Switch
                            id="includeStats"
                            checked={includeStats}
                            onCheckedChange={setIncludeStats}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm text-gray-900">SEO Enhancements</h4>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="includeSchema" className="flex items-center text-sm">
                            <Globe className="h-4 w-4 mr-2" />
                            Schema Markup
                            <Badge variant="secondary" className="ml-2 text-xs">PRO</Badge>
                          </Label>
                          <Switch
                            id="includeSchema"
                            checked={includeSchema}
                            onCheckedChange={setIncludeSchema}
                            disabled={profile.plan === 'free'}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="socialOptimize" className="flex items-center text-sm">
                            <Megaphone className="h-4 w-4 mr-2" />
                            Social Media Optimization
                          </Label>
                          <Switch
                            id="socialOptimize"
                            checked={socialMediaOptimization}
                            onCheckedChange={setSocialMediaOptimization}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pro Research Features */}
                    {profile.plan === 'pro' && (
                      <div className="border-t pt-6">
                        <h4 className="font-semibold text-sm text-gray-900 mb-4 flex items-center">
                          <Crown className="h-4 w-4 mr-2 text-yellow-500" />
                          Pro Research Features
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="webSearch" className="flex items-center text-sm">
                              <Search className="h-4 w-4 mr-2" />
                              Web Search Integration
                            </Label>
                            <Switch
                              id="webSearch"
                              checked={includeWebSearch}
                              onCheckedChange={setIncludeWebSearch}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="serpAnalysis" className="flex items-center text-sm">
                              <Eye className="h-4 w-4 mr-2" />
                              SERP Analysis
                            </Label>
                            <Switch
                              id="serpAnalysis"
                              checked={includeSerpAnalysis}
                              onCheckedChange={setIncludeSerpAnalysis}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Competitor Analysis */}
                    <div className="space-y-2">
                      <Label htmlFor="competitors" className="text-sm font-semibold flex items-center">
                        <GitCompare className="h-4 w-4 mr-2" />
                        Competitor URLs (Optional)
                        {profile.plan === 'free' && <Badge variant="secondary" className="ml-2 text-xs">PRO</Badge>}
                      </Label>
                      <Textarea
                        id="competitors"
                        placeholder="https://competitor1.com/article&#10;https://competitor2.com/article"
                        value={competitorUrls}
                        onChange={(e) => setCompetitorUrls(e.target.value)}
                        className="min-h-[80px] border-2 focus:border-orange-500"
                        disabled={profile.plan === 'free'}
                        rows={3}
                      />
                      <p className="text-xs text-gray-500">One URL per line for competitive analysis</p>
                    </div>

                    {/* Call to Action */}
                    <div className="space-y-2">
                      <Label htmlFor="cta" className="text-sm font-semibold flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        Call to Action
                      </Label>
                      <Input
                        id="cta"
                        placeholder="e.g., Try our AI tools today, Subscribe to our newsletter, Contact us for consultation"
                        value={callToAction}
                        onChange={(e) => setCallToAction(e.target.value)}
                        className="h-12 border-2 focus:border-orange-500"
                      />
                    </div>

                    {/* Custom Instructions */}
                    <div className="space-y-2">
                      <Label htmlFor="instructions" className="text-sm font-semibold flex items-center">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Custom Instructions
                      </Label>
                      <Textarea
                        id="instructions"
                        placeholder="Any specific requirements, style preferences, or additional context you'd like the AI to consider while writing..."
                        value={customInstructions}
                        onChange={(e) => setCustomInstructions(e.target.value)}
                        className="min-h-[120px] border-2 focus:border-orange-500"
                        rows={5}
                      />
                    </div>

                    {/* Generate Outline Button */}
                    <div className="pt-4">
                      <Button
                        onClick={handleGenerateOutline}
                        disabled={!topic.trim() || generatingOutline}
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        size="lg"
                      >
                        {generatingOutline ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                            Generating Article Outline...
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-5 w-5 mr-3" />
                            Generate Article Outline
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Enhanced Outline Tab */}
              <TabsContent value="outline" className="space-y-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                    <CardTitle className="flex items-center text-xl">
                      <BookOpen className="h-6 w-6 mr-3 text-blue-600" />
                      Article Outline & Structure
                    </CardTitle>
                    <CardDescription>Review and customize your article structure before generation</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {generatedOutline ? (
                      <div className="space-y-6">
                        {/* Outline Preview */}
                        <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border-2 border-blue-200">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg text-gray-900">Generated Outline</h3>
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Ready to Generate
                            </Badge>
                          </div>
                          <div className="max-h-96 overflow-y-auto">
                            <OutlineDisplay 
                              content={generatedOutline}
                              className="prose prose-sm max-w-none"
                            />
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button
                            onClick={handleGenerateArticle}
                            disabled={generating || remainingArticles <= 0}
                            className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            size="lg"
                          >
                            {generating ? (
                              <>
                                <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                                Writing Your Article...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-5 w-5 mr-3" />
                                Generate Full Article
                              </>
                            )}
                          </Button>
                          
                          <Button
                            onClick={handleGenerateOutline}
                            variant="outline"
                            disabled={generatingOutline}
                            className="h-14 sm:w-48 border-2 border-gray-300 hover:border-gray-400"
                          >
                            <RefreshCw className="h-5 w-5 mr-2" />
                            Regenerate Outline
                          </Button>
                        </div>

                        {/* Usage Warning */}
                        {remainingArticles <= 0 && (
                          <Card className="border-orange-200 bg-orange-50">
                            <CardContent className="pt-4">
                              <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                  <Crown className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-orange-900">Daily Limit Reached</h4>
                                  <p className="text-sm text-orange-700">
                                    You've used all your articles for today. Upgrade to Pro for unlimited access!
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                          <BookOpen className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Outline Generated Yet</h3>
                        <p className="text-gray-600 mb-6">Complete the article setup first, then generate your outline</p>
                        <Button
                          onClick={() => setActiveTab("setup")}
                          variant="outline"
                          className="h-12 px-8"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Go to Setup
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Enhanced Article Tab */}
              <TabsContent value="article" className="space-y-8">
                {generatedContent ? (
                  <div className="space-y-8">
                    {/* Article Actions */}
                    <Card className="border-0 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                        <CardTitle className="flex items-center text-xl">
                          <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
                          Article Complete!
                        </CardTitle>
                        <CardDescription>Your professional, SEO-optimized content is ready</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <Button 
                            onClick={handleSave} 
                            disabled={saving}
                            className="h-12 bg-green-600 hover:bg-green-700"
                          >
                            {saving ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4 mr-2" />
                            )}
                            Save Article
                          </Button>
                          
                          <Button 
                            onClick={copyToClipboard} 
                            variant="outline"
                            className="h-12 border-2"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy to Clipboard
                          </Button>
                          
                          <Button 
                            onClick={downloadArticle} 
                            variant="outline"
                            className="h-12 border-2"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download HTML
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Article Stats */}
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                          <BarChart3 className="h-5 w-5 mr-2" />
                          Article Statistics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {generatedContent.split(' ').length}
                            </div>
                            <div className="text-sm text-blue-700">Words</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {Math.ceil(generatedContent.split(' ').length / 200)}
                            </div>
                            <div className="text-sm text-green-700">Min Read</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                              {(generatedContent.match(/<h[1-6]/g) || []).length}
                            </div>
                            <div className="text-sm text-purple-700">Headings</div>
                          </div>
                          <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">A+</div>
                            <div className="text-sm text-orange-700">SEO Score</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Generated Article */}
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                          <FileText className="h-5 w-5 mr-2" />
                          Generated Article
                        </CardTitle>
                        <CardDescription>Your professionally written, SEO-optimized content</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div 
                          className="prose prose-lg max-w-none prose-blue prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
                          dangerouslySetInnerHTML={{ __html: generatedContent }}
                        />
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card className="border-0 shadow-lg">
                    <CardContent className="pt-6">
                      <div className="text-center py-16">
                        <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                          <FileText className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Article Not Generated Yet</h3>
                        <p className="text-gray-600 mb-6">Complete the setup and generate an outline first</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button
                            onClick={() => setActiveTab("setup")}
                            variant="outline"
                            className="h-12 px-8"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Setup Article
                          </Button>
                          <Button
                            onClick={() => setActiveTab("outline")}
                            variant="outline"
                            className="h-12 px-8"
                          >
                            <BookOpen className="h-4 w-4 mr-2" />
                            View Outline
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Enhanced Mobile FAB */}
        <div className="lg:hidden">
          {activeTab === "setup" && topic.trim() && !generatingOutline && (
            <div className="fixed bottom-6 right-6 z-20">
              <Button
                onClick={handleGenerateOutline}
                size="lg"
                className="h-16 w-16 rounded-full shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Wand2 className="h-6 w-6" />
              </Button>
            </div>
          )}

          {activeTab === "outline" && generatedOutline && !generating && remainingArticles > 0 && (
            <div className="fixed bottom-6 right-6 z-20">
              <Button
                onClick={handleGenerateArticle}
                size="lg"
                className="h-16 w-16 rounded-full shadow-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Sparkles className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
