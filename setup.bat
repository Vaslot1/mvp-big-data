@echo off
echo ========================================
echo Setting up A/B Test GitHub Repository
echo ========================================
echo.

REM Check if git is available
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo.
echo Please follow these steps to complete setup:
echo.
echo 1. Create a new repository on GitHub:
echo    - Visit https://github.com/new
echo    - Repository name: telegram-emoji-ab-test
echo    - Description: A/B Test for Telegram Emoji Pack Pricing
echo    - Make it Public
echo    - DO NOT initialize with README (we already have one)
echo.
echo 2. After creating the repository, copy its URL
echo    It should look like: https://github.com/YOUR_USERNAME/telegram-emoji-ab-test.git
echo.
set /p repo_url="Enter your repository URL: "

if "%repo_url%"=="" (
    echo ERROR: Repository URL is required
    pause
    exit /b 1
)

echo.
echo Initializing git repository...
git init

echo.
echo Adding all files...
git add .

echo.
echo Creating initial commit...
git commit -m "Initial commit: A/B test for emoji pack pricing

- Created 50/50 traffic splitting engine
- Implemented Variant A (regular pricing) and Variant B (discounted pricing)
- Added comprehensive event tracking system
- Set up Google Apps Script integration with revenue tracking
- Created responsive design with emoji showcase
- Added user engagement metrics and conversion tracking"

echo.
echo Adding remote repository...
git remote add origin %repo_url%

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo Repository setup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Enable GitHub Pages in repository settings
echo 2. Set up Google Apps Script with Code.gs
echo 3. Configure Web App URL on your site
echo.
echo Your site will be available at:
echo https://YOUR_USERNAME.github.io/telegram-emoji-ab-test/
echo.
echo See README.md for detailed instructions
echo.
pause