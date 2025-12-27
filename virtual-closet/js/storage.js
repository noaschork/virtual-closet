// LocalStorage wrapper for managing app data
export class Storage {
    static KEYS = {
        ITEMS: 'virtualCloset_items',
        OUTFITS: 'virtualCloset_outfits',
        PREFERENCES: 'virtualCloset_preferences',
        EVENTS: 'virtualCloset_events',
        VISION_BOARDS: 'virtualCloset_visionBoards',
        SETTINGS: 'virtualCloset_settings'
    };

    // Get data from localStorage
    static get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error reading ${key}:`, error);
            return null;
        }
    }

    // Set data in localStorage
    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
            return false;
        }
    }

    // Remove data from localStorage
    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing ${key}:`, error);
            return false;
        }
    }

    // Clear all app data
    static clearAll() {
        Object.values(Storage.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }

    // Export all data
    static exportAll() {
        const data = {};
        Object.entries(Storage.KEYS).forEach(([name, key]) => {
            data[name] = Storage.get(key);
        });
        return data;
    }

    // Import all data
    static importAll(data) {
        try {
            Object.entries(data).forEach(([name, value]) => {
                const key = Storage.KEYS[name];
                if (key && value) {
                    Storage.set(key, value);
                }
            });
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // Closet Items
    static getItems() {
        return Storage.get(Storage.KEYS.ITEMS) || [];
    }

    static saveItems(items) {
        return Storage.set(Storage.KEYS.ITEMS, items);
    }

    static addItem(item) {
        const items = Storage.getItems();
        item.id = Date.now().toString();
        item.createdAt = new Date().toISOString();
        items.push(item);
        Storage.saveItems(items);
        return item;
    }

    static updateItem(id, updates) {
        const items = Storage.getItems();
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updates };
            Storage.saveItems(items);
            return items[index];
        }
        return null;
    }

    static deleteItem(id) {
        const items = Storage.getItems();
        const filtered = items.filter(item => item.id !== id);
        Storage.saveItems(filtered);
        return filtered.length < items.length;
    }

    // Outfits
    static getOutfits() {
        return Storage.get(Storage.KEYS.OUTFITS) || [];
    }

    static saveOutfits(outfits) {
        return Storage.set(Storage.KEYS.OUTFITS, outfits);
    }

    static addOutfit(outfit) {
        const outfits = Storage.getOutfits();
        outfit.id = Date.now().toString();
        outfit.createdAt = new Date().toISOString();
        outfits.push(outfit);
        Storage.saveOutfits(outfits);
        return outfit;
    }

    static deleteOutfit(id) {
        const outfits = Storage.getOutfits();
        const filtered = outfits.filter(outfit => outfit.id !== id);
        Storage.saveOutfits(filtered);
        return filtered.length < outfits.length;
    }

    // Preferences (for ML learning)
    static getPreferences() {
        return Storage.get(Storage.KEYS.PREFERENCES) || {
            likedCombinations: [],
            dislikedCombinations: [],
            colorPreferences: {},
            stylePreferences: {},
            occasionPreferences: {}
        };
    }

    static savePreferences(preferences) {
        return Storage.set(Storage.KEYS.PREFERENCES, preferences);
    }

    static recordVote(outfit, isLiked) {
        const preferences = Storage.getPreferences();

        const vote = {
            outfit: outfit,
            liked: isLiked,
            timestamp: new Date().toISOString()
        };

        if (isLiked) {
            preferences.likedCombinations.push(vote);

            // Track color combinations
            outfit.items.forEach(item => {
                preferences.colorPreferences[item.color] =
                    (preferences.colorPreferences[item.color] || 0) + 1;
            });

            // Track style preferences
            outfit.items.forEach(item => {
                preferences.stylePreferences[item.silhouette] =
                    (preferences.stylePreferences[item.silhouette] || 0) + 1;
            });

            // Track occasion preferences
            if (outfit.occasion) {
                preferences.occasionPreferences[outfit.occasion] =
                    (preferences.occasionPreferences[outfit.occasion] || 0) + 1;
            }
        } else {
            preferences.dislikedCombinations.push(vote);
        }

        Storage.savePreferences(preferences);
        return preferences;
    }

    // Events
    static getEvents() {
        return Storage.get(Storage.KEYS.EVENTS) || [];
    }

    static saveEvents(events) {
        return Storage.set(Storage.KEYS.EVENTS, events);
    }

    static addEvent(event) {
        const events = Storage.getEvents();
        event.id = Date.now().toString();
        events.push(event);
        events.sort((a, b) => new Date(a.date) - new Date(b.date));
        Storage.saveEvents(events);
        return event;
    }

    static deleteEvent(id) {
        const events = Storage.getEvents();
        const filtered = events.filter(event => event.id !== id);
        Storage.saveEvents(filtered);
        return filtered.length < events.length;
    }

    // Vision Boards
    static getVisionBoards() {
        return Storage.get(Storage.KEYS.VISION_BOARDS) || [];
    }

    static saveVisionBoards(boards) {
        return Storage.set(Storage.KEYS.VISION_BOARDS, boards);
    }

    static addVisionBoard(board) {
        const boards = Storage.getVisionBoards();
        board.id = Date.now().toString();
        board.createdAt = new Date().toISOString();
        boards.push(board);
        Storage.saveVisionBoards(boards);
        return board;
    }

    static deleteVisionBoard(id) {
        const boards = Storage.getVisionBoards();
        const filtered = boards.filter(board => board.id !== id);
        Storage.saveVisionBoards(filtered);
        return filtered.length < boards.length;
    }

    // Settings
    static getSettings() {
        return Storage.get(Storage.KEYS.SETTINGS) || {
            openaiKey: '',
            weatherKey: '',
            weatherLocation: '',
            r2Config: {
                accountId: '',
                accessKeyId: '',
                secretAccessKey: '',
                bucketName: 'virtual-closet',
                publicUrl: ''
            }
        };
    }

    static saveSettings(settings) {
        return Storage.set(Storage.KEYS.SETTINGS, settings);
    }
}
