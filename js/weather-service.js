// Weather API Service (using WeatherAPI.com free tier)
import { Storage } from './storage.js';

export class WeatherService {
    constructor() {
        this.settings = Storage.getSettings();
        this.apiUrl = 'https://api.weatherapi.com/v1';
    }

    // Update settings
    updateSettings(settings) {
        this.settings = settings;
    }

    // Check if API key is configured
    isConfigured() {
        return !!(this.settings.weatherKey && this.settings.weatherLocation);
    }

    // Get current weather
    async getCurrentWeather() {
        if (!this.isConfigured()) {
            throw new Error('Weather API not configured. Please add your API key and location in Settings.');
        }

        const url = `${this.apiUrl}/current.json?key=${this.settings.weatherKey}&q=${encodeURIComponent(this.settings.weatherLocation)}`;

        const response = await fetch(url);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Weather API request failed');
        }

        const data = await response.json();

        return {
            temp: Math.round(data.current.temp_f),
            condition: data.current.condition.text,
            icon: data.current.condition.icon,
            humidity: data.current.humidity,
            feelsLike: Math.round(data.current.feelslike_f)
        };
    }

    // Get forecast for next 7 days
    async getWeeklyForecast() {
        if (!this.isConfigured()) {
            throw new Error('Weather API not configured. Please add your API key and location in Settings.');
        }

        const url = `${this.apiUrl}/forecast.json?key=${this.settings.weatherKey}&q=${encodeURIComponent(this.settings.weatherLocation)}&days=7`;

        const response = await fetch(url);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Weather API request failed');
        }

        const data = await response.json();

        return data.forecast.forecastday.map(day => {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

            return {
                date: day.date,
                dayName: dayName,
                temp: Math.round(day.day.avgtemp_f),
                maxTemp: Math.round(day.day.maxtemp_f),
                minTemp: Math.round(day.day.mintemp_f),
                condition: day.day.condition.text,
                icon: day.day.condition.icon,
                chanceOfRain: day.day.daily_chance_of_rain
            };
        });
    }

    // Get weather category for outfit planning
    getWeatherCategory(temp, condition) {
        const conditionLower = condition.toLowerCase();

        if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
            return 'rainy';
        } else if (temp >= 75) {
            return 'hot';
        } else if (temp >= 60) {
            return 'warm';
        } else if (temp >= 45) {
            return 'cool';
        } else {
            return 'cold';
        }
    }

    // Get outfit suggestions based on weather
    getSuggestions(temp, condition) {
        const category = this.getWeatherCategory(temp, condition);

        const suggestions = {
            hot: {
                tips: ['Light, breathable fabrics', 'Sleeveless or short sleeves', 'Light colors'],
                avoid: ['Heavy layers', 'Dark colors that absorb heat']
            },
            warm: {
                tips: ['Comfortable layers', 'Mix of short and long sleeves', 'Versatile pieces'],
                avoid: ['Heavy coats', 'Too many layers']
            },
            cool: {
                tips: ['Light jacket or cardigan', 'Long sleeves', 'Closed-toe shoes'],
                avoid: ['Sleeveless tops alone', 'Sandals']
            },
            cold: {
                tips: ['Warm coat or jacket', 'Multiple layers', 'Scarves and accessories'],
                avoid: ['Thin fabrics', 'Sandals or open-toe shoes']
            },
            rainy: {
                tips: ['Waterproof outerwear', 'Closed-toe shoes', 'Darker colors'],
                avoid: ['Suede or delicate fabrics', 'White or light colors']
            }
        };

        return suggestions[category] || suggestions.warm;
    }
}
