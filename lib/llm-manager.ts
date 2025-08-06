// Enhanced LLM Provider System for Easy Model Integration
// This extends the existing ai-providers.ts to make adding new LLMs easier

import { AIModel, AIProvider, GenerationRequest, GenerationResponse, AI_MODELS, AI_PROVIDERS } from './ai-providers'

export interface LLMConfig {
  id: string
  name: string
  provider: string
  modelId: string
  tier: 'free' | 'pro'
  features: string[]
  maxTokens: number
  costPer1000Tokens?: number
  description: string
  apiEndpoint?: string
  authType?: 'bearer' | 'apikey' | 'custom'
  customHeaders?: Record<string, string>
  requestFormat?: 'openai' | 'google' | 'custom'
  streaming?: boolean
}

export interface CustomProvider {
  id: string
  name: string
  baseURL: string
  apiKeyEnv: string
  authType: 'bearer' | 'apikey' | 'custom'
  requestFormat: 'openai' | 'google' | 'custom'
  models: LLMConfig[]
  customClient?: (config: LLMConfig) => Promise<any>
}

export class LLMManager {
  private customProviders: Map<string, CustomProvider> = new Map()
  private customModels: Map<string, LLMConfig> = new Map()

  constructor() {
    // Initialize with existing providers
    this.initializeExistingProviders()
  }

  private initializeExistingProviders() {
    // Convert existing AI_MODELS to LLMConfig format for consistency
    AI_MODELS.forEach(model => {
      const llmConfig: LLMConfig = {
        id: model.id,
        name: model.name,
        provider: model.provider,
        modelId: model.modelId,
        tier: model.tier,
        features: model.features,
        maxTokens: model.maxTokens,
        costPer1000Tokens: model.costPer1000Tokens,
        description: model.description,
        requestFormat: model.provider === 'google' ? 'google' : 'openai',
        streaming: false // Current providers don't support streaming
      }
      this.customModels.set(model.id, llmConfig)
    })
  }

  // Add a new LLM provider (like Anthropic Claude, Cohere, etc.)
  addProvider(provider: CustomProvider): void {
    this.customProviders.set(provider.id, provider)
    
    // Add all models from this provider
    provider.models.forEach(model => {
      this.customModels.set(model.id, model)
    })

    console.log(`Added new LLM provider: ${provider.name} with ${provider.models.length} models`)
  }

  // Add a single model to an existing provider
  addModel(providerId: string, model: LLMConfig): void {
    const provider = this.customProviders.get(providerId)
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`)
    }

    provider.models.push(model)
    this.customModels.set(model.id, model)
    
    console.log(`Added new model: ${model.name} to provider: ${provider.name}`)
  }

  // Get all available models
  getAllModels(): LLMConfig[] {
    return Array.from(this.customModels.values())
  }

  // Get models by tier
  getModelsByTier(tier: 'free' | 'pro'): LLMConfig[] {
    return this.getAllModels().filter(model => 
      tier === 'pro' ? true : model.tier === 'free'
    )
  }

  // Get models by provider
  getModelsByProvider(providerId: string): LLMConfig[] {
    return this.getAllModels().filter(model => model.provider === providerId)
  }

  // Get model by ID
  getModel(modelId: string): LLMConfig | undefined {
    return this.customModels.get(modelId)
  }

  // Get all providers
  getAllProviders(): (AIProvider | CustomProvider)[] {
    const existing = Object.values(AI_PROVIDERS)
    const custom = Array.from(this.customProviders.values())
    return [...existing, ...custom]
  }

  // Generate content with any model
  async generateContent(request: GenerationRequest & { modelConfig?: LLMConfig }): Promise<GenerationResponse> {
    const modelConfig = request.modelConfig || this.getModel(request.model)
    
    if (!modelConfig) {
      throw new Error(`Model ${request.model} not found`)
    }

    // Use existing AI provider system for current models
    if (AI_MODELS.find(m => m.id === modelConfig.id)) {
      const { AIProviderClient } = await import('./ai-providers')
      const provider = AI_PROVIDERS[modelConfig.provider]
      const client = new AIProviderClient(provider)
      return await client.generateContent(request)
    }

    // Handle custom providers
    const customProvider = this.customProviders.get(modelConfig.provider)
    if (!customProvider) {
      throw new Error(`Provider ${modelConfig.provider} not found`)
    }

    return await this.generateWithCustomProvider(customProvider, modelConfig, request)
  }

  private async generateWithCustomProvider(
    provider: CustomProvider,
    modelConfig: LLMConfig,
    request: GenerationRequest
  ): Promise<GenerationResponse> {
    const apiKey = process.env[provider.apiKeyEnv]
    if (!apiKey) {
      throw new Error(`API key not found for ${provider.name}. Please set ${provider.apiKeyEnv} environment variable.`)
    }

    // Use custom client if provided
    if (provider.customClient) {
      return await provider.customClient(modelConfig)
    }

    // Use standard implementation based on request format
    switch (provider.requestFormat) {
      case 'openai':
        return await this.generateOpenAIFormat(provider, modelConfig, request, apiKey)
      case 'google':
        return await this.generateGoogleFormat(provider, modelConfig, request, apiKey)
      case 'custom':
        throw new Error(`Custom request format requires customClient implementation`)
      default:
        throw new Error(`Unsupported request format: ${provider.requestFormat}`)
    }
  }

  private async generateOpenAIFormat(
    provider: CustomProvider,
    modelConfig: LLMConfig,
    request: GenerationRequest,
    apiKey: string
  ): Promise<GenerationResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (provider.authType === 'bearer') {
      headers['Authorization'] = `Bearer ${apiKey}`
    } else if (provider.authType === 'apikey') {
      headers['X-API-Key'] = apiKey
    }

    // Add custom headers if specified
    if (modelConfig.customHeaders) {
      Object.assign(headers, modelConfig.customHeaders)
    }

    const response = await fetch(`${provider.baseURL}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: modelConfig.modelId,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: Math.min(request.maxTokens || 2048, modelConfig.maxTokens),
        stream: false
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`${provider.name} API error: ${response.status} ${errorData}`)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error(`Invalid response format from ${provider.name}`)
    }

    return {
      content: data.choices[0].message.content,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      } : undefined,
      model: modelConfig.id,
      provider: provider.id
    }
  }

  private async generateGoogleFormat(
    provider: CustomProvider,
    modelConfig: LLMConfig,
    request: GenerationRequest,
    apiKey: string
  ): Promise<GenerationResponse> {
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
      `${provider.baseURL}/models/${modelConfig.modelId}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...modelConfig.customHeaders
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: request.temperature || 0.7,
            maxOutputTokens: Math.min(request.maxTokens || 2048, modelConfig.maxTokens)
          }
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`${provider.name} API error: ${response.status} ${errorData}`)
    }

    const data = await response.json()
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error(`Invalid response format from ${provider.name}`)
    }

    return {
      content: data.candidates[0].content.parts[0].text,
      usage: data.usageMetadata ? {
        promptTokens: data.usageMetadata.promptTokenCount,
        completionTokens: data.usageMetadata.candidatesTokenCount,
        totalTokens: data.usageMetadata.totalTokenCount
      } : undefined,
      model: modelConfig.id,
      provider: provider.id
    }
  }
}

// Singleton instance
export const llmManager = new LLMManager()

// Helper functions for easy migration from existing code
export function getAllAvailableModels(userTier: 'free' | 'pro' = 'free'): LLMConfig[] {
  return llmManager.getModelsByTier(userTier)
}

export function getLLMModelById(modelId: string): LLMConfig | undefined {
  return llmManager.getModel(modelId)
}

export async function generateWithLLM(request: GenerationRequest): Promise<GenerationResponse> {
  return await llmManager.generateContent(request)
}

// Example: How to add a new provider (Anthropic Claude)
export function addAnthropicProvider() {
  const anthropicProvider: CustomProvider = {
    id: 'anthropic',
    name: 'Anthropic',
    baseURL: 'https://api.anthropic.com/v1',
    apiKeyEnv: 'ANTHROPIC_API_KEY',
    authType: 'apikey',
    requestFormat: 'custom', // Anthropic has its own format
    models: [
      {
        id: 'claude-3-haiku',
        name: 'Claude 3 Haiku',
        provider: 'anthropic',
        modelId: 'claude-3-haiku-20240307',
        tier: 'free',
        features: ['Fast', 'Efficient', 'Good Reasoning'],
        maxTokens: 4096,
        costPer1000Tokens: 0.25,
        description: 'Fast and efficient Claude model for quick tasks',
        streaming: true
      },
      {
        id: 'claude-3-sonnet',
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        modelId: 'claude-3-5-sonnet-20241022',
        tier: 'pro',
        features: ['Advanced Reasoning', 'Long Context', 'High Quality'],
        maxTokens: 8192,
        costPer1000Tokens: 3.0,
        description: 'Advanced Claude model with superior reasoning capabilities',
        streaming: true
      }
    ],
    customClient: async (config: LLMConfig) => {
      // Custom implementation for Anthropic API
      // This would handle Anthropic's specific request format
      throw new Error('Anthropic client implementation needed')
    }
  }

  llmManager.addProvider(anthropicProvider)
}

// Example: How to add Cohere provider
export function addCohereProvider() {
  const cohereProvider: CustomProvider = {
    id: 'cohere',
    name: 'Cohere',
    baseURL: 'https://api.cohere.ai/v1',
    apiKeyEnv: 'COHERE_API_KEY',
    authType: 'bearer',
    requestFormat: 'custom',
    models: [
      {
        id: 'command-r',
        name: 'Command R',
        provider: 'cohere',
        modelId: 'command-r',
        tier: 'free',
        features: ['Instruction Following', 'RAG', 'Tool Use'],
        maxTokens: 4096,
        costPer1000Tokens: 0.15,
        description: 'Cohere\'s instruction-following model optimized for RAG and tool use',
        streaming: true
      },
      {
        id: 'command-r-plus',
        name: 'Command R+',
        provider: 'cohere',
        modelId: 'command-r-plus',
        tier: 'pro',
        features: ['Advanced Reasoning', 'Long Context', 'Multilingual'],
        maxTokens: 128000,
        costPer1000Tokens: 3.0,
        description: 'Cohere\'s most capable model with long context and advanced reasoning',
        streaming: true
      }
    ]
  }

  llmManager.addProvider(cohereProvider)
}