"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  TrendingUp, 
  Globe, 
  Target, 
  Loader2,
  ExternalLink,
  BarChart3,
  Eye,
  DollarSign,
  Users,
  HelpCircle
} from "lucide-react"

interface WebSearchResult {
  name: string
  url: string
  snippet: string
  datePublished: string
}

interface SerpResult {
  keyword: string
  searchVolume: number
  difficulty: number
  cpc: string
  competition: string
  organicResults: Array<{
    position: number
    title: string
    url: string
    snippet: string
    domain: string
    wordCount: number
    headings: string[]
  }>
  relatedKeywords: string[]
  peopleAlsoAsk: string[]
  featuredSnippet: {
    title: string
    snippet: string
    url: string
    source: string
  }
}

export function ResearchTool() {
  const [searchQuery, setSearchQuery] = useState("")
  const [serpKeyword, setSerpKeyword] = useState("")
  const [webResults, setWebResults] = useState<WebSearchResult[]>([])
  const [serpData, setSerpData] = useState<SerpResult | null>(null)
  const [webLoading, setWebLoading] = useState(false)
  const [serpLoading, setSerpLoading] = useState(false)
  
  const handleWebSearch = async () => {
    if (!searchQuery.trim()) return
    
    setWebLoading(true)
    try {
      const response = await fetch('/api/web-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          maxResults: 10
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setWebResults(data.results)
      } else {
        console.error('Web search failed')
      }
    } catch (error) {
      console.error('Error performing web search:', error)
    } finally {
      setWebLoading(false)
    }
  }
  
  const handleSerpAnalysis = async () => {
    if (!serpKeyword.trim()) return
    
    setSerpLoading(true)
    try {
      const response = await fetch('/api/serp-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: serpKeyword,
          location: 'US',
          language: 'en'
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        setSerpData(result.data)
      } else {
        console.error('SERP analysis failed')
      }
    } catch (error) {
      console.error('Error performing SERP analysis:', error)
    } finally {
      setSerpLoading(false)
    }
  }
  
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Research Tool</h1>
        <p className="text-gray-600">
          Analyze search results and gather competitive intelligence for your content
        </p>
      </div>
      
      <Tabs defaultValue="web-search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="web-search" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Web Search
          </TabsTrigger>
          <TabsTrigger value="serp-analysis" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            SERP Analysis
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="web-search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Web Search
              </CardTitle>
              <CardDescription>
                Search the web for relevant content and research sources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="search-query">Search Query</Label>
                  <Input
                    id="search-query"
                    placeholder="Enter your search query..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleWebSearch()}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleWebSearch}
                    disabled={webLoading || !searchQuery.trim()}
                  >
                    {webLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    Search
                  </Button>
                </div>
              </div>
              
              {webResults.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Search Results ({webResults.length})</h3>
                  {webResults.map((result, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-blue-600 hover:text-blue-800">
                            <a 
                              href={result.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              {result.name}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {new Date(result.datePublished).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{result.snippet}</p>
                        <p className="text-xs text-gray-500">{result.url}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="serp-analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                SERP Analysis
              </CardTitle>
              <CardDescription>
                Analyze search engine results and keyword competition
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="serp-keyword">Target Keyword</Label>
                  <Input
                    id="serp-keyword"
                    placeholder="Enter keyword to analyze..."
                    value={serpKeyword}
                    onChange={(e) => setSerpKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSerpAnalysis()}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleSerpAnalysis}
                    disabled={serpLoading || !serpKeyword.trim()}
                  >
                    {serpLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <BarChart3 className="w-4 h-4" />
                    )}
                    Analyze
                  </Button>
                </div>
              </div>
              
              {serpData && (
                <div className="space-y-6">
                  {/* Keyword Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Search Volume</p>
                          <p className="text-lg font-semibold">{serpData.searchVolume.toLocaleString()}</p>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-orange-600" />
                        <div>
                          <p className="text-sm text-gray-600">Difficulty</p>
                          <p className="text-lg font-semibold">{serpData.difficulty}/100</p>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">CPC</p>
                          <p className="text-lg font-semibold">${serpData.cpc}</p>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">Competition</p>
                          <Badge variant={
                            serpData.competition === 'Low' ? 'secondary' : 
                            serpData.competition === 'Medium' ? 'default' : 'destructive'
                          }>
                            {serpData.competition}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </div>
                  
                  {/* Featured Snippet */}
                  {serpData.featuredSnippet && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Featured Snippet</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <h4 className="font-medium">{serpData.featuredSnippet.title}</h4>
                          <p className="text-sm text-gray-600">{serpData.featuredSnippet.snippet}</p>
                          <p className="text-xs text-gray-500">Source: {serpData.featuredSnippet.source}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Top Organic Results */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Top Organic Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {serpData.organicResults.map((result, index) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <Badge variant="outline" className="text-xs">
                                  #{result.position}
                                </Badge>
                                <h4 className="font-medium text-blue-600">
                                  <a href={result.url} target="_blank" rel="noopener noreferrer">
                                    {result.title}
                                  </a>
                                </h4>
                                <p className="text-sm text-gray-600">{result.snippet}</p>
                                <p className="text-xs text-gray-500">{result.domain}</p>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {result.wordCount} words
                              </Badge>
                            </div>
                            
                            {result.headings.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-medium text-gray-700 mb-1">Headings:</p>
                                <div className="flex flex-wrap gap-1">
                                  {result.headings.slice(0, 3).map((heading, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {heading}
                                    </Badge>
                                  ))}
                                  {result.headings.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{result.headings.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Related Keywords */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Related Keywords</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {serpData.relatedKeywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* People Also Ask */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <HelpCircle className="w-5 h-5" />
                        People Also Ask
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {serpData.peopleAlsoAsk.map((question, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <HelpCircle className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{question}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
