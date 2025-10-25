# 🎯 Quick Reference: System Prompts & Logic

## AI Provider Parameters (Optimized)

### Google Gemini 2.5 Flash
```typescript
{
  temperature: 0.7,        // Balanced creativity
  maxTokens: 4096,         // Long-form support
  topP: 0.95,             // Nucleus sampling
  topK: 40                 // Quality control
}
```
**Best for**: Fast, cost-effective, balanced quality content

### Baseten GPT OSS 120B
```typescript
{
  temperature: 0.8,        // Creative output
  maxTokens: 2048,         // Good length
  topP: 0.9,              // Quality coherence
  presencePenalty: 0.6,   // Diverse content
  frequencyPenalty: 0.3   // Reduce repetition
}
```
**Best for**: High-quality, creative premium content

### DeepSeek Chat/Coder
```typescript
{
  temperature: 0.7,        // Balanced
  maxTokens: 4096,         // Long articles
  topP: 0.95,             // High quality
  frequencyPenalty: 0.2,  // Less repetition
  presencePenalty: 0.1    // Topic exploration
}
```
**Best for**: Advanced reasoning, technical content

---

## Temperature Guide

| Value | Use Case | Content Type |
|-------|----------|--------------|
| 0.3-0.5 | Factual, precise | Technical docs, tutorials |
| 0.7-0.8 | Creative, engaging | Blog posts, articles ✅ |
| 0.9-1.0 | Highly creative | Storytelling, fiction |

---

## Token Length Guide

| Article Length | Word Count | Tokens Needed |
|----------------|------------|---------------|
| Short | 800-1000 | 2000-3000 |
| Medium | 1200-1500 | 3000-4000 ✅ |
| Long | 1800-2500 | 4000-6000 |
| Epic | 3000+ | 6000-8000 |

---

## Key Prompt Improvements

### ✅ E-E-A-T Integration
- **Experience**: First-hand insights, real examples
- **Expertise**: Subject knowledge, credentials
- **Authoritativeness**: Data citations, expert quotes
- **Trustworthiness**: Accuracy, transparency, sources

### ✅ SEO Optimization
- Featured snippets (definitions, lists, tables)
- Voice search (natural questions)
- Schema markup (Article, FAQ, HowTo)
- Long-tail keywords
- Internal linking

### ✅ Engagement Elements
- **Hooks**: Questions, statistics, bold statements
- **Bucket Brigades**: "Here's the truth:", "But wait..."
- **Pattern Interrupts**: Every 300-400 words
- **Power Words**: Ultimate, Proven, Revolutionary
- **CTAs**: Early (20%), Mid (50%), Final (conclusion)

### ✅ Content Quality
- Short paragraphs (2-4 sentences)
- Actionable insights
- Real-world examples
- Data and statistics
- Expert quotes
- Social proof

---

## Content Structure Template

```html
<h1>Power Title with Keyword + Benefit</h1>
<!-- Meta: 150-160 char description with action words -->

<!-- INTRO (300 words) -->
<p>Hook: Question/Stat/Bold Statement</p>
<p>Problem identification</p>
<p>Promise: What they'll learn</p>
<p>Credibility signal</p>

<!-- TABLE OF CONTENTS (1500+ words) -->

<!-- SECTION 1 -->
<h2>Keyword-Rich Section Title</h2>
<p>Opening paragraph with hook...</p>
<ul>
  <li><strong>Key Point 1:</strong> Explanation</li>
  <li><strong>Key Point 2:</strong> Explanation</li>
</ul>

<!-- PATTERN INTERRUPT (Every 300-400 words) -->
<blockquote>
  <p><strong>Pro Tip 💡:</strong> Expert insight here</p>
</blockquote>

<!-- CTA (20% through) -->
<p><strong>Want to learn more?</strong> <a href="#">Get the guide</a></p>

<!-- MORE SECTIONS... -->

<!-- FAQ SECTION -->
<h2>Frequently Asked Questions</h2>
<h3>Question optimized for voice search?</h3>
<p>Direct, concise answer for featured snippet.</p>

<!-- CONCLUSION -->
<h2>Conclusion</h2>
<ul>
  <li>Key Takeaway 1</li>
  <li>Key Takeaway 2</li>
  <li>Key Takeaway 3</li>
</ul>
<p><strong>Next Steps:</strong> Clear CTA with benefit</p>
```

---

## Writing Checklist

### Before Generation:
- [ ] Define content type (how-to, guide, comparison, news)
- [ ] Set article length (short, medium, long, epic)
- [ ] Choose provider/model (gemini, baseten, deepseek)
- [ ] Set temperature (0.3-1.0)
- [ ] Add SEO keywords
- [ ] Define target audience

### After Generation:
- [ ] Has engaging hook in first 3 sentences
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Keywords integrated naturally
- [ ] Includes 2-3 actionable examples
- [ ] Pattern interrupts every 300-400 words
- [ ] 2-3 CTAs at strategic points
- [ ] Social proof elements included
- [ ] Proper HTML formatting
- [ ] No repetition or fluff
- [ ] Optimized for featured snippets

---

## Common Use Cases

### Blog Post (Medium, 1200-1500 words)
```typescript
{
  provider: 'google',        // gemini-2-flash
  temperature: 0.7,
  maxTokens: 4000,
  contentType: 'informative',
  articleLength: 'medium',
  tone: 'friendly'
}
```

### Technical Guide (Long, 1800-2500 words)
```typescript
{
  provider: 'deepseek',      // deepseek-coder
  temperature: 0.5,          // More factual
  maxTokens: 6000,
  contentType: 'guide',
  articleLength: 'long',
  tone: 'technical'
}
```

### Premium Article (Epic, 3000+ words)
```typescript
{
  provider: 'baseten',       // gpt-oss-120b
  temperature: 0.8,          // Creative
  maxTokens: 8000,
  contentType: 'guide',
  articleLength: 'epic',
  tone: 'professional'
}
```

### Comparison Article (Medium)
```typescript
{
  provider: 'google',
  temperature: 0.6,          // Balanced
  maxTokens: 4000,
  contentType: 'comparison',
  articleLength: 'medium',
  modelA: 'Product A',
  modelB: 'Product B'
}
```

---

## Error Prevention

### Common Issues & Solutions

**Issue**: Repetitive content
**Solution**: Increase frequency_penalty to 0.3-0.5

**Issue**: Off-topic content
**Solution**: Lower temperature to 0.5-0.6

**Issue**: Too short output
**Solution**: Increase maxTokens and check article length setting

**Issue**: Generic content
**Solution**: Increase presence_penalty to 0.6-0.8

**Issue**: Too technical/complex
**Solution**: Adjust tone to 'friendly' or 'casual'

---

## Performance Tips

### For Best Quality:
1. Use DeepSeek or Baseten for pro content
2. Set temperature 0.7-0.8 for engagement
3. Include SEO keywords in request
4. Define target audience clearly
5. Choose appropriate content type

### For Speed:
1. Use Google Gemini (fastest)
2. Set shorter article length
3. Lower maxTokens to 2000-3000
4. Use simpler content types

### For Cost Efficiency:
1. Use Google Gemini (free tier)
2. Optimize maxTokens (don't over-request)
3. Use web search sparingly
4. Batch similar content requests

---

## Key Files Reference

| File | Purpose | What Was Changed |
|------|---------|------------------|
| `app/api/generate-content/route.ts` | Main content generation | Enhanced prompts, E-E-A-T, SEO |
| `app/api/generate-outline/route.ts` | Outline generation | Advanced outline framework |
| `lib/langchain-blog-pipeline.ts` | LangChain pipeline | All node prompts improved |
| `lib/ai-providers.ts` | Provider logic | Optimized parameters |

---

**Quick Start**: Use Gemini 2.5 Flash at 0.7 temperature with 4000 tokens for best results!

**Last Updated**: October 25, 2025
