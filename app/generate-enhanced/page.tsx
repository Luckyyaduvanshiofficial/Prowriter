"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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
  Info,
  BarChart3,
  Target,
  Lightbulb,
  Star,
  DollarSign,
  Clock,
  Brain,
  Trophy,
  CheckCircle
} from "lucide-react"
import Link from "next/link"

// Mock data for the enhanced generator
const AI_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', mmlu: 87.2, cost: 5.0, context: 128000 },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', mmlu: 88.7, cost: 3.0, context: 200000 },
  { id: 'gemini-pro-1-5', name: 'Gemini Pro 1.5', provider: 'Google', mmlu: 85.9, cost: 1.25, context: 2000000 },
  { id: 'llama-3-1-405b', name: 'LLaMA 3.1 405B', provider: 'Meta', mmlu: 87.3, cost: 2.7, context: 128000 },
  { id: 'qwen-2-5-72b', name: 'Qwen 2.5 72B', provider: 'Alibaba', mmlu: 85.2, cost: 0.4, context: 32768 },
  { id: 'deepseek-v2-5', name: 'DeepSeek V2.5', provider: 'DeepSeek', mmlu: 81.7, cost: 0.14, context: 32768 }
]

const USE_CASES = [
  { value: "coding", label: "Coding & Development", description: "Code generation, debugging, and development assistance" },
  { value: "chat", label: "Chat & Conversation", description: "General conversation, customer service, and dialogue" },
  { value: "reasoning", label: "Reasoning & Analysis", description: "Logic, problem-solving, and analytical tasks" },
  { value: "writing", label: "Writing & Content", description: "Content creation, editing, and creative writing" },
  { value: "research", label: "Research & Analysis", description: "Information gathering and research assistance" },
  { value: "analysis", label: "Data Analysis", description: "Data processing and analytical insights" }
]

const ARTICLE_LENGTHS = [
  { value: "short", label: "Short (1000-1500 words)", description: "Quick overview and comparison" },
  { value: "medium", label: "Medium (2000-3000 words)", description: "Comprehensive analysis with examples" },
  { value: "long", label: "Long (3500-5000 words)", description: "In-depth comparison with benchmarks" },
  { value: "comprehensive", label: "Comprehensive (5000+ words)", description: "Complete guide with all features" }
]

const TARGET_AUDIENCES = [
  { value: "developer", label: "Developers", description: "Technical audience with programming background" },
  { value: "business", label: "Business Users", description: "Decision makers and business professionals" },
  { value: "researcher", label: "Researchers", description: "Academic and research professionals" },
  { value: "general", label: "General Public", description: "Broad audience with varying technical knowledge" }
]

const CONTENT_STYLES = [
  { value: "technical", label: "Technical", description: "Detailed technical analysis with metrics" },
  { value: "conversational", label: "Conversational", description: "Friendly, easy-to-understand tone" },
  { value: "academic", label: "Academic", description: "Formal, research-oriented style" },
  { value: "marketing", label: "Marketing", description: "Persuasive, benefit-focused content" }
]

export default function EnhancedGeneratePage() {
  const [selectedModelA, setSelectedModelA] = useState("")
  const [selectedModelB, setSelectedModelB] = useState("")
  const [selectedUseCase, setSelectedUseCase] = useState("")
  const [selectedLength, setSelectedLength] = useState("medium")
  const [selectedAudience, setSelectedAudience] = useState("general")
  const [selectedStyle, setSelectedStyle] = useState("conversational")
  const [includeVisuals, setIncludeVisuals] = useState(true)
  const [includeCodeExamples, setIncludeCodeExamples] = useState(true)
  const [includePricing, setIncludePricing] = useState(true)
  const [includeRealWorldTests, setIncludeRealWorldTests] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [seoAnalysis, setSeoAnalysis] = useState(null)
  const [contentValue, setContentValue] = useState(0)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [activeTab, setActiveTab] = useState("setup")
  const [progress, setProgress] = useState(0)

  // Calculate estimated content value
  useEffect(() => {
    if (selectedModelA && selectedModelB && selectedUseCase) {
      const baseValue = 75
      const lengthMultiplier = selectedLength === 'comprehensive' ? 1.5 : 
                              selectedLength === 'long' ? 1.3 :
                              selectedLength === 'medium' ? 1.1 : 1.0
      const featuresBonus = (includeVisuals ? 5 : 0) + 
                           (includeCodeExamples ? 5 : 0) + 
                           (includePricing ? 5 : 0) + 
                           (includeRealWorldTests ? 10 : 0)
      
      setContentValue(Math.min(baseValue * lengthMultiplier + featuresBonus, 100))
    }
  }, [selectedModelA, selectedModelB, selectedUseCase, selectedLength, includeVisuals, includeCodeExamples, includePricing, includeRealWorldTests])

  const handleGenerate = async () => {
    if (!selectedModelA || !selectedModelB || !selectedUseCase) return

    setIsGenerating(true)
    setProgress(0)
    setActiveTab("generation")

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 500)

      // Simulate content generation
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      clearInterval(progressInterval)
      setProgress(100)
      
      // Generate mock content
      const modelA = AI_MODELS.find(m => m.id === selectedModelA)
      const modelB = AI_MODELS.find(m => m.id === selectedModelB)
      
      const mockContent = `# ${modelA?.name} vs ${modelB?.name}: Complete ${selectedUseCase} Comparison

## Executive Summary

This comprehensive analysis compares ${modelA?.name} and ${modelB?.name} for ${selectedUseCase} applications. Our testing reveals significant differences in performance, cost-effectiveness, and capabilities that will impact your decision.

**Key Findings:**
- ${modelA?.name} excels in performance with ${modelA?.mmlu} MMLU score
- ${modelB?.name} offers better value at $${modelB?.cost} per million tokens
- Both models show distinct advantages for different use cases

## Performance Benchmarks

### ${modelA?.name} Performance
- MMLU Score: ${modelA?.mmlu}
- Cost per 1M tokens: $${modelA?.cost}
- Context Length: ${modelA?.context.toLocaleString()} tokens

### ${modelB?.name} Performance
- MMLU Score: ${modelB?.mmlu}
- Cost per 1M tokens: $${modelB?.cost}
- Context Length: ${modelB?.context.toLocaleString()} tokens

## Real-World Testing Results

Our extensive testing across 100+ ${selectedUseCase} tasks reveals:

1. **Accuracy**: ${modelA?.name} achieved 94.2% accuracy vs ${modelB?.name}'s 91.7%
2. **Speed**: ${modelB?.name} processed requests 23% faster on average
3. **Cost-Effectiveness**: ${modelB?.name} provides 2.3x better value per task

## Use Case Recommendations

### Choose ${modelA?.name} if:
- Maximum accuracy is crucial
- You need advanced reasoning capabilities
- Budget is not a primary constraint

### Choose ${modelB?.name} if:
- Cost-effectiveness is important
- You need high-volume processing
- Speed is a priority

## Conclusion

Both models offer compelling advantages for ${selectedUseCase} applications. ${modelA?.name} leads in performance, while ${modelB?.name} excels in value and efficiency. Your choice should align with your specific priorities and constraints.

For most applications, we recommend starting with ${modelB?.name} due to its superior cost-effectiveness, then upgrading to ${modelA?.name} if maximum performance is required.`

      setGeneratedContent(mockContent)
      setSeoAnalysis({
        seo_score: 87,
        readability_score: 82,
        word_count: 1247,
        estimated_reading_time: 6
      })
      setActiveTab("results")
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getModelInfo = (modelId: string) => {
    return AI_MODELS.find(model => model.id === modelId)
  }

  const renderModelComparison = () => {
    if (!selectedModelA || !selectedModelB) return null

    const modelA = getModelInfo(selectedModelA)
    const modelB = getModelInfo(selectedModelB)

    if (!modelA || !modelB) return null

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Model Comparison Preview</span>
          </CardTitle>
          <CardDescription>
            Quick comparison of your selected models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">{modelA.name}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Provider</span>
                  <span className="text-sm font-medium">{modelA.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">MMLU Score</span>
                  <span className="text-sm font-medium">{modelA.mmlu}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cost per 1M tokens</span>
                  <span className="text-sm font-medium">${modelA.cost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Context Length</span>
                  <span className="text-sm font-medium">{modelA.context.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">{modelB.name}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Provider</span>
                  <span className="text-sm font-medium">{modelB.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">MMLU Score</span>
                  <span className="text-sm font-medium">{modelB.mmlu}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cost per 1M tokens</span>
                  <span className="text-sm font-medium">${modelB.cost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Context Length</span>
                  <span className="text-sm font-medium">{modelB.context.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderSEOPreview = () => {
    if (!selectedModelA || !selectedModelB || !selectedUseCase) return null

    const modelA = getModelInfo(selectedModelA)
    const modelB = getModelInfo(selectedModelB)

    const title = `${modelA?.name} vs ${modelB?.name}: Complete ${selectedUseCase} Comparison 2024`
    const description = `Compare ${modelA?.name} vs ${modelB?.name} for ${selectedUseCase}. Detailed analysis of performance, cost, accuracy & real-world benchmarks.`

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>SEO Preview</span>
          </CardTitle>
          <CardDescription>
            How your content will appear in search results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Title Tag</Label>
              <p className="text-sm text-blue-600 mt-1">{title}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Meta Description</Label>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Target Keywords</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {modelA?.name} vs {modelB?.name}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {selectedUseCase} ai model comparison
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  best ai model for {selectedUseCase}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {modelA?.name} {selectedUseCase} performance
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {modelB?.name} {selectedUseCase} benchmark
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">10x Enhanced AI Content Generator</h1>
              <p className="text-gray-600">Create premium AI model comparison content with advanced features</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Trophy className="w-3 h-3" />
              <span>Content Value: {contentValue}%</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>10x Enhanced</span>
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Setup & Configuration</TabsTrigger>
            <TabsTrigger value="generation" disabled={!selectedModelA || !selectedModelB || !selectedUseCase}>
              Generation
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!generatedContent}>
              Results & Analysis
            </TabsTrigger>
          </TabsList>

          {/* Setup Tab */}
          <TabsContent value="setup" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Model Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5" />
                    <span>AI Model Selection</span>
                  </CardTitle>
                  <CardDescription>
                    Choose two AI models to compare
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="modelA">Model A</Label>
                    <Select value={selectedModelA} onValueChange={setSelectedModelA}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select first model" />
                      </SelectTrigger>
                      <SelectContent>
                        {AI_MODELS.map(model => (
                          <SelectItem key={model.id} value={model.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{model.name}</span>
                              <Badge variant="outline" className="ml-2">
                                {model.provider}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="modelB">Model B</Label>
                    <Select value={selectedModelB} onValueChange={setSelectedModelB}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select second model" />
                      </SelectTrigger>
                      <SelectContent>
                        {AI_MODELS.map(model => (
                          <SelectItem key={model.id} value={model.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{model.name}</span>
                              <Badge variant="outline" className="ml-2">
                                {model.provider}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Use Case & Content Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Content Configuration</span>
                  </CardTitle>
                  <CardDescription>
                    Configure your content specifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="useCase">Use Case</Label>
                    <Select value={selectedUseCase} onValueChange={setSelectedUseCase}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select use case" />
                      </SelectTrigger>
                      <SelectContent>
                        {USE_CASES.map(useCase => (
                          <SelectItem key={useCase.value} value={useCase.value}>
                            <div>
                              <div className="font-medium">{useCase.label}</div>
                              <div className="text-xs text-gray-500">{useCase.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="length">Article Length</Label>
                    <Select value={selectedLength} onValueChange={setSelectedLength}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select article length" />
                      </SelectTrigger>
                      <SelectContent>
                        {ARTICLE_LENGTHS.map(length => (
                          <SelectItem key={length.value} value={length.value}>
                            <div>
                              <div className="font-medium">{length.label}</div>
                              <div className="text-xs text-gray-500">{length.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Advanced Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Advanced Options</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  >
                    {showAdvancedOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <Collapsible open={showAdvancedOptions}>
                <CollapsibleContent>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="audience">Target Audience</Label>
                        <Select value={selectedAudience} onValueChange={setSelectedAudience}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select target audience" />
                          </SelectTrigger>
                          <SelectContent>
                            {TARGET_AUDIENCES.map(audience => (
                              <SelectItem key={audience.value} value={audience.value}>
                                <div>
                                  <div className="font-medium">{audience.label}</div>
                                  <div className="text-xs text-gray-500">{audience.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="style">Content Style</Label>
                        <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select content style" />
                          </SelectTrigger>
                          <SelectContent>
                            {CONTENT_STYLES.map(style => (
                              <SelectItem key={style.value} value={style.value}>
                                <div>
                                  <div className="font-medium">{style.label}</div>
                                  <div className="text-xs text-gray-500">{style.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="visuals">Include Visual Elements</Label>
                        <Switch
                          id="visuals"
                          checked={includeVisuals}
                          onCheckedChange={setIncludeVisuals}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="code">Include Code Examples</Label>
                        <Switch
                          id="code"
                          checked={includeCodeExamples}
                          onCheckedChange={setIncludeCodeExamples}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pricing">Include Pricing Analysis</Label>
                        <Switch
                          id="pricing"
                          checked={includePricing}
                          onCheckedChange={setIncludePricing}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="tests">Include Real-World Tests</Label>
                        <Switch
                          id="tests"
                          checked={includeRealWorldTests}
                          onCheckedChange={setIncludeRealWorldTests}
                        />
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Model Comparison Preview */}
            {renderModelComparison()}

            {/* SEO Preview */}
            {renderSEOPreview()}

            {/* Generate Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleGenerate}
                disabled={!selectedModelA || !selectedModelB || !selectedUseCase || isGenerating}
                size="lg"
                className="px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Premium Content...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate 10x Enhanced Content
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Generation Tab */}
          <TabsContent value="generation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Content Generation in Progress</span>
                </CardTitle>
                <CardDescription>
                  Creating your premium AI model comparison content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-gray-900 mb-2">{progress}%</div>
                  <Progress value={progress} className="w-full h-3 mb-4" />
                  <p className="text-gray-600">
                    {progress < 30 ? "Analyzing AI models and benchmarks..." :
                     progress < 60 ? "Generating SEO-optimized content..." :
                     progress < 90 ? "Adding performance tables and examples..." :
                     "Finalizing content and analysis..."}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-medium">Real-time Data</h3>
                    <p className="text-sm text-gray-600">Latest benchmark data integrated</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-medium">SEO Optimized</h3>
                    <p className="text-sm text-gray-600">Keywords and structure optimized</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-medium">Expert Analysis</h3>
                    <p className="text-sm text-gray-600">Professional insights included</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Content Display */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5" />
                      <span>Generated Content</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm">
                      {generatedContent || "Generated content will appear here..."}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* Analysis Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Content Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {seoAnalysis && (
                    <>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">SEO Score</span>
                          <span className="text-sm text-gray-600">{seoAnalysis.seo_score}/100</span>
                        </div>
                        <Progress value={seoAnalysis.seo_score} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Readability</span>
                          <span className="text-sm text-gray-600">{Math.round(seoAnalysis.readability_score)}/100</span>
                        </div>
                        <Progress value={seoAnalysis.readability_score} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Word Count</span>
                          <span className="text-sm text-gray-600">{seoAnalysis.word_count}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Reading Time</span>
                          <span className="text-sm text-gray-600">{seoAnalysis.estimated_reading_time} min</span>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{contentValue}%</div>
                      <div className="text-sm text-gray-600">Content Value Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}