# Quick Start Guide - 15 Minutes to Your Virtual Closet

Follow these steps in order. Don't skip any!

## ✅ Step 1: GitHub Pages Setup (5 min)

1. Create GitHub account at [github.com](https://github.com)
2. Create new repository named `virtual-closet`
3. Make it **Public**
4. Upload all files from this folder
5. Go to Settings → Pages → Set source to "main" branch → Save
6. Wait 2 minutes, then visit: `https://YOUR-USERNAME.github.io/virtual-closet/`

**✓ Test**: Can you see the Virtual Closet website?

---

## ✅ Step 2: Cloudflare R2 Setup (10 min)

### Create Account & Bucket
1. Sign up at [cloudflare.com](https://cloudflare.com)
2. Go to R2 → Click "Purchase R2" → Choose **Free**
3. Create bucket named `virtual-closet`
4. Go to Settings → Public Access → **Allow Access**
5. Note your public URL: `https://pub-xxxxx.r2.dev`

### Get API Credentials
1. Go to R2 Overview → "Manage R2 API Tokens"
2. Create API token named `virtual-closet-app`
3. Permissions: **Object Read & Write**
4. Copy these 3 things (you won't see them again!):
   - ✍️ Account ID: `________________________________`
   - ✍️ Access Key ID: `________________________________`
   - ✍️ Secret Access Key: `________________________________`

**✓ Test**: Did you save all 3 credentials?

---

## ✅ Step 3: OpenAI API Setup (5 min)

1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Add billing → Add payment method → Add $10-20
3. Set monthly budget limit to $20 (prevents overspending)
4. Go to API Keys → Create new key → Copy it
   - ✍️ API Key (starts with `sk-`): `________________________________`

**💰 Expected cost**: $5-15/month

**✓ Test**: Did you copy the API key (starts with `sk-`)?

---

## ✅ Step 4: Weather API Setup (3 min)

1. Sign up at [weatherapi.com](https://weatherapi.com)
2. Copy your API key from dashboard
   - ✍️ Weather API Key: `________________________________`

**✓ Test**: Did you copy the weather API key?

---

## ✅ Step 5: Configure Your App (2 min)

1. Open your app: `https://YOUR-USERNAME.github.io/virtual-closet/`
2. Click **"Settings"**
3. Fill in all the fields:

   **OpenAI API Key**: (paste the `sk-` key from Step 3)

   **Weather API Key**: (paste key from Step 4)

   **Your Location**: `City, Country` (e.g., "Paris, France")

   **Cloudflare R2 Configuration**:
   - Account ID: (from Step 2)
   - Access Key ID: (from Step 2)
   - Secret Access Key: (from Step 2)
   - Bucket Name: `virtual-closet`
   - Public URL: `https://pub-xxxxx.r2.dev` (from Step 2)

4. Click **"Save Settings"**

**✓ Test**: Did you see "Settings saved!" message?

---

## ✅ Step 6: Add Your First Item (2 min)

1. Click **"My Closet"**
2. Click **"+ Add Item"**
3. Upload a photo of clothing (or paste an image URL)
4. Review auto-detected details (type, color, silhouette)
5. Click **"Save to Closet"**

**✓ Test**: Does your item appear in the closet grid?

---

## ✅ Step 7: Generate Your First Outfit (1 min)

1. Add at least 3-5 items to your closet (repeat Step 6)
2. Click **"Outfit Generator"**
3. Click **"✨ Generate Outfit"**
4. Vote 👍 or 👎 on the outfit

**✓ Test**: Did you see an AI-generated outfit?

---

## 🎉 You're Done!

Your Virtual Closet is ready! Here's what to do next:

### Immediate Next Steps:
1. **Add more items** (aim for 20-30 items for best results)
2. **Vote on 10+ outfits** so the AI learns your style
3. **Export your data** (Settings → Export) as backup
4. **Add events** to your calendar for the weekly planner

### Bookmark These:
- Your app: `https://YOUR-USERNAME.github.io/virtual-closet/`
- GitHub repo: `https://github.com/YOUR-USERNAME/virtual-closet`
- OpenAI usage: [platform.openai.com/usage](https://platform.openai.com/usage)

---

## 🆘 Troubleshooting

### "Images won't upload"
- Check all R2 credentials in Settings
- Make sure bucket is set to Public Access
- Try pasting an image URL instead

### "Generate Outfit" button does nothing
- Check OpenAI API key in Settings
- Check you have credits: [platform.openai.com/account/billing](https://platform.openai.com/account/billing)
- Open browser console (F12) to see error messages

### "Weather not showing"
- Check Weather API key in Settings
- Check location format: "City, Country"
- Try "London, UK" to test

### "Settings won't save"
- Check browser console for errors (F12)
- Try a different browser
- Make sure you're not in private/incognito mode

---

## 📞 Need Help?

1. **Re-read the full README.md** - it has detailed explanations
2. **Check browser console** (press F12) for error messages
3. **Open an issue** on GitHub with details about the problem

---

## 💡 Pro Tips

- **Photography**: Use natural light and plain backgrounds for best AI analysis
- **Batch upload**: Add 10-20 items in one session to build your closet quickly
- **Vote honestly**: The AI learns from your votes - be authentic!
- **Export monthly**: Back up your data regularly (Settings → Export)
- **Check costs**: Monitor OpenAI spending at platform.openai.com/usage

---

**Ready to use your Virtual Closet? Add items and start generating outfits! 🎨👗**
