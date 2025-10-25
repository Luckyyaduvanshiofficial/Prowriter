# Prowriter AI - Appwrite Setup Guide

This project has been migrated to use **Appwrite** as the Backend-as-a-Service (BaaS) platform, replacing the previous Neon Database and custom JWT authentication.

## 🚀 Quick Setup Steps

### 1. Install Dependencies

```bash
npm install
```

The following Appwrite packages have been added:
- `appwrite` - Client SDK for browser usage
- `node-appwrite` - Server SDK for API routes

### 2. Set Up Appwrite Project

1. **Create an Appwrite Account**
   - Go to [https://cloud.appwrite.io](https://cloud.appwrite.io)
   - Sign up for a free account

2. **Create a New Project**
   - Click "Create Project"
   - Name it "Prowriter" (or your choice)
   - Copy your Project ID

3. **Get Your Project ID**
   - In your project dashboard, go to Settings
   - Copy the Project ID

4. **Create an API Key**
   - Go to Settings > API Keys
   - Click "Create API Key"
   - Name: "Prowriter Server Key"
   - Scopes: Select ALL of the following:
     - `databases.read`
     - `databases.write`
     - `collections.read`
     - `collections.write`
     - `attributes.read`
     - `attributes.write`
     - `documents.read`
     - `documents.write`
     - `users.read`
     - `users.write`
   - Click "Create"
   - **Copy the API Key** (you won't be able to see it again!)

### 3. Create Database and Collections

#### A. Create Database
1. Go to "Databases" in the left sidebar
2. Click "Create database"
3. Database ID: `prowriter_db`
4. Name: "Prowriter Database"
5. Click "Create"

#### B. Create "users" Collection
1. Inside your database, click "Create collection"
2. Collection ID: `users`
3. Name: "Users"
4. Click "Create"

5. **Add Attributes** (click "Create attribute" for each):

   | Name | Type | Size | Required | Default | Array |
   |------|------|------|----------|---------|-------|
   | `userId` | String | 255 | ✅ Yes | - | No |
   | `email` | Email | 320 | ✅ Yes | - | No |
   | `name` | String | 255 | ❌ No | - | No |
   | `plan` | Enum | - | ✅ Yes | `free` | No |
   | `articlesGeneratedToday` | Integer | - | ✅ Yes | `0` | No |
   | `lastGenerationDate` | DateTime | - | ❌ No | - | No |
   | `subscriptionStatus` | Enum | - | ✅ Yes | `inactive` | No |
   | `createdAt` | DateTime | - | ✅ Yes | - | No |
   | `updatedAt` | DateTime | - | ✅ Yes | - | No |

   **Enum Values:**
   - For `plan`: `free`, `pro`, `admin`
   - For `subscriptionStatus`: `active`, `inactive`, `cancelled`, `past_due`

6. **Set Permissions** (in collection settings):
   - Role: Any
     - Permissions: Read
   - Role: Users
     - Permissions: Create, Read, Update (own documents only)

#### C. Create "articles" Collection
1. Click "Create collection"
2. Collection ID: `articles`
3. Name: "Articles"
4. Click "Create"

5. **Add Attributes**:

   | Name | Type | Size | Required | Default | Array |
   |------|------|------|----------|---------|-------|
   | `userId` | String | 255 | ✅ Yes | - | No |
   | `title` | String | 500 | ✅ Yes | - | No |
   | `content` | String | 65535 | ✅ Yes | - | No |
   | `topic` | String | 255 | ❌ No | - | No |
   | `keywords` | String | 100 | ❌ No | - | Yes |
   | `aiModel` | String | 100 | ❌ No | - | No |
   | `wordCount` | Integer | - | ✅ Yes | `0` | No |
   | `createdAt` | DateTime | - | ✅ Yes | - | No |
   | `updatedAt` | DateTime | - | ✅ Yes | - | No |

6. **Set Permissions**:
   - Role: Users
     - Permissions: Create, Read, Update, Delete (own documents only)

### 4. Configure Environment Variables

Update your `.env.local` file with the following values:

```env
# ========================================
# APPWRITE CONFIGURATION
# ========================================
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
APPWRITE_API_KEY=your_api_key_here

# Database and Collection IDs
NEXT_PUBLIC_APPWRITE_DATABASE_ID=prowriter_db
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
NEXT_PUBLIC_APPWRITE_ARTICLES_COLLECTION_ID=articles

# ========================================
# AI PROVIDERS
# ========================================
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
TOGETHER_API_KEY=your_together_api_key_here

# ========================================
# SITE CONFIGURATION
# ========================================
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 What's Changed

### Removed
- ❌ Neon Database (`@neondatabase/serverless`)
- ❌ Custom JWT authentication (`jsonwebtoken`, `bcryptjs`)
- ❌ Direct database access files (`lib/neon.ts`)
- ❌ Database schema files (`neon-schema.sql`, `supabase-schema.sql`)

### Added
- ✅ Appwrite Client SDK (`appwrite`)
- ✅ Appwrite Server SDK (`node-appwrite`)
- ✅ Simplified authentication with Appwrite
- ✅ Cloud-hosted database (no setup required)
- ✅ Built-in user management

### Updated
- 🔄 `lib/appwrite.ts` - Appwrite configuration
- 🔄 `lib/auth.ts` - Authentication using Appwrite
- 🔄 `lib/auth-context.tsx` - Auth context with Appwrite
- 🔄 `package.json` - Dependencies fixed (date-fns downgraded to 3.6.0)

## 🔐 Authentication Features

The app now uses Appwrite's built-in authentication:

- ✅ Email/Password sign up
- ✅ Email/Password sign in
- ✅ Session management
- ✅ User profile storage
- ✅ Password reset (via Appwrite dashboard)
- ✅ Email verification (optional, configure in Appwrite)

## 🛠️ File Structure

```
lib/
├── appwrite.ts          # Appwrite client/server configuration
├── auth.ts              # Authentication functions
├── auth-context.tsx     # React context for auth state
└── ...other files

app/
├── sign-in/            # Sign in page
├── sign-up/            # Sign up page
└── ...other pages
```

## 🐛 Troubleshooting

### "Cannot find module 'appwrite'"
Run: `npm install` or `npm install appwrite node-appwrite`

### "Invalid credentials" or "Project not found"
- Double-check your Project ID in `.env.local`
- Ensure the endpoint is correct: `https://cloud.appwrite.io/v1`

### "Permission denied" errors
- Check collection permissions in Appwrite dashboard
- Ensure users have create/read/update permissions

### "Database/Collection not found"
- Verify database ID matches in `.env.local`
- Verify collection IDs match in `.env.local`
- Check that collections exist in Appwrite dashboard

## 📚 Additional Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Console](https://cloud.appwrite.io/console)
- [Next.js with Appwrite Guide](https://appwrite.io/docs/quick-starts/nextjs)

## 💡 Next Steps

1. Configure your AI API keys (OpenAI, Google AI, etc.)
2. Customize the user interface in the `app/` directory
3. Add more features to your content generation pipeline
4. Set up Appwrite's email templates for password reset
5. Configure OAuth providers (Google, GitHub, etc.) in Appwrite

## 🎉 You're All Set!

Your app is now running on Appwrite. No more manual database setup - everything is managed in the cloud!
