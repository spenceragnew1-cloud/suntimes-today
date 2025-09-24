// SunTimes Today - Main Application

class SunTimesApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupAutoRefresh();
        this.setupThemeToggle();
        this.loadCurrentLocation();
        console.log('🌅 SunTimes Today initialized');
    }

    setupAutoRefresh() {
        // Auto-refresh times every minute
        setInterval(() => {
            this.updateCurrentTimes();
        }, 60000);
    }

    async updateCurrentTimes() {
        const timeCards = document.querySelectorAll('.time-card');

        timeCards.forEach(card => {
            card.classList.add('updating');
        });

        try {
            // Get current location from URL or default
            const location = this.getCurrentLocation();
            const response = await fetch(`/api/suntimes/${location}`);
            const data = await response.json();

            // Update sunrise time
            const sunriseTime = document.querySelector('.sunrise .time');
            if (sunriseTime) {
                sunriseTime.textContent = data.sunrise;
            }

            // Update sunset time
            const sunsetTime = document.querySelector('.sunset .time');
            if (sunsetTime) {
                sunsetTime.textContent = data.sunset;
            }

            // Update daylight hours
            const daylightHours = document.querySelector('.daylight .duration');
            if (daylightHours) {
                daylightHours.textContent = this.calculateDaylight(data.sunrise, data.sunset);
            }

            // Update date
            const dates = document.querySelectorAll('.date');
            dates.forEach(date => {
                date.textContent = new Date().toLocaleDateString();
            });

        } catch (error) {
            console.error('Failed to update times:', error);
        } finally {
            timeCards.forEach(card => {
                card.classList.remove('updating');
            });
        }
    }

    calculateDaylight(sunrise, sunset) {
        const sunriseTime = new Date(`1970-01-01T${sunrise}`);
        const sunsetTime = new Date(`1970-01-01T${sunset}`);
        const diff = sunsetTime - sunriseTime;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    }

    getCurrentLocation() {
        const path = window.location.pathname;
        const match = path.match(/\/locations\/([^\/]+)/);
        return match ? match[1] : 'new-york-ny';
    }

    setupThemeToggle() {
        // Add theme toggle functionality if needed
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
                localStorage.setItem('theme',
                    document.body.classList.contains('dark-theme') ? 'dark' : 'light'
                );
            });
        }

        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }

    loadCurrentLocation() {
        // Try to get user's location if geolocation is available
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.findNearestLocation(latitude, longitude);
                },
                (error) => {
                    console.log('Geolocation not available:', error.message);
                }
            );
        }
    }

    findNearestLocation(userLat, userLng) {
        // This would typically call an API to find the nearest tracked location
        // For now, just log the coordinates
        console.log(`User location: ${userLat}, ${userLng}`);

        // Could suggest nearby locations or show a "Add your city" option
        this.showLocationSuggestion(userLat, userLng);
    }

    showLocationSuggestion(lat, lng) {
        const suggestion = document.createElement('div');
        suggestion.className = 'location-suggestion';
        suggestion.innerHTML = `
            <p>📍 We detected you might be near coordinates ${lat.toFixed(2)}, ${lng.toFixed(2)}</p>
            <button onclick="this.parentElement.remove()">✕</button>
        `;

        const main = document.querySelector('main');
        if (main) {
            main.insertBefore(suggestion, main.firstChild);
        }
    }
}

// Utility functions
const SunTimes = {
    formatTime: (timeString) => {
        const time = new Date(`1970-01-01T${timeString}`);
        return time.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString([], {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    timeUntil: (targetTime) => {
        const now = new Date();
        const target = new Date(`${now.toDateString()} ${targetTime}`);

        if (target < now) {
            target.setDate(target.getDate() + 1);
        }

        const diff = target - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m`;
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SunTimesApp();
});

// Add some smooth scroll behavior for navigation
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});