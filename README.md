# Prowriter AI - Premium AI Content Generation Platform

🚀 **Now powered by Appwrite - No database setup required!**

Prowriter AI is a modern, full-featured content generation platform powered by cutting-edge AI technology. This version has been completely updated to use Appwrite's BaaS platform for a unified, scalable, and easy-to-setup solution.

## ✨ Key Features

### 🔐 **Appwrite Integration**
- **Appwrite BaaS**: Complete backend-as-a-service with zero setup
- **Built-in Authentication**: Secure email/password authentication
- **Managed Database**: Cloud PostgreSQL with visual dashboard
- **Enterprise-grade**: 99.9% uptime and automatic scaling
- **5-minute setup**: No database management or complex configuration

### � **Content Generation** (Add AI libraries when needed)
- Multiple content types: Articles, how-to guides, comparisons, listicles
- SEO optimization capabilities
- Professional templates
- Real-time generation tracking
- Content management system

### 💼 **Professional UI/UX**
- **Modern design**: Clean, responsive interface built with Tailwind CSS
- **Mobile-first**: Fully responsive design for all devices
- **Dark/light themes**: Automatic theme switching
- **Radix UI**: High-quality, accessible components
- **Form validation**: Real-time validation with helpful error messages

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Appwrite (BaaS)
- **Authentication**: Appwrite Auth
- **Database**: Appwrite Database (PostgreSQL)
- **UI Library**: Radix UI components with Tailwind CSS
- **State Management**: React hooks and context
- **Deployment**: Vercel-ready configuration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Appwrite account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LuckyBCA/Prowriter.git
   cd Prowriter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Appwrite** (5 minutes)
   
   See detailed guide in [APPWRITE_SETUP.md](./APPWRITE_SETUP.md)
   
   Quick version:
   - Create account at [cloud.appwrite.io](https://cloud.appwrite.io)
   - Create a new project
   - Create database `prowriter_db`
   - Create collections: `users` and `articles`
   - Copy your Project ID and API Key

4. **Configure environment variables**
   
   Copy `.env.example` to `.env.local` and update:
   ```env
   # Appwrite
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
   APPWRITE_API_KEY=your_api_key_here
   
   # Database IDs
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=prowriter_db
   NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
   NEXT_PUBLIC_APPWRITE_ARTICLES_COLLECTION_ID=articles
   
   # Optional: AI Providers (install packages first)
   # OPENAI_API_KEY=your_key
   # GOOGLE_API_KEY=your_key
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Fast setup guide
- **[APPWRITE_SETUP.md](./APPWRITE_SETUP.md)** - Complete Appwrite setup with screenshots
- **[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)** - What changed from previous version
- **[REMOVED_DEPENDENCIES.md](./REMOVED_DEPENDENCIES.md)** - Optional packages to install later

## 🎨 Adding Features

The app is now minimal and focused. Add features as needed:

### AI Content Generation
```bash
npm install @ai-sdk/openai @google/generative-ai langchain
```

### Web Scraping & Research
```bash
npm install cheerio axios puppeteer
```

### Additional UI Components
```bash
npm install @radix-ui/react-tabs @radix-ui/react-accordion
```

See [REMOVED_DEPENDENCIES.md](./REMOVED_DEPENDENCIES.md) for the complete list.

## 🔐 Authentication

Appwrite provides built-in authentication:

- ✅ Email/Password sign up
- ✅ Email/Password sign in  
- ✅ Session management
- ✅ Password reset
- ✅ Email verification
- ✅ OAuth providers (Google, GitHub, etc.) - Easy to add

## 📊 Database

Appwrite Database features:

- ✅ Visual dashboard
- ✅ Real-time updates
- ✅ Relationships
- ✅ Full-text search
- ✅ File storage
- ✅ Automatic backups

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add your environment variables in Vercel dashboard.

### Deploy to Other Platforms

Works with any Node.js hosting:
- Netlify
- Railway
- Render
- AWS
- Google Cloud

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

- [Appwrite](https://appwrite.io) - Backend-as-a-Service
- [Next.js](https://nextjs.org) - React Framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Radix UI](https://radix-ui.com) - UI Components

## 📞 Support

- Check [APPWRITE_SETUP.md](./APPWRITE_SETUP.md) for troubleshooting
- Visit [Appwrite Documentation](https://appwrite.io/docs)
- Join [Appwrite Discord](https://appwrite.io/discord)

---

**Built with ❤️ using Appwrite**
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

Built with ❤️ by the Prowriter AI team. Powered by Neon's cutting-edge database technology.