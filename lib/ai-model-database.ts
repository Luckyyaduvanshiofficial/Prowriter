// AI Model Benchmark Data Management System
// This provides real-time AI model performance data for generating accurate comparisons

export interface AIModelBenchmark {
  id: string;
  model_name: string;
  provider: string;
  category: 'llm' | 'vision' | 'embedding' | 'code' | 'reasoning';
  benchmarks: {
    mmlu?: number;           // General knowledge
    hellaswag?: number;      // Commonsense reasoning
    arc?: number;            // Science questions
    truthfulqa?: number;     // Truthfulness
    humaneval?: number;      // Code generation
    gsm8k?: number;          // Math reasoning
    mt_bench?: number;       // Multi-turn conversation
    arena_score?: number;    // Chatbot Arena ELO
    cost_per_million_tokens?: number;
    tokens_per_second?: number;
    context_length?: number;
    training_data_cutoff?: string;
  };
  pricing: {
    input_cost_per_million?: number;
    output_cost_per_million?: number;
    free_tier?: boolean;
    rate_limits?: string;
  };
  capabilities: {
    supports_function_calling?: boolean;
    supports_json_mode?: boolean;
    supports_vision?: boolean;
    supports_code_execution?: boolean;
    max_output_tokens?: number;
  };
  last_updated: string;
  is_active: boolean;
}

export const AI_MODEL_DATABASE: AIModelBenchmark[] = [
  {
    id: 'gpt-4o',
    model_name: 'GPT-4o',
    provider: 'OpenAI',
    category: 'llm',
    benchmarks: {
      mmlu: 87.2,
      hellaswag: 95.3,
      arc: 96.3,
      truthfulqa: 79.8,
      humaneval: 90.2,
      gsm8k: 92.3,
      mt_bench: 9.32,
      arena_score: 1287,
      cost_per_million_tokens: 5.0,
      tokens_per_second: 85,
      context_length: 128000,
      training_data_cutoff: '2024-04'
    },
    pricing: {
      input_cost_per_million: 5.0,
      output_cost_per_million: 15.0,
      free_tier: false,
      rate_limits: '10k TPM'
    },
    capabilities: {
      supports_function_calling: true,
      supports_json_mode: true,
      supports_vision: true,
      supports_code_execution: false,
      max_output_tokens: 4096
    },
    last_updated: '2024-12-15',
    is_active: true
  },
  {
    id: 'claude-3-5-sonnet',
    model_name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    category: 'llm',
    benchmarks: {
      mmlu: 88.7,
      hellaswag: 95.4,
      arc: 96.4,
      truthfulqa: 82.1,
      humaneval: 92.0,
      gsm8k: 96.4,
      mt_bench: 9.15,
      arena_score: 1271,
      cost_per_million_tokens: 3.0,
      tokens_per_second: 78,
      context_length: 200000,
      training_data_cutoff: '2024-06'
    },
    pricing: {
      input_cost_per_million: 3.0,
      output_cost_per_million: 15.0,
      free_tier: false,
      rate_limits: '40k TPM'
    },
    capabilities: {
      supports_function_calling: true,
      supports_json_mode: true,
      supports_vision: true,
      supports_code_execution: false,
      max_output_tokens: 8192
    },
    last_updated: '2024-12-15',
    is_active: true
  },
  {
    id: 'gemini-pro-1-5',
    model_name: 'Gemini Pro 1.5',
    provider: 'Google',
    category: 'llm',
    benchmarks: {
      mmlu: 85.9,
      hellaswag: 92.6,
      arc: 91.4,
      truthfulqa: 71.8,
      humaneval: 84.7,
      gsm8k: 91.7,
      mt_bench: 8.17,
      arena_score: 1218,
      cost_per_million_tokens: 1.25,
      tokens_per_second: 92,
      context_length: 2000000,
      training_data_cutoff: '2024-02'
    },
    pricing: {
      input_cost_per_million: 1.25,
      output_cost_per_million: 5.0,
      free_tier: true,
      rate_limits: '2 RPM free'
    },
    capabilities: {
      supports_function_calling: true,
      supports_json_mode: true,
      supports_vision: true,
      supports_code_execution: false,
      max_output_tokens: 8192
    },
    last_updated: '2024-12-15',
    is_active: true
  },
  {
    id: 'llama-3-1-405b',
    model_name: 'LLaMA 3.1 405B',
    provider: 'Meta',
    category: 'llm',
    benchmarks: {
      mmlu: 87.3,
      hellaswag: 95.6,
      arc: 96.1,
      truthfulqa: 75.8,
      humaneval: 89.0,
      gsm8k: 96.8,
      mt_bench: 8.95,
      arena_score: 1254,
      cost_per_million_tokens: 2.7,
      tokens_per_second: 45,
      context_length: 128000,
      training_data_cutoff: '2024-03'
    },
    pricing: {
      input_cost_per_million: 2.7,
      output_cost_per_million: 2.7,
      free_tier: false,
      rate_limits: '10k TPM'
    },
    capabilities: {
      supports_function_calling: true,
      supports_json_mode: true,
      supports_vision: false,
      supports_code_execution: false,
      max_output_tokens: 4096
    },
    last_updated: '2024-12-15',
    is_active: true
  },
  {
    id: 'qwen-2-5-72b',
    model_name: 'Qwen 2.5 72B',
    provider: 'Alibaba',
    category: 'llm',
    benchmarks: {
      mmlu: 85.2,
      hellaswag: 93.1,
      arc: 94.8,
      truthfulqa: 70.5,
      humaneval: 86.2,
      gsm8k: 91.6,
      mt_bench: 8.41,
      arena_score: 1189,
      cost_per_million_tokens: 0.4,
      tokens_per_second: 110,
      context_length: 32768,
      training_data_cutoff: '2024-06'
    },
    pricing: {
      input_cost_per_million: 0.4,
      output_cost_per_million: 0.4,
      free_tier: false,
      rate_limits: '50k TPM'
    },
    capabilities: {
      supports_function_calling: true,
      supports_json_mode: true,
      supports_vision: false,
      supports_code_execution: false,
      max_output_tokens: 8192
    },
    last_updated: '2024-12-15',
    is_active: true
  },
  {
    id: 'deepseek-v2-5',
    model_name: 'DeepSeek V2.5',
    provider: 'DeepSeek',
    category: 'llm',
    benchmarks: {
      mmlu: 81.7,
      hellaswag: 89.8,
      arc: 89.2,
      truthfulqa: 65.9,
      humaneval: 89.6,
      gsm8k: 92.2,
      mt_bench: 8.11,
      arena_score: 1156,
      cost_per_million_tokens: 0.14,
      tokens_per_second: 125,
      context_length: 32768,
      training_data_cutoff: '2024-05'
    },
    pricing: {
      input_cost_per_million: 0.14,
      output_cost_per_million: 0.28,
      free_tier: false,
      rate_limits: '100k TPM'
    },
    capabilities: {
      supports_function_calling: true,
      supports_json_mode: true,
      supports_vision: false,
      supports_code_execution: false,
      max_output_tokens: 4096
    },
    last_updated: '2024-12-15',
    is_active: true
  }
];

// Utility functions for model comparison
export function getModelsByCategory(category: string): AIModelBenchmark[] {
  return AI_MODEL_DATABASE.filter(model => model.category === category && model.is_active);
}

export function getModelById(id: string): AIModelBenchmark | undefined {
  return AI_MODEL_DATABASE.find(model => model.id === id);
}

export function compareModels(modelA: string, modelB: string): {
  modelA: AIModelBenchmark;
  modelB: AIModelBenchmark;
  comparison: {
    performance: { winner: string; details: any };
    pricing: { winner: string; details: any };
    capabilities: { winner: string; details: any };
  };
} | null {
  const a = getModelById(modelA);
  const b = getModelById(modelB);
  
  if (!a || !b) return null;
  
  // Performance comparison
  const performanceScores = {
    a: calculateOverallScore(a),
    b: calculateOverallScore(b)
  };
  
  // Pricing comparison (lower is better)
  const pricingScores = {
    a: (a.pricing.input_cost_per_million || 0) + (a.pricing.output_cost_per_million || 0),
    b: (b.pricing.input_cost_per_million || 0) + (b.pricing.output_cost_per_million || 0)
  };
  
  // Capabilities comparison
  const capabilityScores = {
    a: calculateCapabilityScore(a),
    b: calculateCapabilityScore(b)
  };
  
  return {
    modelA: a,
    modelB: b,
    comparison: {
      performance: {
        winner: performanceScores.a > performanceScores.b ? modelA : modelB,
        details: performanceScores
      },
      pricing: {
        winner: pricingScores.a < pricingScores.b ? modelA : modelB,
        details: pricingScores
      },
      capabilities: {
        winner: capabilityScores.a > capabilityScores.b ? modelA : modelB,
        details: capabilityScores
      }
    }
  };
}

function calculateOverallScore(model: AIModelBenchmark): number {
  const benchmarks = model.benchmarks;
  const weights = {
    mmlu: 0.2,
    hellaswag: 0.15,
    arc: 0.15,
    truthfulqa: 0.15,
    humaneval: 0.15,
    gsm8k: 0.1,
    mt_bench: 0.1
  };
  
  let score = 0;
  let totalWeight = 0;
  
  Object.entries(weights).forEach(([key, weight]) => {
    if (benchmarks[key as keyof typeof benchmarks]) {
      score += (benchmarks[key as keyof typeof benchmarks] as number) * weight;
      totalWeight += weight;
    }
  });
  
  return totalWeight > 0 ? score / totalWeight : 0;
}

function calculateCapabilityScore(model: AIModelBenchmark): number {
  const capabilities = model.capabilities;
  let score = 0;
  
  if (capabilities.supports_function_calling) score += 1;
  if (capabilities.supports_json_mode) score += 1;
  if (capabilities.supports_vision) score += 2;
  if (capabilities.supports_code_execution) score += 1;
  if ((capabilities.max_output_tokens || 0) > 4000) score += 1;
  
  return score;
}

// Get trending models based on performance improvements
export function getTrendingModels(): AIModelBenchmark[] {
  return AI_MODEL_DATABASE
    .filter(model => model.is_active)
    .sort((a, b) => {
      const scoreA = calculateOverallScore(a);
      const scoreB = calculateOverallScore(b);
      return scoreB - scoreA;
    })
    .slice(0, 5);
}

// Get best value models (performance per dollar)
export function getBestValueModels(): AIModelBenchmark[] {
  return AI_MODEL_DATABASE
    .filter(model => model.is_active && model.pricing.input_cost_per_million)
    .sort((a, b) => {
      const valueA = calculateOverallScore(a) / (a.pricing.input_cost_per_million || 1);
      const valueB = calculateOverallScore(b) / (b.pricing.input_cost_per_million || 1);
      return valueB - valueA;
    })
    .slice(0, 5);
}

// Export all models for quick access
export const ALL_MODELS = AI_MODEL_DATABASE;