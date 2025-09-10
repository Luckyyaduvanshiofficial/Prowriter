import { ChatOpenAI, ChatGoogleGenerativeAI, ChatPromptTemplate, StringOutputParser, StateGraph, Annotation, MemorySaver, START, END } from "./mock-langchain";
import { createWebResearcher } from "./web-search";

// Define the state structure for our blog generation pipeline
const BlogGenerationState = Annotation.Root({
  topic: Annotation<string>,
  tone: Annotation<string>,
  length: Annotation<string>,
  research_data: Annotation<string[]>,
  outline: Annotation<string>,
  sections: Annotation<Record<string, string>>,
  final_article: Annotation<string>,
  metadata: Annotation<{
    meta_description: string;
    keywords: string[];
    reading_time: number;
  }>,
  errors: Annotation<string[]>,
  current_step: Annotation<string>
});

type BlogGenerationStateType = typeof BlogGenerationState.State;

// Enhanced Blog Generation Pipeline using LangChain
export class LangChainBlogPipeline {
  private llm: ChatOpenAI | ChatGoogleGenerativeAI;
  private webResearcher: any;
  private graph: any;

  constructor(
    provider: 'openai' | 'google' | 'baseten' = 'baseten',
    modelName?: string,
    apiKey?: string
  ) {
    // Initialize the LLM based on provider
    if (provider === 'google') {
      this.llm = new ChatGoogleGenerativeAI({
        modelName: modelName || "gemini-2.0-flash",
        apiKey: apiKey || process.env.GOOGLE_AI_API_KEY,
        temperature: 0.7,
        maxOutputTokens: 4096,
      });
    } else if (provider === 'baseten') {
      // Use OpenAI-compatible interface for Baseten
      this.llm = new ChatOpenAI({
        modelName: modelName || "openai/gpt-oss-120b",
        openAIApiKey: apiKey || process.env.BASETEN_API_KEY,
        configuration: {
          baseURL: "https://inference.baseten.co/v1",
          defaultHeaders: {
            "Content-Type": "application/json",
          },
        },
        temperature: 1,
        maxTokens: 1000,
      });
    } else {
      this.llm = new ChatOpenAI({
        modelName: modelName || "gpt-4o-mini",
        openAIApiKey: apiKey || process.env.OPENROUTER_API_KEY,
        configuration: {
          baseURL: "https://openrouter.ai/api/v1",
          defaultHeaders: {
            "HTTP-Referer": "https://prowriter.miniai.online",
            "X-Title": "Kutumbhcraft",
          },
        },
        temperature: 0.7,
        maxTokens: 4096,
      });
    }

    this.webResearcher = createWebResearcher();

    this.initializeGraph();
  }

  private initializeGraph() {
    // Define the research node
    const researchNode = async (state: BlogGenerationStateType) => {
      console.log("🔍 Starting research phase...");
      
      try {
        const researchPrompt = ChatPromptTemplate.fromMessages([
          ["system", `You are an expert researcher. Generate 5-7 specific search queries to thoroughly research the topic: {topic}.
          
          Focus on:
          - Current trends and statistics
          - Expert opinions and case studies  
          - Technical details and best practices
          - Real-world applications and examples
          - Market analysis and future predictions
          
          Return only the search queries, one per line.`],
          ["human", "Topic: {topic}"]
        ]);

        const researchChain = researchPrompt.pipe(this.llm).pipe(new StringOutputParser());
        const queries = await researchChain.invoke({ topic: state.topic });
        
        const searchQueries = queries.split('\n').filter((q: string) => q.trim().length > 0);
        const researchData: string[] = [];

        // Perform web searches for each query
        for (const query of searchQueries.slice(0, 5)) { // Limit to 5 queries
          try {
            const searchResults = await this.webResearcher.search(query.trim());
            if (searchResults?.results?.length > 0) {
              const topResults = searchResults.results.slice(0, 3);
              for (const result of topResults) {
                researchData.push(`Source: ${result.title}\nURL: ${result.url}\nSnippet: ${result.snippet}`);
              }
            }
          } catch (error) {
            console.warn(`Search failed for query: ${query}`, error);
          }
        }

        return {
          ...state,
          research_data: researchData,
          current_step: "research_complete"
        };
      } catch (error) {
        console.error("Research phase failed:", error);
        return {
          ...state,
          errors: [...(state.errors || []), `Research failed: ${error}`],
          current_step: "research_failed"
        };
      }
    };

    // Define the outline generation node
    const outlineNode = async (state: BlogGenerationStateType) => {
      console.log("📝 Generating article outline...");
      
      try {
        const outlinePrompt = ChatPromptTemplate.fromMessages([
          ["system", `You are an expert content strategist and professional blog writer. Create a detailed, SEO-optimized blog post outline that stands out from generic content.

          ADVANCED REQUIREMENTS:
          - Create a magnetic, clickable title with power words and emotional triggers
          - Use strategic HTML heading tags (h1, h2, h3, h4) with proper hierarchy
          - Design 6-10 main sections with compelling subsections
          - Include hook-driven introductions and strong conclusions
          - Add strategic call-to-action placements
          - Include interactive elements suggestions (polls, quizzes, tables)
          - Plan for visual content placement (infographics, charts, images)
          - Add estimated word counts and reading flow
          - Create engaging meta description with action words (150-160 chars)
          - Suggest long-tail and semantic keywords for modern SEO
          - Include FAQ section with voice search optimization
          - Plan for featured snippets optimization
          
          CONTENT DIFFERENTIATION STRATEGY:
          - Unique angles and fresh perspectives on the topic
          - Personal stories, case studies, and real examples
          - Data-driven insights and statistics
          - Contrarian viewpoints when appropriate
          - Step-by-step actionable frameworks
          - Expert quotes and industry insights
          - Future predictions and trends
          
          TONE: {tone}
          LENGTH TARGET: {length}
          CURRENT YEAR: 2025
          
          Research Data:
          {research_data}
          
          Format as structured HTML outline with rich content planning.`],
          ["human", "Create a next-level, unique outline for: {topic}"]
        ]);

        const outlineChain = outlinePrompt.pipe(this.llm).pipe(new StringOutputParser());
        const outline = await outlineChain.invoke({
          topic: state.topic,
          tone: state.tone,
          length: state.length,
          research_data: state.research_data?.join('\n\n') || ''
        });

        return {
          ...state,
          outline,
          current_step: "outline_complete"
        };
      } catch (error) {
        console.error("Outline generation failed:", error);
        return {
          ...state,
          errors: [...(state.errors || []), `Outline generation failed: ${error}`],
          current_step: "outline_failed"
        };
      }
    };

    // Define the section writing node
    const sectionWritingNode = async (state: BlogGenerationStateType) => {
      console.log("✍️ Writing article sections...");
      
      try {
        // Extract section headings from outline
        const sectionRegex = /<h[2-3][^>]*>(.*?)<\/h[2-3]>/gi;
        const sections: Record<string, string> = {};
        let match;
        
        while ((match = sectionRegex.exec(state.outline || '')) !== null) {
          const sectionTitle = match[1].replace(/<[^>]*>/g, '').trim();
          
          const sectionPrompt = ChatPromptTemplate.fromMessages([
            ["system", `You are a master blog writer who creates engaging, professional content that stands out. Write a comprehensive section that's both informative and captivating.

            SECTION TO WRITE: {section_title}
            TOPIC CONTEXT: {topic}
            TONE: {tone}
            YEAR: 2025
            
            ADVANCED WRITING REQUIREMENTS:
            ✅ STRUCTURE & FORMATTING:
            - Use semantic HTML5 tags for better accessibility
            - Include proper heading hierarchy (h3, h4 for subsections)
            - Create scannable content with bullet points and numbered lists
            - Add relevant tables, code blocks, or structured data
            - Include call-out boxes with <blockquote> for key insights
            - Use <mark> tags for highlighting important concepts
            
            ✅ CONTENT EXCELLENCE:
            - Start with a compelling hook or surprising statistic
            - Include real-world examples and case studies
            - Add actionable tips and step-by-step guides
            - Incorporate relevant data, stats, and research findings
            - Include expert quotes or industry insights
            - End with a mini-conclusion and transition to next section
            
            ✅ ENGAGEMENT FEATURES:
            - Add interactive elements like checklists
            - Include "Pro Tips" and "Common Mistakes" callouts
            - Create comparison tables when relevant
            - Add FAQ-style Q&A within sections
            - Include relevant emojis for visual appeal (sparingly)
            
            ✅ SEO & READABILITY:
            - Use semantic keywords naturally
            - Vary sentence length and structure
            - Include internal linking opportunities
            - Add schema markup suggestions in comments
            - Optimize for featured snippets
            
            Research Data Available:
            {research_data}
            
            Return professionally formatted HTML content that's engaging and valuable.`],
            ["human", "Write an exceptional section: {section_title}"]
          ]);

          const sectionChain = sectionPrompt.pipe(this.llm).pipe(new StringOutputParser());
          const sectionContent = await sectionChain.invoke({
            topic: state.topic,
            section_title: sectionTitle,
            tone: state.tone,
            research_data: state.research_data?.join('\n\n') || ''
          });

          sections[sectionTitle] = sectionContent;
        }

        return {
          ...state,
          sections,
          current_step: "sections_complete"
        };
      } catch (error) {
        console.error("Section writing failed:", error);
        return {
          ...state,
          errors: [...(state.errors || []), `Section writing failed: ${error}`],
          current_step: "sections_failed"
        };
      }
    };

    // Define the final assembly and polish node
    const finalPolishNode = async (state: BlogGenerationStateType) => {
      console.log("✨ Final polish and assembly...");
      
      try {
        const polishPrompt = ChatPromptTemplate.fromMessages([
          ["system", `You are an expert editor, SEO specialist, and content strategist. Create a magazine-quality, next-level blog article that stands out in 2025.

          MASTER CONTENT ASSEMBLY TASKS:
          
          🎯 ARTICLE STRUCTURE:
          1. Eye-catching title with power words and emotional triggers
          2. Compelling meta description with action words
          3. Hook-driven introduction with a story, statistic, or question
          4. Table of contents for easy navigation
          5. Well-structured body with proper heading hierarchy
          6. Strategic call-to-action placements throughout
          7. Comprehensive conclusion with clear next steps
          8. Author bio section with expertise highlights
          9. FAQ section optimized for voice search
          10. Related articles suggestions
          
          🚀 ADVANCED FORMATTING:
          - Use semantic HTML5 tags (article, section, aside, etc.)
          - Add schema markup comments for rich snippets
          - Include accessibility features (alt text, ARIA labels)
          - Create visually appealing content blocks
          - Add progress indicators for long-form content
          - Include social sharing optimization
          
          💎 CONTENT ENHANCEMENT:
          - Add compelling statistics and data visualizations
          - Include expert quotes and industry insights
          - Create actionable takeaways and checklists
          - Add "Pro Tips" and "Common Mistakes" sections
          - Include future predictions and trends
          - Add personal anecdotes or case studies
          
          📈 SEO & ENGAGEMENT:
          - Optimize for featured snippets and position zero
          - Include long-tail keywords naturally
          - Add internal linking opportunities
          - Create shareable content blocks
          - Optimize for voice search queries
          - Include conversion-focused CTAs
          
          🎨 VISUAL ELEMENTS:
          - Add image placeholders with detailed alt descriptions
          - Include infographic suggestions
          - Add chart and graph recommendations
          - Create quotable social media snippets
          - Add interactive element suggestions
          
          TONE: {tone}
          TARGET LENGTH: {length}
          PUBLICATION YEAR: 2025
          
          OUTLINE:
          {outline}
          
          SECTIONS:
          {sections}
          
          Create a masterpiece article that readers will love and search engines will rank highly.`],
          ["human", "Create the ultimate, next-level article for: {topic}"]
        ]);

        const polishChain = polishPrompt.pipe(this.llm).pipe(new StringOutputParser());
        const finalArticle = await polishChain.invoke({
          topic: state.topic,
          tone: state.tone,
          length: state.length,
          outline: state.outline || '',
          sections: Object.entries(state.sections || {})
            .map(([title, content]) => `<h2>${title}</h2>\n${content}`)
            .join('\n\n')
        });

        // Extract metadata with enhanced parsing
        const metaDescMatch = finalArticle.match(/<!-- Meta Description: (.*?) -->/);
        const keywordsMatch = finalArticle.match(/<!-- Keywords: (.*?) -->/);
        const metaDescription = metaDescMatch ? metaDescMatch[1] : 
          finalArticle.substring(0, 160).replace(/<[^>]*>/g, '').trim() + '...';
        
        // Extract keywords from content if not found in comments
        const keywords = keywordsMatch ? 
          keywordsMatch[1].split(',').map((k: string) => k.trim()) :
          this.extractKeywordsFromContent(finalArticle, state.topic);
        
        // Enhanced reading time calculation
        const wordCount = finalArticle.replace(/<[^>]*>/g, '').split(/\s+/).filter((w: string) => w.length > 0).length;
        const readingTime = Math.max(1, Math.ceil(wordCount / 250)); // 250 WPM average

        return {
          ...state,
          final_article: finalArticle,
          metadata: {
            meta_description: metaDescription,
            keywords: keywords,
            reading_time: readingTime
          },
          current_step: "complete"
        };
      } catch (error) {
        console.error("Final polish failed:", error);
        return {
          ...state,
          errors: [...(state.errors || []), `Final polish failed: ${error}`],
          current_step: "polish_failed"
        };
      }
    };

    // Create the state graph
    const workflow = new StateGraph(BlogGenerationState)
      .addNode("research", researchNode)
      .addNode("outline", outlineNode)
      .addNode("sections", sectionWritingNode)
      .addNode("polish", finalPolishNode)
      .addEdge(START, "research")
      .addEdge("research", "outline")
      .addEdge("outline", "sections")
      .addEdge("sections", "polish")
      .addEdge("polish", END);

    // Compile the graph
    this.graph = workflow.compile({
      checkpointer: new MemorySaver()
    });
  }

  // Enhanced main method to generate next-level blog posts
  async generateNextLevelBlogPost(
    topic: string,
    tone: string = "professional",
    length: string = "medium",
    options: {
      includeInteractiveElements?: boolean;
      addUniqueEnhancements?: boolean;
      generateAdvancedMetadata?: boolean;
    } = {}
  ): Promise<{
    article: string;
    metadata: {
      meta_description: string;
      keywords: string[];
      reading_time: number;
      social_media_snippets?: string[];
      featured_snippet_optimized?: string;
      schema_markup?: string;
    };
    research_data: string[];
    outline: string;
    sections: Record<string, string>;
    errors: string[];
    enhancements: {
      uniqueness_applied: boolean;
      interactive_elements_added: boolean;
      advanced_metadata_generated: boolean;
    };
  }> {
    // First, run the base generation pipeline
    const baseResult = await this.generateBlogPost(topic, tone, length);
    
    let enhancedArticle = baseResult.article;
    let enhancedMetadata = baseResult.metadata;
    const enhancements = {
      uniqueness_applied: false,
      interactive_elements_added: false,
      advanced_metadata_generated: false
    };

    try {
      // Apply uniqueness enhancements
      if (options.addUniqueEnhancements !== false) {
        console.log("🚀 Applying uniqueness enhancements...");
        enhancedArticle = await this.enhanceArticleUniqueness(
          topic,
          enhancedArticle,
          baseResult.research_data
        );
        enhancements.uniqueness_applied = true;
      }

      // Add interactive elements
      if (options.includeInteractiveElements !== false) {
        console.log("🎮 Adding interactive elements...");
        enhancedArticle = await this.addInteractiveElements(enhancedArticle);
        enhancements.interactive_elements_added = true;
      }

      // Generate advanced metadata
      if (options.generateAdvancedMetadata !== false) {
        console.log("📊 Generating advanced metadata...");
        const advancedMeta = await this.generateAdvancedMetadata(enhancedArticle, topic);
        enhancedMetadata = {
          ...enhancedMetadata,
          ...advancedMeta
        };
        enhancements.advanced_metadata_generated = true;
      }

    } catch (error) {
      console.warn("Enhancement failed, using base article:", error);
    }

    return {
      article: enhancedArticle,
      metadata: enhancedMetadata,
      research_data: baseResult.research_data,
      outline: baseResult.outline,
      sections: baseResult.sections,
      errors: baseResult.errors,
      enhancements
    };
  }
  async generateBlogPost(
    topic: string,
    tone: string = "professional",
    length: string = "medium"
  ): Promise<{
    article: string;
    metadata: {
      meta_description: string;
      keywords: string[];
      reading_time: number;
    };
    research_data: string[];
    outline: string;
    sections: Record<string, string>;
    errors: string[];
  }> {
    const initialState: BlogGenerationStateType = {
      topic,
      tone,
      length,
      research_data: [],
      outline: "",
      sections: {},
      final_article: "",
      metadata: {
        meta_description: "",
        keywords: [],
        reading_time: 0
      },
      errors: [],
      current_step: "initialized"
    };

    try {
      const result = await this.graph.invoke(initialState, {
        configurable: { thread_id: `blog-${Date.now()}` }
      });

      return {
        article: result.final_article || "",
        metadata: result.metadata || {
          meta_description: "",
          keywords: [],
          reading_time: 0
        },
        research_data: result.research_data || [],
        outline: result.outline || "",
        sections: result.sections || {},
        errors: result.errors || []
      };
    } catch (error) {
      console.error("Blog generation pipeline failed:", error);
      throw new Error(`Blog generation failed: ${error}`);
    }
  }

  // Stream the generation process for real-time updates
  async *generateBlogPostStream(
    topic: string,
    tone: string = "professional",
    length: string = "medium"
  ) {
    const initialState: BlogGenerationStateType = {
      topic,
      tone,
      length,
      research_data: [],
      outline: "",
      sections: {},
      final_article: "",
      metadata: {
        meta_description: "",
        keywords: [],
        reading_time: 0
      },
      errors: [],
      current_step: "initialized"
    };

    const config = { configurable: { thread_id: `blog-stream-${Date.now()}` } };
    
    for await (const output of await this.graph.stream(initialState, config)) {
      yield {
        step: output.current_step || "processing",
        data: output
      };
    }
  }

  // Stream the next-level generation process for real-time updates
  async *generateNextLevelBlogPostStream(
    topic: string,
    tone: string = "professional",
    length: string = "medium",
    options: {
      includeInteractiveElements?: boolean;
      addUniqueEnhancements?: boolean;
      generateAdvancedMetadata?: boolean;
    } = {}
  ) {
    yield { step: "initializing", message: "Starting next-level blog generation..." };
    
    // First run the base pipeline with streaming
    const baseStream = this.generateBlogPostStream(topic, tone, length);
    let baseResult: any = null;
    
    for await (const update of baseStream) {
      yield update;
      if (update.step === "complete" || update.data?.current_step === "complete") {
        baseResult = update.data;
      }
    }
    
    if (!baseResult?.final_article) {
      yield { step: "error", message: "Base generation failed" };
      return;
    }
    
    let enhancedArticle = baseResult.final_article;
    const enhancements = {
      uniqueness_applied: false,
      interactive_elements_added: false,
      advanced_metadata_generated: false
    };

    try {
      // Apply enhancements with progress updates
      if (options.addUniqueEnhancements !== false) {
        yield { step: "enhancing", message: "🚀 Applying uniqueness enhancements..." };
        enhancedArticle = await this.enhanceArticleUniqueness(
          topic,
          enhancedArticle,
          baseResult.research_data || []
        );
        enhancements.uniqueness_applied = true;
        yield { step: "enhanced", message: "✅ Uniqueness enhancements applied" };
      }

      if (options.includeInteractiveElements !== false) {
        yield { step: "interactive", message: "🎮 Adding interactive elements..." };
        enhancedArticle = await this.addInteractiveElements(enhancedArticle);
        enhancements.interactive_elements_added = true;
        yield { step: "interactive_complete", message: "✅ Interactive elements added" };
      }

      if (options.generateAdvancedMetadata !== false) {
        yield { step: "metadata", message: "📊 Generating advanced metadata..." };
        const advancedMeta = await this.generateAdvancedMetadata(enhancedArticle, topic);
        enhancements.advanced_metadata_generated = true;
        yield { 
          step: "metadata_complete", 
          message: "✅ Advanced metadata generated",
          data: { metadata: advancedMeta }
        };
      }

      yield {
        step: "complete",
        message: "🎉 Next-level blog post generated successfully!",
        data: {
          article: enhancedArticle,
          metadata: baseResult.metadata,
          research_data: baseResult.research_data,
          outline: baseResult.outline,
          sections: baseResult.sections,
          errors: baseResult.errors,
          enhancements
        }
      };

    } catch (error) {
      yield { 
        step: "enhancement_error", 
        message: `Enhancement failed: ${error}. Using base article.`,
        data: baseResult
      };
    }
  }

  // Advanced article enhancement methods
  private async enhanceArticleUniqueness(
    topic: string,
    baseArticle: string,
    researchData: string[]
  ): Promise<string> {
    const enhancementPrompt = ChatPromptTemplate.fromMessages([
      ["system", `You are a content innovation expert. Take this base article and make it truly unique and next-level by adding:

      🔥 UNIQUENESS ENHANCERS:
      - Contrarian viewpoints or myth-busting sections
      - Personal stories and real-world case studies
      - Industry predictions for 2025-2026
      - Step-by-step frameworks and methodologies
      - Comparison tables and decision matrices
      - Interactive checklists and assessments
      - Quote collections from industry experts
      - Data visualizations and infographic descriptions
      
      🎯 FORMATTING UPGRADES:
      - Add compelling subheadings with power words
      - Include "Quick Takeaway" boxes for key points
      - Create "Pro vs. Beginner" comparison sections
      - Add "Common Pitfalls" warning boxes
      - Include "Action Items" at the end of sections
      - Add "Related Tool/Resource" recommendations
      
      📊 CONTENT ADDITIONS:
      - Statistics with source citations
      - Real company examples and case studies
      - Tool recommendations with pros/cons
      - Cost breakdowns and ROI calculations
      - Timeline projections and milestones
      - Risk assessments and mitigation strategies
      
      Research Data:
      {research_data}
      
      Transform this into a premium, magazine-quality article that stands out from competitors.`],
      ["human", "Enhance this article to next-level quality:\n\n{article}"]
    ]);

    const chain = enhancementPrompt.pipe(this.llm).pipe(new StringOutputParser());
    return await chain.invoke({
      article: baseArticle,
      research_data: researchData.join('\n\n')
    });
  }

  private async addInteractiveElements(article: string): Promise<string> {
    const interactivePrompt = ChatPromptTemplate.fromMessages([
      ["system", `Add interactive and engaging elements to this article:

      🎮 INTERACTIVE ELEMENTS TO ADD:
      - Self-assessment quizzes with scoring
      - Interactive checklists with checkboxes
      - Progress trackers and milestone markers
      - Comparison calculators and tools
      - Before/after scenarios
      - Decision trees and flowcharts
      - Poll questions for reader engagement
      
      🎨 VISUAL ENHANCEMENTS:
      - Detailed image descriptions for visuals
      - Infographic outlines and data points
      - Chart specifications (bar, pie, line graphs)
      - Icon suggestions for bullet points
      - Color scheme recommendations
      - Layout suggestions for better readability
      
      💡 ENGAGEMENT BOOSTERS:
      - "Try This Now" action boxes
      - "Reader Challenge" sections
      - "Share Your Experience" prompts
      - "Quick Win" opportunity highlights
      - "Next Level" advanced tips
      - Social proof testimonial slots
      
      Format everything in clean HTML with proper semantic tags.`],
      ["human", "Add interactive elements to: {article}"]
    ]);

    const chain = interactivePrompt.pipe(this.llm).pipe(new StringOutputParser());
    return await chain.invoke({ article });
  }

  private async generateAdvancedMetadata(article: string, topic: string): Promise<{
    meta_description: string;
    keywords: string[];
    reading_time: number;
    social_media_snippets: string[];
    featured_snippet_optimized: string;
    schema_markup: string;
  }> {
    const metadataPrompt = ChatPromptTemplate.fromMessages([
      ["system", `Generate comprehensive metadata for this article:

      CREATE:
      1. Compelling meta description (150-160 chars) with action words
      2. 15-20 relevant keywords (primary, secondary, long-tail)
      3. 3-5 social media snippets for different platforms
      4. Featured snippet optimized paragraph
      5. Schema markup suggestions (JSON-LD format)
      
      Focus on 2025 SEO best practices and user engagement.`],
      ["human", "Generate metadata for article about: {topic}\n\nArticle content: {article}"]
    ]);

    const chain = metadataPrompt.pipe(this.llm).pipe(new StringOutputParser());
    const metadataText = await chain.invoke({ article, topic });

    // Parse the metadata response (simplified parsing)
    const wordCount = article.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 250); // Updated to 250 WPM for better accuracy

    return {
      meta_description: this.extractMetaDescription(metadataText),
      keywords: this.extractKeywords(metadataText),
      reading_time: readingTime,
      social_media_snippets: this.extractSocialSnippets(metadataText),
      featured_snippet_optimized: this.extractFeaturedSnippet(metadataText),
      schema_markup: this.extractSchemaMarkup(metadataText)
    };
  }

  private extractMetaDescription(text: string): string {
    const match = text.match(/meta description[:\s]*([^\n]+)/i);
    return match ? match[1].trim().replace(/['"]/g, '') : '';
  }

  private extractKeywords(text: string): string[] {
    const match = text.match(/keywords[:\s]*([^\n]+)/i);
    if (!match) return [];
    return match[1].split(',').map(k => k.trim()).filter(k => k.length > 0);
  }

  private extractSocialSnippets(text: string): string[] {
    const snippets: string[] = [];
    const matches = text.match(/social[^:]*:[^\n]+/gi);
    if (matches) {
      matches.forEach(match => {
        const snippet = match.replace(/social[^:]*:/i, '').trim();
        if (snippet) snippets.push(snippet);
      });
    }
    return snippets;
  }

  private extractFeaturedSnippet(text: string): string {
    const match = text.match(/featured snippet[:\s]*([^\n]+)/i);
    return match ? match[1].trim() : '';
  }

  private extractSchemaMarkup(text: string): string {
    const match = text.match(/schema[^{]*(\{[^}]+\})/i);
    return match ? match[1] : '';
  }

  private extractKeywordsFromContent(content: string, topic: string): string[] {
    const cleanContent = content.replace(/<[^>]*>/g, '').toLowerCase();
    const words = cleanContent.split(/\s+/);
    const topicWords = topic.toLowerCase().split(/\s+/);
    
    // Find frequently occurring words (basic keyword extraction)
    const wordFreq: { [key: string]: number } = {};
    words.forEach(word => {
      if (word.length > 3 && !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'].includes(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
    
    // Sort by frequency and take top keywords
    const keywords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
    
    // Always include topic words
    return [...topicWords, ...keywords].slice(0, 15);
  }

  // Main method to generate a blog post
  async generateBlogPost(
    topic: string,
    tone: string = "professional",
    length: string = "medium"
  ): Promise<{
    article: string;
    metadata: {
      meta_description: string;
      keywords: string[];
      reading_time: number;
    };
    research_data: string[];
    outline: string;
    sections: Record<string, string>;
    errors: string[];
  }> {
    const initialState: BlogGenerationStateType = {
      topic,
      tone,
      length,
      research_data: [],
      outline: "",
      sections: {},
      final_article: "",
      metadata: {
        meta_description: "",
        keywords: [],
        reading_time: 0
      },
      errors: [],
      current_step: "initialized"
    };

    try {
      const result = await this.graph.invoke(initialState, {
        configurable: { thread_id: `blog-${Date.now()}` }
      });

      return {
        article: result.final_article || "",
        metadata: result.metadata || {
          meta_description: "",
          keywords: [],
          reading_time: 0
        },
        research_data: result.research_data || [],
        outline: result.outline || "",
        sections: result.sections || {},
        errors: result.errors || []
      };
    } catch (error) {
      console.error("Blog generation pipeline failed:", error);
      throw new Error(`Blog generation failed: ${error}`);
    }
  }

  // Stream the generation process for real-time updates
  async *generateBlogPostStream(
    topic: string,
    tone: string = "professional",
    length: string = "medium"
  ) {
    const initialState: BlogGenerationStateType = {
      topic,
      tone,
      length,
      research_data: [],
      outline: "",
      sections: {},
      final_article: "",
      metadata: {
        meta_description: "",
        keywords: [],
        reading_time: 0
      },
      errors: [],
      current_step: "initialized"
    };

    const config = { configurable: { thread_id: `blog-stream-${Date.now()}` } };
    
    for await (const output of await this.graph.stream(initialState, config)) {
      yield {
        step: output.current_step || "processing",
        data: output
      };
    }
  }
}

// Export utility functions
export function createLangChainBlogPipeline(
  provider: 'openai' | 'google' = 'openai',
  modelName?: string,
  apiKey?: string
) {
  return new LangChainBlogPipeline(provider, modelName, apiKey);
}

// Quick function to generate next-level blog posts
export async function generateNextLevelBlog(
  topic: string,
  options: {
    provider?: 'openai' | 'google';
    modelName?: string;
    apiKey?: string;
    tone?: string;
    length?: string;
    includeInteractiveElements?: boolean;
    addUniqueEnhancements?: boolean;
    generateAdvancedMetadata?: boolean;
  } = {}
) {
  const pipeline = createLangChainBlogPipeline(
    options.provider,
    options.modelName,
    options.apiKey
  );
  
  return await pipeline.generateNextLevelBlogPost(
    topic,
    options.tone || "professional",
    options.length || "medium",
    {
      includeInteractiveElements: options.includeInteractiveElements,
      addUniqueEnhancements: options.addUniqueEnhancements,
      generateAdvancedMetadata: options.generateAdvancedMetadata
    }
  );
}

export type { BlogGenerationStateType };
