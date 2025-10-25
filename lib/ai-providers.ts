// AI Providers Configuration for Multi-Provider Support
// Supports OpenRouter, Google AI (Gemini), and Together.ai

export interface AIModel {
  id: string
  name: string
  provider: 'openrouter' | 'google' | 'together' | 'baseten'
  modelId: string
  tier: 'free' | 'pro'
  features: string[]
  maxTokens: number
  costPer1000Tokens?: number
  description: string
}

export interface AIProvider {
  id: string
  name: string
  baseURL?: string
  apiKeyEnv: string
  models: AIModel[]
}

// AI Models Configuration
export const AI_MODELS: AIModel[] = [
  // OpenRouter Models
  {
    id: 'qwen-72b',
    name: 'Qwen 2.5 72B Instruct',
    provider: 'openrouter',
    modelId: 'qwen/qwen-2.5-72b-instruct',
    tier: 'free',
    features: ['General Purpose', 'Fast', 'Multilingual'],
    maxTokens: 8192,
    costPer1000Tokens: 0.4,
    description: 'Fast and efficient model for general content generation'
  },
  {
    id: 'llama-405b',
    name: 'LLaMA 3.1 405B',
    provider: 'openrouter',
    modelId: 'meta-llama/llama-3.1-405b-instruct',
    tier: 'pro',
    features: ['Advanced Reasoning', 'High Quality', 'Large Context'],
    maxTokens: 16384,
    costPer1000Tokens: 2.7,
    description: 'Premium model with exceptional reasoning capabilities'
  },
  {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder',
    provider: 'openrouter',
    modelId: 'deepseek/deepseek-coder',
    tier: 'free',
    features: ['Code Generation', 'Technical Writing', 'Programming'],
    maxTokens: 8192,
    costPer1000Tokens: 0.14,
    description: 'Specialized for technical and programming content'
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'openrouter',
    modelId: 'google/gemini-pro',
    tier: 'pro',
    features: ['Multimodal', 'Creative Writing', 'Analysis'],
    maxTokens: 12288,
    costPer1000Tokens: 0.5,
    description: 'Google\'s advanced multimodal AI model'
  },

  // Google AI Models (Direct) - PRIMARY MODELS
  {
    id: 'gemini-2-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'google',
    modelId: 'gemini-2.5-flash-exp',
    tier: 'free',
    features: ['Fast Generation', 'Real-time', 'Efficient', 'Latest'],
    maxTokens: 8192,
    costPer1000Tokens: 0,
    description: '⭐ Default - Latest Gemini model optimized for speed and efficiency'
  },
  // Baseten Models
  {
    id: 'gpt-oss-120b',
    name: 'GPT OSS 120B',
    provider: 'baseten',
    modelId: 'openai/gpt-oss-120b',
    tier: 'pro',
    features: ['Large Scale', 'High Quality', 'Advanced Reasoning'],
    maxTokens: 1000,
    costPer1000Tokens: 2.0,
    description: 'High-performance open-source GPT model with 120B parameters'
  }
]

// Provider Configurations
export const AI_PROVIDERS: Record<string, AIProvider> = {
  google: {
    id: 'google',
    name: 'Google AI',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    apiKeyEnv: 'GOOGLE_API_KEY',
    models: AI_MODELS.filter(m => m.provider === 'google')
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    baseURL: 'https://openrouter.ai/api/v1',
    apiKeyEnv: 'OPENROUTER_API_KEY',
    models: AI_MODELS.filter(m => m.provider === 'openrouter')
  },
  together: {
    id: 'together',
    name: 'Together.ai',
    baseURL: 'https://api.together.xyz/v1',
    apiKeyEnv: 'TOGETHER_AI_API_KEY',
    models: AI_MODELS.filter(m => m.provider === 'together')
  },
  baseten: {
    id: 'baseten',
    name: 'Baseten',
    baseURL: 'https://inference.baseten.co/v1',
    apiKeyEnv: 'BASETEN_API_KEY',
    models: AI_MODELS.filter(m => m.provider === 'baseten')
  }
}

// Helper Functions
export function getModelById(modelId: string): AIModel | undefined {
  return AI_MODELS.find(model => model.id === modelId)
}

export function getModelsByTier(tier: 'free' | 'pro'): AIModel[] {
  return AI_MODELS.filter(model => model.tier === tier)
}

export function getModelsByProvider(provider: string): AIModel[] {
  return AI_MODELS.filter(model => model.provider === provider)
}

export function getAvailableModels(userTier: 'free' | 'pro'): AIModel[] {
  return userTier === 'pro' 
    ? AI_MODELS 
    : AI_MODELS.filter(model => model.tier === 'free')
}

// AI Generation Interface
export interface GenerationRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  model: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export interface GenerationResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  model: string
  provider: string
}

// Provider-specific API clients
export class AIProviderClient {
  private apiKey: string
  private provider: AIProvider

  constructor(provider: AIProvider) {
    this.provider = provider
    this.apiKey = process.env[provider.apiKeyEnv] || ''
    
    if (!this.apiKey) {
      throw new Error(`API key not found for ${provider.name}. Please set ${provider.apiKeyEnv} environment variable.`)
    }
  }

  async generateContent(request: GenerationRequest): Promise<GenerationResponse> {
    const model = getModelById(request.model)
    if (!model) {
      throw new Error(`Model ${request.model} not found`)
    }

    if (model.provider !== this.provider.id) {
      throw new Error(`Model ${request.model} does not belong to provider ${this.provider.name}`)
    }

    try {
      switch (this.provider.id) {
        case 'openrouter':
          return await this.generateOpenRouter(request, model)
        case 'google':
          return await this.generateGoogle(request, model)
        case 'together':
          return await this.generateTogether(request, model)
        case 'baseten':
          return await this.generateBaseten(request, model)
        default:
          throw new Error(`Unsupported provider: ${this.provider.id}`)
      }
    } catch (error) {
      console.error(`Error generating content with ${this.provider.name}:`, error)
      throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  private async generateOpenRouter(request: GenerationRequest, model: AIModel): Promise<GenerationResponse> {
    const response = await fetch(`${this.provider.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'AI Blog Writer'
      },
      body: JSON.stringify({
        model: model.modelId,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: Math.min(request.maxTokens || 2048, model.maxTokens),
        stream: false
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`OpenRouter API error: ${response.status} ${errorData}`)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenRouter')
    }

    return {
      content: data.choices[0].message.content,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      } : undefined,
      model: model.id,
      provider: 'openrouter'
    }
  }

  private async generateGoogle(request: GenerationRequest, model: AIModel): Promise<GenerationResponse> {
    // Convert messages to Google's format
    const contents = request.messages
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))

    // Add system message as part of the first user message if exists
    const systemMessage = request.messages.find(msg => msg.role === 'system')
    if (systemMessage && contents.length > 0) {
      contents[0].parts[0].text = `${systemMessage.content}\n\n${contents[0].parts[0].text}`
    }

    const response = await fetch(
      `${this.provider.baseURL}/models/${model.modelId}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: request.temperature || 0.7,
            maxOutputTokens: Math.min(request.maxTokens || 2048, model.maxTokens)
          }
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Google AI API error: ${response.status} ${errorData}`)
    }

    const data = await response.json()
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Google AI')
    }

    return {
      content: data.candidates[0].content.parts[0].text,
      usage: data.usageMetadata ? {
        promptTokens: data.usageMetadata.promptTokenCount,
        completionTokens: data.usageMetadata.candidatesTokenCount,
        totalTokens: data.usageMetadata.totalTokenCount
      } : undefined,
      model: model.id,
      provider: 'google'
    }
  }

  private async generateTogether(request: GenerationRequest, model: AIModel): Promise<GenerationResponse> {
    const response = await fetch(`${this.provider.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model.modelId,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: Math.min(request.maxTokens || 2048, model.maxTokens),
        stream: false
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Together.ai API error: ${response.status} ${errorData}`)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from Together.ai')
    }

    return {
      content: data.choices[0].message.content,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      } : undefined,
      model: model.id,
      provider: 'together'
    }
  }

  private async generateBaseten(request: GenerationRequest, model: AIModel): Promise<GenerationResponse> {
    const response = await fetch(`${this.provider.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model.modelId,
        messages: request.messages,
        temperature: request.temperature || 1,
        max_tokens: Math.min(request.maxTokens || 1000, model.maxTokens),
        top_p: 1,
        presence_penalty: 0,
        frequency_penalty: 0,
        stop: [],
        stream: false
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Baseten API error: ${response.status} ${errorData}`)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from Baseten')
    }

    return {
      content: data.choices[0].message.content,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      } : undefined,
      model: model.id,
      provider: 'baseten'
    }
  }
}

// Factory function to create provider clients
export function createProviderClient(providerId: string): AIProviderClient {
  const provider = AI_PROVIDERS[providerId]
  if (!provider) {
    throw new Error(`Provider ${providerId} not found`)
  }
  return new AIProviderClient(provider)
}

// Utility to get the best available model for a user tier
export function getBestModelForTier(userTier: 'free' | 'pro', preferredProvider?: string): AIModel {
  const availableModels = getAvailableModels(userTier)
  
  if (preferredProvider) {
    const providerModels = availableModels.filter(m => m.provider === preferredProvider)
    if (providerModels.length > 0) {
      return providerModels[0]
    }
  }
  
  // Default to Gemini 2.0 Flash first (free and fast), then fallback to others
  return availableModels.find(m => m.id === 'gemini-2-flash') 
    || availableModels.find(m => m.id === 'llama-3-3-70b-free') 
    || availableModels.find(m => m.id === 'qwen-72b') 
    || availableModels[0]
}