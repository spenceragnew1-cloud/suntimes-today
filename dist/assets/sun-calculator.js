// SunTimes Calculator - Frontend Integration
// Integrates with existing SunCalculator backend

class FrontendSunCalculator {
  constructor() {
    this.init();
  }

  init() {
    this.setupFormHandler();
    this.setupLocationSearch();
    console.log('🌅 Sun Calculator initialized');
  }

  setupFormHandler() {
    const form = document.getElementById('sunCalculatorForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleCalculation();
    });
  }

  async handleCalculation() {
    const locationInput = document.getElementById('location').value.trim();
    const dateInput = document.getElementById('date').value;
    const timezoneInput = document.getElementById('timezone').value;

    if (!locationInput) {
      this.showError('Please enter a location');
      return;
    }

    if (!dateInput) {
      this.showError('Please select a date');
      return;
    }

    this.showLoading(true);

    try {
      // First try to find the location in our predefined cities
      const cityData = await this.findCityData(locationInput);

      if (cityData) {
        // Use our existing location data
        await this.calculateWithExistingData(cityData, dateInput, timezoneInput);
      } else {
        // For new locations, use approximate calculation
        await this.calculateWithCoordinates(locationInput, dateInput, timezoneInput);
      }

    } catch (error) {
      console.error('Calculation error:', error);
      this.showError('Unable to calculate sun times. Please check your location and try again.');
    } finally {
      this.showLoading(false);
    }
  }

  async findCityData(locationInput) {
    // Check if the input matches any of our existing cities
    const cityMatches = [
      { input: 'new york', data: { name: 'New York', state: 'NY', slug: 'new-york-ny', lat: 40.7128, lng: -74.0060, timezone: 'America/New_York' }},
      { input: 'los angeles', data: { name: 'Los Angeles', state: 'CA', slug: 'los-angeles-ca', lat: 34.0522, lng: -118.2437, timezone: 'America/Los_Angeles' }},
      { input: 'chicago', data: { name: 'Chicago', state: 'IL', slug: 'chicago-il', lat: 41.8781, lng: -87.6298, timezone: 'America/Chicago' }},
      { input: 'houston', data: { name: 'Houston', state: 'TX', slug: 'houston-tx', lat: 29.7604, lng: -95.3698, timezone: 'America/Chicago' }},
      { input: 'phoenix', data: { name: 'Phoenix', state: 'AZ', slug: 'phoenix-az', lat: 33.4484, lng: -112.0740, timezone: 'America/Phoenix' }},
      { input: 'philadelphia', data: { name: 'Philadelphia', state: 'PA', slug: 'philadelphia-pa', lat: 39.9526, lng: -75.1652, timezone: 'America/New_York' }},
      { input: 'san antonio', data: { name: 'San Antonio', state: 'TX', slug: 'san-antonio-tx', lat: 29.4241, lng: -98.4936, timezone: 'America/Chicago' }},
      { input: 'san diego', data: { name: 'San Diego', state: 'CA', slug: 'san-diego-ca', lat: 32.7157, lng: -117.1611, timezone: 'America/Los_Angeles' }},
      { input: 'dallas', data: { name: 'Dallas', state: 'TX', slug: 'dallas-tx', lat: 32.7767, lng: -96.7970, timezone: 'America/Chicago' }},
      { input: 'san jose', data: { name: 'San Jose', state: 'CA', slug: 'san-jose-ca', lat: 37.3382, lng: -121.8863, timezone: 'America/Los_Angeles' }},
      { input: 'austin', data: { name: 'Austin', state: 'TX', slug: 'austin-tx', lat: 30.2672, lng: -97.7431, timezone: 'America/Chicago' }},
      { input: 'jacksonville', data: { name: 'Jacksonville', state: 'FL', slug: 'jacksonville-fl', lat: 30.3322, lng: -81.6557, timezone: 'America/New_York' }},
      { input: 'fort worth', data: { name: 'Fort Worth', state: 'TX', slug: 'fort-worth-tx', lat: 32.7555, lng: -97.3308, timezone: 'America/Chicago' }},
      { input: 'columbus', data: { name: 'Columbus', state: 'OH', slug: 'columbus-oh', lat: 39.9612, lng: -82.9988, timezone: 'America/New_York' }},
      { input: 'charlotte', data: { name: 'Charlotte', state: 'NC', slug: 'charlotte-nc', lat: 35.2271, lng: -80.8431, timezone: 'America/New_York' }}
    ];

    const normalizedInput = locationInput.toLowerCase();
    const match = cityMatches.find(city =>
      normalizedInput.includes(city.input) ||
      city.input.includes(normalizedInput.split(',')[0].trim())
    );

    return match ? match.data : null;
  }

  async calculateWithExistingData(cityData, dateInput, timezoneInput) {
    try {
      // Try to fetch from our existing API first
      const response = await fetch(`/api/${cityData.slug}.json`);

      if (response.ok) {
        const apiData = await response.json();

        // If the date matches today, use the API data
        const requestDate = new Date(dateInput);
        const apiDate = new Date(apiData.date);

        if (this.isSameDate(requestDate, apiDate)) {
          this.displayResults(apiData, cityData);
          return;
        }
      }
    } catch (error) {
      console.log('API data not available, calculating directly');
    }

    // Calculate directly using our algorithm
    await this.calculateWithCoordinates(
      `${cityData.name}, ${cityData.state}`,
      dateInput,
      timezoneInput || cityData.timezone,
      cityData.lat,
      cityData.lng
    );
  }

  async calculateWithCoordinates(locationName, dateInput, timezoneInput, lat = null, lng = null) {
    // If coordinates not provided, use default (NYC as example)
    const latitude = lat || 40.7128;
    const longitude = lng || -74.0060;
    const timezone = timezoneInput === 'auto' ? 'America/New_York' : (timezoneInput || 'America/New_York');

    const date = new Date(dateInput);

    // Use simplified sun calculation (in production, you'd use your full SunCalculator class)
    const sunTimes = this.calculateSunTimes(latitude, longitude, date);

    const result = {
      location: {
        name: locationName,
        coordinates: { latitude, longitude },
        timezone: timezone
      },
      date: dateInput,
      sunTimes: {
        sunrise: sunTimes.sunrise.toISOString(),
        sunset: sunTimes.sunset.toISOString(),
        solarNoon: sunTimes.solarNoon.toISOString(),
        daylightHours: sunTimes.daylightHours
      },
      twilightTimes: {
        civilDawn: sunTimes.civilDawn.toISOString(),
        civilDusk: sunTimes.civilDusk.toISOString(),
        astronomicalDawn: sunTimes.astronomicalDawn.toISOString(),
        astronomicalDusk: sunTimes.astronomicalDusk.toISOString()
      }
    };

    this.displayResults(result, { timezone });
  }

  calculateSunTimes(lat, lng, date) {
    // Simplified sun calculation - in production use your full algorithm
    const J2000 = 2451545.0;
    const day = (date.getTime() / 86400000) - 0.5 + 2440588 - J2000;

    // Mean solar noon
    const solarNoonUTC = (lng / -15) / 24;

    // Solar declination (simplified)
    const declination = -23.45 * Math.cos(2 * Math.PI * (day + 10) / 365.25) * Math.PI / 180;

    // Hour angle
    const latRad = lat * Math.PI / 180;
    const cosHourAngle = -Math.tan(latRad) * Math.tan(declination);

    let hourAngle;
    if (cosHourAngle > 1) {
      // Polar night
      hourAngle = 0;
    } else if (cosHourAngle < -1) {
      // Polar day
      hourAngle = Math.PI;
    } else {
      hourAngle = Math.acos(cosHourAngle);
    }

    const sunriseUTC = solarNoonUTC - (hourAngle * 12 / Math.PI) / 24;
    const sunsetUTC = solarNoonUTC + (hourAngle * 12 / Math.PI) / 24;

    // Convert to dates
    const baseDate = new Date(date);
    baseDate.setUTCHours(0, 0, 0, 0);

    const sunrise = new Date(baseDate.getTime() + sunriseUTC * 24 * 60 * 60 * 1000);
    const sunset = new Date(baseDate.getTime() + sunsetUTC * 24 * 60 * 60 * 1000);
    const solarNoon = new Date(baseDate.getTime() + solarNoonUTC * 24 * 60 * 60 * 1000);

    // Twilight times (approximated)
    const civilDawn = new Date(sunrise.getTime() - 30 * 60 * 1000);
    const civilDusk = new Date(sunset.getTime() + 30 * 60 * 1000);
    const astronomicalDawn = new Date(sunrise.getTime() - 90 * 60 * 1000);
    const astronomicalDusk = new Date(sunset.getTime() + 90 * 60 * 1000);

    const daylightHours = (sunset.getTime() - sunrise.getTime()) / (1000 * 60 * 60);

    return {
      sunrise,
      sunset,
      solarNoon,
      civilDawn,
      civilDusk,
      astronomicalDawn,
      astronomicalDusk,
      daylightHours: Math.max(0, daylightHours)
    };
  }

  displayResults(data, cityInfo = {}) {
    const timezone = cityInfo.timezone || data.location.timezone || 'UTC';

    // Parse times
    const sunrise = data.sunTimes.sunrise ? new Date(data.sunTimes.sunrise) : null;
    const sunset = data.sunTimes.sunset ? new Date(data.sunTimes.sunset) : null;
    const solarNoon = data.sunTimes.solarNoon ? new Date(data.sunTimes.solarNoon) : null;
    const civilDawn = data.twilightTimes?.civilDawn ? new Date(data.twilightTimes.civilDawn) : null;
    const civilDusk = data.twilightTimes?.civilDusk ? new Date(data.twilightTimes.civilDusk) : null;
    const astronomicalDawn = data.twilightTimes?.astronomicalDawn ? new Date(data.twilightTimes.astronomicalDawn) : null;
    const astronomicalDusk = data.twilightTimes?.astronomicalDusk ? new Date(data.twilightTimes.astronomicalDusk) : null;

    // Update result values
    document.getElementById('sunrise').textContent = this.formatTime(sunrise, timezone);
    document.getElementById('sunset').textContent = this.formatTime(sunset, timezone);
    document.getElementById('dayLength').textContent = this.formatDayLength(data.sunTimes.daylightHours);
    document.getElementById('goldenHour').textContent = this.formatTime(
      sunset ? new Date(sunset.getTime() - 60 * 60 * 1000) : null,
      timezone
    );
    document.getElementById('civilDawn').textContent = this.formatTime(civilDawn, timezone);
    document.getElementById('civilDusk').textContent = this.formatTime(civilDusk, timezone);
    document.getElementById('astronomicalDawn').textContent = this.formatTime(astronomicalDawn, timezone);
    document.getElementById('astronomicalDusk').textContent = this.formatTime(astronomicalDusk, timezone);

    // Show results
    document.getElementById('results').style.display = 'block';
  }

  formatTime(date, timezone) {
    if (!date) return 'N/A';

    try {
      return date.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  }

  formatDayLength(hours) {
    if (typeof hours !== 'number' || hours < 0) return 'N/A';

    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  }

  isSameDate(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  showLoading(show) {
    const loadingEl = document.getElementById('loading');
    const resultsEl = document.getElementById('results');

    if (show) {
      loadingEl.style.display = 'block';
      resultsEl.style.display = 'none';
    } else {
      loadingEl.style.display = 'none';
    }
  }

  showError(message) {
    alert(message); // In production, use a better error display
  }

  setupLocationSearch() {
    const locationInput = document.getElementById('location');
    if (!locationInput) return;

    // Add example cities as placeholder suggestions
    locationInput.addEventListener('focus', () => {
      if (!locationInput.value) {
        locationInput.placeholder = 'Try: New York, Los Angeles, Chicago...';
      }
    });

    locationInput.addEventListener('blur', () => {
      locationInput.placeholder = 'Enter city name (e.g., New York, NY)';
    });
  }
}

// Utility functions
const SunTimesUtils = {
  getCurrentDate: () => {
    return new Date().toISOString().split('T')[0];
  },

  detectTimezone: () => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
      return 'America/New_York'; // fallback
    }
  },

  isValidCoordinates: (lat, lng) => {
    return !isNaN(lat) && !isNaN(lng) &&
           lat >= -90 && lat <= 90 &&
           lng >= -180 && lng <= 180;
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new FrontendSunCalculator();

  // Set today's date as default if not already set
  const dateInput = document.getElementById('date');
  if (dateInput && !dateInput.value) {
    dateInput.value = SunTimesUtils.getCurrentDate();
  }
});