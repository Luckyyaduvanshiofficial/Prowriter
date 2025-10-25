# Testing Article Count Fix

## Quick Test Steps

### 1. Check Current Count
1. Open the app and go to `/blog-writer` or `/dashboard`
2. Note the current article count (e.g., "23/25 used today")
3. Note your user ID in browser console

### 2. Generate Article
1. Go to `/blog-writer` page
2. Fill in the topic (e.g., "AI in Healthcare")
3. Click "Generate Article"
4. Wait for generation to complete
5. **Check the count increases by 1** (should show "24/25 used today")

### 3. Reload Page Test
1. After article is generated, **reload the page** (F5 or Ctrl+R)
2. **Verify count is still correct** (should still show "24/25 used today")
3. This is the critical test - previously it would reset

### 4. Generate Another Article
1. Generate another article
2. Count should increase to "25/25 used today"
3. Reload page again
4. Count should still be "25/25 used today"

### 5. Verify Database (Optional)
If you have Appwrite console access:
1. Go to Appwrite Console → Databases → Users collection
2. Find your user document
3. Check these fields:
   - `articlesGeneratedToday` - should match UI count
   - `lastGenerationDate` - should be today's date

## Expected Results

### ✅ PASS Criteria
- Count increases after each generation
- Count persists after page reload
- Database shows correct count
- Daily limit is enforced properly

### ❌ FAIL Criteria  
- Count resets to old value after reload
- Database not updated
- Can generate more articles than daily limit

## Browser Console Logs to Watch

Look for these success messages in console:
```
✅ Updated article count for user {userId}: {newCount}
✅ Profile reloaded with updated count: {count}
```

## Troubleshooting

### If count still resets after reload:
1. Check browser console for errors
2. Verify userId is being passed to API
3. Check Appwrite database permissions
4. Verify `getUserProfile` and `updateUserProfile` functions work

### If count doesn't increase:
1. Check API route is receiving userId
2. Check database update isn't failing silently
3. Verify Appwrite connection is working

## Test with Different Scenarios

### Test 1: Free User (5/day limit)
- Start with 3 articles
- Generate 2 more articles
- Should reach 5/5 limit
- Should block further generation

### Test 2: Pro User (25/day limit)  
- Generate multiple articles
- Count should increase each time
- Verify all counts persist after reload

### Test 3: New Day Reset
- Check count at end of day
- Next day, first generation should reset to 1
- `lastGenerationDate` should update to new date
