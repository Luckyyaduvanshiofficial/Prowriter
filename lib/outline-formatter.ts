/**
 * Utility functions for formatting and cleaning outline content
 */

export interface FormattedOutline {
  content: string;
  htmlContent: string;
}

/**
 * Removes "thinking" text and other unwanted content from AI responses
 */
export function cleanOutlineContent(content: string): string {
  if (!content) return '';
  
  // Remove thinking blocks (common patterns from Together AI and other models)
  const thinkingPatterns = [
    /<thinking>[\s\S]*?<\/thinking>/gi,
    /\[thinking\][\s\S]*?\[\/thinking\]/gi,
    /\*\*thinking\*\*[\s\S]*?\*\*\/thinking\*\*/gi,
    /thinking:[\s\S]*?(?=\n\n|\n#|$)/gi,
    /^thinking[\s\S]*?(?=\n\n|\n#|$)/gim,
    /^let me think[\s\S]*?(?=\n\n|\n#|$)/gim,
    /^i need to[\s\S]*?(?=\n\n|\n#|$)/gim,
    /^first,?\s*i[\s\S]*?(?=\n\n|\n#|$)/gim,
  ];
  
  let cleaned = content;
  thinkingPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  // Remove common AI artifacts
  cleaned = cleaned.replace(/^\s*\*\*\s*$|^\s*---\s*$/gm, '');
  cleaned = cleaned.replace(/\[Assistant\]|\[AI\]|\[Response\]/gi, '');
  
  // Clean up excessive whitespace and normalize line endings
  cleaned = cleaned.replace(/\r\n/g, '\n');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.trim();
  
  return cleaned;
}

/**
 * Converts markdown-style outline to properly formatted HTML
 */
export function formatOutlineToHtml(content: string): string {
  if (!content) return '';
  
  let html = content;
  
  // Convert headings (# ## ###) to proper HTML headings
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 mt-6 mb-3">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-6 mb-4">$1</h1>');
  
  // Convert **bold** to proper HTML bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
  
  // Convert *italic* to proper HTML italic
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  
  // Convert numbered lists
  html = html.replace(/^(\d+)\.\s+(.*$)/gim, '<li class="ml-4 mb-1"><span class="font-medium text-blue-600">$1.</span> $2</li>');
  
  // Convert bullet points
  html = html.replace(/^[-*]\s+(.*$)/gim, '<li class="ml-4 mb-1 text-gray-700">• $1</li>');
  
  // Wrap consecutive list items in proper list containers
  html = html.replace(/(<li[^>]*>.*?<\/li>(\s*<li[^>]*>.*?<\/li>)*)/gs, '<ul class="space-y-1 mb-4">$1</ul>');
  
  // Convert line breaks to paragraphs for regular text
  const lines = html.split('\n');
  let formattedLines: string[] = [];
  let inList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) {
      formattedLines.push('');
      continue;
    }
    
    // Check if line is already HTML (starts with < or is part of a list)
    if (line.startsWith('<') || line.includes('<li') || line.includes('<ul') || line.includes('</ul>')) {
      formattedLines.push(line);
      inList = line.includes('<ul') || (inList && !line.includes('</ul>'));
    } else if (!inList) {
      // Regular text line - wrap in paragraph
      formattedLines.push(`<p class="text-gray-700 mb-3 leading-relaxed">${line}</p>`);
    } else {
      formattedLines.push(line);
    }
  }
  
  html = formattedLines.join('\n');
  
  // Clean up extra whitespace
  html = html.replace(/\n{3,}/g, '\n\n');
  
  return html.trim();
}

/**
 * Main function to process outline content
 */
export function processOutlineContent(rawContent: string): FormattedOutline {
  const cleanContent = cleanOutlineContent(rawContent);
  const htmlContent = formatOutlineToHtml(cleanContent);
  
  return {
    content: cleanContent,
    htmlContent
  };
}

/**
 * Extracts the main title from outline content
 */
export function extractOutlineTitle(content: string): string {
  const lines = content.split('\n');
  
  // Look for the first heading
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      return trimmed.substring(2).trim();
    }
    if (trimmed.startsWith('## ')) {
      return trimmed.substring(3).trim();
    }
  }
  
  return 'Article Outline';
}
