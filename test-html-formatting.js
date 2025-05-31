// Test HTML formatting output from the generate-content API
// This script tests the enhanced HTML output formatting

const testHTMLFormatting = async () => {
  console.log('🧪 Testing HTML Output Formatting...\n');

  const baseUrl = 'http://localhost:3000';
  const endpoint = '/api/generate-content';

  // Test data
  const testCases = [
    {
      name: 'Short Comparison Article',
      payload: {
        topic: 'AI model performance comparison',
        modelA: 'GPT-4',
        modelB: 'Claude-3',
        aiEngine: 'qwen-72b',
        articleLength: 'short',
        contentType: 'comparison',
        brandVoice: 'professional',
        seoKeywords: 'AI models, performance comparison',
        targetAudience: 'AI developers'
      }
    },
    {
      name: 'Medium How-To Guide',
      payload: {
        topic: 'Setting up AI model APIs',
        aiEngine: 'qwen-72b',
        articleLength: 'medium',
        contentType: 'how-to',
        brandVoice: 'friendly',
        seoKeywords: 'AI API setup, configuration',
        targetAudience: 'developers'
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📝 Testing: ${testCase.name}`);
    console.log('Payload:', JSON.stringify(testCase.payload, null, 2));

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Error ${response.status}:`, errorText);
        continue;
      }

      const result = await response.json();
      
      if (result.content) {
        console.log('✅ Content generated successfully');
        
        // Check for HTML formatting compliance
        const content = result.content;
        
        // Check for markdown violations
        const markdownPatterns = [
          /\*\*.*?\*\*/g,  // Bold markdown
          /##\s/g,         // Heading markdown
          /###\s/g,        // Subheading markdown
          /\*\s/g,         // Bullet markdown (at start of line)
          /_.*?_/g,        // Italic markdown
        ];
        
        let hasMarkdown = false;
        markdownPatterns.forEach((pattern, index) => {
          const matches = content.match(pattern);
          if (matches) {
            hasMarkdown = true;
            console.log(`❌ Found markdown pattern ${index + 1}:`, matches.slice(0, 3));
          }
        });
        
        if (!hasMarkdown) {
          console.log('✅ No markdown formatting detected');
        }
        
        // Check for HTML compliance
        const htmlPatterns = [
          /<h1>/g,         // H1 tags
          /<h2>/g,         // H2 tags
          /<h3>/g,         // H3 tags
          /<p>/g,          // Paragraph tags
          /<ul>/g,         // Unordered lists
          /<li>/g,         // List items
          /<strong>/g,     // Strong tags
          /<table>/g,      // Tables
          /<blockquote>/g, // Blockquotes
        ];
        
        let htmlScore = 0;
        htmlPatterns.forEach((pattern, index) => {
          const matches = content.match(pattern);
          if (matches) {
            htmlScore++;
            console.log(`✅ Found HTML pattern ${index + 1}: ${matches.length} instances`);
          }
        });
        
        console.log(`📊 HTML Compliance Score: ${htmlScore}/${htmlPatterns.length}`);
        
        // Check content structure
        if (content.includes('<!-- Meta Description:')) {
          console.log('✅ Meta description comment found');
        } else {
          console.log('❌ Meta description comment missing');
        }
        
        // Check for table of contents
        if (content.includes('Table of Contents') || content.includes('<ol>')) {
          console.log('✅ Table of contents or ordered list found');
        }
        
        // Show content preview (first 500 chars)
        console.log('\n📄 Content Preview:');
        console.log(content.substring(0, 500) + '...\n');
        
        console.log('📊 Metadata:', JSON.stringify(result.metadata, null, 2));
        
      } else {
        console.error('❌ No content in response:', result);
      }
      
    } catch (error) {
      console.error(`❌ Request failed:`, error.message);
    }
  }
};

// Run the test
testHTMLFormatting().catch(console.error);
