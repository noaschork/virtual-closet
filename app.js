// Main Application
import { Storage } from './storage.js';
import { R2Uploader } from './r2-uploader.js';
import { AIService } from './ai-service.js';
import { WeatherService } from './weather-service.js';
import { UI } from './ui.js';

class VirtualClosetApp {
    constructor() {
        this.storage = Storage;
        this.r2Uploader = new R2Uploader();
        this.aiService = new AIService();
        this.weatherService = new WeatherService();
        this.ui = new UI(this);

        this.currentPage = 'closet';
        this.currentOutfit = null;

        this.init();
    }

    init() {
        this.loadSettings();
        this.setupNavigation();
        this.setupClosetPage();
        this.setupOutfitsPage();
        this.setupPlannerPage();
        this.setupVisionBoardPage();
        this.setupSettingsPage();

        // Load initial data
        this.refreshCloset();
    }

    // Load settings and update services
    loadSettings() {
        const settings = Storage.getSettings();
        this.r2Uploader.updateSettings(settings);
        this.aiService.updateSettings(settings);
        this.weatherService.updateSettings(settings);
    }

    // Navigation
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateTo(page);
            });
        });
    }

    navigateTo(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        // Show selected page
        document.getElementById(`${page}-page`).classList.add('active');

        // Update nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });

        this.currentPage = page;

        // Load page-specific data
        if (page === 'closet') {
            this.refreshCloset();
        } else if (page === 'outfits') {
            this.refreshOutfitsPage();
        } else if (page === 'planner') {
            this.refreshPlannerPage();
        } else if (page === 'vision-board') {
            this.refreshVisionBoards();
        }
    }

    // CLOSET PAGE
    setupClosetPage() {
        // Add item button
        document.getElementById('add-item-btn').addEventListener('click', () => {
            this.ui.showModal('add-item-modal');
        });

        // Filters
        document.getElementById('filter-type').addEventListener('change', () => this.filterCloset());
        document.getElementById('filter-color').addEventListener('change', () => this.filterCloset());
        document.getElementById('filter-silhouette').addEventListener('change', () => this.filterCloset());
        document.getElementById('search-items').addEventListener('input', () => this.filterCloset());

        // File upload
        document.getElementById('file-upload').addEventListener('change', (e) => this.handleFileUpload(e));

        // URL scraping
        document.getElementById('scrape-url-btn').addEventListener('click', () => this.handleURLScrape());

        // Save item
        document.getElementById('save-item-btn').addEventListener('click', () => this.saveItem());
    }

    async handleFileUpload(e) {
        const files = e.target.files;
        if (files.length === 0) return;

        const file = files[0];
        this.ui.showLoading();

        try {
            // Upload to R2 or convert to data URL
            const imageUrl = await this.r2Uploader.uploadWithFallback(file);

            // Show preview
            document.getElementById('item-preview').src = imageUrl;
            document.getElementById('preview-section').style.display = 'block';

            // Try to auto-analyze the image if OpenAI is configured
            if (this.aiService.isConfigured()) {
                try {
                    const analysis = await this.aiService.analyzeImage(imageUrl);
                    if (analysis) {
                        document.getElementById('item-type').value = analysis.type || '';
                        document.getElementById('item-color').value = analysis.color || '';
                        document.getElementById('item-silhouette').value = analysis.silhouette || '';
                        this.ui.showToast('Image analyzed! Review the auto-filled details.', 'success');
                    }
                } catch (error) {
                    console.log('Auto-analysis not available:', error);
                }
            }

            // Store image URL temporarily
            this.tempImageUrl = imageUrl;
        } catch (error) {
            this.ui.showToast(`Upload failed: ${error.message}`, 'error');
        } finally {
            this.ui.hideLoading();
        }
    }

    async handleURLScrape() {
        const url = document.getElementById('url-input').value.trim();
        if (!url) {
            this.ui.showToast('Please enter a valid URL', 'warning');
            return;
        }

        this.ui.showLoading();

        try {
            const imageUrl = await this.r2Uploader.scrapeImageFromURL(url);

            // Show preview
            document.getElementById('item-preview').src = imageUrl;
            document.getElementById('preview-section').style.display = 'block';

            // Store image URL temporarily
            this.tempImageUrl = imageUrl;

            this.ui.showToast('Image loaded successfully!', 'success');
        } catch (error) {
            this.ui.showToast(`Failed to load image: ${error.message}`, 'error');
        } finally {
            this.ui.hideLoading();
        }
    }

    saveItem() {
        const type = document.getElementById('item-type').value;
        const color = document.getElementById('item-color').value;
        const silhouette = document.getElementById('item-silhouette').value;
        const notes = document.getElementById('item-notes').value;

        if (!type || !color || !silhouette) {
            this.ui.showToast('Please fill in all required fields', 'warning');
            return;
        }

        if (!this.tempImageUrl) {
            this.ui.showToast('Please upload an image first', 'warning');
            return;
        }

        const item = {
            imageUrl: this.tempImageUrl,
            type,
            color,
            silhouette,
            notes
        };

        Storage.addItem(item);
        this.ui.showToast('Item added to your closet!', 'success');
        this.ui.hideModal('add-item-modal');
        this.resetAddItemForm();
        this.refreshCloset();
    }

    resetAddItemForm() {
        document.getElementById('file-upload').value = '';
        document.getElementById('url-input').value = '';
        document.getElementById('item-type').value = '';
        document.getElementById('item-color').value = '';
        document.getElementById('item-silhouette').value = '';
        document.getElementById('item-notes').value = '';
        document.getElementById('preview-section').style.display = 'none';
        this.tempImageUrl = null;
    }

    refreshCloset() {
        this.filterCloset();
    }

    filterCloset() {
        let items = Storage.getItems();

        // Apply filters
        const typeFilter = document.getElementById('filter-type').value;
        const colorFilter = document.getElementById('filter-color').value;
        const silhouetteFilter = document.getElementById('filter-silhouette').value;
        const searchQuery = document.getElementById('search-items').value.toLowerCase();

        if (typeFilter) {
            items = items.filter(item => item.type === typeFilter);
        }
        if (colorFilter) {
            items = items.filter(item => item.color === colorFilter);
        }
        if (silhouetteFilter) {
            items = items.filter(item => item.silhouette === silhouetteFilter);
        }
        if (searchQuery) {
            items = items.filter(item =>
                item.type.toLowerCase().includes(searchQuery) ||
                item.color.toLowerCase().includes(searchQuery) ||
                item.silhouette.toLowerCase().includes(searchQuery) ||
                (item.notes && item.notes.toLowerCase().includes(searchQuery))
            );
        }

        this.ui.renderClosetGrid(items);
    }

    deleteItem(id) {
        if (confirm('Are you sure you want to delete this item?')) {
            Storage.deleteItem(id);
            this.ui.showToast('Item deleted', 'success');
            this.refreshCloset();
        }
    }

    // OUTFITS PAGE
    setupOutfitsPage() {
        document.getElementById('generate-outfit-btn').addEventListener('click', () => this.generateOutfit());
        document.getElementById('vote-yes').addEventListener('click', () => this.voteOnOutfit(true));
        document.getElementById('vote-no').addEventListener('click', () => this.voteOnOutfit(false));
    }

    async generateOutfit() {
        if (!this.aiService.isConfigured()) {
            this.ui.showToast('Please configure your OpenAI API key in Settings', 'warning');
            this.navigateTo('settings');
            return;
        }

        const items = Storage.getItems();
        if (items.length < 3) {
            this.ui.showToast('Add more items to your closet to generate outfits', 'warning');
            return;
        }

        const occasion = document.getElementById('outfit-occasion').value;
        const weather = document.getElementById('outfit-weather').value;

        this.ui.showLoading();

        try {
            const outfit = await this.aiService.generateOutfit(items, Storage.getPreferences(), {
                occasion,
                weather
            });

            this.currentOutfit = outfit;
            this.ui.renderOutfit(outfit);
            document.getElementById('outfit-voting').style.display = 'flex';
        } catch (error) {
            this.ui.showToast(`Failed to generate outfit: ${error.message}`, 'error');
        } finally {
            this.ui.hideLoading();
        }
    }

    voteOnOutfit(liked) {
        if (!this.currentOutfit) return;

        Storage.recordVote(this.currentOutfit, liked);

        if (liked) {
            // Save to liked outfits
            Storage.addOutfit({
                ...this.currentOutfit,
                liked: true
            });
            this.ui.showToast('Outfit saved to your collection!', 'success');
        } else {
            this.ui.showToast('Thanks for the feedback! I\'ll learn from this.', 'success');
        }

        this.refreshOutfitsPage();
        this.currentOutfit = null;

        // Hide voting buttons and outfit
        document.getElementById('outfit-voting').style.display = 'none';
        document.getElementById('outfit-display').innerHTML = '<p class="placeholder-text">Click "Generate Outfit" to create another outfit!</p>';
    }

    refreshOutfitsPage() {
        const savedOutfits = Storage.getOutfits().filter(o => o.liked);
        this.ui.renderSavedOutfits(savedOutfits);
    }

    deleteOutfit(id) {
        if (confirm('Remove this outfit from your saved collection?')) {
            Storage.deleteOutfit(id);
            this.ui.showToast('Outfit removed', 'success');
            this.refreshOutfitsPage();
        }
    }

    // PLANNER PAGE
    setupPlannerPage() {
        document.getElementById('add-event-btn').addEventListener('click', () => {
            this.ui.showModal('add-event-modal');
        });

        document.getElementById('save-event-btn').addEventListener('click', () => this.saveEvent());

        document.getElementById('generate-week-btn').addEventListener('click', () => this.generateWeeklyPlan());
    }

    saveEvent() {
        const name = document.getElementById('event-name').value.trim();
        const date = document.getElementById('event-date').value;
        const type = document.getElementById('event-type').value;

        if (!name || !date) {
            this.ui.showToast('Please fill in all fields', 'warning');
            return;
        }

        Storage.addEvent({ name, date, type });
        this.ui.showToast('Event added!', 'success');
        this.ui.hideModal('add-event-modal');

        // Reset form
        document.getElementById('event-name').value = '';
        document.getElementById('event-date').value = '';

        this.refreshPlannerPage();
    }

    deleteEvent(id) {
        if (confirm('Delete this event?')) {
            Storage.deleteEvent(id);
            this.ui.showToast('Event deleted', 'success');
            this.refreshPlannerPage();
        }
    }

    async refreshPlannerPage() {
        const events = Storage.getEvents();
        this.ui.renderEvents(events);

        // Load weather forecast if configured
        if (this.weatherService.isConfigured()) {
            try {
                const forecast = await this.weatherService.getWeeklyForecast();
                this.ui.renderWeatherForecast(forecast);
            } catch (error) {
                console.error('Weather fetch failed:', error);
            }
        } else {
            document.getElementById('weather-forecast').innerHTML = '<p class="placeholder-text">Configure weather API in Settings to see forecast</p>';
        }
    }

    async generateWeeklyPlan() {
        if (!this.aiService.isConfigured()) {
            this.ui.showToast('Please configure your OpenAI API key in Settings', 'warning');
            this.navigateTo('settings');
            return;
        }

        const items = Storage.getItems();
        if (items.length < 5) {
            this.ui.showToast('Add more items to your closet for a full weekly plan', 'warning');
            return;
        }

        this.ui.showLoading();

        try {
            const events = Storage.getEvents();
            let weatherForecast = [];

            if (this.weatherService.isConfigured()) {
                weatherForecast = await this.weatherService.getWeeklyForecast();
            } else {
                // Generate mock forecast
                const today = new Date();
                for (let i = 0; i < 7; i++) {
                    const date = new Date(today);
                    date.setDate(date.getDate() + i);
                    weatherForecast.push({
                        date: date.toISOString().split('T')[0],
                        temp: 65,
                        condition: 'Partly cloudy'
                    });
                }
            }

            const weeklyPlan = await this.aiService.generateWeeklyPlan(items, events, weatherForecast);
            this.ui.renderWeeklyOutfits(weeklyPlan);
            this.ui.showToast('Weekly plan generated!', 'success');
        } catch (error) {
            this.ui.showToast(`Failed to generate weekly plan: ${error.message}`, 'error');
        } finally {
            this.ui.hideLoading();
        }
    }

    // VISION BOARD PAGE
    setupVisionBoardPage() {
        document.getElementById('create-board-btn').addEventListener('click', () => this.createVisionBoard());
    }

    createVisionBoard() {
        const name = document.getElementById('board-name-input').value.trim();
        if (!name) {
            this.ui.showToast('Please enter a board name', 'warning');
            return;
        }

        const selectedTypes = Array.from(document.querySelectorAll('.board-filter:checked'))
            .map(cb => cb.value);

        if (selectedTypes.length === 0) {
            this.ui.showToast('Please select at least one clothing type', 'warning');
            return;
        }

        // Get items matching selected types
        const items = Storage.getItems().filter(item =>
            selectedTypes.includes(item.type)
        );

        if (items.length === 0) {
            this.ui.showToast('No items found matching your selection', 'warning');
            return;
        }

        const board = {
            name,
            types: selectedTypes,
            items
        };

        Storage.addVisionBoard(board);
        this.ui.showToast('Vision board created!', 'success');

        // Reset form
        document.getElementById('board-name-input').value = '';
        document.querySelectorAll('.board-filter').forEach(cb => cb.checked = false);

        this.refreshVisionBoards();
    }

    refreshVisionBoards() {
        const boards = Storage.getVisionBoards();
        this.ui.renderVisionBoards(boards);
    }

    deleteVisionBoard(id) {
        if (confirm('Delete this vision board?')) {
            Storage.deleteVisionBoard(id);
            this.ui.showToast('Vision board deleted', 'success');
            this.refreshVisionBoards();
        }
    }

    // SETTINGS PAGE
    setupSettingsPage() {
        // Load current settings
        const settings = Storage.getSettings();
        document.getElementById('openai-key').value = settings.openaiKey || '';
        document.getElementById('weather-key').value = settings.weatherKey || '';
        document.getElementById('weather-location').value = settings.weatherLocation || '';
        document.getElementById('r2-account-id').value = settings.r2Config.accountId || '';
        document.getElementById('r2-access-key').value = settings.r2Config.accessKeyId || '';
        document.getElementById('r2-secret-key').value = settings.r2Config.secretAccessKey || '';
        document.getElementById('r2-bucket-name').value = settings.r2Config.bucketName || 'virtual-closet';
        document.getElementById('r2-public-url').value = settings.r2Config.publicUrl || '';

        // Save settings
        document.getElementById('save-settings-btn').addEventListener('click', () => this.saveSettings());

        // Data management
        document.getElementById('export-data-btn').addEventListener('click', () => this.exportData());
        document.getElementById('import-data-btn').addEventListener('click', () => {
            document.getElementById('import-file-input').click();
        });
        document.getElementById('import-file-input').addEventListener('change', (e) => this.importData(e));
        document.getElementById('clear-data-btn').addEventListener('click', () => this.clearAllData());
    }

    saveSettings() {
        const settings = {
            openaiKey: document.getElementById('openai-key').value.trim(),
            weatherKey: document.getElementById('weather-key').value.trim(),
            weatherLocation: document.getElementById('weather-location').value.trim(),
            r2Config: {
                accountId: document.getElementById('r2-account-id').value.trim(),
                accessKeyId: document.getElementById('r2-access-key').value.trim(),
                secretAccessKey: document.getElementById('r2-secret-key').value.trim(),
                bucketName: document.getElementById('r2-bucket-name').value.trim() || 'virtual-closet',
                publicUrl: document.getElementById('r2-public-url').value.trim()
            }
        };

        Storage.saveSettings(settings);
        this.loadSettings(); // Reload settings in services
        this.ui.showToast('Settings saved!', 'success');
    }

    exportData() {
        const data = Storage.exportAll();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `virtual-closet-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.ui.showToast('Data exported successfully!', 'success');
    }

    importData(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (confirm('This will replace all your current data. Continue?')) {
                    Storage.importAll(data);
                    this.ui.showToast('Data imported successfully!', 'success');
                    location.reload();
                }
            } catch (error) {
                this.ui.showToast('Invalid backup file', 'error');
            }
        };
        reader.readAsText(file);
    }

    clearAllData() {
        if (confirm('This will delete ALL your data including items, outfits, and preferences. This cannot be undone. Continue?')) {
            if (confirm('Are you absolutely sure? This action is permanent.')) {
                Storage.clearAll();
                this.ui.showToast('All data cleared', 'success');
                location.reload();
            }
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new VirtualClosetApp();
});
