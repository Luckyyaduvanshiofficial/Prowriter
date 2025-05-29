import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

const MASTER_PROMPT = `You are an experienced SEO blog writer and technical expert in AI and Large Language Models (LLMs). You write for RankLLMs.com, a trusted platform that compares, ranks, and explains AI models in a way that's easy to understand for beginners and insightful for advanced users.

🎯 OBJECTIVE:
Write a long-form (1,500+ words), SEO-optimized, comparison-style blog article between two LLMs.

🧠 CONTENT STRATEGY:
- Write in a **natural, friendly, human tone** — not robotic or overly formal.
- Assume the reader is smart but not a tech expert. Use **simple, clear explanations**.
- Use **short paragraphs**, **clear headings**, and **conversational transitions** like "Let's break it down."
- Optimize for Google SEO using a clear structure, keywords, and metadata.

📝 ARTICLE STRUCTURE:
1. **SEO Title**  
   - Clear, keyword-rich, and attention-grabbing  
   - Example: *Claude 3.5 vs GPT-4o: Which AI Model Is Smarter in 2025?*

2. **Meta Description**  
   - 150–160 characters  
   - Include both model names and the goal of the article (e.g., "comparison, performance, use cases")

3. **Introduction**  
   - Ask a question or state a problem  
   - Set reader expectations clearly (who this article is for and what they'll learn)

4. **Benchmark Comparison Table**  
   - Include a side-by-side comparison with real or placeholder values:
     | Model       | Speed | Coding | Chat | Reasoning | Price | Launch Year |
     |-------------|-------|--------|------|-----------|-------|--------------|
     | Model A     |       |        |      |           |       |              |
     | Model B     |       |        |      |           |       |              |

5. **Use Case Deep Dive**  
   - Use subheadings and explain how each model performs in:
     - Chat & Conversations (tone, writing help, assistants)
     - Coding Help (programming, debugging, DevX)
     - Reasoning & IQ (math, logic, planning)
   - Use **real-world examples** (e.g., "If you're a developer...")

6. **Pros and Cons List**  
   - Use honest, detailed bullet points
   - Avoid vague words like "good" or "better" — explain **why**

7. **Final Verdict**  
   - Help readers decide with a clear recommendation  
   - Use a sentence like:  
     - "Choose {{Model A}} if you need speed. Go with {{Model B}} if you want top-tier reasoning."

8. **3 SEO-Optimized FAQs**  
   - Use beginner-friendly keywords  
   - Examples:
     - "Which LLM is better for coding: {{Model A}} or {{Model B}}?"
     - "Can {{Model B}} write SEO blogs?"
     - "Is {{Model A}} faster than GPT-4?"

📸 VISUALS:  
- Use **at least 1 featured image** from [Pexels.com](https://www.pexels.com) that fits the article topic.  
- Include AI model images/logos (if available via public sources or generic placeholders).  
- Add table formatting, bullets, and bold keywords for **readability and SEO**.

⚙️ OUTPUT FORMAT:
Return the full blog article in well-formatted HTML with:
- \`<h1>\` for the SEO title  
- \`<meta>\` tag for the meta description  
- \`<h2>\`, \`<h3>\`, \`<ul>\`, \`<table>\` for structure  
- Image URLs included as \`<img src="/placeholder.svg">\` (use Pexels where appropriate)

💡 TONE CONTROL:
If the user provides a tone like "journalistic" or "friendly," adjust the tone accordingly without breaking structure.

✍️ Your article should feel like it was written by a helpful expert who wants the reader to succeed — like talking to a smart friend, not a machine.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      topic, 
      modelA, 
      modelB, 
      useCase,
      aiEngine = "qwen",
      articleLength = "medium",
      tone = "friendly", 
      temperature = 0.7, 
      contentType = "comparison",
      seoKeywords = "",
      targetAudience = "",
      customInstructions = "",
      brandVoice = "friendly",
      includeWebSearch = false,
      includeSerpAnalysis = false
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

    // Customize prompt based on article length
    const lengthInstructions = {
      "short": "Write a focused 800-1000 word article.",
      "medium": "Write a comprehensive 1200-1500 word article.",
      "long": "Write an in-depth 1800-2500 word article with detailed analysis.",
      "epic": "Write an ultimate 3000+ word comprehensive guide with extensive examples and analysis."
    }

    // Customize prompt based on content type
    const contentTypeInstructions = {
      "how-to": "Structure as a step-by-step tutorial with clear instructions, prerequisites, and troubleshooting tips. Include numbered steps and practical examples.",
      "guide": "Create a comprehensive educational guide with background information, detailed explanations, best practices, and expert insights.",
      "comparison": "Focus on detailed side-by-side analysis, benchmarks, pros/cons, use case recommendations, and clear verdicts.",
      "news": "Write in journalistic style with latest updates, industry impact, expert quotes, and future implications.",
      "informative": "Provide educational content with clear explanations, examples, and actionable insights for the target audience."
    }

    // Brand voice adjustments
    const brandVoiceInstructions = {
      "professional": "Use formal, authoritative language with industry terminology and expert-level insights.",
      "friendly": "Write conversationally with a warm, approachable tone and relatable examples.",
      "technical": "Include detailed technical explanations, specifications, and expert-level analysis.",
      "casual": "Use relaxed, easy-to-read language with informal tone and accessible explanations.",
      "journalistic": "Adopt news-style writing with objective reporting, quotes, and fact-based analysis."
    }

    let customPrompt = MASTER_PROMPT

    // Add length and content type specific instructions
    customPrompt += `\n\n📏 ARTICLE LENGTH: ${lengthInstructions[articleLength]}`
    customPrompt += `\n\n📝 CONTENT TYPE: ${contentTypeInstructions[contentType]}`
    customPrompt += `\n\n🎨 BRAND VOICE: ${brandVoiceInstructions[brandVoice]}`

    // Add SEO and audience targeting
    if (seoKeywords) {
      customPrompt += `\n\n🎯 SEO KEYWORDS: Focus on these keywords naturally throughout the content: ${seoKeywords}`
    }
    
    if (targetAudience) {
      customPrompt += `\n\n👥 TARGET AUDIENCE: Write specifically for: ${targetAudience}`
    }

    // Add custom instructions if provided
    if (customInstructions) {
      customPrompt += `\n\n📋 SPECIAL INSTRUCTIONS: ${customInstructions}`
    }

    // Add web search context if enabled (PRO feature simulation)
    if (includeWebSearch) {
      customPrompt += `\n\n🌐 WEB SEARCH CONTEXT: Include latest industry trends, recent developments, and current market insights in your analysis.`
    }

    // Add SERP analysis if enabled (PRO feature simulation)
    if (includeSerpAnalysis) {
      customPrompt += `\n\n🔍 SERP OPTIMIZATION: Structure content to compete with top-ranking articles, include FAQ sections optimized for featured snippets, and use heading structures that perform well in search results.`
    }

    // Create the specific prompt based on content type
    let specificPrompt = ""

    if (contentType === "comparison" && modelA && modelB) {
      specificPrompt = `Write a comprehensive comparison article between ${modelA} and ${modelB}. Focus on: ${topic}

Key comparison points to cover:
- Performance benchmarks and real-world testing
- Strengths and weaknesses analysis
- Use case recommendations and scenarios
- Pricing and accessibility comparison
- User experience and interface evaluation
- Final recommendation with clear decision criteria`
    } else if (contentType === "how-to") {
      specificPrompt = `Write a detailed how-to guide about: ${topic}

Structure requirements:
- Clear introduction explaining what readers will accomplish
- Prerequisites and requirements section
- Step-by-step instructions with numbered steps
- Screenshots/visual aids placeholders where helpful
- Troubleshooting section for common issues
- Conclusion with next steps or advanced techniques`
    } else if (contentType === "guide") {
      specificPrompt = `Write a comprehensive guide about: ${topic}

Content requirements:
- Executive summary for quick overview
- Background and context setting
- Core concepts with detailed explanations
- Best practices and expert recommendations
- Real-world examples and case studies
- Common pitfalls and how to avoid them
- Resources for further learning`
    } else if (contentType === "news") {
      specificPrompt = `Write a news-style article about: ${topic}

Journalistic structure:
- Compelling headline and lead paragraph
- Who, what, when, where, why coverage
- Industry expert perspectives and quotes
- Market impact and implications analysis
- Background context for newcomers
- Future outlook and predictions`
    } else if (contentType === "informative") {
      specificPrompt = `Write an informative educational article about: ${topic}

Educational focus:
- Clear learning objectives
- Foundational concepts explanation
- Progressive complexity building
- Practical applications and examples
- Key takeaways and summary
- Further reading suggestions`
    } else {
      specificPrompt = `Write a comprehensive blog article about: ${topic}`
    }

    const finalPrompt = `${customPrompt}\n\n${specificPrompt}\n\nBegin writing the article now.`

    const { text } = await generateText({
      model,
      prompt: finalPrompt,
      temperature,
      maxTokens: articleLength === "long" ? 6000 : articleLength === "medium" ? 4000 : 3000,
    })

    return NextResponse.json({
      content: text,
      metadata: {
        topic,
        modelA,
        modelB,
        useCase,
        aiEngine,
        articleLength,
        tone,
        temperature,
        contentType,
        seoKeywords,
        targetAudience,
        brandVoice,
        includeWebSearch,
        includeSerpAnalysis,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Content generation error:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
