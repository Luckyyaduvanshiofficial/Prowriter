# 🗄️ Appwrite Database Setup Guide

## Quick Setup (2 Minutes)

### Step 1: Go to Appwrite Console
Visit: https://cloud.appwrite.io (or your Appwrite endpoint)

### Step 2: Create Database
1. Click on **Databases** in the left sidebar
2. Click **Create Database**
3. Name it: `ProWriter` (or any name you prefer)
4. Click **Create**
5. **Copy the Database ID** (it will look like: `67234abc...`)

### Step 3: Create Articles Collection
1. Inside your database, click **Create Collection**
2. Name it: `articles`
3. Click **Create**
4. **Copy the Collection ID**

### Step 4: Add Attributes to Articles Collection
Click **Attributes** tab and add these one by one:

| Attribute Name | Type | Size | Required | Default |
|---------------|------|------|----------|---------|
| userId | String | 255 | ✅ Yes | - |
| title | String | 500 | ✅ Yes | - |
| content | String | 65535 | ✅ Yes | - |
| metaDescription | String | 500 | ❌ No | "" |
| topic | String | 500 | ❌ No | "" |
| modelA | String | 255 | ❌ No | "" |
| modelB | String | 255 | ❌ No | "" |
| useCase | String | 255 | ❌ No | "informative" |
| articleLength | String | 50 | ❌ No | "medium" |
| aiEngine | String | 255 | ❌ No | "gemini" |
| seoKeywords | String | 1000 | ❌ No | "" |
| targetAudience | String | 500 | ❌ No | "" |
| brandVoice | String | 100 | ❌ No | "friendly" |
| usedWebSearch | Boolean | - | ❌ No | false |
| usedSerpAnalysis | Boolean | - | ❌ No | false |
| wordCount | Integer | - | ❌ No | 0 |
| estimatedReadingTime | Integer | - | ❌ No | 0 |
| status | String | 50 | ❌ No | "draft" |
| createdAt | DateTime | - | ❌ No | - |
| updatedAt | DateTime | - | ❌ No | - |

### Step 5: Set Permissions
1. Go to **Settings** tab in your collection
2. Under **Permissions**, add:
   - **Create**: Any authenticated user
   - **Read**: User (select "User" role)
   - **Update**: User
   - **Delete**: User

### Step 6: Update .env File
Open your `.env` file and update:

```env
NEXT_PUBLIC_APPWRITE_DATABASE_ID=YOUR_DATABASE_ID_HERE
NEXT_PUBLIC_APPWRITE_ARTICLES_COLLECTION_ID=articles
```

Replace `YOUR_DATABASE_ID_HERE` with the actual Database ID from Step 2.

### Step 7: Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## ✅ Test It
1. Generate an article
2. Click "Save"
3. You should see: **"✅ Article saved successfully to database!"**

---

## 🚀 Alternative: Use the Setup Script

If you want to automate this, run:

```bash
node scripts/setup-appwrite.js
```

This will:
- ✅ Create the database
- ✅ Create the articles collection
- ✅ Set up all attributes
- ✅ Configure permissions
- ✅ Update your .env file

---

## 📊 Database Structure

```
ProWriter Database
└── articles (Collection)
    ├── userId (String) - User who created the article
    ├── title (String) - Article title
    ├── content (String) - Full HTML content
    ├── metaDescription (String) - SEO meta description
    ├── topic (String) - Article topic
    ├── modelA (String) - First AI model (for comparisons)
    ├── modelB (String) - Second AI model (for comparisons)
    ├── useCase (String) - Article type (how-to, guide, etc.)
    ├── articleLength (String) - Length category
    ├── aiEngine (String) - AI engine used
    ├── seoKeywords (String) - SEO keywords
    ├── targetAudience (String) - Target audience
    ├── brandVoice (String) - Writing tone
    ├── usedWebSearch (Boolean) - Web research enabled
    ├── usedSerpAnalysis (Boolean) - SERP analysis enabled
    ├── wordCount (Integer) - Total words
    ├── estimatedReadingTime (Integer) - Minutes to read
    ├── status (String) - draft/published
    ├── createdAt (DateTime) - Creation timestamp
    └── updatedAt (DateTime) - Last update timestamp
```

---

## 🔧 Troubleshooting

### Error: "Collection not found"
- Make sure the collection is named exactly `articles` (lowercase)
- Or update the collection ID in `.env`

### Error: "Database not found"
- Check if `NEXT_PUBLIC_APPWRITE_DATABASE_ID` in `.env` matches your actual database ID
- Database IDs are case-sensitive

### Error: "Permission denied"
- Ensure you've set up permissions in Step 5
- Make sure you're signed in to the app

### Still seeing "not saved to database"?
- Restart your development server after updating `.env`
- Clear browser cache
- Check console logs for detailed error messages

---

## 📝 Notes

- The `content` field is set to max size (65535) to store large articles
- All fields except `userId`, `title`, and `content` are optional
- Timestamps are automatically set by Appwrite
- You can add indexes later for better query performance

---

**Need help?** Check the console logs - they show detailed error messages!
