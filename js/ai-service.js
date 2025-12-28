// OpenAI ChatGPT API Service
import { Storage } from './storage.js';

export class AIService {
    constructor() {
        this.settings = Storage.getSettings();
        this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    }

    // Update settings
    updateSettings(settings) {
        this.settings = settings;
    }

    // Check if API key is configured
    isConfigured() {
        return !!this.settings.openaiKey;
    }

    // Make API request
    async makeRequest(messages, options = {}) {
        if (!this.isConfigured()) {
            throw new Error('OpenAI API key not configured. Please add it in Settings.');
        }

        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.settings.openaiKey}`
            },
            body: JSON.stringify({
                model: options.model || 'gpt-4o-mini',
                messages: messages,
                temperature: options.temperature || 0.7,
                max_tokens: options.maxTokens || 1000,
                ...options
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI API request failed');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // Generate outfit combinations
    async generateOutfit(items, preferences, options = {}) {
        const { occasion, weather, excludeItemIds = [] } = options;

        // Get user preferences for better recommendations
        const userPrefs = Storage.getPreferences();

        // Filter out recently used items
        const availableItems = excludeItemIds.length > 0
            ? items.filter(item => !excludeItemIds.includes(item.id))
            : items;

        // Build context about items
        const itemsDescription = availableItems.map(item =>
            `${item.type}: ${item.color} ${item.silhouette}, ${item.season || 'all-season'} (ID: ${item.id})`
        ).join('\n');

        // Build preference context
        let prefContext = '';
        if (userPrefs.likedCombinations.length > 0) {
            const topColors = Object.entries(userPrefs.colorPreferences)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([color]) => color)
                .join(', ');

            const topStyles = Object.entries(userPrefs.stylePreferences)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([style]) => style)
                .join(', ');

            prefContext = `\n\nUser's style preferences based on ${userPrefs.likedCombinations.length} liked outfits:
- Favorite colors: ${topColors}
- Preferred styles: ${topStyles}`;
        }

        const prompt = `You are a professional fashion stylist. Create a complete outfit from the following wardrobe items.

Available items:
${itemsDescription}

Requirements:
${occasion ? `- Occasion: ${occasion}` : '- Occasion: Any'}
${weather ? `- Weather: ${weather}` : '- Weather: Any'}
${prefContext}

Instructions:
1. Select items that work well together
2. IMPORTANT outfit rules:
   - If you choose a DRESS, do NOT include regular tops or bottoms (dress replaces both)
   - However, you CAN layer sweaters, outerwear, or jackets over a dress for warmth/style
   - If you choose a TOP (not a dress), you MUST include a BOTTOM
   - Always try to include shoes if available
   - Add accessories if they enhance the outfit
3. CRITICAL SEASON MATCHING:
   - DO NOT mix seasonal items inappropriately (e.g., no sandals with wool coats, no summer dresses with winter boots)
   - All items must match the season OR be labeled "all-season"
   - Winter items: wool coats, heavy sweaters, boots
   - Summer items: sandals, tank tops, light dresses
   - Spring/Fall items: transitional pieces
   - "all-season" items can be paired with any season
4. STRICT COMBINATION RULES:
   - NEVER pair sandals with outerwear (sandals are for warm weather, outerwear is for cold)
   - NEVER pair white bottoms with outerwear (creates visual imbalance)
   - DO NOT include outerwear when weather is "warm" or "hot" (unnecessary layering)
5. Consider color coordination, style harmony, and appropriateness for the occasion and weather
6. BE CREATIVE - try different combinations each time, don't repeat the same items
7. Provide the outfit as a JSON object with this structure:
{
  "items": [
    {"id": "item_id_1", "type": "tops"},
    {"id": "item_id_2", "type": "bottoms"},
    ...
  ],
  "reasoning": "Brief explanation of why this outfit works (2-3 sentences)"
}

Return ONLY the JSON object, no additional text.`;

        const response = await this.makeRequest([
            { role: 'system', content: 'You are a professional fashion stylist who creates cohesive, stylish outfit combinations. Create variety - never suggest the same outfit twice in a row.' },
            { role: 'user', content: prompt }
        ], { temperature: 0.9 });

        // Parse JSON response
        try {
            const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
            const outfit = JSON.parse(cleanResponse);

            // Add full item details
            outfit.items = outfit.items.map(outfitItem => {
                const fullItem = items.find(item => item.id === outfitItem.id);
                return fullItem || outfitItem;
            });

            outfit.occasion = occasion || 'casual';
            outfit.weather = weather || 'any';

            return outfit;
        } catch (error) {
            console.error('Failed to parse AI response:', error);
            throw new Error('Failed to parse outfit suggestion. Please try again.');
        }
    }

    // Generate weekly outfit plan
    async generateWeeklyPlan(items, events, weatherForecast) {
        const userPrefs = Storage.getPreferences();

        const itemsDescription = items.map(item =>
            `${item.type}: ${item.color} ${item.silhouette}, ${item.season || 'all-season'} (ID: ${item.id})`
        ).join('\n');

        const eventsDescription = events.map(event =>
            `${event.date}: ${event.name} (${event.type})`
        ).join('\n');

        const weatherDescription = weatherForecast.map(day =>
            `${day.date}: ${day.temp}°F, ${day.condition}`
        ).join('\n');

        let prefContext = '';
        if (userPrefs.likedCombinations.length > 0) {
            const topColors = Object.entries(userPrefs.colorPreferences)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([color]) => color)
                .join(', ');

            prefContext = `\nUser's favorite colors: ${topColors}`;
        }

        const prompt = `You are a professional fashion stylist. Create a 7-day outfit plan based on the user's schedule and weather.

Available wardrobe items:
${itemsDescription}

This week's events:
${eventsDescription || 'No special events scheduled'}

Weather forecast:
${weatherDescription}
${prefContext}

Instructions:
1. Create one complete outfit for each day
2. Match outfits to scheduled events (if any)
3. Consider weather appropriateness and match seasonal items to the weather
4. STRICT RULES:
   - DO NOT mix seasonal items inappropriately (e.g., no sandals with wool coats)
   - NEVER pair sandals with outerwear
   - NEVER pair white bottoms with outerwear
   - DO NOT include outerwear when weather shows warm/hot temperatures (above 70°F)
5. Avoid repeating the same items on consecutive days when possible
6. Return a JSON array with 7 outfit objects:

[
  {
    "day": "Monday",
    "date": "2024-01-15",
    "items": [{"id": "...", "type": "tops"}, ...],
    "reason": "Brief explanation"
  },
  ...
]

Return ONLY the JSON array, no additional text.`;

        const response = await this.makeRequest([
            { role: 'system', content: 'You are a professional fashion stylist who creates practical, stylish weekly outfit plans.' },
            { role: 'user', content: prompt }
        ], {
            max_tokens: 2000
        });

        try {
            const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
            const weeklyPlan = JSON.parse(cleanResponse);

            // Add full item details
            weeklyPlan.forEach(dayPlan => {
                dayPlan.items = dayPlan.items.map(outfitItem => {
                    const fullItem = items.find(item => item.id === outfitItem.id);
                    return fullItem || outfitItem;
                });
            });

            return weeklyPlan;
        } catch (error) {
            console.error('Failed to parse weekly plan:', error);
            throw new Error('Failed to generate weekly plan. Please try again.');
        }
    }

    // Analyze image using GPT-4 Vision (optional, for auto-tagging)
    async analyzeImage(imageUrl) {
        if (!this.isConfigured()) {
            throw new Error('OpenAI API key not configured.');
        }

        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.settings.openaiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: 'Analyze this clothing item and return a JSON object with: type (tops/sweaters/bottoms/dresses/outerwear/shoes/accessories), color (black/white/gray/brown/beige/red/pink/orange/yellow/green/blue/purple/multicolor), silhouette (fitted/loose/oversized/flowy/structured), and season (spring/summer/fall/winter/all-season) based on material and weight. Return ONLY the JSON object.'
                            },
                            {
                                type: 'image_url',
                                image_url: { url: imageUrl }
                            }
                        ]
                    }
                ],
                max_tokens: 200
            })
        });

        if (!response.ok) {
            throw new Error('Image analysis failed');
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        try {
            const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
            return JSON.parse(cleanContent);
        } catch (error) {
            console.error('Failed to parse image analysis:', error);
            return null;
        }
    }

    // Get style insights from preferences
    async getStyleInsights() {
        const preferences = Storage.getPreferences();

        if (preferences.likedCombinations.length < 5) {
            return 'Vote on more outfits to get personalized style insights!';
        }

        const likedOutfits = preferences.likedCombinations.slice(-10);
        const outfitDescriptions = likedOutfits.map(vote =>
            vote.outfit.items.map(item => `${item.color} ${item.silhouette} ${item.type}`).join(', ')
        ).join('\n');

        const prompt = `Based on these liked outfit combinations, provide 3-4 brief style insights about this person's fashion preferences:

${outfitDescriptions}

Keep insights specific, actionable, and encouraging. Format as a simple list.`;

        const response = await this.makeRequest([
            { role: 'system', content: 'You are a fashion consultant providing personalized style insights.' },
            { role: 'user', content: prompt }
        ], {
            max_tokens: 300
        });

        return response;
    }

    // Analyze wardrobe for France trip - identify items NOT to bring
    async analyzeFranceWardrobe(items) {
        const itemsDescription = items.map(item =>
            `ID: ${item.id} | ${item.type}: ${item.color} ${item.silhouette}, ${item.season || 'all-season'}${item.notes ? ' (' + item.notes + ')' : ''}`
        ).join('\n');

        const prompt = `You are a French style consultant helping someone pack for living in France for a full year.

Analyze this wardrobe and identify 0-10 items that should NOT be brought to France because:
1. Low versatility (can only be used in 1-2 outfit combinations)
2. "Too American" style that won't fit French aesthetic (e.g., overly casual, athletic wear for daily use, graphic tees, obviously American brands, etc.)

Wardrobe:
${itemsDescription}

IMPORTANT: Focus on items that are BOTH low versatility AND culturally inappropriate. Don't flag basics or versatile pieces even if they're casual.

Return a JSON array of 0-10 items (only the worst offenders):
[
  {
    "id": "item_id",
    "reasons": ["Low versatility: only works with X", "Too American: overly casual for French style"],
    "versatilityScore": 2,
    "culturalFit": "poor"
  }
]

If all items are fine for France, return an empty array: []

Return ONLY the JSON array, no additional text.`;

        const response = await this.makeRequest([
            { role: 'system', content: 'You are a French fashion consultant with expertise in French vs American style differences and capsule wardrobe planning.' },
            { role: 'user', content: prompt }
        ], {
            max_tokens: 1500,
            temperature: 0.3
        });

        try {
            const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
            const analysis = JSON.parse(cleanResponse);

            // Add full item details
            return analysis.map(result => {
                const fullItem = items.find(item => item.id === result.id);
                return {
                    ...result,
                    item: fullItem
                };
            });
        } catch (error) {
            console.error('Failed to parse France analysis:', error);
            throw new Error('Failed to analyze wardrobe. Please try again.');
        }
    }
}
