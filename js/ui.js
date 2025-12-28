// UI Helper Module
export class UI {
    constructor(app) {
        this.app = app;
        this.setupModals();
    }

    // Modal management
    setupModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const closeBtn = modal.querySelector('.close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.hideModal(modal.id);
                });
            }

            // Close on outside click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // Loading overlay
    showLoading() {
        document.getElementById('loading-overlay').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loading-overlay').style.display = 'none';
    }

    // Toast notifications
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Render closet grid
    renderClosetGrid(items) {
        const grid = document.getElementById('closet-grid');

        if (items.length === 0) {
            grid.innerHTML = '<p class="placeholder-text">No items found. Add items to your closet to get started!</p>';
            return;
        }

        grid.innerHTML = items.map(item => `
            <div class="item-card">
                <img src="${item.imageUrl}" alt="${item.type}" class="item-image">
                <div class="item-info">
                    <div class="item-type">${item.type}</div>
                    <div class="item-details-text">
                        <span class="item-tag">${item.color}</span>
                        <span class="item-tag">${item.silhouette}</span>
                    </div>
                    ${item.notes ? `<p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.5rem;">${item.notes}</p>` : ''}
                    <div class="item-actions">
                        <button class="item-btn delete" onclick="app.deleteItem('${item.id}')">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Render outfit
    renderOutfit(outfit) {
        const display = document.getElementById('outfit-display');

        const itemsHTML = outfit.items.map(item => `
            <div class="outfit-item">
                <img src="${item.imageUrl}" alt="${item.type}">
                <div class="outfit-item-label">${item.type}</div>
            </div>
        `).join('');

        display.innerHTML = `
            <div class="outfit-items">
                ${itemsHTML}
            </div>
            <div class="outfit-description">
                <h4>Why this works:</h4>
                <p>${outfit.reasoning}</p>
            </div>
        `;
    }

    // Render saved outfits
    renderSavedOutfits(outfits) {
        const grid = document.getElementById('liked-outfits-grid');

        if (outfits.length === 0) {
            grid.innerHTML = '<p class="placeholder-text">No saved outfits yet. Vote on generated outfits to save them!</p>';
            return;
        }

        grid.innerHTML = outfits.map(outfit => `
            <div class="saved-outfit-card">
                <div class="saved-outfit-items">
                    ${outfit.items.map(item => `
                        <img src="${item.imageUrl}" alt="${item.type}">
                    `).join('')}
                </div>
                <div class="saved-outfit-info">
                    ${outfit.occasion ? `<strong>Occasion:</strong> ${outfit.occasion}<br>` : ''}
                    ${outfit.reasoning ? `<em>${outfit.reasoning}</em>` : ''}
                </div>
                <button class="delete-outfit-btn" onclick="app.deleteOutfit('${outfit.id}')">Remove</button>
            </div>
        `).join('');
    }

    // Render events
    renderEvents(events) {
        const list = document.getElementById('events-list');

        if (events.length === 0) {
            list.innerHTML = '<p class="placeholder-text">No events scheduled. Add events to help plan your outfits!</p>';
            return;
        }

        list.innerHTML = events.map(event => {
            const date = new Date(event.date);
            const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            return `
                <div class="event-item">
                    <div class="event-info">
                        <h4>${event.name}</h4>
                        <div class="event-date">${dateStr}</div>
                        <span class="event-type-badge" style="background: rgba(99, 102, 241, 0.1); color: var(--primary-color);">${event.type}</span>
                    </div>
                    <button class="delete-event-btn" onclick="app.deleteEvent('${event.id}')">Delete</button>
                </div>
            `;
        }).join('');
    }

    // Render weather forecast
    renderWeatherForecast(forecast) {
        const container = document.getElementById('weather-forecast');

        container.innerHTML = forecast.map(day => `
            <div class="weather-day">
                <div class="weather-day-name">${day.dayName}</div>
                <img src="https:${day.icon}" alt="${day.condition}" style="width: 50px; height: 50px;">
                <div class="weather-temp">${day.temp}°F</div>
                <div class="weather-condition">${day.condition}</div>
                ${day.chanceOfRain > 30 ? `<div style="color: var(--primary-color); font-size: 0.75rem; margin-top: 0.25rem;">☂️ ${day.chanceOfRain}%</div>` : ''}
            </div>
        `).join('');
    }

    // Render weekly outfits
    renderWeeklyOutfits(weeklyPlan) {
        const container = document.getElementById('weekly-outfits');

        container.innerHTML = weeklyPlan.map(dayPlan => `
            <div class="day-outfit-card">
                <h4>${dayPlan.day}</h4>
                <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;">
                    ${new Date(dayPlan.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div class="day-outfit-items">
                    ${dayPlan.items.map(item => `
                        <img src="${item.imageUrl}" alt="${item.type}" title="${item.type}">
                    `).join('')}
                </div>
                <p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.75rem;">
                    ${dayPlan.reason}
                </p>
            </div>
        `).join('');
    }

    // Render vision boards
    renderVisionBoards(boards) {
        const container = document.getElementById('vision-boards-container');

        if (boards.length === 0) {
            container.innerHTML = '<p class="placeholder-text">No vision boards yet. Create one to get 30 complete outfit combinations!</p>';
            return;
        }

        container.innerHTML = boards.map(board => {
            const casualCount = board.outfits.filter(o => o.occasion === 'casual').length;
            const dateCount = board.outfits.filter(o => o.occasion === 'date').length;
            const galaCount = board.outfits.filter(o => o.occasion === 'gala').length;

            return `
            <div class="vision-board">
                <div class="vision-board-header">
                    <h3 class="vision-board-title">${board.name}</h3>
                    <button class="btn btn-danger" onclick="app.deleteVisionBoard('${board.id}')">Delete Board</button>
                </div>
                <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;">
                    ${board.outfits.length} outfits • ${casualCount} casual, ${dateCount} date/dinner, ${galaCount} gala/party
                </div>
                <div class="vision-board-grid">
                    ${board.outfits.map(outfit => `
                        <div class="vision-board-outfit">
                            <div class="vision-board-outfit-occasion">${outfit.occasion === 'date' ? 'Date/Dinner' : outfit.occasion}</div>
                            <div class="vision-board-outfit-items">
                                ${outfit.items.map(item => `
                                    <img src="${item.imageUrl}" alt="${item.type}" onerror="this.style.display='none'">
                                `).join('')}
                            </div>
                            <div class="vision-board-outfit-description">${outfit.description}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        }).join('');
    }
}
