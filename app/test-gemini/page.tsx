'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

export default function TestGeminiPage() {
  const [prompt, setPrompt] = useState('Write a short paragraph about the benefits of AI writing tools.')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTest = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/test-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Test Gemini 2.0 Flash Integration</CardTitle>
          <CardDescription>
            Verify that your Gemini API is working correctly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Enter your prompt:
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter a prompt to test Gemini..."
              rows={4}
              className="w-full"
            />
          </div>

          <Button 
            onClick={handleTest} 
            disabled={loading || !prompt}
            className="w-full"
          >
            {loading ? 'Generating...' : 'Test Gemini API'}
          </Button>

          {error && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-6">
                <p className="text-red-600 font-medium">❌ Error:</p>
                <p className="text-red-800 mt-2">{error}</p>
              </CardContent>
            </Card>
          )}

          {result && (
            <div className="space-y-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <p className="text-green-600 font-medium mb-2">✅ Success!</p>
                  <div className="space-y-1 text-sm">
                    <p><strong>Model:</strong> {result.model}</p>
                    <p><strong>Provider:</strong> {result.provider}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Generated Content:</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{result.content}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">📚 API Information</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Model: <code className="bg-blue-100 px-1 rounded">gemini-2.0-flash-exp</code></li>
              <li>• Endpoint: <code className="bg-blue-100 px-1 rounded">/api/test-gemini</code></li>
              <li>• Status: {loading ? '🟡 Testing...' : '🟢 Ready'}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
