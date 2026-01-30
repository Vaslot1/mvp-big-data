# A/B Test: Telegram Emoji Pack Sales

A comprehensive A/B testing application for comparing pricing strategies on custom Telegram emoji pack sales.

## 🎯 Test Overview

**Objective:** Compare conversion rates between regular pricing and discounted pricing
- **Variant A:** Regular price ($14.99) - no discount
- **Variant B:** Discounted price ($12.74) - 15% off with "next purchase" messaging

## 📁 Project Structure

```
├── index.html          # Entry point with 50/50 traffic split
├── redirect.js         # Traffic splitting logic
├── test-a.html         # Variant A - Regular pricing
├── test-b.html         # Variant B - Discounted pricing
├── landing.js          # Shared logic and event tracking
├── style.css           # Responsive styling
├── Code.gs            # Google Apps Script endpoint
└── README.md          # This file
```

## 🚀 Features

### A/B Testing Engine
- **Random traffic splitting** with 50/50 distribution
- **Consistent user assignment** via localStorage
- **Clean isolation** of pricing variable (identical design)

### Event Tracking
- `page_view` - Landing on variant pages
- `view_pricing` - Pricing section visibility
- `cta_click` - Purchase button interactions  
- `conversion` - Completed purchases with revenue
- `emoji_interaction` - User engagement metrics

### Analytics & Reporting
- **Revenue tracking** by variant
- **Conversion rate calculations**
- **Click-through rate metrics**
- **Unique user counting**
- **Built-in reporting** in Google Apps Script

## 🛠️ Setup Instructions

### 1. GitHub Repository Setup

```bash
# Create new repository on GitHub first
# Then clone and add files:

git clone https://github.com/YOUR_USERNAME/telegram-emoji-ab-test.git
cd telegram-emoji-ab-test

# Add all project files
git add .
git commit -m "Initial commit: A/B test for emoji pack pricing"
git push origin main
```

### 2. GitHub Pages Deployment

1. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `main` and `/ (root)`
   - Click Save

2. **Access your site:**
   - Wait 1-2 minutes for deployment
   - Visit: `https://YOUR_USERNAME.github.io/telegram-emoji-ab-test/`

### 3. Google Apps Script Setup

1. **Create new Apps Script project:**
   - Visit [script.google.com](https://script.google.com)
   - Create new project
   - Replace default code with `Code.gs` contents

2. **Deploy as Web App:**
   - Click Deploy → New deployment
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Deploy
   - Copy the `/exec` URL

3. **Configure Web App URL:**
   - The Google Apps Script URL is already pre-configured
   - Visit: `https://YOUR_USERNAME.github.io/telegram-emoji-ab-test/config.html`
   - Click "Test Connection" to verify integration
   - The A/B test will work automatically

## 📊 Data Collection

### Tracked Metrics
- **Page views** by variant
- **Pricing section views**
- **CTA click-through rates**
- **Conversion rates**
- **Revenue by variant**
- **User engagement patterns**

### Google Sheets Integration
Data is automatically organized in `ab_test_logs` sheet with columns:
- Timestamp, Event type, Variant, User ID
- Revenue, Pricing details, Discount percentage
- Complete metadata for analysis

### Generate Reports
Use the `generateABTestReport()` function in Apps Script to get:
- Conversion rates by variant
- Revenue comparison
- User engagement metrics
- Click-through statistics

## 🎨 Design Features

- **Responsive design** for all devices
- **Professional emoji showcase**
- **Trust signals** (customer count, ratings)
- **Loading states** and user feedback
- **Smooth animations** and micro-interactions

## 🧪 Testing the Flow

1. **Visit your GitHub Pages URL**
2. **You'll be redirected** to Variant A or B
3. **Interact with the page** (scroll, click emojis)
4. **Test purchase flow** (simulated for demo)
5. **Check Google Sheets** for real-time data

## 📈 Expected Results

This test will help determine:
- Does 15% discount increase conversion rate?
- What's the revenue impact of discounting?
- Which pricing strategy has better ROI?
- User behavior patterns by variant

## 🔧 Customization

### Modify Pricing
Edit the `getPricingInfo()` function in `landing.js`:

```javascript
return {
    regular: 19.99,        // Change base price
    current: 16.99,        // Change current price
    discountPercent: 15     // Change discount percentage
};
```

### Add New Variants
1. Create `test-c.html` with new design
2. Update redirect.js probability logic
3. Add variant detection in landing.js

### Custom Events
Add new tracking events in `landing.js`:

```javascript
await sendLogSimple({
    event: 'custom_event_name',
    variant: getCurrentVariant(),
    userId: getUserId(),
    ts: Date.now(),
    meta: { /* custom data */ }
});
```

## 🚨 Important Notes

- **CORS-safe** implementation using simple requests
- **No external dependencies** - pure vanilla JavaScript
- **Privacy-focused** - only essential data collected
- **Mobile-optimized** responsive design
- **Accessibility** considered throughout

## 📞 Support

For issues or questions:
1. Check GitHub Issues for this repository
2. Review Google Apps Script execution logs
3. Verify GitHub Pages deployment status

---

**Built with:** HTML5, CSS3, Vanilla JavaScript, Google Apps Script  
**Deployment:** GitHub Pages  
**Data Storage:** Google Sheets  
**License:** MIT