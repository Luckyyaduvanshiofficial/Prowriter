# Prowriter AI - Premium AI Content Generation Platform

🚀 **Enhanced with Baseten API Integration**

Prowriter AI is a modern, full-featured content generation platform powered by cutting-edge AI technology. This version has been completely updated to integrate with Baseten's high-performance AI infrastructure for lightning-fast content creation.

## ✨ Key Features

### 🎯 **Baseten AI Integration**
- **GPT OSS 120B Model**: Ultra-high performance content generation
- **Enterprise-grade reliability**: 99.9% uptime and consistent performance
- **Lightning fast**: Generate 3000+ word articles in under 2 minutes
- **Advanced parameters**: Full control over creativity, temperature, and output quality

### 🔐 **Modern Authentication**
- **Clerk Integration**: Seamless sign-in/sign-up experience
- **Social logins**: Google, GitHub, Apple, and more
- **Secure sessions**: Enterprise-grade security and user management
- **Role-based access**: Free and Pro tier management

### 📝 **Advanced Content Generation**
- **Multiple content types**: Articles, how-to guides, comparisons, listicles
- **SEO optimization**: Built-in keyword research and content optimization
- **Professional templates**: Industry-specific content templates
- **Real-time generation**: Live progress tracking and status updates

### 💼 **Professional UI/UX**
- **Modern design**: Clean, responsive interface built with Tailwind CSS
- **Mobile-first**: Fully responsive design for all devices
- **Dark/light themes**: Automatic theme switching
- **Accessibility**: WCAG 2.1 compliant interface

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Library**: Radix UI components with Tailwind CSS
- **Authentication**: Clerk
- **AI Integration**: Baseten API with GPT OSS 120B
- **State Management**: React hooks and context
- **Database**: Clerk user management (Supabase removed)
- **Deployment**: Vercel-ready configuration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Baseten API key
- Clerk account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LuckyBCA/Prowriter.git
   cd Prowriter
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure environment variables**
   Create a `.env.local` file:
   ```env
   # Baseten AI Integration
   BASETEN_API_KEY=your_baseten_api_key_here
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Baseten API Setup
1. Sign up at [Baseten](https://baseten.co)
2. Create a new API key
3. Add the key to your `.env.local` file
4. The integration uses the `openai/gpt-oss-120b` model by default

### Clerk Authentication Setup
1. Create a Clerk application at [Clerk.dev](https://clerk.dev)
2. Configure your authentication providers
3. Add your keys to the environment variables
4. Update the middleware for protected routes

## 📊 Features Overview

### Content Generation
- **Multi-format support**: Articles, guides, comparisons, news, listicles
- **Advanced AI settings**: Temperature control, creativity levels, output length
- **SEO optimization**: Keyword research, meta descriptions, schema markup
- **Content enhancement**: Table of contents, FAQ sections, statistics

### User Management
- **Free tier**: 5 articles per day
- **Pro tier**: 25 articles per day + advanced features
- **Usage tracking**: Real-time generation limits and statistics
- **Content history**: Save and manage generated articles

### Performance
- **Fast generation**: 2-minute average for long-form content
- **Real-time updates**: Live progress tracking during generation
- **Optimized caching**: Reduced API calls and faster responses
- **Error handling**: Graceful fallbacks and error recovery

## 🔄 Recent Updates

### ✅ **Completed Improvements**
- [x] **Baseten API Integration**: Complete integration with GPT OSS 120B model
- [x] **Cleaned codebase**: Removed all test files and unnecessary documentation
- [x] **Authentication overhaul**: Clerk as primary authentication provider
- [x] **UI/UX enhancements**: Modern, responsive design improvements
- [x] **Performance optimization**: Faster content generation and loading times
- [x] **Error handling**: Better error messages and user feedback

### 🎯 **Key Achievements**
- **40+ test files removed**: Cleaner, more maintainable codebase
- **Supabase dependencies removed**: Simplified authentication with Clerk
- **Baseten as default provider**: High-performance AI content generation
- **Enhanced user experience**: Improved navigation and content flow
- **Better SEO optimization**: Advanced meta tags and structured data

## 📱 Usage Guide

### 1. **Getting Started**
- Sign up with email or social login
- Choose your plan (Free or Pro)
- Access the AI Writer dashboard

### 2. **Creating Content**
- Select content type (article, guide, comparison, etc.)
- Enter your topic and target keywords
- Configure AI settings (length, tone, creativity)
- Generate outline and review structure
- Create full article with one click

### 3. **Content Management**
- Save articles to your dashboard
- Export in HTML, Markdown, or PDF formats
- Copy content to clipboard
- Track usage statistics

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Check the inline code documentation
- **Community**: Join our Discord community

## 🎉 Acknowledgments

- **Baseten**: For providing high-performance AI infrastructure
- **Clerk**: For seamless authentication solutions
- **Vercel**: For excellent hosting and deployment
- **Next.js team**: For the amazing React framework
- **Tailwind CSS**: For beautiful, utility-first styling

---

Built with ❤️ by the Prowriter AI team. Powered by Baseten's cutting-edge AI technology.