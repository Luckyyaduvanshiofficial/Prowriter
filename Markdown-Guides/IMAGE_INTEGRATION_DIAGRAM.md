# AI Image Integration - Quick Reference

## 🖼️ Image Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   User Generates Article                     │
│              topic: "AI Content Writing"                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              1. Article Content Generated                    │
│     <h1>AI Content Writing Guide</h1>                       │
│     <h2>What is AI Writing?</h2>                            │
│     <h2>Best Practices</h2>                                 │
│     <h2>Top Tools in 2025</h2>                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         2. Keyword Extraction & Query Generation             │
│                                                              │
│  Main Topic: "AI Content Writing"                           │
│  H2 Queries: ["What is AI Writing?",                        │
│               "Best Practices",                              │
│               "Top Tools in 2025"]                           │
│  Keywords:   ["automation", "productivity", "writing"]       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              3. Parallel API Requests                        │
│                                                              │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │  Unsplash API    │         │   Pexels API     │         │
│  │                  │         │                  │         │
│  │ Query: "AI       │         │ Query: "AI       │         │
│  │ Content Writing" │         │ Content Writing" │         │
│  │                  │         │                  │         │
│  │ Results: 2 imgs  │         │ Results: 1 img   │         │
│  └──────────────────┘         └──────────────────┘         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│            4. Combine & Select Best Images                   │
│                                                              │
│  Image 1: Unsplash - Person typing (1920x1080)             │
│  Image 2: Pexels - AI robot (1600x900)                     │
│  Image 3: Unsplash - Content screen (1800x1000)            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           5. Strategic Image Insertion                       │
│                                                              │
│  <h1>AI Content Writing Guide</h1>                          │
│  ┌─────────────────────────────────────┐                   │
│  │ 🖼️ FEATURED IMAGE (Image 1)        │                   │
│  │ Photo by John Doe on Unsplash      │                   │
│  └─────────────────────────────────────┘                   │
│                                                              │
│  <h2>What is AI Writing?</h2>                               │
│  <p>Content...</p>                                          │
│                                                              │
│  ┌─────────────────────────────────────┐                   │
│  │ 🖼️ SECTION IMAGE (Image 2)         │                   │
│  │ Photo by Jane Smith on Pexels      │                   │
│  └─────────────────────────────────────┘                   │
│  <h2>Best Practices</h2>                                    │
│  <p>Content...</p>                                          │
│                                                              │
│  <h2>Top Tools in 2025</h2>                                 │
│  <p>Content...</p>                                          │
│  ┌─────────────────────────────────────┐                   │
│  │ 🖼️ SECTION IMAGE (Image 3)         │                   │
│  │ Photo by Alex Brown on Unsplash    │                   │
│  └─────────────────────────────────────┘                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              6. Return Enhanced Article                      │
│                                                              │
│  {                                                           │
│    content: "<h1>...</h1><figure>...</figure>...",          │
│    images: [ImageResult, ImageResult, ImageResult],         │
│    metadata: {                                               │
│      imageCount: 3,                                          │
│      imageSources: ["unsplash", "pexels", "unsplash"]       │
│    }                                                         │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Image Placement Rules

### Featured Image (Position 1)
- **Location**: Right after `<h1>` tag
- **Size**: Max-width 1200px
- **Purpose**: Main visual representation of article
- **Query**: Primary topic
- **Example**: "AI Content Writing"

### Section Images (Positions 2, 3, 4...)
- **Location**: Before every 2-3 `<h2>` tags
- **Size**: Max-width 800px  
- **Purpose**: Illustrate specific sections
- **Query**: H2 heading text or related keywords
- **Example**: "Best Practices", "productivity"

### Image Count Logic
```javascript
Short Article (800-1000 words):   1-2 images
Medium Article (1200-1500 words): 2-3 images
Long Article (1800-2500 words):   3-4 images
Epic Article (3000+ words):       4-5 images
```

## 🎯 API Selection Strategy

```
┌─────────────────────────────────────────┐
│          Image Request (count: 3)       │
└──────────────────┬──────────────────────┘
                   │
                   ├──────────────┬──────────────┐
                   ▼              ▼              ▼
            Query 1: Topic   Query 2: H2   Query 3: Keyword
                   │              │              │
       ┌───────────┴───────┐     │     ┌────────┴────────┐
       ▼                   ▼     ▼     ▼                 ▼
   Unsplash             Pexels  Both  Unsplash        Pexels
   (1 image)            (1 img) APIs  (1 image)       (1 img)
       │                   │     │     │                 │
       └───────────────────┴─────┴─────┴─────────────────┘
                           │
                    Combine & Shuffle
                           │
                     Return 3 Best
```

## 🔑 Environment Setup

```env
# Minimum Required (pick one)
UNSPLASH_ACCESS_KEY=xxx    # OR
PEXELS_API_KEY=xxx

# Recommended (both for diversity)
UNSPLASH_ACCESS_KEY=xxx    # Free: 50 req/hour
PEXELS_API_KEY=xxx         # Free: Unlimited
```

## ⚡ Quick Usage

### Enable (Default)
```typescript
// Images automatically included
{ includeImages: true, imageCount: 3 }
```

### Customize
```typescript
// More images
{ includeImages: true, imageCount: 5 }

// Just featured image
{ includeImages: true, imageCount: 1 }
```

### Disable
```typescript
// No images
{ includeImages: false }
```

## 📝 Image HTML Template

```html
<figure class="[featured-image|article-image]" 
        style="margin: 32px 0; text-align: center;">
  <img 
    src="https://images.[unsplash|pexels].com/..."
    alt="Descriptive alt text for SEO"
    style="width: 100%; 
           max-width: [1200px|800px]; 
           height: auto; 
           border-radius: 8px; 
           box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
    loading="lazy"
  />
  <figcaption style="margin-top: 12px; 
                     font-size: 14px; 
                     color: #666; 
                     font-style: italic;">
    Photo by <a href="photographer-url">Name</a> on 
    <a href="source-url">[Unsplash|Pexels]</a>
  </figcaption>
</figure>
```

## 🎨 Style Variables

```css
/* Featured Image */
max-width: 1200px
border-radius: 8px
box-shadow: 0 4px 6px rgba(0,0,0,0.1)

/* Section Image */
max-width: 800px
border-radius: 8px
box-shadow: 0 4px 6px rgba(0,0,0,0.1)

/* Both */
margin: 32px 0
loading: lazy (performance)
```

## 🚀 Performance

### Optimization Features
✅ **Lazy Loading**: Images load as user scrolls
✅ **Responsive**: Adapts to screen size
✅ **Parallel Fetch**: APIs queried simultaneously
✅ **Fallback**: Placeholder if API fails
✅ **Caching**: Store URLs for reuse

### Load Time Impact
- Initial page: No delay (lazy loading)
- Images: Load progressively
- Total overhead: ~0.5s per article generation

## 🔒 Attribution & Licensing

### Unsplash
```html
Photo by <a href="profile-url">Photographer</a> on 
<a href="https://unsplash.com">Unsplash</a>
```
- Free to use commercially
- Attribution required
- No permission needed

### Pexels
```html
Photo by <a href="profile-url">Photographer</a> on 
<a href="https://pexels.com">Pexels</a>
```
- Free to use commercially
- Attribution appreciated
- No permission needed

## 📊 API Response Example

```json
{
  "url": "https://images.unsplash.com/photo-123...",
  "downloadUrl": "https://unsplash.com/photos/...",
  "thumbnailUrl": "https://images.unsplash.com/photo-123...?w=400",
  "alt": "AI Content Writing Tools",
  "photographer": "John Doe",
  "photographerUrl": "https://unsplash.com/@johndoe",
  "source": "unsplash",
  "width": 1920,
  "height": 1080,
  "averageColor": "#4F46E5"
}
```

## ✅ Ready to Use!

1. Get API keys (5 minutes)
2. Add to `.env.local`
3. Restart server
4. Generate article
5. See automatic images! 🎉
