# 🚀 Appwrite Migration Guide for Prowriter AI Platform

This guide will help you migrate your Prowriter AI application from Neon PostgreSQL to Appwrite backend-as-a-service.

## 📋 Overview

The migration replaces:
- **Custom JWT authentication** → **Appwrite Auth**
- **Neon PostgreSQL database** → **Appwrite Database**
- **Manual user management** → **Built-in user management**
- **Custom database queries** → **Appwrite SDK operations**

## 🛠️ Migration Steps

### 1. Setup Appwrite Account

1. **Create Appwrite Account**:
   - Go to [https://appwrite.io/](https://appwrite.io/)
   - Sign up for a free account
   - Create a new project

2. **Get Project Credentials**:
   - Note your Project ID
   - Note your Appwrite endpoint (e.g., `https://cloud.appwrite.io/v1`)
   - Generate an API key with full permissions

### 2. Configure Environment Variables

1. **Copy the example environment file**:
   ```bash
   cp .env.example .env.local
   ```

2. **Update .env.local with your Appwrite credentials**:
   ```env
   # Appwrite Configuration
   APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   APPWRITE_PROJECT_ID=your-project-id
   APPWRITE_API_KEY=your-server-api-key
   
   # Public Configuration
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
   ```

### 3. Create Database Structure

1. **Install Appwrite CLI** (if you want to use the automated script):
   ```bash
   npm install -g appwrite-cli
   ```

2. **Run the automated setup script**:
   ```bash
   ./setup-appwrite.sh
   ```

   **OR manually create the database structure through Appwrite Console:**
   - Create a database named `prowriter_db`
   - Create the following collections:
     - `profiles` - User profile information
     - `articles` - Generated articles  
     - `usage_tracking` - Daily usage statistics
     - `article_outlines` - Article outlines

### 4. Update Dependencies

The required dependencies have already been added to your project:
```json
{
  "dependencies": {
    "node-appwrite": "latest"
  }
}
```

### 5. Test the Migration

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test authentication**:
   - Try registering a new user
   - Try signing in with existing credentials
   - Check that user sessions work correctly

3. **Test article functionality**:
   - Generate a new article
   - Save an article
   - View saved articles
   - Delete an article

## 🔄 Migration Process

### Authentication Changes

**Before (Neon + Custom JWT):**
```typescript
import { getCurrentUserId } from '@/lib/auth'
const userId = await getCurrentUserId(request)
```

**After (Appwrite):**
```typescript
import { getCurrentUserId } from '@/lib/appwrite-auth'  
const userId = await getCurrentUserId(request)
```

### Database Query Changes

**Before (Neon SQL):**
```typescript
import { DatabaseQueries } from '@/lib/neon'
const articles = await DatabaseQueries.getArticlesByUser(userId)
```

**After (Appwrite):**
```typescript  
import { AppwriteQueries } from '@/lib/appwrite'
const articles = await AppwriteQueries.getArticlesByUser(userId)
```

## 📊 Data Migration

### Option 1: Fresh Start (Recommended)
Since this is a content generation platform, the easiest approach is to:
1. Start with the new Appwrite backend
2. Have users re-register their accounts
3. Previously generated articles can be exported and imported if needed

### Option 2: Data Migration Script (Advanced)
If you need to migrate existing data:

1. **Export from Neon**:
   ```sql
   COPY (SELECT * FROM users) TO '/tmp/users.csv' CSV HEADER;
   COPY (SELECT * FROM profiles) TO '/tmp/profiles.csv' CSV HEADER;  
   COPY (SELECT * FROM articles) TO '/tmp/articles.csv' CSV HEADER;
   ```

2. **Import to Appwrite** using the Appwrite SDK:
   ```typescript
   // Create migration script using Appwrite SDK
   // Map Neon schema to Appwrite collections
   ```

## 🔐 Security Configuration

### Authentication Settings
Configure these in your Appwrite Console:

1. **Auth Security**:
   - Enable email/password authentication
   - Configure session length (default: 1 year)
   - Set up password requirements

2. **Database Permissions**:
   - Profiles: Read/Write by document owner
   - Articles: Read/Write by document owner  
   - Usage Tracking: Read/Write by document owner

### Rate Limiting
Appwrite provides built-in rate limiting:
- Configure in your project settings
- Set appropriate limits for your use case

## 🚫 Removed Dependencies

After migration, you can remove these dependencies if not used elsewhere:
```json
{
  "dependencies": {
    "@neondatabase/serverless": "^0.9.5", // Remove
    "bcryptjs": "^2.4.3",                  // Remove  
    "jsonwebtoken": "^9.0.2",              // Remove
    "@types/bcryptjs": "^2.4.6",           // Remove
    "@types/jsonwebtoken": "^9.0.7"        // Remove
  }
}
```

## 📁 File Changes

### New Files Created:
- `lib/appwrite.ts` - Appwrite server configuration
- `lib/appwrite-auth.ts` - Appwrite authentication helpers
- `lib/appwrite-client.ts` - Client-side Appwrite configuration
- `setup-appwrite.sh` - Database setup script
- `.env.example` - Environment configuration template

### Modified Files:
- `app/api/auth/sign-up/route.ts` - Updated to use Appwrite Auth
- `app/api/auth/sign-in/route.ts` - Updated to use Appwrite Auth
- `app/api/auth/logout/route.ts` - Updated to use Appwrite Auth  
- `app/api/auth/me/route.ts` - Updated to use Appwrite Auth
- `app/api/articles/route.ts` - Updated to use Appwrite Database
- `app/api/save-article/route.ts` - Updated to use Appwrite Database
- `app/api/user-profile/route.ts` - Updated to use Appwrite Database
- `app/api/web-search/route.ts` - Updated imports
- `app/api/serp-analysis/route.ts` - Updated imports

### Files to Remove (After Testing):
- `lib/neon.ts` - Old database configuration
- `lib/auth.ts` - Old authentication system  
- `neon-schema.sql` - Old database schema
- `supabase-schema.sql` - Unused schema file

## ✅ Benefits After Migration

1. **Simplified Authentication**: No more JWT token management
2. **Real-time Capabilities**: Built-in real-time subscriptions  
3. **File Storage**: Ready for future file upload features
4. **Built-in Security**: Row-level security and permissions
5. **Scalability**: Managed infrastructure that scales automatically
6. **Reduced Code**: Less boilerplate authentication code

## 🆘 Troubleshooting

### Common Issues:

1. **Authentication not working**:
   - Check environment variables are correctly set
   - Verify Appwrite project ID and endpoint
   - Ensure API key has correct permissions

2. **Database operations failing**:
   - Check collection IDs match your configuration
   - Verify database permissions are set correctly
   - Ensure required attributes exist

3. **Session issues**:
   - Clear browser cookies
   - Check session cookie configuration  
   - Verify Appwrite endpoint accessibility

### Getting Help:
- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Discord Community](https://discord.gg/appwrite)  
- [Appwrite GitHub Issues](https://github.com/appwrite/appwrite/issues)

## 🎉 Migration Complete!

After successful migration, your Prowriter AI platform will be running on Appwrite with:
- ✅ User authentication and management
- ✅ Article storage and retrieval  
- ✅ Usage tracking and analytics
- ✅ Scalable backend infrastructure
- ✅ Built-in security features

The application functionality remains the same, but with a more robust and scalable backend!