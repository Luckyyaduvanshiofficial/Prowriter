import { NextRequest, NextResponse } from "next/server";
import { createLangChainBlogPipeline } from "@/lib/langchain-blog-pipeline";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      topic, 
      tone = "professional", 
      length = "medium",
      provider = "google",
      modelName,
      stream = false,
      // Next-level options
      nextLevel = true,
      includeInteractiveElements = true,
      addUniqueEnhancements = true,
      generateAdvancedMetadata = true
    } = body;

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    // Create the LangChain pipeline
    const pipeline = createLangChainBlogPipeline(
      provider,
      modelName,
      provider === 'google' ? process.env.GOOGLE_AI_API_KEY : 
      provider === 'baseten' ? process.env.BASETEN_API_KEY :
      process.env.DEEPSEEK_API_KEY
    );

    if (stream) {
      // Return streaming response
      const encoder = new TextEncoder();
      
      const stream = new ReadableStream({
        async start(controller) {
          try {
            // Use next-level streaming if enabled
            const streamGenerator = nextLevel 
              ? pipeline.generateNextLevelBlogPostStream(topic, tone, length, {
                  includeInteractiveElements,
                  addUniqueEnhancements,
                  generateAdvancedMetadata
                })
              : pipeline.generateBlogPostStream(topic, tone, length);
            
            for await (const update of streamGenerator) {
              const chunk = encoder.encode(
                `data: ${JSON.stringify({
                  type: 'update',
                  step: update.step,
                  message: update.message || '',
                  data: update.data
                })}\n\n`
              );
              controller.enqueue(chunk);
            }
            
            controller.enqueue(encoder.encode('data: {"type": "complete"}\n\n'));
            controller.close();
          } catch (error) {
            console.error('Streaming error:', error);
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'error',
                  error: error instanceof Error ? error.message : 'Unknown error'
                })}\n\n`
              )
            );
            controller.close();
          }
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    } else {
      // Return complete response - use next-level generation if enabled
      const result = nextLevel 
        ? await pipeline.generateNextLevelBlogPost(topic, tone, length, {
            includeInteractiveElements,
            addUniqueEnhancements,
            generateAdvancedMetadata
          })
        : await pipeline.generateBlogPost(topic, tone, length);
      
      return NextResponse.json({
        success: true,
        data: {
          article: result.article,
          metadata: result.metadata,
          research_data: result.research_data,
          outline: result.outline,
          sections: result.sections,
          errors: result.errors,
          enhancements: (result as any).enhancements || {
            uniqueness_applied: false,
            interactive_elements_added: false,
            advanced_metadata_generated: false
          },
          generated_at: new Date().toISOString(),
          word_count: result.article.replace(/<[^>]*>/g, '').split(/\s+/).length,
          pipeline_version: nextLevel ? "langchain-nextlevel-v2.0" : "langchain-v1.0",
          generation_type: nextLevel ? "next-level" : "standard"
        }
      });
    }
  } catch (error) {
    console.error('LangChain blog generation error:', error);
    
    return NextResponse.json(
      {
        error: "Failed to generate blog post",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
