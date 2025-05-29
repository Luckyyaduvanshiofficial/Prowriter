# RankLLMs - Premium AI Content Generation SaaS

A professional SaaS platform that generates expert-level AI model comparison articles using advanced language models. Built for content creators who need high-quality, SEO-optimized blog content about AI/LLM comparisons.

## 🚀 Features

### Core Platform
- 🤖 **Multiple AI Engines**: Qwen 2.5, LLaMA 3.1, DeepSeek V2.5, Gemini Pro
- 📊 **Model Comparisons**: Generate detailed comparisons between AI models
- 🎯 **Use Case Focused**: Coding, Chat, Reasoning, Writing specializations
- 📝 **SEO-Optimized**: Built-in meta descriptions, benchmark tables, FAQs
- 💾 **Secure Storage**: Articles saved in Supabase with full user control
- 📈 **Analytics Dashboard**: Track usage, performance, and article history

### User Experience
- 🔐 **Authentication**: Email/password + Google OAuth via Supabase
- 🎨 **Premium UI**: Modern, responsive design with Tailwind CSS
- 📱 **Mobile Friendly**: Works perfectly on all devices
- ⚡ **Real-time Generation**: Live preview with progress tracking
- 📄 **Export Options**: HTML, Markdown, plain text downloads

### Pricing & Plans
- 🆓 **Free Plan**: 5 articles/day, all features
- 👑 **Pro Plan**: $4/month, 25 articles/day, priority access
- 🏢 **Enterprise**: Custom pricing, unlimited articles, team features

## 🛠 Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS |
| **UI Components** | Radix UI, Lucide Icons |
| **Authentication** | Supabase Auth (Email + OAuth) |
| **Database** | Supabase PostgreSQL |
| **AI Integration** | OpenRouter API (Multiple LLMs) |
| **Payments** | Stripe (Ready for integration) |
| **Deployment** | Vercel (Ready) |

## 🎯 Target Market

- **Content Marketers**: Need AI comparison content for blogs
- **Tech Writers**: Cover AI/ML industry developments  
- **SEO Agencies**: Generate ranking content about AI models
- **AI Enthusiasts**: Share insights about model capabilities
- **SaaS Companies**: Content marketing for AI products

## 📦 Quick Setup

### 1. Clone & Install
```bash
git clone <your-repo>
cd Prowriter
pnpm install
```

### 2. Environment Configuration
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Supabase (Get from supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# OpenRouter (Get from openrouter.ai)  
OPENROUTER_API_KEY=your_openrouter_key

# Stripe (Optional - for payments)
STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 3. Database Setup
Create tables in Supabase:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'admin')),
  articles_generated_today INTEGER DEFAULT 0,
  last_generation_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Articles table
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  meta_description TEXT,
  model_a TEXT NOT NULL,
  model_b TEXT NOT NULL,
  use_case TEXT NOT NULL,
  article_length TEXT DEFAULT 'medium',
  ai_engine TEXT DEFAULT 'qwen',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own articles" ON articles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own articles" ON articles FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 4. Run Development Server
```bash
pnpm dev
```

Visit `http://localhost:3000` to see your SaaS platform!

## 📱 Pages & Features

### 🏠 Home Page (`/`)
- Hero section with value proposition
- Feature showcase vs competitors
- Pricing preview
- Social proof & stats
- Call-to-action for registration

### 🔐 Authentication (`/auth`)  
- Email/password registration
- Google OAuth integration
- Password reset functionality
- Automatic profile creation

### 📊 Dashboard (`/dashboard`)
- Usage statistics & limits
- Quick action buttons
- Recent articles overview
- Plan upgrade prompts
- Account management

### ✍️ Article Generator (`/generate`)
- Model selection (A vs B)
- Use case targeting
- AI engine choice
- Article length control
- Real-time generation
- Live preview & editing

### 💰 Pricing (`/pricing`)
- Plan comparison table
- Feature breakdown
- FAQ section
- Upgrade call-to-actions

## 🎨 UI/UX Design Philosophy

### Visual Design
- **Clean & Modern**: Minimal clutter, focus on content
- **Professional**: Suitable for business users
- **Accessible**: WCAG compliant, keyboard navigation
- **Responsive**: Mobile-first design approach

### User Experience  
- **Onboarding**: Simple 3-step signup process
- **Discoverability**: Clear navigation, logical flow
- **Feedback**: Loading states, success/error messages
- **Performance**: Fast page loads, efficient AI calls

### Brand Identity
- **Colors**: Blue primary, clean grays, success greens
- **Typography**: Modern, readable font hierarchy
- **Tone**: Professional yet friendly, expert authority

## 🚀 Deployment Guide

### Vercel Deployment
1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Custom Domain Setup
1. Add domain in Vercel settings
2. Update DNS records
3. Configure SSL (automatic)

### Production Checklist
- [ ] Supabase production database
- [ ] OpenRouter API keys secured
- [ ] Stripe webhook endpoints
- [ ] Analytics integration (optional)
- [ ] Error monitoring (Sentry, etc.)

## 🔮 Roadmap & Future Features

### Phase 1 (Current)
- ✅ Core article generation
- ✅ User authentication  
- ✅ Basic dashboard
- ✅ Payment ready infrastructure

### Phase 2 (Coming Soon)
- 🔍 **SERP Scraper**: Auto-discover trending AI topics
- 🕸️ **Benchmark Scraper**: Real-time model performance data
- 📈 **Model Rankings**: Community-driven AI leaderboard
- 💬 **Prompt Assistant**: AI-powered prompt suggestions

### Phase 3 (Future)
- 👥 **Team Collaboration**: Multi-user workspaces
- 🎨 **Custom Templates**: User-defined article formats
- 📊 **Advanced Analytics**: Content performance tracking
- 🔌 **API Access**: Programmatic article generation

## 💸 Monetization Strategy

### Revenue Streams
1. **Subscription Plans**: Free → Pro ($4/mo) → Enterprise
2. **API Access**: Pay-per-use for developers
3. **White-label**: Custom solutions for agencies
4. **Premium Models**: Access to latest AI models

### Pricing Psychology
- **Freemium**: Low barrier to entry, high conversion
- **Value-based**: Priced below time cost of manual writing
- **Scalable**: Usage-based limits encourage upgrades

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🆘 Support

- 📧 **Email**: support@rankllms.com
- 💬 **Discord**: [Join our community]
- 📖 **Docs**: [Documentation site]
- 🐛 **Issues**: [GitHub Issues]

---

**Ready to launch your AI content SaaS?** ⚡

This platform is production-ready and can be deployed immediately to start generating revenue from AI-powered content creation.