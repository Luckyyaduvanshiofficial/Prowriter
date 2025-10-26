@echo off
echo ===============================================
echo   FIXING ARTICLES DATABASE ISSUE
echo ===============================================
echo.
echo Step 1: Checking current database status...
echo.
call npm run check:database
echo.
echo ===============================================
echo Step 2: Updating Articles collection schema...
echo ===============================================
echo.
call npm run update:articles-schema
echo.
echo ===============================================
echo Step 3: Verifying the fix...
echo ===============================================
echo.
call npm run verify:setup
echo.
echo ===============================================
echo   FIX COMPLETE!
echo ===============================================
echo.
echo Next steps:
echo 1. Restart your dev server if it's running
echo 2. Try generating and saving an article
echo 3. Check console for "Article saved successfully"
echo.
pause
