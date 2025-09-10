# Kutumbhcraft - Premium AI Content Generation Platform

🚀 **Enhanced with Neon Database & Auth Integration**

Kutumbhcraft is a modern, full-featured content generation platform powered by cutting-edge AI technology. This version has been completely updated to use Neon's high-performance PostgreSQL database and authentication system for a unified, scalable solution.

## ✨ Key Features

### 🎯 **Neon Integration**
- **Neon PostgreSQL**: High-performance, serverless database with branching
- **Neon Auth**: Secure authentication with JWT tokens and session management
- **Enterprise-grade reliability**: 99.9% uptime and automatic scaling
- **Lightning fast**: Generate 3000+ word articles in under 2 minutes
- **Advanced parameters**: Full control over creativity, temperature, and output quality

### 🔐 **Modern Authentication**
- **Custom Auth System**: Built on Neon database with secure password hashing
- **JWT Sessions**: Secure, stateless authentication tokens
- **Professional UI**: Beautiful sign-in/sign-up pages with form validation
- **Password Security**: Strong password requirements and bcrypt hashing
- **Role-based access**: Free and Pro tier management

### 📝 **Advanced Content Generation**
- **Multiple content types**: Articles, how-to guides, comparisons, listicles
- **SEO optimization**: Built-in keyword research and content optimization
- **Professional templates**: Industry-specific content templates
- **Real-time generation**: Live progress tracking and status updates
- **Content management**: Save, edit, and organize your generated articles

### 💼 **Professional UI/UX**
- **Modern design**: Clean, responsive interface built with Tailwind CSS
- **Mobile-first**: Fully responsive design for all devices
- **Dark/light themes**: Automatic theme switching
- **Accessibility**: WCAG 2.1 compliant interface
- **Form validation**: Real-time validation with helpful error messages

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Database**: Neon PostgreSQL (serverless)
- **Authentication**: Custom JWT-based auth system
- **UI Library**: Radix UI components with Tailwind CSS
- **AI Integration**: OpenAI, Google Generative AI, Together AI
- **State Management**: React hooks and context
- **Password Security**: bcryptjs for hashing
- **Deployment**: Vercel-ready configuration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Neon account (free tier available)
- AI provider API keys (OpenAI, Google AI, etc.)

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

3. **Set up Neon Database**
   - Sign up at [Neon.tech](https://neon.tech)
   - Create a new project
   - Copy your connection string
   - Run the schema file in Neon Console:
     ```sql
     -- Copy and paste the contents of neon-schema.sql
     ```

4. **Configure environment variables**
   Create a `.env.local` file:
   ```env
   # Neon Database
   DATABASE_URL=your_neon_connection_string_here
   
   # Authentication
   JWT_SECRET=your_super_secret_jwt_key_here
   
   # AI Providers
   OPENAI_API_KEY=your_openai_api_key_here
   GOOGLE_API_KEY=your_google_api_key_here
   
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Neon Database Setup
1. Sign up at [Neon.tech](https://neon.tech)
2. Create a new project and database
3. Copy the connection string to your `.env.local`
4. Run the `neon-schema.sql` file to create tables
5. The application will automatically handle user registration and data management

### AI Providers Setup
1. **OpenAI**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Google AI**: Create a key at [Google AI Studio](https://makersuite.google.com/app/apikey)
3. **Together AI**: Sign up at [Together.ai](https://together.ai) for access to LLaMA and other models
4. Add all keys to your environment variables

### Authentication Configuration
The system uses JWT tokens for authentication:
- Tokens expire after 7 days
- Passwords are hashed with bcryptjs (12 rounds)
- Sessions are stored in HTTP-only cookies
- Middleware protects all authenticated routes

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
- **Content history**: Save and manage generated articles in your dashboard

### Database Features
- **Article storage**: Full content with metadata and SEO information
- **Usage analytics**: Track daily, monthly, and total article generation
- **User profiles**: Comprehensive user management with subscription tracking
- **Performance**: Optimized queries with proper indexing

## 🔄 Recent Updates

### ✅ **Completed Migration**
- [x] **Neon Integration**: Complete migration from Supabase to Neon PostgreSQL
- [x] **Custom Authentication**: Replaced Clerk with custom JWT-based auth system
- [x] **Database Schema**: Updated schema with proper relationships and indexing
- [x] **Modern UI**: Redesigned authentication pages with improved UX
- [x] **API Overhaul**: Updated all API routes to use Neon database
- [x] **Security Enhancements**: Implemented proper password hashing and JWT validation

### 🎯 **Key Improvements**
- **Unified Platform**: Single database and auth provider for better integration
- **Better Performance**: Neon's serverless architecture provides faster queries
- **Enhanced Security**: Custom authentication with industry-standard practices
- **Improved UX**: Professional sign-in/up pages with real-time validation
- **Scalability**: Auto-scaling database that grows with your needs

## 📱 Usage Guide

### 1. **Getting Started**
- Create an account with email and password
- Verify your account meets password requirements
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
- View usage statistics and limits
- Export content in various formats
- Track your content generation history

### 4. **Account Management**
- Update profile information
- Monitor usage limits
- Upgrade/downgrade plans
- Manage account settings

## 🔐 Security Features

- **Password Security**: Strong password requirements with validation
- **JWT Tokens**: Secure, stateless authentication
- **HTTP-Only Cookies**: Prevent XSS attacks
- **Database Security**: Prepared statements prevent SQL injection
- **Environment Variables**: Sensitive data stored securely
- **Middleware Protection**: Automatic route protection

## 📈 Performance

- **Fast queries**: Optimized database schema with proper indexing
- **Serverless scaling**: Neon automatically scales with demand
- **Efficient caching**: Reduced API calls and faster responses
- **Optimized build**: Next.js production optimizations
- **CDN delivery**: Static assets served via CDN

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

- **Neon**: For providing excellent PostgreSQL database infrastructure
- **Vercel**: For excellent hosting and deployment
- **Next.js team**: For the amazing React framework
- **Tailwind CSS**: For beautiful, utility-first styling
- **Radix UI**: For accessible, unstyled UI components

---

Built with ❤️ by the Kutumbhcraft team. Powered by Neon's cutting-edge database technology.