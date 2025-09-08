"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CanvasWriter } from "@/components/canvas-writer"
import { 
  ArrowLeft, 
  Loader2, 
  Sparkles, 
  Type,
  Brain,
  Wand2,
  Palette,
  Users,
  Target,
  FileText,
  Settings,
  Play,
  Crown
} from "lucide-react"
import { getAvailableModels } from "@/lib/ai-providers"

const ARTICLE_TYPES = [
  { 
    id: "howto", 
    name: "How-To Guide", 
    icon: Target, 
    description: "Step-by-step tutorials and guides",
    example: "How to Build a React App",
    color: "bg-blue-50 border-blue-200 text-blue-700"
  },
  { 
    id: "listicle", 
    name: "Listicle", 
    icon: FileText, 
    description: "Engaging numbered lists and rankings",
    example: "Top 10 AI Tools for Developers",
    color: "bg-pink-50 border-pink-200 text-pink-700"
  },
  { 
    id: "guide", 
    name: "Ultimate Guide", 
    icon: Brain, 
    description: "Comprehensive guides covering all aspects",
    example: "Complete Guide to Machine Learning",
    color: "bg-purple-50 border-purple-200 text-purple-700"
  },
  { 
    id: "tutorial", 
    name: "Tutorial", 
    icon: Sparkles, 
    description: "Educational content with practical examples",
    example: "JavaScript Tutorial for Beginners",
    color: "bg-green-50 border-green-200 text-green-700"
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
    icon: Sparkles,
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
    icon: Palette,
    example: "Here's the thing about AI models..."
  }
]

const CONTENT_LENGTHS = [
  { 
    id: "short", 
    name: "Short Article", 
    range: "800-1K words", 
    description: "Quick reads, focused content",
    readTime: "3-4 min read"
  },
  { 
    id: "medium", 
    name: "Medium Article", 
    range: "1.2K-1.5K words", 
    description: "Standard blog length",
    readTime: "5-7 min read"
  },
  { 
    id: "long", 
    name: "Long Article", 
    range: "1.8K-2.5K words", 
    description: "In-depth, comprehensive",
    readTime: "8-12 min read"
  },
  { 
    id: "epic", 
    name: "Epic Guide", 
    range: "3K+ words", 
    description: "Ultimate guides",
    readTime: "15+ min read", 
    tier: "pro"
  }
]

interface UserProfile {
  id: string
  plan: 'free' | 'pro'
  articles_generated_today: number
}

export default function CanvasWriterPage() {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser()
  const router = useRouter()
  
  // Form state
  const [topic, setTopic] = useState("")
  const [articleType, setArticleType] = useState("guide")
  const [brandVoice, setBrandVoice] = useState("professional")
  const [contentLength, setContentLength] = useState("medium")
  const [targetAudience, setTargetAudience] = useState("")
  const [seoKeywords, setSeoKeywords] = useState("")
  const [selectedModel, setSelectedModel] = useState("")
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [error, setError] = useState("")
  
  // User state
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [availableModels, setAvailableModels] = useState<any[]>([])

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
      return
    }
    
    if (isSignedIn && clerkUser) {
      loadUserData()
    }
  }, [isLoaded, isSignedIn, clerkUser, router])

  const loadUserData = async () => {
    try {
      // Mock user profile for demo - in real app this would fetch from database
      const userProfile: UserProfile = {
        id: clerkUser?.id || '',
        plan: 'free', // This would come from your database
        articles_generated_today: 0
      }
      
      setProfile(userProfile)
      
      // Load available models based on user tier
      const models = getAvailableModels(userProfile.plan)
      setAvailableModels(models)
      
      // Set default model
      if (models.length > 0 && !selectedModel) {
        setSelectedModel(models[0].id)
      }
      
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!topic.trim() || !selectedModel) {
      setError("Please provide a topic and select a model")
      return
    }

    setIsGenerating(true)
    setError("")
    setGeneratedContent("")

    try {
      const response = await fetch('/api/canvas-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          modelA: selectedModel,
          articleType,
          contentLength,
          brandVoice,
          targetAudience: targetAudience || "general audience",
          seoKeywords: seoKeywords || topic
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.success || data.error) {
        throw new Error(data.error || 'Failed to generate article')
      }

      setGeneratedContent(data.content)
      
      // Update usage count
      if (profile) {
        setProfile({
          ...profile,
          articles_generated_today: profile.articles_generated_today + 1
        })
      }

    } catch (error) {
      console.error("Error generating article:", error)
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading Canvas Writer...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Type className="h-16 w-16 mx-auto mb-4 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Profile...</h2>
          <p className="text-gray-600">Please wait while we set up your canvas...</p>
        </div>
      </div>
    )
  }

  const dailyLimit = profile.plan === 'pro' ? 1000 : 10

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Type className="h-8 w-8 mr-3 text-blue-600" />
                Canvas Writer
                <Badge className="ml-3 bg-gradient-to-r from-blue-500 to-purple-600">
                  Live Typing
                </Badge>
              </h1>
              <p className="text-gray-600 mt-2">
                Watch your articles come to life with live typing animation, just like ChatGPT
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Today's Usage</p>
            <p className="text-lg font-semibold">
              {profile.articles_generated_today}/{dailyLimit}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Setup Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Settings className="h-6 w-6 mr-3 text-blue-600" />
                  Article Setup
                </CardTitle>
                <CardDescription>
                  Configure your article parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Topic */}
                <div>
                  <Label htmlFor="topic" className="text-base font-medium">
                    Article Topic *
                  </Label>
                  <Textarea
                    id="topic"
                    placeholder="e.g., 'Complete Guide to React Hooks' or 'Best AI Tools for Content Creation'"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                </div>

                {/* AI Model */}
                <div>
                  <Label className="text-base font-medium">AI Model</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center space-x-2">
                            <span>{model.name}</span>
                            {model.tier === 'pro' && (
                              <Crown className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Article Type */}
                <div>
                  <Label className="text-base font-medium">Article Type</Label>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {ARTICLE_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setArticleType(type.id)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          articleType === type.id 
                            ? type.color 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <type.icon className="h-5 w-5" />
                          <div>
                            <div className="font-medium">{type.name}</div>
                            <div className="text-sm opacity-75">{type.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Length */}
                <div>
                  <Label className="text-base font-medium">Content Length</Label>
                  <Select value={contentLength} onValueChange={setContentLength}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTENT_LENGTHS.map((length) => (
                        <SelectItem 
                          key={length.id} 
                          value={length.id}
                          disabled={length.tier === 'pro' && profile.plan !== 'pro'}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{length.name}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">{length.range}</span>
                              {length.tier === 'pro' && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Brand Voice */}
                <div>
                  <Label className="text-base font-medium">Brand Voice</Label>
                  <Select value={brandVoice} onValueChange={setBrandVoice}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BRAND_VOICES.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          <div className="flex items-center space-x-2">
                            <voice.icon className="h-4 w-4" />
                            <span>{voice.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Optional Fields */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="audience">Target Audience (Optional)</Label>
                    <Input
                      id="audience"
                      placeholder="e.g., 'Beginner developers' or 'Marketing professionals'"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="keywords">SEO Keywords (Optional)</Label>
                    <Input
                      id="keywords"
                      placeholder="e.g., 'react hooks, javascript, frontend'"
                      value={seoKeywords}
                      onChange={(e) => setSeoKeywords(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={!topic.trim() || !selectedModel || isGenerating || profile.articles_generated_today >= dailyLimit}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Start Writing
                    </>
                  )}
                </Button>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Canvas Panel */}
          <div className="lg:col-span-2">
            <CanvasWriter
              content={generatedContent}
              title="Article Canvas"
              isGenerating={isGenerating}
              onContentUpdate={setGeneratedContent}
            />
          </div>
        </div>
      </div>
    </div>
  )
}