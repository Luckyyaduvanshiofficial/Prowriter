# AI-Generated Images Integration Guide

## 🎯 Overview
This guide explains how to automatically add relevant, high-quality images to your blog posts using free AI image APIs (Unsplash and Pexels).

## 📦 Features Implemented

### 1. **Automatic Image Fetching**
- Fetches relevant images based on article topic and content
- Uses both Unsplash and Pexels APIs for diversity
- Extracts keywords from article headings automatically
- Generates image queries from H2 sections

### 2. **Smart Image Placement**
- Featured image after H1 title
- Section images after every 2-3 H2 headings
- Proper HTML structure with `<figure>` and `<figcaption>` tags
- Responsive images with lazy loading

### 3. **Professional Attribution**
- Photographer credits with links
- Source platform links (Unsplash/Pexels)
- Proper licensing compliance
- SEO-friendly alt text

## 🔧 Setup Instructions

### Step 1: Get Free API Keys

#### Unsplash API (Recommended)
1. Go to https://unsplash.com/developers
2. Click "Register as a developer"
3. Create a new application
4. Copy your **Access Key**
5. Free tier: 50 requests/hour

#### Pexels API (Optional but recommended)
1. Go to https://www.pexels.com/api/
2. Click "Get Started"
3. Copy your **API Key**
4. Free tier: Unlimited requests

### Step 2: Add Environment Variables

Create or update your `.env.local` file:

```env
# Unsplash API
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here

# Pexels API
PEXELS_API_KEY=your_pexels_api_key_here
```

**Important:** Never commit your `.env.local` file to git!

### Step 3: Verify Integration

The image integration is already active in:
- `/api/generate-content` - Standard article generation
- `/api/next-level-generate` - Advanced article generation

## 🖼️ How It Works

### Automatic Image Selection Process

1. **Topic Analysis**: Extracts main topic from article title
2. **Content Scanning**: Identifies H2 headings for section-specific images
3. **Keyword Extraction**: Finds relevant keywords from content
4. **API Queries**: Searches both Unsplash and Pexels
5. **Smart Placement**: Inserts images at strategic positions
6. **Attribution**: Adds photographer credits automatically

### Image Placement Strategy

```html
<!-- Featured Image (after H1) -->
<h1>Article Title</h1>
<figure class="featured-image">
  <img src="..." alt="..." />
  <figcaption>Photo by John Doe on Unsplash</figcaption>
</figure>

<!-- Section Images (after every 2-3 H2) -->
<figure class="article-image">
  <img src="..." alt="..." />
  <figcaption>Photo by Jane Smith on Pexels</figcaption>
</figure>
<h2>Section Title</h2>
```

## 🎨 Image Formatting

### Generated HTML Structure

Each image is wrapped in a professional figure element:

```html
<figure class="featured-image" style="margin: 32px 0; text-align: center;">
  <img 
    src="https://images.unsplash.com/photo-xyz"
    alt="AI Technology in Modern Business"
    style="width: 100%; max-width: 1200px; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"
    loading="lazy"
  />
  <figcaption style="margin-top: 12px; font-size: 14px; color: #666; font-style: italic;">
    Photo by <a href="..." target="_blank">Photographer Name</a> on 
    <a href="https://unsplash.com" target="_blank">Unsplash</a>
  </figcaption>
</figure>
```

### Styling Features

- **Responsive**: 100% width up to max-width
- **Rounded Corners**: 8px border-radius
- **Shadow Effect**: Subtle box-shadow for depth
- **Lazy Loading**: Improves page performance
- **Accessibility**: Proper alt text for SEO

## 📝 API Request Parameters

### Request Body Options

```javascript
{
  "topic": "AI Technology in Business",
  "includeImages": true,        // Enable/disable images
  "imageCount": 3,              // Number of images (1-5)
  "contentType": "guide",
  "articleLength": "medium",
  // ... other parameters
}
```

### Response Structure

```json
{
  "content": "<h1>...</h1><figure>...</figure>...",
  "images": [
    {
      "url": "https://images.unsplash.com/...",
      "alt": "AI Technology in Business",
      "photographer": "John Doe",
      "photographerUrl": "https://unsplash.com/@johndoe",
      "source": "unsplash",
      "width": 1920,
      "height": 1080
    }
  ],
  "metadata": {
    "imageCount": 3,
    "imageSources": ["unsplash", "pexels", "unsplash"]
  }
}
```

## 🎯 Usage Examples

### Enable Images in Blog Writer

The blog writer component automatically includes images:

```typescript
const response = await fetch('/api/next-level-generate', {
  method: 'POST',
  body: JSON.stringify({
    topic: 'AI Content Writing',
    includeImages: true,  // Enabled by default
    imageCount: 3,        // 3 images by default
    // ...
  })
})
```

### Customize Image Count

```typescript
// More images for long articles
includeImages: true,
imageCount: 5,  // For epic-length articles

// Fewer images for short posts
includeImages: true,
imageCount: 1,  // Just featured image
```

### Disable Images

```typescript
includeImages: false,  // No images will be fetched
```

## 🔍 Image Selection Logic

### Query Generation

1. **Primary Query**: Article topic
2. **Section Queries**: H2 headings (first 50 chars)
3. **Keyword Queries**: Top 5 extracted keywords

### Example Queries

For topic: "AI Content Writing Tools"
- Query 1: "AI Content Writing Tools"
- Query 2: "How AI Transforms Content Creation"
- Query 3: "Best Practices for AI Writing"
- Query 4: "automation"
- Query 5: "productivity"

### Image Orientation

- **Featured Image**: Landscape (1200x630+)
- **Section Images**: Landscape (800x450+)
- **Responsive**: Adapts to container width

## 🚀 Performance Optimizations

### Lazy Loading
All images use `loading="lazy"` attribute:
- Reduces initial page load time
- Improves Core Web Vitals
- Better mobile performance

### Parallel Fetching
- Unsplash and Pexels queried simultaneously
- Results combined for diversity
- Fallback to placeholder if APIs fail

### Caching Strategy
Consider implementing:
- Image URL caching in database
- CDN for frequently used images
- Browser caching headers

## 📊 API Rate Limits

### Unsplash
- **Free Tier**: 50 requests/hour
- **Demo Requests**: Count against limit
- **Best Practice**: Cache results per article

### Pexels
- **Free Tier**: Unlimited requests
- **Fair Use Policy**: Don't abuse
- **Best Practice**: Use as primary source

### Optimization Tips

1. **Cache Image URLs**: Store in article metadata
2. **Reuse Images**: For similar topics
3. **Batch Requests**: Generate multiple articles, then images
4. **Monitor Usage**: Track API call counts

## 🎨 Customization Options

### Image Styles

Edit the `generateImageHTML` method in `/lib/image-fetcher.ts`:

```typescript
// Custom featured image size
style="max-width: 1400px;"

// Different border radius
style="border-radius: 12px;"

// Custom shadow
style="box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);"
```

### Placement Logic

Modify `insertImagesIntoArticle` to change where images appear:

```typescript
// Insert after every H2
h2Matches.forEach((h2, index) => {
  // Current: every 2nd H2
  if (index % 2 === 0 && index > 0) {
    // Change to every H2:
    // if (index > 0) {
  }
})
```

## 🐛 Troubleshooting

### No Images Appearing

**Check:**
1. API keys in `.env.local`
2. `includeImages: true` in request
3. Console logs for API errors
4. Network tab for failed requests

**Solution:**
```bash
# Restart dev server after adding env vars
npm run dev
```

### Low-Quality Images

**Cause:** Using `size: 'small'` option

**Solution:**
```typescript
// Use 'large' for better quality
size: 'large'  // Default is 'medium'
```

### Rate Limit Exceeded

**Unsplash Error:** "Rate Limit Exceeded"

**Solutions:**
1. Wait 1 hour for limit reset
2. Rely on Pexels (unlimited)
3. Implement caching
4. Upgrade Unsplash plan

### Attribution Not Showing

**Check:** Image HTML includes `<figcaption>`

**Verify:**
```html
<figcaption>
  Photo by <a href="...">Name</a> on <a href="...">Source</a>
</figcaption>
```

## 📜 Licensing & Attribution

### Unsplash License
- **Free to use**: Commercial and non-commercial
- **Attribution**: Required (automatically added)
- **No permission needed**: For most uses
- **Link back**: To photographer's Unsplash profile

### Pexels License
- **Free to use**: All photos
- **Attribution**: Appreciated but not required
- **Commercial use**: Allowed
- **Link back**: To photographer's Pexels profile

### Our Implementation
We **always provide attribution** for both:
- Respects creators
- Builds trust
- Supports free image ecosystem

## 🎯 Best Practices

### DO:
✅ Use relevant images matching article topic
✅ Include alt text for SEO and accessibility
✅ Credit photographers properly
✅ Cache image URLs in your database
✅ Use lazy loading for performance
✅ Monitor API usage

### DON'T:
❌ Remove attribution links
❌ Use offensive or inappropriate images
❌ Exceed API rate limits
❌ Use images without alt text
❌ Ignore photographer credits

## 📈 Future Enhancements

### Planned Features
- [ ] AI-powered image selection based on sentiment
- [ ] Custom image filters and effects
- [ ] Multiple orientation support (portrait/square)
- [ ] Image compression and optimization
- [ ] CDN integration for faster loading
- [ ] Image gallery components
- [ ] Featured image selection UI

### Advanced Options
```typescript
// Coming soon
{
  imageOptions: {
    color: 'blue',           // Color filter
    orientation: 'portrait', // Portrait images
    quality: 'high',         // Higher quality
    compress: true,          // Auto-compress
    filters: ['blur', 'brightness']
  }
}
```

## 📚 Additional Resources

- [Unsplash API Documentation](https://unsplash.com/documentation)
- [Pexels API Documentation](https://www.pexels.com/api/documentation/)
- [Image SEO Best Practices](https://developers.google.com/search/docs/appearance/google-images)
- [Web Performance - Images](https://web.dev/fast/#optimize-your-images)

---

## 🎉 Summary

Your Prowriter AI now automatically:
1. ✅ Fetches relevant images from Unsplash & Pexels
2. ✅ Inserts images at strategic positions
3. ✅ Adds proper photographer attribution
4. ✅ Uses responsive, lazy-loading images
5. ✅ Enhances SEO with alt text
6. ✅ Improves article visual appeal

**Next Steps:**
1. Get your free API keys
2. Add them to `.env.local`
3. Generate a test article
4. Enjoy automatic images! 🖼️
