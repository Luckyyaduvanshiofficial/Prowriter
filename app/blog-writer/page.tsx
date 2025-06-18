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
  Filter
} from "lucide-react"
import Link from "next/link"
import { getAvailableModels, AI_MODELS, getModelById } from "@/lib/ai-providers"
import { OutlineDisplay } from "@/components/outline-display"

const ARTICLE_TYPES = [
  { 
    id: "how-to", 
    name: "How-To Guide", 
    icon: FileText, 
    description: "Step-by-step tutorials and guides",
    example: "How to Choose the Best AI Model for Your Business"
  },
  { 
    id: "guide", 
    name: "Complete Guide", 
    icon: BookOpen, 
    description: "Comprehensive deep-dive articles",
    example: "The Complete Guide to Large Language Models in 2024"
  },
  { 
    id: "comparison", 
    name: "Comparison", 
    icon: GitCompare, 
    description: "Side-by-side model comparisons",
    example: "GPT-4 vs Claude 3.5: Which AI Model Wins?"
  },
  { 
    id: "news", 
    name: "News & Updates", 
    icon: Newspaper, 
    description: "Latest AI industry news and updates",
    example: "OpenAI Releases GPT-4.5: What's New and Improved"
  },
  { 
    id: "informative", 
    name: "Informative", 
    icon: Info, 
    description: "Educational and explanatory content",
    example: "Understanding Transformer Architecture: A Beginner's Guide"
  }
]

const BRAND_VOICES = [
  { id: "professional", name: "Professional", description: "Formal, authoritative tone" },
  { id: "friendly", name: "Friendly", description: "Conversational, approachable tone" },
  { id: "technical", name: "Technical", description: "Expert-level, detailed explanations" },
  { id: "casual", name: "Casual", description: "Relaxed, easy-to-read style" },
  { id: "journalistic", name: "Journalistic", description: "News-style, objective reporting" }
]

const CONTENT_LENGTHS = [
  { id: "short", name: "Short (800-1K words)", description: "Quick reads, focused content" },
  { id: "medium", name: "Medium (1.2K-1.5K words)", description: "Standard blog length" },
  { id: "long", name: "Long (1.8K-2.5K words)", description: "In-depth, comprehensive" },
  { id: "epic", name: "Epic (3K+ words)", description: "Ultimate guides", tier: "pro" }
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
  const [articleType, setArticleType] = useState("comparison")
  const [topic, setTopic] = useState("")
  const [aiEngine, setAiEngine] = useState("qwen-72b")
  const [contentLength, setContentLength] = useState("medium")
  const [brandVoice, setBrandVoice] = useState("friendly")
  const [seoKeywords, setSeoKeywords] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [customInstructions, setCustomInstructions] = useState("")
  const [includeWebSearch, setIncludeWebSearch] = useState(false)
  const [includeSerpAnalysis, setIncludeSerpAnalysis] = useState(false)
  const [temperature, setTemperature] = useState([0.7])
  
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
      
      // Log generation statistics
      console.log('📊 Next-Level Article Generated:', {
        wordCount: data.data.statistics?.word_count || 0,
        readingTime: data.data.metadata.reading_time || 0,
        researchSources: data.data.statistics?.research_sources || 0,
        sectionsGenerated: data.data.statistics?.sections_generated || 0,
        enhancementsApplied: data.data.enhancements
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
    if (!generatedContent || !user) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/save-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
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
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 lg:py-4">
            <div className="flex items-center space-x-2 lg:space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="h-9 px-2 lg:px-3">
                  <ArrowLeft className="h-4 w-4 mr-1 lg:mr-2" />
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Blog Writer
                </h1>
                <p className="text-xs lg:text-sm text-gray-600 hidden sm:block">Create professional, SEO-optimized content</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="text-right">
                <p className="text-xs lg:text-sm font-medium text-gray-900 truncate max-w-32 lg:max-w-none">
                  {profile.full_name || profile.email}
                </p>
                <div className="flex items-center space-x-1 lg:space-x-2">
                  <Badge variant={profile.plan === 'pro' ? 'default' : 'secondary'} className="text-xs">
                    {profile.plan === 'pro' && <Crown className="h-3 w-3 mr-1" />}
                    {profile.plan?.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-gray-500 hidden sm:inline">
                    {remainingArticles} left
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Mobile Progress Indicator */}
        {(generating || generatingOutline) && (
          <div className="lg:hidden mb-6">
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Generation Progress</span>
                  </div>
                  <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
                  <p className="text-sm text-gray-600">
                    Step {Math.floor(currentStep)} of {totalSteps}
                  </p>
                  {generating && (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      <span className="text-sm">Writing your article...</span>
                    </div>
                  )}
                  {generatingOutline && (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      <span className="text-sm">Creating outline...</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Mobile Article Type Selection */}
        <div className="lg:hidden mb-6">
          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between h-12">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  <span>Article Type: {ARTICLE_TYPES.find(t => t.id === articleType)?.name}</span>
                </div>
                {isAdvancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-3">
              {ARTICLE_TYPES.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => {
                      setArticleType(type.id)
                      setIsAdvancedOpen(false)
                    }}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      articleType === type.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">{type.name}</div>
                        <div className="text-sm text-gray-600">{type.description}</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Desktop Left Sidebar - Article Types */}
          <div className="hidden lg:block lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Article Types
                </CardTitle>
                <CardDescription>Choose your content format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {ARTICLE_TYPES.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      onClick={() => setArticleType(type.id)}
                      className={`w-full p-4 rounded-lg border transition-all ${
                        articleType === type.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className="h-5 w-5 mt-0.5" />
                        <div className="text-left">
                          <p className="font-medium">{type.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                          <p className="text-xs text-blue-600 mt-1 italic">{type.example}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </CardContent>
            </Card>

            {/* Progress Card */}
            {(generating || generatingOutline) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-blue-600" />
                    Generation Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
                    <p className="text-sm text-gray-600">
                      Step {Math.floor(currentStep)} of {totalSteps}
                    </p>
                    {generating && (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        <span className="text-sm">Writing your article...</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-12 mb-6">
                <TabsTrigger value="setup" className="text-sm font-medium">
                  <Settings className="h-4 w-4 mr-2 lg:mr-1" />
                  <span className="hidden sm:inline">Setup</span>
                  <span className="sm:hidden">Setup</span>
                </TabsTrigger>
                <TabsTrigger value="outline" className="text-sm font-medium">
                  <BookOpen className="h-4 w-4 mr-2 lg:mr-1" />
                  <span className="hidden sm:inline">Outline</span>
                  <span className="sm:hidden">Outline</span>
                </TabsTrigger>
                <TabsTrigger value="article" className="text-sm font-medium">
                  <FileText className="h-4 w-4 mr-2 lg:mr-1" />
                  <span className="hidden sm:inline">Article</span>
                  <span className="sm:hidden">Article</span>
                </TabsTrigger>
              </TabsList>

              {/* Setup Tab */}
              <TabsContent value="setup" className="space-y-4 lg:space-y-6">
                <Card>
                  <CardHeader className="pb-4 lg:pb-6">
                    <CardTitle className="text-lg lg:text-xl">Article Configuration</CardTitle>
                    <CardDescription>Configure your article settings and requirements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5 lg:space-y-6">
                    {/* Topic Input */}
                    <div>
                      <Label htmlFor="topic" className="text-sm font-medium">Article Topic *</Label>
                      <Input
                        id="topic"
                        placeholder="e.g., Best AI Models for Content Creation in 2024"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="mt-2 h-11 lg:h-10"
                      />
                    </div>

                    {/* Comparison specific inputs */}
                    {articleType === 'comparison' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="modelA" className="text-sm font-medium">Model A</Label>
                          <Input
                            id="modelA"
                            placeholder="e.g., GPT-4"
                            value={modelA}
                            onChange={(e) => setModelA(e.target.value)}
                            className="mt-2 h-11 lg:h-10"
                          />
                        </div>
                        <div>
                          <Label htmlFor="modelB" className="text-sm font-medium">Model B</Label>
                          <Input
                            id="modelB"
                            placeholder="e.g., Claude 3.5"
                            value={modelB}
                            onChange={(e) => setModelB(e.target.value)}
                            className="mt-2 h-11 lg:h-10"
                          />
                        </div>
                      </div>
                    )}

                    {/* SEO Keywords */}
                    <div>
                      <Label htmlFor="keywords" className="text-sm font-medium">SEO Keywords</Label>
                      <Input
                        id="keywords"
                        placeholder="ai models, comparison, 2024, machine learning"
                        value={seoKeywords}
                        onChange={(e) => setSeoKeywords(e.target.value)}
                        className="mt-2 h-11 lg:h-10"
                      />
                      <p className="text-xs text-gray-500 mt-1">Comma-separated keywords for SEO optimization</p>
                    </div>

                    {/* Target Audience */}
                    <div>
                      <Label htmlFor="audience" className="text-sm font-medium">Target Audience</Label>
                      <Input
                        id="audience"
                        placeholder="e.g., AI developers, business owners, tech enthusiasts"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        className="mt-2 h-11 lg:h-10"
                      />
                    </div>

                    {/* AI Provider Selection */}
                    <div>
                      <Label className="text-sm font-medium">AI Provider</Label>
                      <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                        <SelectTrigger className="mt-2 h-11 lg:h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Providers</SelectItem>
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
                      <p className="text-xs text-gray-500 mt-1">
                        Filter models by AI provider
                      </p>
                    </div>

                    {/* AI Engine Selection */}
                    <div>
                      <Label className="text-sm font-medium">AI Engine</Label>
                      <Select value={aiEngine} onValueChange={setAiEngine}>
                        <SelectTrigger className="mt-2 h-11 lg:h-10">
                          <SelectValue />
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
                      <p className="text-xs text-gray-500 mt-1">
                        {getModelById(aiEngine)?.provider && `Using ${getModelById(aiEngine)?.provider} provider`}
                      </p>
                    </div>

                    {/* Content Length */}
                    <div>
                      <Label className="text-sm font-medium">Content Length</Label>
                      <Select value={contentLength} onValueChange={setContentLength}>
                        <SelectTrigger className="mt-2 h-11 lg:h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CONTENT_LENGTHS.map((length) => (
                            <SelectItem 
                              key={length.id} 
                              value={length.id}
                              disabled={length.tier === 'pro' && profile.plan === 'free'}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div>
                                  <span>{length.name}</span>
                                  <p className="text-xs text-gray-500">{length.description}</p>
                                </div>
                                {length.tier === 'pro' && profile.plan === 'free' && (
                                  <Crown className="h-4 w-4 text-yellow-500 ml-2" />
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Brand Voice */}
                    <div>
                      <Label className="text-sm font-medium">Brand Voice</Label>
                      <Select value={brandVoice} onValueChange={setBrandVoice}>
                        <SelectTrigger className="mt-2 h-11 lg:h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BRAND_VOICES.map((voice) => (
                            <SelectItem key={voice.id} value={voice.id}>
                              <div>
                                <span>{voice.name}</span>
                                <p className="text-xs text-gray-500">{voice.description}</p>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Advanced Options */}
                    <div className="border-t pt-6">
                      <h3 className="font-medium mb-4 flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Advanced Options
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Custom Instructions */}
                        <div>
                          <Label htmlFor="instructions" className="text-sm font-medium">Custom Instructions</Label>
                          <Textarea
                            id="instructions"
                            placeholder="Any specific requirements, style preferences, or additional context..."
                            value={customInstructions}
                            onChange={(e) => setCustomInstructions(e.target.value)}
                            className="mt-2 min-h-[100px] lg:min-h-[80px]"
                            rows={4}
                          />
                        </div>

                        {/* Pro Features */}
                        {profile.plan === 'pro' && (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="webSearch"
                                checked={includeWebSearch}
                                onChange={(e) => setIncludeWebSearch(e.target.checked)}
                                className="rounded"
                              />
                              <Label htmlFor="webSearch" className="flex items-center">
                                <Search className="h-4 w-4 mr-2" />
                                Include Web Search
                              </Label>
                              <Badge variant="secondary">PRO</Badge>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="serpAnalysis"
                                checked={includeSerpAnalysis}
                                onChange={(e) => setIncludeSerpAnalysis(e.target.checked)}
                                className="rounded"
                              />
                              <Label htmlFor="serpAnalysis" className="flex items-center">
                                <Eye className="h-4 w-4 mr-2" />
                                SERP Analysis
                              </Label>
                              <Badge variant="secondary">PRO</Badge>
                            </div>
                          </div>
                        )}

                        {/* Temperature Slider */}
                        <div>
                          <Label>Creativity Level: {temperature[0]}</Label>
                          <Slider
                            value={temperature}
                            onValueChange={setTemperature}
                            max={1}
                            min={0.1}
                            step={0.1}
                            className="mt-2"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Conservative</span>
                            <span>Creative</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Generate Outline Button */}
                    <Button
                      onClick={handleGenerateOutline}
                      disabled={!topic.trim() || generatingOutline}
                      className="w-full h-12 lg:h-11"
                      size="lg"
                    >
                      {generatingOutline ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating Outline...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Generate Article Outline
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Outline Tab */}
              <TabsContent value="outline" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Article Outline
                    </CardTitle>
                    <CardDescription>Review and refine your article structure</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {generatedOutline ? (
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-3 lg:p-4 rounded-lg border">
                          <OutlineDisplay 
                            content={generatedOutline}
                            className="max-h-96 overflow-y-auto"
                          />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            onClick={handleGenerateArticle}
                            disabled={generating || remainingArticles <= 0}
                            className="flex-1 h-12 lg:h-11"
                            size="lg"
                          >
                            {generating ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Writing Article...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Generate Full Article
                              </>
                            )}
                          </Button>
                          
                          <Button
                            onClick={handleGenerateOutline}
                            variant="outline"
                            disabled={generatingOutline}
                            className="h-12 lg:h-11 sm:w-auto w-full"
                          >
                            <RefreshCw className="h-4 w-4 sm:mr-0 mr-2" />
                            <span className="sm:hidden">Regenerate Outline</span>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Generate an outline first to see the article structure</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Article Tab */}
              <TabsContent value="article" className="space-y-6">
                {generatedContent ? (
                  <div className="space-y-6">
                    {/* Article Actions */}
                    <Card>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <Button 
                            onClick={handleSave} 
                            disabled={saving}
                            className="h-12 lg:h-10"
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
                            className="h-12 lg:h-10"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          
                          <Button 
                            onClick={downloadArticle} 
                            variant="outline"
                            className="h-12 lg:h-10"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Generated Article */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Generated Article</CardTitle>
                        <CardDescription>Your professionally written, SEO-optimized content</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div 
                          className="prose prose-sm sm:prose-lg max-w-none prose-blue"
                          dangerouslySetInnerHTML={{ __html: generatedContent }}
                        />
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Your generated article will appear here</p>
                        <p className="text-sm mt-2">Complete the setup and generate an outline to get started</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Mobile Floating Action Button */}
        {activeTab === "setup" && topic.trim() && !generatingOutline && (
          <div className="lg:hidden fixed bottom-6 right-6 z-20">
            <Button
              onClick={handleGenerateOutline}
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg"
            >
              <Wand2 className="h-6 w-6" />
            </Button>
          </div>
        )}

        {activeTab === "outline" && generatedOutline && !generating && remainingArticles > 0 && (
          <div className="lg:hidden fixed bottom-6 right-6 z-20">
            <Button
              onClick={handleGenerateArticle}
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg"
            >
              <Sparkles className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
