# 🚀 Deployment Guide: A/B Test to GitHub Pages

This guide will walk you through deploying your Telegram Emoji Pack A/B test to GitHub Pages.

## 📋 Prerequisites

1. **GitHub Account** - Create one at [github.com](https://github.com)
2. **Git Installation** - Install from [git-scm.com](https://git-scm.com/)
3. **Google Account** - For Apps Script deployment

## 🎯 Step 1: Create GitHub Repository

1. **Visit [github.com/new](https://github.com/new)**
2. **Repository name:** `telegram-emoji-ab-test`
3. **Description:** `A/B Test for Telegram Emoji Pack Pricing`
4. **Visibility:** Public (or Private if preferred)
5. **⚠️ Important:** Do NOT initialize with README, license, or .gitignore

6. **Click "Create repository"**
7. **Copy the repository URL** (look like: `https://github.com/YOUR_USERNAME/telegram-emoji-ab-test.git`)

## 🎯 Step 2: Setup Local Repository

### Option A: Use Setup Script (Recommended)
```bash
# In your project directory, run:
setup.bat
# Follow the prompts to enter your repository URL
```

### Option B: Manual Git Commands
```bash
# In your project directory:
git init
git add .
git commit -m "Initial commit: A/B test for emoji pack pricing"
git remote add origin https://github.com/YOUR_USERNAME/telegram-emoji-ab-test.git
git push -u origin main
```

## 🎯 Step 3: Enable GitHub Pages

1. **Go to your repository on GitHub**
2. **Click Settings tab**
3. **Scroll down to "Pages" section**
4. **Source:** Deploy from a branch
5. **Branch:** `main` → `/ (root)`
6. **Click Save**

7. **Wait 1-2 minutes** for deployment
8. **Visit:** `https://YOUR_USERNAME.github.io/telegram-emoji-ab-test/`

## 🎯 Step 4: Setup Google Apps Script

### Create Apps Script Project
1. **Visit [script.google.com](https://script.google.com)**
2. **Click "New Project"**
3. **Delete default code** in the editor
4. **Copy contents** from our `Code.gs` file
5. **Paste into Apps Script editor**
6. **Save project** (Ctrl+S or File → Save)

### Deploy as Web App
1. **Click "Deploy" → "New deployment"**
2. **Click gear icon** → "Web app"
3. **Description:** "A/B Test Data Collection"
4. **Execute as:** Me
5. **Who has access:** Anyone
6. **Click "Deploy"**

7. **Authorize permissions** when prompted
8. **Copy the Web App URL** (ends with `/exec`)
   - Example: `https://script.google.com/macros/s/abcdef12345/exec`

## 🎯 Step 5: Configure Web App URL

1. **Visit your GitHub Pages site**
2. **You'll see the original Event Logger interface**
3. **Paste your Web App URL** in the input field
4. **Click "Save URL"**
5. **You should see "URL saved successfully"**

## 🎯 Step 6: Test Your A/B Test

1. **Visit:** `https://YOUR_USERNAME.github.io/telegram-emoji-ab-test/`
2. **You should see** the redirect animation, then be sent to Variant A or B
3. **Interact with the page** - scroll, click emojis, click purchase button
4. **Check your Google Sheet** (in Apps Script) to see incoming data

## 📊 Verify Data Collection

1. **Open your Apps Script project**
2. **Go to "Extensions" → "Apps Script Dashboard"**
3. **Find your spreadsheet** (usually named "Untitled Spreadsheet")
4. **Open the "ab_test_logs" sheet**
5. **You should see incoming data** as users interact with your site

## 🧪 Test Both Variants Manually

To test both variants:
1. **Visit:** `https://YOUR_USERNAME.github.io/telegram-emoji-ab-test/test-a.html`
2. **Then visit:** `https://YOUR_USERNAME.github.io/telegram-emoji-ab-test/test-b.html`

## 🚨 Common Issues & Solutions

### Issue: "Site not found"
- **Solution:** Wait 5-10 minutes after enabling Pages, deployment takes time

### Issue: "Missing Web App URL" error
- **Solution:** Make sure you configured the URL using the original index.html interface

### Issue: "HTTP 403" errors
- **Solution:** Check that your Apps Script is deployed as "Who has access: Anyone"

### Issue: "No data in Google Sheet"
- **Solution:** Check Apps Script execution logs for errors

### Issue: Git push fails
- **Solution:** Make sure you created repository as instructed (no README initialization)

## 📈 Next Steps

Once deployed:
1. **Drive traffic** to your main URL (the redirect page)
2. **Monitor data** collection in Google Sheets
3. **Run the test** for statistically significant period
4. **Analyze results** using the built-in report function

## 🔧 Generate Reports

In your Apps Script editor:
1. **Press Ctrl+Enter** or click "Run"
2. **Select "generateABTestReport"**
3. **Check the execution log** for results

## 🎉 Success!

Your A/B test is now live and collecting data! You can:
- Monitor real-time conversions
- Compare Variant A vs B performance
- Make data-driven decisions about pricing strategy

---

**Need help?** Check the main README.md file or create an issue in your GitHub repository.