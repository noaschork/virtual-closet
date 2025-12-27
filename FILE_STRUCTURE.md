# Virtual Closet - File Structure

This document explains what each file does and how they work together.

## 📁 Complete File Structure

```
virtual-closet/
│
├── index.html              # Main HTML file (the app's homepage)
│
├── css/
│   └── styles.css          # All styling and design
│
├── js/
│   ├── app.js              # Main application logic
│   ├── storage.js          # Data storage (localStorage management)
│   ├── r2-uploader.js      # Cloudflare R2 image upload
│   ├── ai-service.js       # OpenAI API integration
│   ├── weather-service.js  # Weather API integration
│   └── ui.js               # User interface rendering
│
├── README.md               # Full documentation and setup guide
├── QUICK_START.md          # 15-minute quick setup guide
├── API_SETUP_GUIDE.md      # Detailed API configuration instructions
├── FILE_STRUCTURE.md       # This file
│
└── .gitignore              # Git ignore file (prevents uploading sensitive data)
```

---

## 📄 File Descriptions

### Core Files

#### `index.html` (Main Application)
- **Purpose**: The main HTML structure of your app
- **Contains**:
  - Navigation menu
  - All 5 pages (Closet, Outfit Generator, Planner, Vision Board, Settings)
  - Modals (popups for adding items and events)
  - Loading overlay
  - Toast notification container
- **You can customize**: Text, labels, button names
- **Don't change**: HTML structure, IDs, class names (JavaScript depends on these)

#### `css/styles.css` (Styling)
- **Purpose**: All visual design and layout
- **Contains**:
  - Color scheme (defined in `:root` variables)
  - Responsive design (mobile/tablet/desktop)
  - Animations and transitions
  - Grid layouts
  - Button styles
  - Modal styles
- **You can customize**:
  - Colors (change CSS variables at the top)
  - Fonts
  - Spacing and sizes
  - Button styles
- **Pre-built features**:
  - Mobile-responsive (works on all screen sizes)
  - Dark mode ready (can be added by changing color variables)

---

### JavaScript Modules

#### `js/app.js` (Main Application Logic)
- **Purpose**: Orchestrates everything, handles user interactions
- **Key Functions**:
  - Navigation between pages
  - Adding/deleting items
  - Generating outfits
  - Creating vision boards
  - Event management
  - Settings management
- **Connects**: All other JS modules together
- **Initialization**: Runs when page loads via `DOMContentLoaded`

#### `js/storage.js` (Data Management)
- **Purpose**: Manages all data using browser's localStorage
- **Stores**:
  - Closet items (clothes, shoes, accessories)
  - Saved outfits
  - User preferences (votes, style learning)
  - Calendar events
  - Vision boards
  - Settings (API keys)
- **Key Features**:
  - Import/export all data
  - CRUD operations (Create, Read, Update, Delete)
  - Automatic vote tracking for ML
- **Storage Location**: Browser's localStorage (private to your device)

#### `js/r2-uploader.js` (Image Upload)
- **Purpose**: Uploads images to Cloudflare R2
- **How it works**:
  1. Takes image file or URL
  2. If R2 configured: Uploads to R2 using AWS S3 API
  3. If R2 not configured: Converts to Data URL (base64)
  4. Returns image URL for storage
- **Features**:
  - AWS Signature V4 authentication
  - Fallback to data URLs
  - URL scraping support
  - Automatic file naming
- **Limitations**: CORS may prevent scraping some websites

#### `js/ai-service.js` (OpenAI Integration)
- **Purpose**: Communicates with OpenAI's ChatGPT API
- **Functions**:
  - `generateOutfit()`: Creates outfit combinations
  - `generateWeeklyPlan()`: Plans outfits for 7 days
  - `analyzeImage()`: Auto-tags uploaded images (optional)
  - `getStyleInsights()`: Learns from your votes
- **How it works**:
  1. Builds detailed prompt with your items and preferences
  2. Sends to ChatGPT API
  3. Receives JSON response
  4. Parses and returns outfit data
- **Model used**: GPT-4o-mini (cost-effective, fast)

#### `js/weather-service.js` (Weather Integration)
- **Purpose**: Fetches weather data from WeatherAPI
- **Functions**:
  - `getCurrentWeather()`: Today's weather
  - `getWeeklyForecast()`: 7-day forecast
  - `getWeatherCategory()`: Classifies weather (hot/cold/rainy)
  - `getSuggestions()`: Outfit tips based on weather
- **Uses**: Free WeatherAPI.com service
- **Data returned**: Temperature, conditions, rain chance, icons

#### `js/ui.js` (User Interface)
- **Purpose**: Renders everything you see on screen
- **Functions**:
  - `renderClosetGrid()`: Displays clothing items
  - `renderOutfit()`: Shows generated outfits
  - `renderWeeklyOutfits()`: Displays weekly plan
  - `renderVisionBoards()`: Shows vision boards
  - `showToast()`: Notifications
  - `showLoading()`: Loading spinner
- **Handles**: All DOM manipulation and HTML generation

---

### Documentation Files

#### `README.md` (Main Documentation)
- **Purpose**: Complete guide to setup and use
- **Contains**:
  - Feature overview
  - Complete setup instructions
  - How to use each feature
  - Troubleshooting
  - FAQ
  - Cost breakdown
- **For**: First-time setup and reference

#### `QUICK_START.md` (Fast Setup)
- **Purpose**: Get running in 15 minutes
- **Contains**:
  - Condensed step-by-step checklist
  - Just the essentials
  - Quick troubleshooting
- **For**: Users who want to get started ASAP

#### `API_SETUP_GUIDE.md` (API Configuration)
- **Purpose**: Detailed API setup with screenshots descriptions
- **Contains**:
  - Step-by-step for each API service
  - Security best practices
  - Cost monitoring
  - Testing instructions
- **For**: Users setting up APIs for the first time

#### `FILE_STRUCTURE.md` (This File)
- **Purpose**: Understand how the app is organized
- **Contains**:
  - File structure explanation
  - What each file does
  - How files work together
- **For**: Understanding the codebase

#### `.gitignore`
- **Purpose**: Tells Git which files to ignore
- **Prevents**: Accidentally uploading sensitive config files
- **Ignores**:
  - API key files
  - Editor files
  - System files (`.DS_Store`, `Thumbs.db`)

---

## 🔄 How Everything Works Together

### When You Open the App

1. **Browser loads `index.html`**
   - Loads `styles.css` for design
   - Loads `app.js` as a module

2. **`app.js` initializes**
   - Creates instances of all services:
     - Storage (data management)
     - R2Uploader (image uploads)
     - AIService (ChatGPT)
     - WeatherService (forecast)
     - UI (rendering)
   - Loads settings from localStorage
   - Sets up navigation
   - Renders initial page

### When You Add an Item

1. User clicks "+ Add Item"
2. `app.js` shows modal
3. User uploads image
4. `r2-uploader.js` uploads to R2 (or creates data URL)
5. `ai-service.js` analyzes image (optional)
6. User confirms details
7. `storage.js` saves item to localStorage
8. `ui.js` re-renders closet grid

### When You Generate an Outfit

1. User clicks "Generate Outfit"
2. `app.js` collects items and preferences
3. `ai-service.js` sends request to OpenAI
4. ChatGPT returns outfit JSON
5. `ui.js` renders the outfit
6. User votes (👍 or 👎)
7. `storage.js` records vote and updates preferences
8. Machine learning data updated

### When You Plan Your Week

1. User clicks "Plan My Week"
2. `app.js` gathers:
   - All closet items
   - Calendar events from `storage.js`
   - Weather forecast from `weather-service.js`
3. `ai-service.js` sends comprehensive request to ChatGPT
4. AI generates 7 daily outfits considering:
   - Events
   - Weather
   - Your preferences
   - Item availability
5. `ui.js` renders weekly calendar
6. User can regenerate if needed

---

## 🗃️ Data Storage Structure

Everything is stored in browser's localStorage as JSON:

### Items
```javascript
{
  id: "1234567890",
  imageUrl: "https://...",
  type: "tops",
  color: "blue",
  silhouette: "fitted",
  notes: "Favorite shirt",
  createdAt: "2024-01-15T10:30:00Z"
}
```

### Outfits
```javascript
{
  id: "1234567890",
  items: [item1, item2, item3],
  reasoning: "Why this works...",
  occasion: "casual",
  weather: "warm",
  liked: true,
  createdAt: "2024-01-15T10:30:00Z"
}
```

### Preferences (ML Data)
```javascript
{
  likedCombinations: [...],
  dislikedCombinations: [...],
  colorPreferences: { "blue": 15, "black": 12 },
  stylePreferences: { "fitted": 10, "loose": 5 },
  occasionPreferences: { "casual": 20, "work": 15 }
}
```

### Events
```javascript
{
  id: "1234567890",
  name: "Client Meeting",
  date: "2024-01-20",
  type: "work"
}
```

### Settings
```javascript
{
  openaiKey: "sk-...",
  weatherKey: "xxx...",
  weatherLocation: "Paris, France",
  r2Config: {
    accountId: "...",
    accessKeyId: "...",
    secretAccessKey: "...",
    bucketName: "virtual-closet",
    publicUrl: "https://..."
  }
}
```

---

## 🔧 Customization Guide

### Change Colors

Edit `css/styles.css`, find `:root` section:

```css
:root {
    --primary-color: #6366f1;      /* Main purple - change this! */
    --success-color: #10b981;      /* Green for success */
    --danger-color: #ef4444;       /* Red for delete */
    --bg-color: #f9fafb;           /* Background */
    --card-bg: #ffffff;            /* Cards */
}
```

### Add New Clothing Types

1. Edit `index.html`, find all `<select id="item-type">` or `<select id="filter-type">`
2. Add new `<option>`:
   ```html
   <option value="jewelry">Jewelry</option>
   ```
3. That's it! No JS changes needed.

### Add New Colors

1. Edit `index.html`, find `<select id="item-color">`
2. Add new option:
   ```html
   <option value="gold">Gold</option>
   ```

### Change AI Model

Edit `js/ai-service.js`, find `makeRequest()` function:

```javascript
model: options.model || 'gpt-4o-mini',  // Change to 'gpt-4o' for better quality
```

Note: GPT-4o is more expensive than GPT-4o-mini!

---

## 🚀 Deployment Checklist

Before deploying to GitHub Pages:

- [ ] All files are in the `virtual-closet` folder
- [ ] `index.html` is at the root (not in a subfolder)
- [ ] `css/` and `js/` folders are included
- [ ] No API keys are hardcoded in the files
- [ ] `.gitignore` is present
- [ ] Documentation files are included

---

## 📊 File Sizes (Approximate)

- `index.html`: ~20 KB
- `css/styles.css`: ~15 KB
- `js/app.js`: ~15 KB
- `js/storage.js`: ~8 KB
- `js/r2-uploader.js`: ~7 KB
- `js/ai-service.js`: ~8 KB
- `js/weather-service.js`: ~4 KB
- `js/ui.js`: ~8 KB

**Total**: ~85 KB (extremely lightweight!)

---

## 🔒 Security Notes

### What's Secure
- API keys stored only in localStorage (not in source code)
- All API calls use HTTPS
- No server-side code to hack
- No database to compromise

### What to Watch
- **Browser localStorage is not encrypted**
  - Anyone with access to your computer can see it
  - Don't use on shared computers
  - Use private/incognito mode on shared devices
- **API keys in browser**
  - Keys are visible in browser DevTools
  - Don't let others use your computer while logged in
  - Clear browser data when done on shared computers

### Best Practices
- Use strong, unique password for GitHub
- Enable 2FA on GitHub, Cloudflare, OpenAI
- Regularly export your data as backup
- Monitor API usage for unexpected activity
- Rotate API keys every 6-12 months

---

## 🆘 Quick Troubleshooting

### App won't load
- **Check**: Files uploaded correctly to GitHub
- **Check**: GitHub Pages is enabled
- **Try**: Clear browser cache (Ctrl+F5)

### Features not working
- **Check**: Settings are saved
- **Check**: Browser console (F12) for errors
- **Check**: API keys are valid
- **Try**: Re-save settings

### Images not appearing
- **Check**: R2 bucket is public
- **Check**: Public URL is correct
- **Try**: Use data URL fallback (leave R2 settings empty)

---

**Now you understand how your Virtual Closet app works! 🎨**

For setup instructions, see [README.md](README.md) or [QUICK_START.md](QUICK_START.md).
