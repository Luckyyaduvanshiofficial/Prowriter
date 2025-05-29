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
    const { topic, modelA, modelB, tone = "friendly", temperature = 0.7, contentType = "comparison" } = body

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    // Configure OpenRouter with qwen3-235b-a22b
    const model = openai("qwen/qwen-2.5-72b-instruct", {
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    })

    let customPrompt = MASTER_PROMPT

    // Adjust tone if specified
    if (tone !== "friendly") {
      customPrompt += `\n\n🎨 TONE ADJUSTMENT: Write in a ${tone} tone while maintaining the structure above.`
    }

    // Create the specific prompt based on content type
    let specificPrompt = ""

    if (contentType === "comparison" && modelA && modelB) {
      specificPrompt = `Write a comprehensive comparison article between ${modelA} and ${modelB}. Focus on: ${topic}`
    } else {
      specificPrompt = `Write a comprehensive blog article about: ${topic}`
    }

    const finalPrompt = `${customPrompt}\n\n${specificPrompt}\n\nBegin writing the article now.`

    const { text } = await generateText({
      model,
      prompt: finalPrompt,
      temperature,
      maxTokens: 4000,
    })

    return NextResponse.json({
      content: text,
      metadata: {
        topic,
        modelA,
        modelB,
        tone,
        temperature,
        contentType,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Content generation error:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
