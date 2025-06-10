import React from 'react';
import { processOutlineContent } from '@/lib/outline-formatter';

interface OutlineDisplayProps {
  content: string;
  className?: string;
}

export function OutlineDisplay({ content, className = '' }: OutlineDisplayProps) {
  if (!content) {
    return (
      <div className={`text-center text-gray-500 py-8 ${className}`}>
        <p>No outline generated yet. Click "Generate Outline" to create your article structure.</p>
      </div>
    );
  }

  const { htmlContent } = processOutlineContent(content);
  
  return (
    <div className={`outline-display space-y-4 ${className}`}>
      <div 
        className="prose prose-sm max-w-none 
          prose-headings:font-semibold 
          prose-h1:text-2xl prose-h1:text-gray-900 prose-h1:mb-4 prose-h1:mt-6 prose-h1:border-b-2 prose-h1:border-gray-200 prose-h1:pb-2
          prose-h2:text-xl prose-h2:text-gray-900 prose-h2:mb-3 prose-h2:mt-6 prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-1
          prose-h3:text-lg prose-h3:text-gray-800 prose-h3:mb-2 prose-h3:mt-4
          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-3
          prose-strong:text-gray-900 prose-strong:font-semibold prose-strong:bg-yellow-100 prose-strong:px-1 prose-strong:rounded
          prose-ul:space-y-1 prose-ul:mb-4
          prose-li:text-gray-700 prose-li:relative prose-li:pl-4
          [&_ul_li]:before:content-['•'] [&_ul_li]:before:text-blue-600 [&_ul_li]:before:font-bold [&_ul_li]:before:absolute [&_ul_li]:before:left-0"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
          lineHeight: '1.6'
        }}
      />
    </div>
  );
}
