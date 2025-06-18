"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  AI_PROVIDERS, 
  AI_MODELS, 
  getModelsByProvider,
  getAvailableModels 
} from "@/lib/ai-providers"
import { 
  ChevronDown, 
  Bot, 
  Zap, 
  Crown,
  CheckCircle2
} from "lucide-react"

interface AIProviderSelectorProps {
  selectedModel?: string
  onModelSelect?: (modelId: string) => void
  userTier?: 'free' | 'pro'
  variant?: 'default' | 'compact'
}

export function AIProviderSelector({ 
  selectedModel, 
  onModelSelect, 
  userTier = 'free',
  variant = 'default' 
}: AIProviderSelectorProps) {
  const [availableModels, setAvailableModels] = useState<any[]>([])
  const [currentModel, setCurrentModel] = useState<any>(null)

  useEffect(() => {
    const models = getAvailableModels(userTier)
    setAvailableModels(models)
    
    if (selectedModel) {
      const model = models.find(m => m.id === selectedModel)
      setCurrentModel(model)
    } else {
      // Set default model
      const defaultModel = models.find(m => m.id === 'qwen-72b') || models[0]
      setCurrentModel(defaultModel)
      onModelSelect?.(defaultModel?.id)
    }
  }, [selectedModel, userTier, onModelSelect])

  const handleModelSelect = (modelId: string) => {
    const model = availableModels.find(m => m.id === modelId)
    setCurrentModel(model)
    onModelSelect?.(modelId)
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openrouter':
        return '🔀'
      case 'google':
        return '🟡'
      case 'together':
        return '🤝'
      default:
        return '🤖'
    }
  }

  const getProviderModels = (providerId: string) => {
    return availableModels.filter(model => model.provider === providerId)
  }

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">
              {currentModel?.name || 'Select AI'}
            </span>
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center space-x-2">
            <Bot className="w-4 h-4" />
            <span>AI Engine Selection</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {Object.values(AI_PROVIDERS).map((provider) => {
            const providerModels = getProviderModels(provider.id)
            if (providerModels.length === 0) return null
            
            return (
              <DropdownMenuSub key={provider.id}>
                <DropdownMenuSubTrigger className="flex items-center space-x-2">
                  <span>{getProviderIcon(provider.id)}</span>
                  <span>{provider.name}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {providerModels.length}
                  </Badge>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-72">
                  {providerModels.map((model) => (
                    <DropdownMenuItem
                      key={model.id}
                      onClick={() => handleModelSelect(model.id)}
                      className="flex items-start space-x-3 p-3 cursor-pointer"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{model.name}</span>
                          {currentModel?.id === model.id && (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                          {model.tier === 'pro' && userTier === 'free' && (
                            <Crown className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{model.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge 
                            variant={model.tier === 'pro' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {model.tier.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {model.costPer1000Tokens === 0 ? 'Free' : `$${model.costPer1000Tokens}/1K`}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )
          })}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-xs text-gray-500 justify-center">
            {availableModels.length} models available
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Bot className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">AI Engine Selection</h3>
      </div>
      
      <div className="grid gap-4">
        {Object.values(AI_PROVIDERS).map((provider) => {
          const providerModels = getProviderModels(provider.id)
          if (providerModels.length === 0) return null
          
          return (
            <div key={provider.id} className="space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <span className="text-lg">{getProviderIcon(provider.id)}</span>
                <h4 className="font-medium text-gray-900">{provider.name}</h4>
                <Badge variant="secondary" className="ml-auto">
                  {providerModels.length} models
                </Badge>
              </div>
              
              <div className="grid gap-2">
                {providerModels.map((model) => (
                  <div
                    key={model.id}
                    onClick={() => handleModelSelect(model.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:border-blue-300 hover:shadow-sm ${
                      currentModel?.id === model.id 
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{model.name}</span>
                          {currentModel?.id === model.id && (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                          {model.tier === 'pro' && userTier === 'free' && (
                            <Crown className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{model.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge 
                            variant={model.tier === 'pro' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {model.tier.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {model.costPer1000Tokens === 0 ? 'Free' : `$${model.costPer1000Tokens}/1K`}
                          </span>
                          {model.features.slice(0, 2).map((feature: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      
      {currentModel && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-green-500" />
            <span className="font-medium text-sm">Selected Engine</span>
          </div>
          <div className="text-sm text-gray-600">
            <div className="font-medium">{currentModel.name}</div>
            <div>Provider: {currentModel.provider}</div>
            <div>Tier: {currentModel.tier}</div>
            <div>Max Tokens: {currentModel.maxTokens.toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  )
}
