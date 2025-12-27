# Detailed API Setup Guide

This guide walks you through setting up each API service with step-by-step instructions.

---

## 1. Cloudflare R2 Setup

### Why R2?
- **Free**: 10GB storage free forever
- **Fast**: Cloudflare's global network
- **Reliable**: Enterprise-grade storage
- **Perfect for**: Storing thousands of clothing photos

### Step-by-Step Setup

#### A. Create Cloudflare Account

1. Visit [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
2. Enter your email and create a password
3. Verify your email address
4. Log in to the Cloudflare dashboard

#### B. Enable R2

1. In the Cloudflare dashboard, look at the left sidebar
2. Click on **"R2"** (you might need to scroll down)
3. Click **"Purchase R2"** (don't worry - free tier is included!)
4. Review the pricing:
   - First 10GB: **FREE**
   - First 1M Class A operations/month: **FREE**
   - First 10M Class B operations/month: **FREE**
5. Click **"Continue with Free"** or **"Enable R2"**

#### C. Create a Bucket

1. Click **"Create bucket"** button (blue button on the right)
2. Bucket name: `virtual-closet` (or choose your own name)
   - Must be lowercase
   - No spaces
   - Only letters, numbers, hyphens
3. Location: Choose **"Automatic"** (recommended)
4. Click **"Create bucket"**

#### D. Make Bucket Public

**Important**: Your images need to be publicly accessible!

1. Click on your `virtual-closet` bucket from the list
2. Click the **"Settings"** tab at the top
3. Scroll down to **"Public Access"** section
4. Click **"Allow Access"** or **"Connect Domain"**
5. You'll see a public URL like: `https://pub-xxxxxxxxxxxxxx.r2.dev`
6. **Copy this URL** - you'll need it later!

Alternative method (custom domain):
- If you have a domain in Cloudflare, you can connect it
- Go to Settings → R2.dev subdomain → Allow Access
- Or connect a custom domain for nicer URLs

#### E. Create API Tokens

1. Click **"R2"** in the left sidebar to go back to R2 Overview
2. Click **"Manage R2 API Tokens"** button on the right
3. Click **"Create API Token"**
4. Fill in the form:
   - **Token name**: `virtual-closet-app`
   - **Permissions**: Select **"Object Read & Write"**
   - **Specify bucket(s)**: (Optional) Select your `virtual-closet` bucket
   - **TTL**: Leave blank or set to "Forever"
5. Click **"Create API Token"**

6. **CRITICAL**: You'll see three pieces of information:
   ```
   Access Key ID: xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Secret Access Key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

7. **Copy these immediately!** You can't see the Secret Access Key again!

   Save in a text file:
   ```
   CLOUDFLARE R2 CREDENTIALS
   ========================
   Account ID: [Find this in your R2 dashboard URL]
   Access Key ID: [paste here]
   Secret Access Key: [paste here]
   Bucket Name: virtual-closet
   Public URL: https://pub-xxxxxx.r2.dev
   ```

8. **Find your Account ID**:
   - Look at your browser URL when viewing R2 dashboard
   - URL format: `https://dash.cloudflare.com/[ACCOUNT_ID]/r2/overview`
   - The long string of numbers/letters is your Account ID
   - Copy it to your credentials file

#### F. Test Your Setup

You can test if R2 is working using curl (optional):

```bash
# List buckets (to verify credentials)
curl https://[ACCOUNT_ID].r2.cloudflarestorage.com \
  -H "Authorization: Bearer [ACCESS_KEY]"
```

Or just wait to test it in the app!

---

## 2. OpenAI API Setup

### Why OpenAI?
- **Powerful AI**: GPT-4 for smart outfit suggestions
- **Vision API**: Can analyze clothing photos
- **Learning**: Gets better with your preferences
- **Pay-as-you-go**: Only pay for what you use

### Cost Breakdown
- **GPT-4o-mini** (what this app uses): ~$0.30 per 1M input tokens
- **Average costs**:
  - Analyze 1 photo: ~$0.01
  - Generate 1 outfit: ~$0.02
  - Generate weekly plan: ~$0.05
  - Monthly usage (active user): $5-15

### Step-by-Step Setup

#### A. Create OpenAI Account

1. Visit [platform.openai.com/signup](https://platform.openai.com/signup)
2. Sign up with:
   - Email address, OR
   - Google account, OR
   - Microsoft account
3. Verify your email
4. Complete the account setup

#### B. Add Billing Information

**You must add billing to use the API!**

1. Log in to [platform.openai.com](https://platform.openai.com)
2. Click your profile icon (top right)
3. Click **"Settings"**
4. Click **"Billing"** in the left sidebar
5. Click **"Add payment method"**
6. Enter your credit/debit card information
7. Add initial credit:
   - Click **"Add to credit balance"**
   - Recommended: $10-20 to start
   - This is a prepaid balance

#### C. Set Up Usage Limits (Prevent Overspending!)

**Highly recommended!**

1. Still in Settings → Billing
2. Click **"Limits"** tab
3. Set **"Hard limit"**:
   - Enter: `$20` (or your preferred monthly max)
   - This stops all API calls when you hit this amount
4. Set **"Soft limit"**:
   - Enter: `$10` (or 50% of your hard limit)
   - You'll get an email warning at this amount
5. Enable email notifications
6. Click **"Save"**

#### D. Create API Key

1. Click on **"API keys"** in the left sidebar (or visit [platform.openai.com/api-keys](https://platform.openai.com/api-keys))
2. Click **"+ Create new secret key"** button
3. Fill in the form:
   - **Name**: `virtual-closet` (so you remember what it's for)
   - **Permissions**: Leave as default (All)
   - **Project**: Default project (or create a specific one)
4. Click **"Create secret key"**
5. **COPY THE KEY IMMEDIATELY!** It looks like:
   ```
   sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
6. **You cannot see it again!** Store it safely:
   ```
   OPENAI API CREDENTIALS
   =====================
   API Key: sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Created: [today's date]
   Purpose: Virtual Closet app
   ```

#### E. Monitor Your Usage

Keep track of spending:

1. Go to [platform.openai.com/usage](https://platform.openai.com/usage)
2. View:
   - Current month's usage
   - Costs per day
   - Costs per model
   - Request counts
3. Check this weekly at first to understand your usage patterns

#### F. Tips to Reduce Costs

- Use **GPT-4o-mini** instead of GPT-4 (already set in the app)
- Don't generate outfits excessively (only when you need them)
- Vote on outfits - the better trained the AI, the fewer regenerations
- Batch operations (plan weekly instead of daily)

---

## 3. WeatherAPI Setup

### Why WeatherAPI?
- **Free tier**: 1 million calls/month
- **No credit card**: Truly free
- **Reliable**: 7-day forecast included
- **Global coverage**: Works anywhere

### Step-by-Step Setup

#### A. Create Account

1. Visit [www.weatherapi.com](https://www.weatherapi.com)
2. Click **"Sign Up"** or **"Pricing"** → **"Free"**
3. Fill in the form:
   - Email address
   - Password
   - Name
4. Click **"Register"**
5. Check your email and verify your account

#### B. Get API Key

1. Log in to [www.weatherapi.com](https://www.weatherapi.com)
2. You'll see your dashboard
3. Your **API key** is displayed prominently at the top:
   ```
   Your API Key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. Click **"Copy"** or select and copy it
5. Save it:
   ```
   WEATHERAPI CREDENTIALS
   =====================
   API Key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Plan: Free (1M calls/month)
   ```

#### C. Understand Free Tier Limits

Your free account includes:
- **1,000,000 calls per month** (way more than needed!)
- **Current weather**: Real-time conditions
- **7-day forecast**: Perfect for weekly planning
- **Location search**: Autocomplete city names

You'll likely use ~100-300 calls per month with this app.

#### D. Test Your API Key (Optional)

Test in browser:
```
https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=London
```

Replace `YOUR_API_KEY` with your actual key.

You should see JSON response with London's weather!

#### E. Finding Your Location

The app needs your location in this format: `City, Country`

**Examples**:
- ✅ `New York, USA`
- ✅ `Paris, France`
- ✅ `Tokyo, Japan`
- ✅ `London, UK`
- ✅ `Sydney, Australia`
- ❌ `NYC` (too vague)
- ❌ `Paris, TX` (specify USA if not France)

**Tips**:
- Use the major city name
- Include country to avoid ambiguity
- Check [weatherapi.com/docs](https://www.weatherapi.com/docs/) for location search examples

---

## 4. Entering Credentials in the App

Once you have all API keys, here's how to configure your Virtual Closet app:

### Step-by-Step

1. **Open your deployed app**:
   ```
   https://YOUR-USERNAME.github.io/virtual-closet/
   ```

2. **Click "Settings"** in the top navigation bar

3. **Fill in each section carefully**:

   #### OpenAI API Configuration
   - **OpenAI API Key**: Paste your `sk-proj-xxxxx` key
   - Should start with `sk-proj-` or `sk-`

   #### Weather API Configuration
   - **Weather API Key**: Paste your WeatherAPI key (32 characters)
   - **Your Location**: Enter `City, Country` (e.g., "Paris, France")

   #### Cloudflare R2 Configuration
   - **Account ID**: Your R2 account ID (from R2 dashboard URL)
   - **Access Key ID**: The access key from API token creation
   - **Secret Access Key**: The secret key from API token creation
   - **Bucket Name**: `virtual-closet` (or whatever you named your bucket)
   - **Public URL**: Your bucket's public URL (e.g., `https://pub-xxxxx.r2.dev`)

4. **Double-check everything**:
   - No extra spaces
   - Complete keys (not cut off)
   - Correct bucket name
   - Valid public URL

5. **Click "Save Settings"**

6. **Look for confirmation**: You should see "Settings saved!" notification

### Verify It's Working

#### Test R2 Image Upload:
1. Go to "My Closet"
2. Click "+ Add Item"
3. Upload a photo
4. If it works, R2 is configured correctly!

#### Test OpenAI:
1. Add at least 3 items to your closet
2. Go to "Outfit Generator"
3. Click "Generate Outfit"
4. If you see an outfit, OpenAI is working!

#### Test Weather:
1. Go to "Weekly Planner"
2. Check if weather forecast appears
3. If you see 7-day forecast, Weather API is working!

---

## Security Best Practices

### Protect Your API Keys

1. **Never share your keys**:
   - Don't post on social media
   - Don't commit to public GitHub repos
   - Don't share screenshots showing keys

2. **If keys are exposed**:
   - **OpenAI**: Delete the key and create a new one immediately
   - **R2**: Revoke the token and create a new one
   - **WeatherAPI**: Regenerate your key in dashboard

3. **Regular rotation**:
   - Consider rotating keys every 6-12 months
   - Update the app when you rotate

4. **Monitor usage**:
   - **OpenAI**: Check [platform.openai.com/usage](https://platform.openai.com/usage) weekly
   - **R2**: Check [R2 dashboard](https://dash.cloudflare.com) monthly
   - **WeatherAPI**: Check dashboard monthly

5. **Set spending limits**:
   - OpenAI: Hard limit of $20/month
   - Get email alerts at 50% and 100%
   - Review charges monthly

---

## Troubleshooting API Issues

### Cloudflare R2 Issues

**Problem**: "Upload failed"
- **Check**: All credentials are entered correctly
- **Check**: Bucket exists and is public
- **Check**: API token has Read & Write permissions
- **Solution**: Try regenerating the API token

**Problem**: "Can't see uploaded images"
- **Check**: Bucket is set to Public Access
- **Check**: Public URL is correct
- **Solution**: Use the r2.dev domain, not a custom domain unless fully set up

### OpenAI Issues

**Problem**: "API request failed"
- **Check**: API key is correct (starts with `sk-`)
- **Check**: You have billing set up
- **Check**: You have credit balance
- **Check**: You haven't hit your usage limit
- **Solution**: Add more credit or increase limits

**Problem**: "Outfit generation is slow"
- **Normal**: Can take 5-15 seconds
- **Check**: Your internet connection
- **Wait**: GPT-4 can take time for complex requests

### WeatherAPI Issues

**Problem**: "Weather API request failed"
- **Check**: API key is correct (32 characters)
- **Check**: Location format is correct (`City, Country`)
- **Check**: You haven't exceeded 1M calls (very unlikely!)
- **Solution**: Try a different city like "London, UK" to test

**Problem**: "Location not found"
- **Use**: Major city names
- **Format**: `City, Country`
- **Example**: Try "New York, USA" instead of "NYC"

---

## Cost Monitoring Checklist

Use this monthly checklist to monitor costs:

### Monthly Review (First Week of Month)

- [ ] Check OpenAI usage: [platform.openai.com/usage](https://platform.openai.com/usage)
  - Last month's total: $______
  - Current trend: $______/month
  - Adjust usage if needed

- [ ] Check R2 usage: Cloudflare Dashboard → R2 → Usage
  - Storage used: ______ GB (free up to 10GB)
  - Operations: ______ (free up to 1M Class A)

- [ ] Check WeatherAPI usage: Dashboard
  - Calls used: ______ (free up to 1M)
  - Should be under 500 calls/month for typical use

- [ ] Review total monthly cost: $______
  - Target: $5-15/month
  - Adjust usage if exceeding budget

---

## Getting Help

If you're stuck:

1. **Re-read this guide** - follow each step carefully
2. **Check the main README.md** - has additional troubleshooting
3. **Browser console** - press F12 to see error messages
4. **API provider support**:
   - OpenAI: [help.openai.com](https://help.openai.com)
   - Cloudflare: [community.cloudflare.com](https://community.cloudflare.com)
   - WeatherAPI: [weatherapi.com/contact](https://www.weatherapi.com/contact.aspx)

---

**You're all set! Return to the main README or QUICK_START guide to continue setting up your app.**
