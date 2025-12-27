# Virtual Closet - AI-Powered Outfit Planner

A smart web application that helps you organize your wardrobe and get AI-powered outfit recommendations. Hosted for **FREE** on GitHub Pages with image storage on Cloudflare R2.

## Features

- **Digital Closet**: Upload photos of your clothing items and organize them by type, color, and silhouette
- **AI Outfit Generator**: Get personalized outfit combinations powered by ChatGPT
- **Smart Learning**: The app learns your style preferences as you vote on outfits
- **Weekly Planner**: Generate a full week of outfits based on your calendar events and weather forecast
- **Vision Boards**: Create organized collections for trips, special occasions, or packing lists
- **100% Free Hosting**: Runs entirely on GitHub Pages with no server costs

## Live Demo

Once deployed, your app will be at: `https://YOUR-USERNAME.github.io/virtual-closet/`

---

## Complete Setup Guide

### Prerequisites

- A GitHub account (free)
- A Cloudflare account (free)
- An OpenAI API account (paid, ~$5-10/month for typical use)
- A WeatherAPI account (free)

### Step 1: Set Up GitHub Pages (5 minutes)

1. **Create a GitHub account** (if you don't have one):
   - Go to [github.com](https://github.com)
   - Click "Sign up" and follow the steps

2. **Create a new repository**:
   - Click the "+" icon in the top-right corner
   - Select "New repository"
   - Name it: `virtual-closet`
   - Make it **Public** (required for free GitHub Pages)
   - Click "Create repository"

3. **Upload your files**:

   **Option A: Using GitHub's web interface (easiest for beginners)**
   - On your repository page, click "uploading an existing file"
   - Drag and drop ALL files from the `virtual-closet` folder
   - Make sure you include the `css/` and `js/` folders
   - Click "Commit changes"

   **Option B: Using Git command line**
   ```bash
   # Open Terminal (Mac) or Command Prompt (Windows)
   # Navigate to the virtual-closet folder
   cd /path/to/virtual-closet

   # Initialize git and upload
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/virtual-closet.git
   git push -u origin main
   ```
   Replace `YOUR-USERNAME` with your actual GitHub username.

4. **Enable GitHub Pages**:
   - In your repository, click "Settings" (top menu)
   - Scroll down and click "Pages" in the left sidebar
   - Under "Source", select "main" branch
   - Click "Save"
   - Wait 1-2 minutes, then refresh the page
   - You'll see: "Your site is live at https://YOUR-USERNAME.github.io/virtual-closet/"

5. **Visit your site**:
   - Click the link to open your Virtual Closet app!
   - Bookmark this URL - this is your app forever!

---

### Step 2: Set Up Cloudflare R2 for Image Storage (10 minutes)

Cloudflare R2 offers 10GB of free storage - perfect for thousands of clothing photos!

1. **Create a Cloudflare account**:
   - Go to [cloudflare.com](https://www.cloudflare.com)
   - Click "Sign up" (it's free!)
   - Verify your email

2. **Set up R2**:
   - Log in to Cloudflare dashboard
   - In the left sidebar, click "R2"
   - Click "Purchase R2" (don't worry, we'll use the free tier)
   - Click "Continue with Free"

3. **Create a bucket**:
   - Click "Create bucket"
   - Name: `virtual-closet` (or any name you prefer)
   - Location: Choose "Automatic" (recommended)
   - Click "Create bucket"

4. **Make bucket public** (so you can see your images):
   - Click on your `virtual-closet` bucket
   - Click "Settings" tab
   - Scroll to "Public Access"
   - Click "Allow Access"
   - Click "Connect Domain" (optional - or use the default r2.dev domain)
   - Note the public bucket URL - it looks like: `https://pub-xxxxx.r2.dev`

5. **Create API tokens**:
   - Go back to R2 Overview (click "R2" in left sidebar)
   - Click "Manage R2 API Tokens"
   - Click "Create API token"
   - Name: `virtual-closet-app`
   - Permissions: Select "Object Read & Write"
   - TTL: Leave as default
   - Click "Create API Token"
   - **IMPORTANT**: Copy these values immediately (you won't see them again!):
     - Access Key ID
     - Secret Access Key
     - Account ID (shown in the R2 dashboard URL)

6. **Save your credentials** (we'll use them in Step 5):
   - Account ID: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Access Key ID: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Secret Access Key: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Bucket Name: `virtual-closet`
   - Public URL: `https://pub-xxxxx.r2.dev`

---

### Step 3: Get OpenAI API Key (5 minutes)

This is the ONLY paid service. Typical usage costs $5-10/month.

1. **Create an OpenAI account**:
   - Go to [platform.openai.com](https://platform.openai.com)
   - Click "Sign up"
   - Verify your email

2. **Add billing**:
   - Go to [platform.openai.com/account/billing](https://platform.openai.com/account/billing)
   - Click "Add payment method"
   - Add a credit/debit card
   - Add $10-20 to start (you can add more later)
   - Set up usage limits to control spending:
     - Go to "Limits"
     - Set "Monthly budget" to $20 (or your preferred amount)
     - This prevents unexpected charges

3. **Create API key**:
   - Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Click "Create new secret key"
   - Name: `virtual-closet`
   - Click "Create secret key"
   - **COPY THE KEY** - it starts with `sk-`
   - You won't be able to see it again!

4. **Save your key**:
   - OpenAI API Key: `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**Cost Estimate**:
- Image analysis: ~$0.01 per item
- Outfit generation: ~$0.02 per outfit
- Weekly plan: ~$0.05 per plan
- Expected monthly cost: $5-15 depending on usage

---

### Step 4: Get Free Weather API Key (3 minutes)

1. **Create WeatherAPI account**:
   - Go to [weatherapi.com](https://www.weatherapi.com)
   - Click "Sign Up Free"
   - Fill in your details
   - Verify your email

2. **Get your API key**:
   - Log in to WeatherAPI dashboard
   - Your API key is displayed right on the dashboard
   - Copy it - it looks like: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

3. **Free tier includes**:
   - 1 million calls per month (way more than you need!)
   - 7-day forecast
   - Current weather
   - Perfect for this app

---

### Step 5: Configure Your App (5 minutes)

Now let's connect everything!

1. **Open your Virtual Closet app**:
   - Go to `https://YOUR-USERNAME.github.io/virtual-closet/`

2. **Click "Settings"** in the top navigation

3. **Enter your API credentials**:

   **OpenAI API Key**:
   - Paste your key (starts with `sk-`)

   **Weather API Key**:
   - Paste your WeatherAPI key

   **Your Location**:
   - Enter your city and country (e.g., "New York, USA" or "Paris, France")

   **Cloudflare R2 Configuration**:
   - Account ID: (from Step 2)
   - Access Key ID: (from Step 2)
   - Secret Access Key: (from Step 2)
   - Bucket Name: `virtual-closet` (or whatever you named it)
   - Public URL: Your bucket's public URL (e.g., `https://pub-xxxxx.r2.dev`)

4. **Click "Save Settings"**

5. **Done!** Your app is now fully configured!

---

## How to Use the App

### Adding Items to Your Closet

1. **Click "My Closet"** in the navigation
2. **Click "+ Add Item"**
3. **Upload an image**:
   - **From your device**: Click "Choose Files" and select a photo
   - **From a URL**: Paste an image URL and click "Fetch Image"
     - Tip: Right-click any image online and select "Copy Image Address"
4. **Review auto-detected details** (if using OpenAI):
   - The app will try to auto-detect the type, color, and silhouette
   - Edit if needed
5. **Fill in any missing details**:
   - Type (tops, bottoms, dresses, etc.)
   - Color
   - Silhouette (fitted, loose, oversized, etc.)
   - Notes (optional): Brand, material, occasion
6. **Click "Save to Closet"**

**Tips**:
- Take photos with good lighting against a plain background
- Photo from websites work great too!
- The AI auto-tagging saves tons of time

### Organizing Your Closet

Use the filters at the top:
- **Type filter**: Show only tops, bottoms, dresses, etc.
- **Color filter**: Filter by color
- **Silhouette filter**: Filter by fit
- **Search box**: Search by any keyword (type, color, notes)

### Generating Outfits

1. **Click "Outfit Generator"** in navigation
2. **Optional: Set preferences**:
   - Occasion (casual, work, formal, etc.)
   - Weather (hot, cold, rainy, etc.)
3. **Click "✨ Generate Outfit"**
4. **View your AI-generated outfit!**
   - See the complete outfit with all items
   - Read why the AI chose this combination
5. **Vote on the outfit**:
   - **👍 Love It**: Saves the outfit and teaches the AI you like this style
   - **👎 Not My Style**: Helps the AI learn what you don't like

**The more you vote, the better the AI gets at suggesting outfits you'll love!**

### Weekly Outfit Planner

1. **Click "Weekly Planner"**
2. **Add your events**:
   - Click "+ Add Event"
   - Enter event name (e.g., "Client meeting", "Dinner date")
   - Choose date and type
   - Click "Save Event"
3. **Click "🗓️ Plan My Week"**
4. **Get a complete 7-day outfit plan!**
   - Outfits matched to your events
   - Weather-appropriate clothing
   - Personalized to your style preferences

### Vision Boards

Perfect for planning trips or special occasions!

1. **Click "Vision Board"**
2. **Enter a board name**: e.g., "France Trip", "Work Clothes", "Summer Outfits"
3. **Select clothing types** to include (check multiple boxes)
4. **Click "+ New Board"**
5. **View all matching items** in a visual grid
6. **Use this to**:
   - Plan what to pack for trips
   - See all items of a specific type
   - Decide what to buy/donate

---

## Data Management

### Export Your Data (Backup)

1. Go to **Settings**
2. Click **"Export All Data"**
3. Save the JSON file to your computer
4. This backs up all your items, outfits, preferences, and events

### Import Data (Restore)

1. Go to **Settings**
2. Click **"Import Data"**
3. Select your backup JSON file
4. Confirm the import

### Clear All Data

⚠️ **Warning**: This deletes everything permanently!

1. Go to **Settings**
2. Click **"Clear All Data"**
3. Confirm twice
4. All data will be deleted

---

## Troubleshooting

### Images won't upload
- **Check R2 credentials**: Make sure all R2 settings are correct in Settings
- **Check bucket permissions**: Ensure your bucket allows public access
- **Fallback mode**: If R2 isn't configured, images are stored as data URLs (works but uses more browser storage)

### AI outfit generation fails
- **Check API key**: Verify your OpenAI API key in Settings
- **Check billing**: Make sure you have credits in your OpenAI account
- **Check internet**: The app needs internet to contact OpenAI's API
- **Try again**: Sometimes API requests fail - just click "Generate Outfit" again

### Weather not showing
- **Check API key**: Verify your WeatherAPI key in Settings
- **Check location**: Use format "City, Country" (e.g., "Paris, France")
- **Free tier limits**: If you hit 1M requests/month (unlikely!), weather will stop working

### Site not updating after changes
- **Clear browser cache**: Press Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- **Wait a few minutes**: GitHub Pages can take 1-5 minutes to update
- **Check GitHub**: Make sure your files uploaded correctly

### Data disappeared
- **Check browser**: Data is stored in your browser's localStorage
- **Don't clear browser data**: Clearing cookies/data will delete your closet
- **Use Export regularly**: Back up your data by exporting it
- **Try different browser**: See if data appears in another browser

---

## Privacy & Security

- **Your data stays on YOUR device**: Everything is stored in your browser's localStorage
- **No database**: There's no central server storing your data
- **API keys are private**: Your API keys are only stored in your browser
- **Images in R2**: Your images are stored in YOUR Cloudflare R2 bucket
- **No tracking**: This app doesn't track you or send data anywhere except:
  - OpenAI (for outfit generation)
  - WeatherAPI (for weather forecast)
  - Cloudflare R2 (for image storage)

### Important Security Notes

⚠️ **Keep your API keys secret**:
- Never share your API keys with anyone
- Don't post screenshots showing your API keys
- If exposed, regenerate them immediately

⚠️ **Back up regularly**:
- Export your data monthly
- Save the JSON file somewhere safe (Google Drive, Dropbox, etc.)

---

## Cost Breakdown

| Service | Cost | What You Get |
|---------|------|--------------|
| **GitHub Pages** | FREE | App hosting forever |
| **Cloudflare R2** | FREE | 10GB storage (~10,000 photos) |
| **WeatherAPI** | FREE | 1M requests/month |
| **OpenAI API** | ~$5-15/month | AI outfit generation |
| **Total** | **~$5-15/month** | Full-featured smart closet |

---

## Tips for Best Results

### Photography Tips
- Use natural lighting
- Plain background (white wall, door, floor)
- Lay items flat or hang them
- Full view of the item (no cropping)

### Organization Tips
- Add all your items before generating outfits (the more items, the better!)
- Be consistent with color names
- Add notes for special items (designer pieces, favorites, etc.)
- Use vision boards for seasonal organization

### AI Tips
- Vote on at least 10-15 outfits to "train" your preferences
- Be honest with votes - this helps the AI learn YOUR style
- Specify occasion and weather for better suggestions
- The AI gets smarter the more you use it!

### Storage Tips
- Export your data monthly as backup
- Don't clear your browser data/cookies
- Use the same browser consistently
- Consider using browser sync (Chrome/Firefox) to access from multiple devices

---

## Advanced: Updating Your App

If you want to modify the app:

1. **Edit files locally**:
   - Download your repository or edit files
   - Make your changes

2. **Upload to GitHub**:
   ```bash
   git add .
   git commit -m "Your update description"
   git push
   ```

3. **GitHub Pages updates automatically** (wait 1-2 minutes)

---

## FAQ

**Q: Can multiple people use the same installation?**
A: No, this is designed for single-user use. Each person should deploy their own copy.

**Q: Can I access this from my phone?**
A: Yes! The app is fully responsive and works on mobile browsers.

**Q: What happens if I run out of R2 storage?**
A: You can upgrade to paid tier (~$0.015/GB/month) or delete old items.

**Q: Can I use this offline?**
A: The app loads offline, but AI features and weather require internet.

**Q: How do I delete my app?**
A: Delete the GitHub repository and R2 bucket.

**Q: Can I customize the colors/design?**
A: Yes! Edit `css/styles.css` and upload to GitHub.

**Q: What if OpenAI raises prices?**
A: You can set spending limits in OpenAI dashboard or stop using AI features.

---

## Support

- **Issues/Bugs**: Open an issue on GitHub
- **Questions**: Check this README first
- **Feature Requests**: Open an issue on GitHub

---

## License

This project is open source and free to use for personal purposes.

---

## Credits

Built with:
- HTML, CSS, JavaScript (Vanilla - no frameworks!)
- OpenAI GPT-4 API
- WeatherAPI.com
- Cloudflare R2
- GitHub Pages

---

## Changelog

### Version 1.0.0 (2024)
- Initial release
- Full closet management
- AI outfit generation
- Style preference learning
- Weekly planner
- Weather integration
- Vision boards

---

**Enjoy your Virtual Closet! Never wonder "what should I wear?" again! 👗👔👠**
