# Articles Dashboard - User Guide

## Overview

The Articles Dashboard provides a centralized location to view, manage, and organize all your generated articles.

## Features

### 📊 Dashboard Integration
- **Quick Access**: Click "Article History" from the dashboard Quick Actions
- **Recent Articles**: View your 5 most recent articles on the dashboard
- **Statistics**: See total articles count in your dashboard stats

### 📝 Articles Page (`/articles`)

#### View Articles
- **List View**: All your saved articles displayed in a clean card layout
- **Article Details**: Each article shows:
  - Title and description
  - Article type badge (Comparison, How-To, Guide, etc.)
  - AI Engine used (Gemini, GPT, etc.)
  - Word count
  - Creation date

#### Article Actions
- **Preview**: View full article content in a modal
- **Copy**: Copy article content to clipboard
- **Download**: Download article as HTML file
- **Delete**: Remove article from database (with confirmation)

#### Pagination
- Navigate through articles with Previous/Next buttons
- Shows current page and total pages
- 10 articles per page by default

## How to Access

### From Dashboard
1. Navigate to `/dashboard`
2. Click "Article History" in Quick Actions section
3. Or click "View All" under Recent Articles

### Direct URL
- Visit `/articles` to go directly to the articles page

## Article Information Display

Each article card shows:
- **Title**: The main title of your article
- **Description**: Meta description or topic
- **Type Badge**: Article category (color-coded)
  - Blue: Comparison articles
  - Green: How-To guides
  - Purple: General guides
  - Orange: News articles
  - Gray: Informative content
- **Engine Badge**: AI model used to generate
- **Word Count**: Total words in article
- **Date**: When the article was created

## Managing Articles

### Preview Article
1. Click the **Preview** button on any article
2. View full content in a modal window
3. Copy or download from the preview modal
4. Click **Close** to return to list

### Copy Article
1. Click the **Copy** button
2. Article content copied to clipboard
3. Confirmation alert appears
4. Paste anywhere you need it

### Download Article
1. Click the **Download** button
2. Article downloads as `.html` file
3. Filename based on article title
4. Open in browser or text editor

### Delete Article
1. Click the trash icon (🗑️)
2. Confirm deletion in popup
3. Article removed from database
4. Cannot be undone!

## Empty State

If you have no articles yet:
- Helpful message displayed
- "Create Your First Article" button
- Links to blog writer tool

## Error Handling

### Connection Errors
- Error banner displays if articles fail to load
- **Retry** button to attempt reload
- **Dismiss** to hide error banner

### Database Issues
If you see "Database not configured" error:
1. Run: `npm run update:articles-schema`
2. Or: `fix-articles-database.bat`
3. Restart dev server
4. Refresh page

## Dashboard Recent Articles

The dashboard shows your 5 most recent articles:
- Click any article to go to articles page
- View article details inline
- Status badge shows article state
- Click "View All" to see complete list

## Tips

1. **Regular Backups**: Download important articles regularly
2. **Organization**: Use descriptive titles for easy searching
3. **Clean Up**: Delete old test articles to keep list manageable
4. **Preview First**: Preview before copying to ensure formatting
5. **Quick Access**: Bookmark `/articles` for faster access

## Keyboard Shortcuts

- **Ctrl+C** (on article card): Copy article content
- **Escape** (in preview modal): Close preview
- **Tab**: Navigate between buttons

## API Endpoints Used

The articles page uses these APIs:
- `GET /api/articles?userId={id}&page={n}&limit={n}` - Fetch articles
- `DELETE /api/articles?id={id}&userId={id}` - Delete article

## Troubleshooting

### Articles Not Showing
- Check if database is configured
- Verify articles were actually saved
- Check browser console for errors
- Run `npm run check:database` to verify setup

### Can't Delete Articles
- Ensure you're logged in
- Check user ID matches article owner
- Verify database permissions

### Preview Not Working
- Check article content is valid HTML
- Ensure browser allows popups
- Try refreshing the page

## Related Pages

- `/dashboard` - Main dashboard with stats
- `/blog-writer` - Create new articles
- `/generate` - Alternative article generator
- `/canvas-writer` - Canvas-based editor

## Database Schema

Articles are stored with these fields:
- `userId` - Owner of the article
- `title` - Article title
- `content` - Full HTML content
- `metaDescription` - SEO description
- `topic` - Article topic
- `aiEngine` - AI model used
- `useCase` - Article type
- `wordCount` - Number of words
- `status` - Draft/Published
- `createdAt` - Creation timestamp
- And more...

## Future Enhancements

Planned features:
- Search and filter articles
- Sort by date, title, or word count
- Bulk operations (delete multiple)
- Export to PDF
- Share articles via link
- Article editing
- Categories and tags
