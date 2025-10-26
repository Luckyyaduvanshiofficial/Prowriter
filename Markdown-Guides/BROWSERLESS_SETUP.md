# Browserless Integration Setup Guide

## 🎯 Overview
This guide explains how to integrate self-hosted Browserless for web scraping features in Prowriter AI.

## 📦 Installation

1. **Install Browserless**
   ```bash
   # Using Docker (Recommended)
   docker run -p 3000:3000 browserless/chrome
   
   # Or use Browserless Cloud
   # Sign up at https://www.browserless.io
   ```

2. **Add Environment Variables**
   Add to your `.env.local`:
   ```env
   BROWSERLESS_API_KEY=your_api_key_here
   BROWSERLESS_URL=http://localhost:3000  # or https://chrome.browserless.io
   ```

## 🔧 Implementation

### 1. Browserless Client Library
The library has been created at `/lib/browserless.ts` with the following features:

- **Web Page Scraping**: Extract content, headings, links, and images
- **SERP Analysis**: Analyze Google search results for keywords
- **Competitor Analysis**: Scrape multiple competitor URLs

### 2. API Integration

#### SERP Analysis API (`/api/serp-analysis/route.ts`)
```typescript
import { browserless } from '@/lib/browserless'

export async function POST(req) {
  const { keyword } = await req.json()
  const serpData = await browserless.analyzeSERP(keyword)
  return NextResponse.json({ data: serpData })
}
```

#### Web Search API (`/api/web-search/route.ts`)
```typescript
import { browserless } from '@/lib/browserless'

export async function POST(req) {
  const { urls } = await req.json()
  const results = await browserless.analyzeCompetitors(urls)
  return NextResponse.json({ results })
}
```

## 🎨 Features Enabled

### 1. SERP Analysis Toggle
- Analyzes top-ranking content
- Extracts competitor headings
- Identifies keyword opportunities
- Shows search volume and difficulty

### 2. Web Search Toggle
- Scrapes competitor content
- Extracts meta information
- Analyzes word count and structure
- Gathers related keywords

### 3. Competitor Analysis
- Input multiple competitor URLs
- Extract content structure
- Compare heading strategies
- Analyze content depth

## 🚀 Usage in Blog Writer

The toggles are now functional:
- **SERP Analysis**: Click to analyze search engine results
- **Web Search**: Enable to research competitor content
- **Competitor URLs**: Paste URLs for direct analysis

## 🔒 Security Notes

1. **API Key**: Keep your Browserless API key secure
2. **Rate Limiting**: Implement rate limits to prevent abuse
3. **Error Handling**: Always handle scraping failures gracefully
4. **User Validation**: Verify user authentication before scraping

## 📊 Response Format

### SERP Analysis Response
```json
{
  "keyword": "AI content writing",
  "searchVolume": 5400,
  "difficulty": 65,
  "organicResults": [
    {
      "position": 1,
      "title": "Best AI Content Writing Tools",
      "url": "https://example.com/ai-writing",
      "snippet": "Discover the best AI tools...",
      "domain": "example.com"
    }
  ],
  "relatedKeywords": ["AI writing tools", "content generation"],
  "peopleAlsoAsk": ["What is AI content writing?"]
}
```

### Web Scrape Response
```json
{
  "title": "Competitor Page Title",
  "content": "Scraped content...",
  "headings": {
    "h1": ["Main Heading"],
    "h2": ["Subheading 1", "Subheading 2"],
    "h3": ["Detail 1", "Detail 2"]
  },
  "wordCount": 1500,
  "metaDescription": "Page description",
  "links": ["https://link1.com", "https://link2.com"],
  "images": ["https://image1.jpg"]
}
```

## 🐛 Troubleshooting

### Browserless Not Working
- Check if BROWSERLESS_URL is correct
- Verify API key is valid
- Ensure Docker container is running
- Check network connectivity

### Slow Scraping
- Increase timeout values
- Use faster Browserless instance
- Limit concurrent requests
- Implement caching

### SERP Analysis Fails
- Google may block automated requests
- Use residential proxies
- Implement delays between requests
- Consider using SERPApi alternative

## 🔄 Fallback Mechanism

The system includes automatic fallbacks:
1. **Browserless fails** → Use mock data
2. **API rate limited** → Return cached results
3. **Network error** → Show placeholder content

## 📝 Best Practices

1. **Cache Results**: Store SERP data to reduce API calls
2. **Rate Limiting**: Don't scrape too frequently
3. **User Quotas**: Limit scraping per user/plan
4. **Error Messages**: Provide helpful feedback
5. **Loading States**: Show progress indicators

## 🎯 Next Steps

1. **Test the Integration**:
   - Enable SERP analysis toggle
   - Try web search feature
   - Test competitor URL scraping

2. **Monitor Usage**:
   - Track API call volume
   - Monitor error rates
   - Check response times

3. **Optimize Performance**:
   - Implement caching
   - Add request queuing
   - Set up retry logic

---

**Note**: The browserless.ts file has been created and integrated into the web-search and serp-analysis APIs. The toggle buttons should now be functional when you configure your Browserless instance.
