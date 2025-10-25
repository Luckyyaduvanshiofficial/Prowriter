# ✅ Setup Checklist

Use this checklist to ensure everything is properly configured.

## 📦 1. Dependencies

- [ ] Run `npm install` (or `pnpm install`)
- [ ] No errors during installation
- [ ] `node_modules` folder created
- [ ] Check: `ls node_modules/appwrite` exists
- [ ] Check: `ls node_modules/node-appwrite` exists

## 🔧 2. Appwrite Account Setup

- [ ] Created account at https://cloud.appwrite.io
- [ ] Email verified
- [ ] Can access Appwrite Console
- [ ] Created a new project
- [ ] Copied Project ID

## 🔑 3. API Key Creation

- [ ] Went to Settings → API Keys
- [ ] Created new API Key
- [ ] Named it (e.g., "Prowriter Server Key")
- [ ] Selected ALL these scopes:
  - [ ] `databases.read`
  - [ ] `databases.write`
  - [ ] `collections.read`
  - [ ] `collections.write`
  - [ ] `attributes.read`
  - [ ] `attributes.write`
  - [ ] `documents.read`
  - [ ] `documents.write`
  - [ ] `users.read`
  - [ ] `users.write`
- [ ] Copied and saved the API Key (safely!)

## 💾 4. Database Setup

- [ ] Went to "Databases" in sidebar
- [ ] Created database with ID: `prowriter_db`
- [ ] Database is visible in dashboard

## 📚 5. Collections Setup

### Users Collection
- [ ] Created collection with ID: `users`
- [ ] Added all 9 attributes:
  - [ ] `userId` (String, 255, required)
  - [ ] `email` (Email, 320, required)
  - [ ] `name` (String, 255, optional)
  - [ ] `plan` (Enum: free|pro|admin, required, default: free)
  - [ ] `articlesGeneratedToday` (Integer, required, default: 0)
  - [ ] `lastGenerationDate` (DateTime, optional)
  - [ ] `subscriptionStatus` (Enum: active|inactive|cancelled|past_due, required, default: inactive)
  - [ ] `createdAt` (DateTime, required)
  - [ ] `updatedAt` (DateTime, required)
- [ ] Set permissions:
  - [ ] Any: Read
  - [ ] Users: Create, Read, Update

### Articles Collection
- [ ] Created collection with ID: `articles`
- [ ] Added all 9 attributes:
  - [ ] `userId` (String, 255, required)
  - [ ] `title` (String, 500, required)
  - [ ] `content` (String, 65535, required)
  - [ ] `topic` (String, 255, optional)
  - [ ] `keywords` (String array, 100 each, optional)
  - [ ] `aiModel` (String, 100, optional)
  - [ ] `wordCount` (Integer, required, default: 0)
  - [ ] `createdAt` (DateTime, required)
  - [ ] `updatedAt` (DateTime, required)
- [ ] Set permissions:
  - [ ] Users: Create, Read, Update, Delete

## 🌍 6. Environment Variables

- [ ] Created `.env.local` file in root directory
- [ ] Added `NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1`
- [ ] Added `NEXT_PUBLIC_APPWRITE_PROJECT_ID=` (your project ID)
- [ ] Added `APPWRITE_API_KEY=` (your API key)
- [ ] Added `NEXT_PUBLIC_APPWRITE_DATABASE_ID=prowriter_db`
- [ ] Added `NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users`
- [ ] Added `NEXT_PUBLIC_APPWRITE_ARTICLES_COLLECTION_ID=articles`
- [ ] Added `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- [ ] Saved the file
- [ ] Double-checked no typos in variable names

## 🎨 7. Files Check

- [ ] `lib/appwrite.ts` exists and not empty
- [ ] `lib/auth.ts` exists and not empty
- [ ] `lib/auth-context.tsx` updated
- [ ] `package.json` has appwrite dependencies
- [ ] No TypeScript errors (or waiting for npm install)

## 🚀 8. Run the App

- [ ] Run `npm run dev`
- [ ] Server starts without errors
- [ ] Can access http://localhost:3000
- [ ] Homepage loads
- [ ] Can access `/sign-up` page
- [ ] Can access `/sign-in` page

## 🧪 9. Test Authentication

- [ ] Go to `/sign-up`
- [ ] Fill in the form:
  - Name: Test User
  - Email: test@example.com
  - Password: Test123456!
- [ ] Click "Sign Up"
- [ ] Check Appwrite Console → Auth → Users
- [ ] New user appears
- [ ] Check Database → users collection
- [ ] User profile document created
- [ ] Try signing in with same credentials
- [ ] Successfully signed in
- [ ] Can see user info in dashboard

## 🎯 10. Optional: Add AI Features

If you want AI content generation:

- [ ] Get OpenAI API key from https://platform.openai.com
- [ ] Add to `.env.local`: `OPENAI_API_KEY=your_key`
- [ ] Install AI packages: `npm install @ai-sdk/openai langchain`
- [ ] Test AI generation features

## 📝 Common Issues

### ❌ "Cannot find module 'appwrite'"
**Fix:** Run `npm install` again

### ❌ "Project not found"
**Fix:** Check `NEXT_PUBLIC_APPWRITE_PROJECT_ID` in `.env.local`

### ❌ "Invalid API key"
**Fix:** 
1. Check `APPWRITE_API_KEY` in `.env.local`
2. Regenerate API key in Appwrite Console
3. Make sure key has all required scopes

### ❌ "Collection not found"
**Fix:** Check collection IDs match in `.env.local` and Appwrite Console

### ❌ "Permission denied"
**Fix:** Review collection permissions in Appwrite Console

## ✨ You're Done!

When all checkboxes are ticked, your app is ready to use! 🎉

### Next Steps:
1. Customize the UI in `app/` directory
2. Add more features
3. Deploy to Vercel
4. Share with the world!

---

**Need help?** Check:
- `APPWRITE_SETUP.md` - Detailed guide
- `QUICK_START.md` - Quick reference
- `MIGRATION_SUMMARY.md` - What changed
- Appwrite Discord: https://appwrite.io/discord
