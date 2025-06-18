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
      invoke: async (state: any, config: any) => ({
        final_article: "<h1>Mock Next-Level Article</h1><p>This is a mock implementation.</p>",
        metadata: { meta_description: "Mock description", keywords: ["mock"], reading_time: 5 },
        research_data: ["Mock research"],
        outline: "<h1>Mock Outline</h1>",
        sections: { "Introduction": "Mock section" },
        errors: [],
        current_step: "complete"
      }),
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
