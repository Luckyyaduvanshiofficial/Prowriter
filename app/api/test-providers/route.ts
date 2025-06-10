import { NextRequest, NextResponse } from "next/server"
import { createProviderClient, getModelById, AI_MODELS } from "@/lib/ai-providers"

export async function GET() {
  try {
    const results = []
    
    // Test a model from each provider
    const testModels = [
      'qwen-235B A22B',     // OpenRouter
      'gemini-2.0-flash',     // Google AI
      'llama-3.3-70b-free'  // Together.ai
    ]
    
    for (const modelId of testModels) {
      const model = getModelById(modelId)
      if (!model) {
        results.push({
          modelId,
          status: 'error',
          message: 'Model not found'
        })
        continue
      }
      
      try {
        const client = createProviderClient(model.provider)
        
        // Simple test prompt
        const response = await client.generateContent({
          messages: [
            {
              role: 'user',
              content: 'Say "Hello from AI!" in exactly 3 words.'
            }
          ],
          model: modelId,
          temperature: 0.7,
          maxTokens: 50
        })
        
        results.push({
          modelId,
          provider: model.provider,
          status: 'success',
          response: response.content?.substring(0, 100) + '...',
          usage: response.usage
        })
      } catch (error) {
        results.push({
          modelId,
          provider: model.provider,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      results,
      availableModels: AI_MODELS.map(m => ({
        id: m.id,
        name: m.name,
        provider: m.provider,
        tier: m.tier,
        cost: m.costPer1000Tokens === 0 ? 'Free' : `$${m.costPer1000Tokens}/1K`
      }))
    })
  } catch (error) {
    console.error("Provider test error:", error)
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
