// Mock LangChain dependencies for development
export class ChatOpenAI {
  constructor(config: any) {}
  async invoke(messages: any): Promise<string> {
    return "Mock response";
  }
}

export class ChatGoogleGenerativeAI {
  constructor(config: any) {}
  async invoke(messages: any): Promise<string> {
    return "Mock response";
  }
}

export class ChatPromptTemplate {
  static fromMessages(messages: any[]) {
    return new ChatPromptTemplate();
  }
  pipe(llm: any) {
    return {
      pipe: (parser: any) => ({
        invoke: async (params: any) => "Mock enhanced content"
      })
    };
  }
}

export class StringOutputParser {
  constructor() {}
}

export class StateGraph {
  constructor(state: any) {}
  addNode(name: string, fn: any) { return this; }
  addEdge(from: any, to: any) { return this; }
  compile(config: any) {
    return {
      invoke: async (state: any, config: any) => {
        // Create a proper mock article with realistic content
        const mockArticle = `
<h1>${state.topic || 'Complete Guide to AI Technology'}</h1>

<p>Welcome to this comprehensive guide on ${state.topic || 'AI Technology'}. In this article, we'll explore everything you need to know about this fascinating subject.</p>

<h2>Introduction</h2>
<p>The world of ${state.topic || 'AI Technology'} continues to evolve rapidly, offering new opportunities and challenges. Understanding the fundamentals is crucial for anyone looking to stay ahead in this dynamic field.</p>

<h2>Key Concepts</h2>
<p>To fully grasp ${state.topic || 'AI Technology'}, it's important to understand several core concepts that form the foundation of this domain. These principles will guide you through more advanced topics.</p>

<h2>Best Practices</h2>
<p>Implementing effective strategies requires following proven methodologies. Here are the most important best practices to consider when working with ${state.topic || 'AI Technology'}.</p>

<h2>Common Challenges and Solutions</h2>
<p>Every field has its obstacles, and ${state.topic || 'AI Technology'} is no exception. By understanding common pitfalls and their solutions, you can avoid costly mistakes and achieve better results.</p>

<h2>Future Trends</h2>
<p>Looking ahead, ${state.topic || 'AI Technology'} shows promising developments that will shape the industry. Staying informed about these trends will help you make strategic decisions.</p>

<h2>Conclusion</h2>
<p>In conclusion, ${state.topic || 'AI Technology'} offers tremendous potential for those willing to invest time in understanding its complexities. By following the guidelines outlined in this article, you'll be well-positioned for success.</p>
        `.trim()
        
        // Create realistic metadata
        const mockKeywords = [
          state.topic?.toLowerCase() || 'ai technology',
          'guide',
          'best practices',
          'tips',
          'strategies'
        ]
        
        const wordCount = mockArticle.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length
        const readingTime = Math.ceil(wordCount / 200) // Average reading speed
        
        return {
          final_article: mockArticle,
          metadata: { 
            meta_description: `Complete guide to ${state.topic || 'AI Technology'}. Learn best practices, overcome challenges, and stay ahead with expert insights.`,
            keywords: mockKeywords,
            reading_time: readingTime,
            social_media_snippets: [
              `Discover the essentials of ${state.topic || 'AI Technology'} in our comprehensive guide.`,
              `Master ${state.topic || 'AI Technology'} with proven strategies and expert insights.`
            ],
            featured_snippet_optimized: `${state.topic || 'AI Technology'} is a comprehensive approach that involves understanding key concepts, implementing best practices, and staying current with trends.`,
            schema_markup: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": state.topic || 'Complete Guide to AI Technology',
              "description": `Complete guide to ${state.topic || 'AI Technology'}`,
              "wordCount": wordCount
            })
          },
          research_data: [
            `Research finding 1 about ${state.topic || 'AI Technology'}`,
            `Research finding 2 about ${state.topic || 'AI Technology'}`,
            `Research finding 3 about ${state.topic || 'AI Technology'}`
          ],
          outline: `
# Article Outline: ${state.topic || 'AI Technology'}

## 1. Introduction
- Overview of ${state.topic || 'AI Technology'}
- Why it matters today

## 2. Key Concepts
- Fundamental principles
- Core terminology

## 3. Best Practices
- Proven methodologies
- Implementation strategies

## 4. Common Challenges
- Typical obstacles
- Effective solutions

## 5. Future Trends
- Emerging developments
- Strategic considerations

## 6. Conclusion
- Key takeaways
- Next steps
          `.trim(),
          sections: { 
            "Introduction": `<p>The world of ${state.topic || 'AI Technology'} continues to evolve rapidly...</p>`,
            "Key Concepts": `<p>To fully grasp ${state.topic || 'AI Technology'}, it's important to understand...</p>`,
            "Best Practices": `<p>Implementing effective strategies requires following proven methodologies...</p>`,
            "Challenges": `<p>Every field has its obstacles, and ${state.topic || 'AI Technology'} is no exception...</p>`,
            "Future Trends": `<p>Looking ahead, ${state.topic || 'AI Technology'} shows promising developments...</p>`,
            "Conclusion": `<p>In conclusion, ${state.topic || 'AI Technology'} offers tremendous potential...</p>`
          },
          errors: [],
          current_step: "complete"
        }
      },
      stream: async function* (state: any, config: any) {
        yield { current_step: "research", ...state };
        yield { current_step: "outline", ...state };
        yield { current_step: "sections", ...state };
        yield { current_step: "complete", ...state };
      }
    };
  }
}

export const Annotation = {
  Root: (obj: any) => ({ State: obj })
};

export class MemorySaver {}

export const START = "START";
export const END = "END";

// Mock additional exports
export const BaseMessage = {};
export const HumanMessage = {};
export const SystemMessage = {};
export const MessagesPlaceholder = {};
export const RunnableSequence = {};
export const RunnablePassthrough = {};
export const Tool = {};
export const WebBrowser = {};
