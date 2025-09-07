"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Loader2, 
  FileText, 
  Calendar, 
  Eye, 
  Download,
  Trash2,
  Copy,
  ExternalLink
} from "lucide-react"
import Link from "next/link"

interface Article {
  id: string
  title: string
  content: string
  meta_description: string
  article_length: string
  ai_engine: string
  use_case: string
  created_at: string
  topic: string
  seo_keywords: string
  target_audience: string
  brand_voice: string
}

export default function ArticleHistoryPage() {
  const [user, setUser] = useState<any>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkUserAndLoadArticles()
  }, [page])

  const checkUserAndLoadArticles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // Use demo user for development
        const mockUser = { id: 'demo-user', email: 'demo@prowriter.miniai.online' }
        setUser(mockUser)
        await loadArticles(mockUser.id)
      } else {
        setUser(user)
        await loadArticles(user.id)
      }
    } catch (error) {
      console.error("Error checking user:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadArticles = async (userId: string) => {
    try {
      const response = await fetch(`/api/articles?userId=${userId}&page=${page}&limit=10`)
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setArticles(data.articles || [])
      setTotalPages(data.pagination?.totalPages || 0)
    } catch (error) {
      console.error("Error loading articles:", error)
      // For demo purposes, show empty state instead of error
      setArticles([])
    }
  }

  const handleDelete = async (articleId: string) => {
    if (!user || !confirm("Are you sure you want to delete this article?")) return
    
    setDeleting(articleId)
    try {
      const response = await fetch(`/api/articles?id=${articleId}&userId=${user.id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Remove from local state
      setArticles(prev => prev.filter(article => article.id !== articleId))
      alert("Article deleted successfully!")
    } catch (error) {
      console.error("Error deleting article:", error)
      alert("Failed to delete article. Please try again.")
    } finally {
      setDeleting(null)
    }
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    alert("Article content copied to clipboard!")
  }

  const downloadArticle = (article: Article) => {
    const element = document.createElement("a")
    const file = new Blob([article.content], { type: 'text/html' })
    element.href = URL.createObjectURL(file)
    element.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getArticleTypeColor = (useCase: string) => {
    switch (useCase) {
      case 'comparison': return 'bg-blue-100 text-blue-800'
      case 'how-to': return 'bg-green-100 text-green-800'
      case 'guide': return 'bg-purple-100 text-purple-800'
      case 'news': return 'bg-orange-100 text-orange-800'
      case 'informative': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getWordCount = (content: string) => {
    return content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading articles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Article History</h1>
                <p className="text-sm text-gray-600">Manage your generated articles</p>
              </div>
            </div>
            <Link href="/blog-writer">
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                New Article
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {articles.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles yet</h3>
              <p className="text-gray-600 mb-6">
                Start creating amazing content with our AI Blog Writer
              </p>
              <Link href="/blog-writer">
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Create Your First Article
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-6">
              {articles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
                        <CardDescription className="mb-3">
                          {article.meta_description || article.topic}
                        </CardDescription>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getArticleTypeColor(article.use_case)}>
                            {article.use_case.replace('-', ' ')}
                          </Badge>
                          <Badge variant="outline">
                            {article.ai_engine.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {getWordCount(article.content)} words
                          </Badge>
                          <Badge variant="outline">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(article.created_at)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedArticle(article)
                            setShowPreview(true)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(article.content)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadArticle(article)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(article.id)}
                        disabled={deleting === article.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {deleting === article.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Article Preview</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                ×
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />
            </div>
            <div className="border-t p-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(selectedArticle.content)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Content
              </Button>
              <Button
                variant="outline"
                onClick={() => downloadArticle(selectedArticle)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => setShowPreview(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
