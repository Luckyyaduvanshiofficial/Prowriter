import { type NextRequest, NextResponse } from "next/server"
import { getModelById, AI_PROVIDERS, AIProviderClient } from "@/lib/ai-providers"

export async function POST(request: NextRequest) {
  try {
    const {
      topic,
      modelA,
      articleType = "guide",
      contentLength = "medium",
      brandVoice = "professional",
      targetAudience = "general audience",
      seoKeywords = "",
      includeWebSearch = false
    } = await request.json()

    if (!topic || !modelA) {
      return NextResponse.json(
        { error: "Topic and model are required" },
        { status: 400 }
      )
    }

    // Get model configuration
    const model = getModelById(modelA)
    if (!model) {
      return NextResponse.json(
        { error: "Invalid model selected" },
        { status: 400 }
      )
    }

    // Get provider configuration
    const provider = AI_PROVIDERS[model.provider]
    if (!provider) {
      return NextResponse.json(
        { error: "Provider not available" },
        { status: 500 }
      )
    }

    // Create provider client
    const client = new AIProviderClient(provider)

    // Build comprehensive prompt for article generation
    const prompt = buildArticlePrompt({
      topic,
      articleType,
      contentLength,
      brandVoice,
      targetAudience,
      seoKeywords
    })

    // Generate content using existing AI provider system
    const response = await client.generateContent({
      messages: [
        {
          role: "system",
          content: "You are an expert content writer specializing in creating high-quality, SEO-optimized articles. Always format your output in proper HTML without markdown."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      model: model.id,
      temperature: 0.7,
      maxTokens: getMaxTokensForLength(contentLength)
    })

    return NextResponse.json({
      success: true,
      content: response.content,
      model: model.name,
      provider: model.provider,
      usage: response.usage
    })

  } catch (error) {
    console.error("Canvas generation error:", error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to generate content",
        success: false 
      },
      { status: 500 }
    )
  }
}

function buildArticlePrompt({
  topic,
  articleType,
  contentLength,
  brandVoice,
  targetAudience,
  seoKeywords
}: {
  topic: string
  articleType: string
  contentLength: string
  brandVoice: string
  targetAudience: string
  seoKeywords: string
}) {
  const lengthMapping = {
    short: "800-1000 words",
    medium: "1200-1500 words", 
    long: "1800-2500 words",
    epic: "3000+ words"
  }

  const voiceMapping = {
    professional: "formal, authoritative, and expert-level",
    friendly: "conversational, approachable, and engaging",
    technical: "detailed, precise, and technically comprehensive",
    casual: "relaxed, easy-to-read, and accessible",
    journalistic: "objective, factual, and news-style"
  }

  const typeMapping = {
    howto: "step-by-step tutorial with actionable instructions",
    listicle: "engaging numbered list format with detailed explanations",
    review: "comprehensive analysis with pros, cons, and recommendations",
    news: "up-to-date news article with latest developments",
    tutorial: "educational guide with clear learning objectives",
    comparison: "detailed comparison with thorough analysis",
    guide: "comprehensive guide covering all aspects",
    opinion: "thought-provoking opinion piece with strong arguments",
    "case-study": "real-world case study with practical insights"
  }

  return `You are an expert content writer creating a ${typeMapping[articleType as keyof typeof typeMapping] || 'comprehensive article'} about "${topic}".

REQUIREMENTS:
- Length: ${lengthMapping[contentLength as keyof typeof lengthMapping] || '1200-1500 words'}
- Tone: ${voiceMapping[brandVoice as keyof typeof voiceMapping] || 'professional and engaging'}
- Target Audience: ${targetAudience}
- SEO Keywords: ${seoKeywords}

CONTENT STRUCTURE:
1. Start with an engaging introduction that hooks the reader
2. Use clear HTML headings (h1, h2, h3) for proper structure
3. Include practical examples and actionable insights
4. Write in a ${voiceMapping[brandVoice as keyof typeof voiceMapping] || 'professional'} tone
5. Optimize for the target keywords naturally
6. End with a compelling conclusion and call-to-action

OUTPUT FORMAT:
- Use proper HTML formatting (h1, h2, h3, p, ul, ol, strong, em)
- No markdown formatting
- Include meta description comment at the start
- Ensure content is valuable and engaging for ${targetAudience}

Begin writing the article now:`
}

function getMaxTokensForLength(contentLength: string): number {
  const tokenMapping = {
    short: 1500,
    medium: 2500,
    long: 4000,
    epic: 6000
  }
  return tokenMapping[contentLength as keyof typeof tokenMapping] || 2500
}