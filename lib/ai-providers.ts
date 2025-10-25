// AI Providers Configuration for Multi-Provider Support
// Supports OpenRouter, Google AI (Gemini), and Together.ai

export interface AIModel {
  id: string
  name: string
  provider: 'google' | 'baseten' | 'deepseek'
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

// AI Models Configuration - Only Baseten, Gemini, and DeepSeek
export const AI_MODELS: AIModel[] = [
  // Google AI Models (Direct) - FREE TIER (Default)
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
  // Baseten Models - PRO TIER
  {
    id: 'gpt-oss-120b',
    name: 'GPT OSS 120B',
    provider: 'baseten',
    modelId: 'openai/gpt-oss-120b',
    tier: 'pro',
    features: ['Large Scale', 'High Quality', 'Advanced Reasoning'],
    maxTokens: 4096,
    costPer1000Tokens: 2.0,
    description: '🔥 Pro - High-performance open-source GPT model with 120B parameters'
  },
  // DeepSeek API - PRO TIER
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'deepseek',
    modelId: 'deepseek-chat',
    tier: 'pro',
    features: ['Advanced Reasoning', 'Long Context', 'Cost-Effective'],
    maxTokens: 8192,
    costPer1000Tokens: 0.27,
    description: '🚀 Pro - DeepSeek\'s flagship model with exceptional reasoning at low cost'
  },
  {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder',
    provider: 'deepseek',
    modelId: 'deepseek-coder',
    tier: 'pro',
    features: ['Code Generation', 'Technical Writing', 'Programming'],
    maxTokens: 8192,
    costPer1000Tokens: 0.14,
    description: '💻 Pro - Specialized for technical and programming content'
  }
]

// Provider Configurations - Only Baseten, Gemini, and DeepSeek
export const AI_PROVIDERS: Record<string, AIProvider> = {
  google: {
    id: 'google',
    name: 'Google AI',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    apiKeyEnv: 'GOOGLE_API_KEY',
    models: AI_MODELS.filter(m => m.provider === 'google')
  },
  baseten: {
    id: 'baseten',
    name: 'Baseten',
    baseURL: 'https://inference.baseten.co/v1',
    apiKeyEnv: 'BASETEN_API_KEY',
    models: AI_MODELS.filter(m => m.provider === 'baseten')
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    baseURL: 'https://api.deepseek.com/v1',
    apiKeyEnv: 'DEEPSEEK_API_KEY',
    models: AI_MODELS.filter(m => m.provider === 'deepseek')
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

    // Optimize temperature for better content quality
    // Lower temperature (0.3-0.5) for factual, technical content
    // Medium temperature (0.7-0.8) for creative, engaging content
    // Higher temperature (0.9-1.0) for highly creative, varied content
    const optimizedTemperature = request.temperature !== undefined 
      ? request.temperature 
      : 0.7 // Default to creative but controlled

    try {
      switch (this.provider.id) {
        case 'google':
          return await this.generateGoogle({ ...request, temperature: optimizedTemperature }, model)
        case 'baseten':
          return await this.generateBaseten({ ...request, temperature: optimizedTemperature }, model)
        case 'deepseek':
          return await this.generateDeepSeek({ ...request, temperature: optimizedTemperature }, model)
        default:
          throw new Error(`Unsupported provider: ${this.provider.id}`)
      }
    } catch (error) {
      console.error(`Error generating content with ${this.provider.name}:`, error)
      throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : String(error)}`)
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

    // Optimize generation config for better quality
    const generationConfig = {
      temperature: request.temperature || 0.7,
      maxOutputTokens: Math.min(request.maxTokens || 4096, model.maxTokens),
      topP: 0.95, // Nucleus sampling for more coherent output
      topK: 40,   // Top-k sampling for quality control
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
          generationConfig
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



  private async generateBaseten(request: GenerationRequest, model: AIModel): Promise<GenerationResponse> {
    // Optimize parameters for Baseten's GPT OSS model
    const optimizedConfig = {
      model: model.modelId,
      messages: request.messages,
      temperature: request.temperature || 0.8, // Slightly higher for creativity
      max_tokens: Math.min(request.maxTokens || 2048, model.maxTokens),
      top_p: 0.9,        // Nucleus sampling for quality
      presence_penalty: 0.6,  // Encourage diverse content
      frequency_penalty: 0.3, // Reduce repetition
      stop: [],
      stream: false
    }

    const response = await fetch(`${this.provider.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(optimizedConfig)
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

  private async generateDeepSeek(request: GenerationRequest, model: AIModel): Promise<GenerationResponse> {
    // Optimize parameters for DeepSeek's advanced reasoning capabilities
    const optimizedConfig = {
      model: model.modelId,
      messages: request.messages,
      temperature: request.temperature || 0.7,
      max_tokens: Math.min(request.maxTokens || 4096, model.maxTokens),
      top_p: 0.95,       // High quality nucleus sampling
      frequency_penalty: 0.2, // Slight penalty to reduce repetition
      presence_penalty: 0.1,  // Encourage topic exploration
      stream: false
    }

    const response = await fetch(`${this.provider.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(optimizedConfig)
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`DeepSeek API error: ${response.status} ${errorData}`)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from DeepSeek')
    }

    return {
      content: data.choices[0].message.content,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      } : undefined,
      model: model.id,
      provider: 'deepseek'
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
  
  // Default to Gemini 2.5 Flash (free), then Baseten GPT OSS 120B (pro), then DeepSeek Chat (pro)
  return availableModels.find(m => m.id === 'gemini-2-flash') 
    || availableModels.find(m => m.id === 'gpt-oss-120b') 
    || availableModels.find(m => m.id === 'deepseek-chat') 
    || availableModels[0]
}