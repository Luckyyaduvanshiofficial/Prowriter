import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

const OUTLINE_PROMPT = `You are an expert content strategist and SEO specialist. Your task is to create detailed, SEO-optimized article outlines that serve as blueprints for high-quality blog content.

🎯 OBJECTIVE:
Create a comprehensive article outline that includes:
- SEO-optimized structure with proper heading hierarchy
- Detailed section descriptions with word count targets
- Key points and sub-topics for each section
- SEO recommendations (keywords, meta descriptions, etc.)
- Content suggestions and examples

📝 OUTLINE STRUCTURE:
1. **Article Title Suggestions** (3-5 options)
   - Primary title (H1)
   - Alternative variations for A/B testing

2. **Meta Information**
   - Meta description (150-160 characters)
   - Primary keywords and secondary keywords
   - Target word count
   - Estimated reading time

3. **Detailed Section Breakdown**
   For each section, include:
   - Section title (H2/H3)
   - Target word count
   - Key points to cover
   - Content suggestions
   - SEO notes

4. **Content Enhancement Suggestions**
   - Visual content recommendations
   - Internal linking opportunities
   - Call-to-action placements
   - FAQ section ideas

5. **SEO Optimization Notes**
   - Keyword placement strategy
   - Featured snippet opportunities
   - Schema markup suggestions

Return the outline in clear, well-formatted text that can be easily followed by a content writer.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      topic, 
      contentType = "informative",
      articleLength = "medium",
      seoKeywords = "",
      targetAudience = "",
      brandVoice = "friendly",
      aiEngine = "qwen"
    } = body

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    // Map AI engines to actual models
    const engineModels = {
      "qwen": "qwen/qwen-2.5-72b-instruct",
      "llama": "meta-llama/llama-3.1-405b-instruct",
      "deepseek": "deepseek/deepseek-coder",
      "gemini": "google/gemini-pro"
    }

    const selectedModel = engineModels[aiEngine] || engineModels["qwen"]

    // Configure OpenRouter
    const model = openai(selectedModel, {
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    })

    // Content type specific instructions
    const contentTypeInstructions = {
      "how-to": "Structure as a step-by-step tutorial with clear progression from beginner to completion. Include prerequisites, tools needed, and troubleshooting sections.",
      "guide": "Create a comprehensive educational outline covering fundamentals to advanced concepts. Include background, core concepts, best practices, and practical applications.",
      "comparison": "Focus on detailed comparative analysis structure. Include introduction, individual analysis of each option, direct comparisons, and clear recommendations.",
      "news": "Use journalistic structure with lead, background, analysis, expert opinions, and future implications. Include fact-checking and source requirements.",
      "informative": "Structure for maximum educational value with clear learning progression. Include concept introduction, detailed explanations, examples, and takeaways."
    }

    // Article length specifications
    const lengthSpecs = {
      "short": { words: "800-1000", sections: "4-5", depth: "focused and concise" },
      "medium": { words: "1200-1500", sections: "6-8", depth: "comprehensive coverage" },
      "long": { words: "1800-2500", sections: "8-12", depth: "in-depth analysis" },
      "epic": { words: "3000+", sections: "12-15", depth: "ultimate comprehensive guide" }
    }

    const lengthSpec = lengthSpecs[articleLength] || lengthSpecs["medium"]

    let customPrompt = OUTLINE_PROMPT
    
    customPrompt += `\n\n📋 CONTENT SPECIFICATIONS:
- Content Type: ${contentType}
- Target Length: ${lengthSpec.words} words
- Number of Sections: ${lengthSpec.sections}
- Content Depth: ${lengthSpec.depth}
- Content Type Focus: ${contentTypeInstructions[contentType]}`

    if (seoKeywords) {
      customPrompt += `\n\n🎯 SEO FOCUS: Primary keywords to target: ${seoKeywords}`
    }

    if (targetAudience) {
      customPrompt += `\n\n👥 TARGET AUDIENCE: ${targetAudience}`
    }

    customPrompt += `\n\n🎨 BRAND VOICE: ${brandVoice} tone and style`

    const specificPrompt = `Create a detailed article outline for: "${topic}"

The outline should be comprehensive enough that any skilled writer could use it to create a high-quality, SEO-optimized article. Include specific guidance for content creation, keyword placement, and reader engagement strategies.`

    const finalPrompt = `${customPrompt}\n\n${specificPrompt}`

    const { text } = await generateText({
      model,
      prompt: finalPrompt,
      temperature: 0.3, // Lower temperature for more structured outlines
      maxTokens: 2000,
    })

    return NextResponse.json({
      outline: text,
      metadata: {
        topic,
        contentType,
        articleLength,
        seoKeywords,
        targetAudience,
        brandVoice,
        aiEngine,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Outline generation error:", error)
    return NextResponse.json({ error: "Failed to generate outline" }, { status: 500 })
  }
}
