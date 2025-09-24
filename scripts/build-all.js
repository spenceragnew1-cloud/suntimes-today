// scripts/build-all.js
// Comprehensive build system for SunTimes Today

const fs = require('fs').promises;
const path = require('path');
const SunCalculator = require('../src/utils/sun-calculations');
const { locationData } = require('./generate-location-data');

class SiteBuilder {
  constructor() {
    this.sunCalc = new SunCalculator();
    this.outputDir = 'dist';
    this.buildStats = {
      startTime: new Date(),
      pagesGenerated: 0,
      errors: [],
      warnings: []
    };
  }

  /**
   * Initialize build environment
   */
  async initialize() {
    console.log('🚀 Initializing SunTimes Today build system...');

    try {
      // Clean and recreate output directory
      await this.cleanOutputDir();
      await this.createDirectoryStructure();

      console.log('✅ Build environment initialized');
    } catch (error) {
      console.error('❌ Failed to initialize build environment:', error);
      throw error;
    }
  }

  /**
   * Clean the output directory
   */
  async cleanOutputDir() {
    try {
      await fs.rm(this.outputDir, { recursive: true, force: true });
      await fs.mkdir(this.outputDir, { recursive: true });
      console.log('🧹 Cleaned output directory');
    } catch (error) {
      console.warn('⚠️ Could not clean output directory:', error.message);
    }
  }

  /**
   * Create directory structure in output
   */
  async createDirectoryStructure() {
    const dirs = [
      'locations',
      'assets',
      'images',
      'api',
      'sitemap'
    ];

    for (const dir of dirs) {
      await fs.mkdir(path.join(this.outputDir, dir), { recursive: true });
    }

    console.log('📁 Created directory structure');
  }

  /**
   * Generate HTML template for a location
   */
  generateLocationHTML(slug, locationData, sunTimes, additionalData = {}) {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const sunrise = this.sunCalc.formatTime(sunTimes.sunrise, locationData.timezone);
    const sunset = this.sunCalc.formatTime(sunTimes.sunset, locationData.timezone);
    const solarNoon = this.sunCalc.formatTime(sunTimes.solarNoon, locationData.timezone);
    const daylightHours = this.sunCalc.formatDuration(sunTimes.daylightHours);

    // Generate structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Place",
      "name": `${locationData.name}, ${locationData.stateCode}`,
      "description": `Sunrise and sunset times for ${locationData.name}, ${locationData.stateCode}`,
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": locationData.latitude,
        "longitude": locationData.longitude
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": locationData.name,
        "addressRegion": locationData.stateCode,
        "addressCountry": "US"
      },
      "url": `https://suntimestoday.com/locations/${slug}.html`
    };

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sunrise & Sunset Times in ${locationData.name}, ${locationData.stateCode} | ${formattedDate}</title>
    <meta name="description" content="Get accurate sunrise and sunset times for ${locationData.name}, ${locationData.stateCode}. Today's sunrise: ${sunrise || 'N/A'}, sunset: ${sunset || 'N/A'}. Updated daily with precise solar calculations.">
    <meta name="keywords" content="sunrise, sunset, ${locationData.name}, ${locationData.stateCode}, solar times, daylight hours, sun times, ${locationData.keywords.join(', ')}">

    <!-- Open Graph -->
    <meta property="og:title" content="Sunrise & Sunset Times in ${locationData.name}, ${locationData.stateCode}">
    <meta property="og:description" content="Today's sunrise: ${sunrise || 'N/A'}, sunset: ${sunset || 'N/A'}. Get accurate daily sun times for ${locationData.name}.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://suntimestoday.com/locations/${slug}.html">
    <meta property="og:image" content="https://suntimestoday.com/images/${slug}-sunrise.jpg">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Sun Times for ${locationData.name}, ${locationData.stateCode}">
    <meta name="twitter:description" content="Sunrise: ${sunrise || 'N/A'}, Sunset: ${sunset || 'N/A'}">

    <!-- Structured Data -->
    <script type="application/ld+json">
    ${JSON.stringify(structuredData, null, 2)}
    </script>

    <!-- Canonical URL -->
    <link rel="canonical" href="https://suntimestoday.com/locations/${slug}.html">

    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            min-height: 100vh;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #2c3e50;
            font-size: 2.2em;
            margin: 0 0 10px 0;
        }
        .location-info {
            text-align: center;
            color: #7f8c8d;
            margin-bottom: 30px;
        }
        .sun-times {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .time-card {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }
        .time-card h3 {
            font-size: 1.1em;
            margin: 0 0 10px 0;
            opacity: 0.9;
        }
        .time-value {
            font-size: 2em;
            font-weight: bold;
            margin: 10px 0;
        }
        .details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-top: 30px;
        }
        .details-section {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 10px;
        }
        .details-section h3 {
            color: #2c3e50;
            margin-top: 0;
        }
        .fact-list {
            list-style: none;
            padding: 0;
        }
        .fact-list li {
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .fact-list li:last-child {
            border-bottom: none;
        }
        .attractions {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 15px;
        }
        .attraction-tag {
            background: #667eea;
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.9em;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e9ecef;
            color: #7f8c8d;
        }
        @media (max-width: 768px) {
            body { padding: 10px; }
            .container { padding: 20px; }
            .details { grid-template-columns: 1fr; }
            .time-card { padding: 20px; }
            .time-value { font-size: 1.5em; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>🌅 Sun Times for ${locationData.name}, ${locationData.stateCode}</h1>
            <p><strong>${formattedDate}</strong></p>
        </header>

        <div class="location-info">
            <p>📍 <strong>${locationData.latitude}°N, ${Math.abs(locationData.longitude)}°W</strong> •
               🏙️ Population: <strong>${locationData.population.toLocaleString()}</strong> •
               🕐 Timezone: <strong>${locationData.timezone}</strong></p>
        </div>

        <div class="sun-times">
            <div class="time-card">
                <h3>🌅 Sunrise</h3>
                <div class="time-value">${sunrise || 'N/A'}</div>
                ${sunTimes.polarEvent === 'polar_night' ? '<p>Polar Night</p>' : ''}
            </div>

            <div class="time-card">
                <h3>🌇 Sunset</h3>
                <div class="time-value">${sunset || 'N/A'}</div>
                ${sunTimes.polarEvent === 'polar_day' ? '<p>Polar Day</p>' : ''}
            </div>

            <div class="time-card">
                <h3>☀️ Solar Noon</h3>
                <div class="time-value">${solarNoon}</div>
            </div>

            <div class="time-card">
                <h3>⏰ Daylight Hours</h3>
                <div class="time-value">${daylightHours}</div>
            </div>
        </div>

        <div class="details">
            <div class="details-section">
                <h3>📊 Location Details</h3>
                <ul class="fact-list">
                    <li><strong>Elevation:</strong> ${locationData.elevation} feet</li>
                    <li><strong>Metro Area:</strong> ${locationData.metro}</li>
                    <li><strong>State:</strong> ${locationData.state}</li>
                    <li><strong>Coordinates:</strong> ${locationData.latitude}, ${locationData.longitude}</li>
                </ul>
            </div>

            <div class="details-section">
                <h3>🎯 Popular Attractions</h3>
                <p>${locationData.description}</p>
                <div class="attractions">
                    ${locationData.attractions.map(attraction =>
                        `<span class="attraction-tag">${attraction}</span>`
                    ).join('')}
                </div>
            </div>
        </div>

        <div class="details-section">
            <h3>📸 Best Photo Spots for Sunrise & Sunset</h3>
            <div class="attractions">
                ${locationData.photoSpots.map(spot =>
                    `<span class="attraction-tag">📸 ${spot}</span>`
                ).join('')}
            </div>
        </div>

        <footer class="footer">
            <p>🌅 Accurate sunrise and sunset times calculated using precise astronomical algorithms<br>
               Updated daily for ${locationData.name}, ${locationData.stateCode}</p>
            <p><small>Data accurate for ${formattedDate} • Times shown in ${locationData.timezone}</small></p>
        </footer>
    </div>
</body>
</html>`;
  }

  /**
   * Build a single location page
   */
  async buildLocationPage(slug, locationData) {
    try {
      const today = new Date();
      const sunTimes = this.sunCalc.getSunTimes(today, locationData.latitude, locationData.longitude);

      // Get twilight times for additional data
      const twilightTimes = this.sunCalc.getTwilightTimes(today, locationData.latitude, locationData.longitude);

      const html = this.generateLocationHTML(slug, locationData, sunTimes, { twilightTimes });
      const outputPath = path.join(this.outputDir, 'locations', `${slug}.html`);

      await fs.writeFile(outputPath, html, 'utf8');

      // Generate JSON API data
      const apiData = {
        location: {
          name: locationData.name,
          state: locationData.stateCode,
          coordinates: {
            latitude: locationData.latitude,
            longitude: locationData.longitude
          },
          timezone: locationData.timezone
        },
        date: today.toISOString().split('T')[0],
        sunTimes: {
          sunrise: sunTimes.sunrise?.toISOString(),
          sunset: sunTimes.sunset?.toISOString(),
          solarNoon: sunTimes.solarNoon?.toISOString(),
          daylightHours: sunTimes.daylightHours,
          polarEvent: sunTimes.polarEvent
        },
        twilightTimes: {
          civilDawn: twilightTimes.civilDawn?.toISOString(),
          civilDusk: twilightTimes.civilDusk?.toISOString(),
          nauticalDawn: twilightTimes.nauticalDawn?.toISOString(),
          nauticalDusk: twilightTimes.nauticalDusk?.toISOString(),
          astronomicalDawn: twilightTimes.astronomicalDawn?.toISOString(),
          astronomicalDusk: twilightTimes.astronomicalDusk?.toISOString()
        },
        lastUpdated: new Date().toISOString()
      };

      const apiPath = path.join(this.outputDir, 'api', `${slug}.json`);
      await fs.writeFile(apiPath, JSON.stringify(apiData, null, 2));

      console.log(`✅ Generated: locations/${slug}.html & api/${slug}.json`);
      this.buildStats.pagesGenerated++;

    } catch (error) {
      const errorMsg = `Failed to build page for ${slug}: ${error.message}`;
      console.error(`❌ ${errorMsg}`);
      this.buildStats.errors.push(errorMsg);
    }
  }

  /**
   * Generate site index page with interactive calculator
   */
  async generateIndexPage() {
    // Get sample data for popular cities
    const today = new Date();
    const popularCitiesData = Object.entries(locationData)
      .sort(([,a], [,b]) => b.population - a.population)
      .slice(0, 6)
      .map(([slug, location]) => {
        const sunTimes = this.sunCalc.getSunTimes(today, location.latitude, location.longitude);
        return {
          name: location.name,
          state: location.stateCode,
          url: `locations/${slug}.html`,
          sunrise: this.sunCalc.formatTime(sunTimes.sunrise, location.timezone) || 'N/A',
          sunset: this.sunCalc.formatTime(sunTimes.sunset, location.timezone) || 'N/A'
        };
      });

    // Generate dropdown options for all cities
    const cityOptions = Object.entries(locationData)
      .sort(([,a], [,b]) => a.name.localeCompare(b.name))
      .map(([slug, location]) =>
        `<option value="locations/${slug}.html">${location.name}, ${location.stateCode}</option>`
      ).join('');

    const indexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sun Times Calculator - Accurate Sunrise & Sunset Times for Any Location</title>
    <meta name="description" content="Calculate precise sunrise and sunset times for any location worldwide. Get golden hour times, twilight information, and day length data. Free online sun calculator.">
    <meta name="keywords" content="sunrise calculator, sunset times, sun calculator, golden hour, twilight times, day length">

    <!-- Open Graph -->
    <meta property="og:title" content="Sun Times Calculator - Sunrise & Sunset Times">
    <meta property="og:description" content="Calculate accurate sunrise and sunset times for any location worldwide. Free online calculator with detailed sun information.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://suntimestoday.com">

    <style>
        :root {
            --primary: #FF6B35;
            --primary-light: #FF8A65;
            --secondary: #2E86AB;
            --accent: #A23B72;
            --text: #2D3748;
            --text-light: #718096;
            --bg: #FFFFFF;
            --bg-light: #F7FAFC;
            --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --border: #E2E8F0;
            --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            --shadow-lg: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: var(--text);
            background: var(--bg);
        }

        .hero-section {
            background: var(--bg-gradient);
            color: white;
            padding: 4rem 0 6rem 0;
            position: relative;
            overflow: hidden;
        }

        .hero-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><defs><radialGradient id="a" cx=".66" cy=".5" r=".5"><stop offset="0" stop-color="%23FFFFFF" stop-opacity=".1"/><stop offset="1" stop-color="%23FFFFFF" stop-opacity="0"/></radialGradient></defs><circle cx="10" cy="10" r="10" fill="url(%23a)"/></svg>');
            opacity: 0.3;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            position: relative;
        }

        .hero-content {
            text-align: center;
            max-width: 600px;
            margin: 0 auto;
        }

        .hero-title {
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 800;
            margin-bottom: 1.5rem;
            background: linear-gradient(45deg, #FFE082, #FFCC02);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .hero-subtitle {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            opacity: 0.9;
            line-height: 1.7;
        }

        .calculator-card {
            background: white;
            border-radius: 20px;
            padding: 3rem;
            margin: -3rem auto 4rem auto;
            max-width: 600px;
            box-shadow: var(--shadow-lg);
            position: relative;
            z-index: 10;
        }

        .calculator-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--text);
            margin-bottom: 2rem;
            text-align: center;
        }

        .input-group {
            margin-bottom: 1.5rem;
        }

        .input-label {
            display: block;
            font-weight: 600;
            color: var(--text);
            margin-bottom: 0.5rem;
        }

        .input-field {
            width: 100%;
            padding: 1rem 1.25rem;
            border: 2px solid var(--border);
            border-radius: 12px;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: var(--bg-light);
        }

        .input-field:focus {
            outline: none;
            border-color: var(--primary);
            background: white;
            box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        .input-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .calculate-btn {
            width: 100%;
            background: linear-gradient(135deg, var(--primary), var(--primary-light));
            color: white;
            border: none;
            padding: 1.25rem 2rem;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 1rem;
        }

        .calculate-btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow);
        }

        .results-section {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid var(--border);
            display: none;
        }

        .results-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .result-card {
            background: var(--bg-light);
            padding: 1.5rem;
            border-radius: 12px;
            text-align: center;
            border: 1px solid var(--border);
        }

        .result-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }

        .result-label {
            font-weight: 600;
            color: var(--text-light);
            font-size: 0.9rem;
            margin-bottom: 0.25rem;
        }

        .result-value {
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--primary);
        }

        .city-navigation {
            background: var(--bg-light);
            padding: 4rem 0;
        }

        .section-title {
            font-size: 2.5rem;
            font-weight: 800;
            text-align: center;
            color: var(--text);
            margin-bottom: 1rem;
        }

        .section-subtitle {
            text-align: center;
            color: var(--text-light);
            font-size: 1.1rem;
            margin-bottom: 3rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        .city-dropdown {
            max-width: 400px;
            margin: 0 auto 3rem auto;
        }

        .dropdown-select {
            width: 100%;
            padding: 1rem 1.25rem;
            border: 2px solid var(--border);
            border-radius: 12px;
            font-size: 1rem;
            background: white;
            cursor: pointer;
        }

        .popular-cities {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            max-width: 1000px;
            margin: 0 auto;
        }

        .city-card {
            background: white;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: var(--shadow);
            text-decoration: none;
            color: inherit;
            transition: all 0.3s ease;
            border: 1px solid var(--border);
        }

        .city-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-lg);
            text-decoration: none;
        }

        .city-name {
            font-size: 1.4rem;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 0.5rem;
        }

        .city-info {
            color: var(--text-light);
            margin-bottom: 1rem;
        }

        .city-times {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .time-info {
            text-align: center;
            padding: 0.75rem;
            background: var(--bg-light);
            border-radius: 8px;
        }

        .time-label {
            font-size: 0.8rem;
            color: var(--text-light);
            margin-bottom: 0.25rem;
        }

        .time-value {
            font-weight: 700;
            color: var(--text);
        }

        .features-section {
            padding: 4rem 0;
            background: white;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .feature-card {
            text-align: center;
            padding: 2rem;
        }

        .feature-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, var(--primary), var(--primary-light));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem auto;
            font-size: 1.5rem;
            color: white;
        }

        .feature-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: var(--text);
            margin-bottom: 1rem;
        }

        .feature-description {
            color: var(--text-light);
            line-height: 1.7;
        }

        @media (max-width: 768px) {
            .hero-section {
                padding: 3rem 0 4rem 0;
            }

            .calculator-card {
                margin: -2rem 1rem 3rem 1rem;
                padding: 2rem;
            }

            .input-row {
                grid-template-columns: 1fr;
            }

            .results-grid {
                grid-template-columns: 1fr 1fr;
            }

            .city-times {
                grid-template-columns: 1fr;
            }
        }

        .loading {
            display: none;
            text-align: center;
            padding: 2rem;
        }

        .spinner {
            border: 3px solid var(--border);
            border-top: 3px solid var(--primary);
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem auto;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <!-- Hero Section with Calculator -->
    <section class="hero-section">
        <div class="container">
            <div class="hero-content">
                <h1 class="hero-title">🌅 Sun Times Calculator</h1>
                <p class="hero-subtitle">
                    Get accurate sunrise and sunset times for any location worldwide.
                    Perfect for photography, outdoor activities, and planning your day.
                </p>
            </div>
        </div>
    </section>

    <!-- Main Calculator Tool -->
    <div class="container">
        <div class="calculator-card">
            <h2 class="calculator-title">Calculate Sun Times for Any Location</h2>

            <form id="sunCalculatorForm">
                <div class="input-group">
                    <label class="input-label" for="location">🏡 Location (City or Coordinates)</label>
                    <input type="text" id="location" class="input-field"
                           placeholder="Enter city name (e.g., New York, NY)">
                </div>

                <div class="input-row">
                    <div class="input-group">
                        <label class="input-label" for="date">📅 Date</label>
                        <input type="date" id="date" class="input-field">
                    </div>
                    <div class="input-group">
                        <label class="input-label" for="timezone">🌍 Timezone</label>
                        <select id="timezone" class="input-field">
                            <option value="auto">Auto-detect</option>
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                        </select>
                    </div>
                </div>

                <button type="submit" class="calculate-btn">
                    ✨ Calculate Sun Times
                </button>
            </form>

            <div class="loading" id="loading">
                <div class="spinner"></div>
                <p>Calculating sun times...</p>
            </div>

            <div class="results-section" id="results">
                <div class="results-grid">
                    <div class="result-card">
                        <div class="result-icon">🌅</div>
                        <div class="result-label">Sunrise</div>
                        <div class="result-value" id="sunrise">--:--</div>
                    </div>
                    <div class="result-card">
                        <div class="result-icon">🌇</div>
                        <div class="result-label">Sunset</div>
                        <div class="result-value" id="sunset">--:--</div>
                    </div>
                    <div class="result-card">
                        <div class="result-icon">📐</div>
                        <div class="result-label">Day Length</div>
                        <div class="result-value" id="dayLength">-- hrs</div>
                    </div>
                    <div class="result-card">
                        <div class="result-icon">✨</div>
                        <div class="result-label">Golden Hour</div>
                        <div class="result-value" id="goldenHour">--:--</div>
                    </div>
                </div>

                <div class="results-grid">
                    <div class="result-card">
                        <div class="result-icon">🌄</div>
                        <div class="result-label">Civil Dawn</div>
                        <div class="result-value" id="civilDawn">--:--</div>
                    </div>
                    <div class="result-card">
                        <div class="result-icon">🌆</div>
                        <div class="result-label">Civil Dusk</div>
                        <div class="result-value" id="civilDusk">--:--</div>
                    </div>
                    <div class="result-card">
                        <div class="result-icon">⭐</div>
                        <div class="result-label">Astronomical Dawn</div>
                        <div class="result-value" id="astronomicalDawn">--:--</div>
                    </div>
                    <div class="result-card">
                        <div class="result-icon">🌌</div>
                        <div class="result-label">Astronomical Dusk</div>
                        <div class="result-value" id="astronomicalDusk">--:--</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Popular Cities Navigation -->
    <section class="city-navigation">
        <div class="container">
            <h2 class="section-title">Popular Cities</h2>
            <p class="section-subtitle">
                Quick access to sun times for major cities. Each page provides detailed information
                including photography tips, best viewing spots, and seasonal variations.
            </p>

            <div class="city-dropdown">
                <select class="dropdown-select" id="cityDropdown" onchange="navigateToCity(this.value)">
                    <option value="">Select a city...</option>
                    ${cityOptions}
                </select>
            </div>

            <div class="popular-cities" id="popularCities">
                ${popularCitiesData.map(city => `
                    <a href="${city.url}" class="city-card">
                        <div class="city-name">${city.name}, ${city.state}</div>
                        <div class="city-info">Click for detailed sun times and photography tips</div>
                        <div class="city-times">
                            <div class="time-info">
                                <div class="time-label">Today's Sunrise</div>
                                <div class="time-value">${city.sunrise}</div>
                            </div>
                            <div class="time-info">
                                <div class="time-label">Today's Sunset</div>
                                <div class="time-value">${city.sunset}</div>
                            </div>
                        </div>
                    </a>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
        <div class="container">
            <h2 class="section-title">Why Use Our Sun Calculator?</h2>

            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🎯</div>
                    <h3 class="feature-title">Precise Calculations</h3>
                    <p class="feature-description">
                        Accurate sun times calculated using astronomical algorithms.
                        Accounts for your exact location and elevation.
                    </p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">📱</div>
                    <h3 class="feature-title">Mobile Optimized</h3>
                    <p class="feature-description">
                        Works perfectly on all devices. Calculate sun times
                        on-the-go with our responsive design.
                    </p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">📸</div>
                    <h3 class="feature-title">Photography Ready</h3>
                    <p class="feature-description">
                        Golden hour times, blue hour information, and
                        photography tips for the perfect shot.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <script src="/assets/sun-calculator.js"></script>
    <script>
        // Set today's date as default
        document.getElementById('date').valueAsDate = new Date();

        // Navigate to city
        function navigateToCity(url) {
            if (url) {
                window.location.href = url;
            }
        }
    </script>
</body>
</html>`;

    const indexPath = path.join(this.outputDir, 'index.html');
    await fs.writeFile(indexPath, indexHTML);
    console.log('✅ Generated: index.html');
  }

  /**
   * Generate XML sitemap
   */
  async generateSitemap() {
    const urls = [
      { loc: '', priority: '1.0', changefreq: 'daily' }
    ];

    // Add location pages
    for (const slug of Object.keys(locationData)) {
      urls.push({
        loc: `locations/${slug}.html`,
        priority: '0.8',
        changefreq: 'daily'
      });
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>https://suntimestoday.com/${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('\n')}
</urlset>`;

    const sitemapPath = path.join(this.outputDir, 'sitemap.xml');
    await fs.writeFile(sitemapPath, sitemap);
    console.log('✅ Generated: sitemap.xml');
  }

  /**
   * Copy static assets to output directory
   */
  async copyAssets() {
    try {
      const publicAssetsDir = path.join(__dirname, '..', 'public', 'assets');
      const outputAssetsDir = path.join(this.outputDir, 'assets');

      await fs.mkdir(outputAssetsDir, { recursive: true });

      // Copy all files from public/assets to dist/assets
      const assetFiles = await fs.readdir(publicAssetsDir);
      for (const file of assetFiles) {
        const sourcePath = path.join(publicAssetsDir, file);
        const destPath = path.join(outputAssetsDir, file);
        await fs.copyFile(sourcePath, destPath);
      }

      console.log('✅ Copied assets to dist/assets');
    } catch (error) {
      console.warn('⚠️ Could not copy assets:', error.message);
    }
  }

  /**
   * Build all pages
   */
  async buildAllPages() {
    console.log('🏗️ Building all location pages...');

    // Build location pages in parallel for better performance
    const buildPromises = Object.entries(locationData).map(([slug, location]) =>
      this.buildLocationPage(slug, location)
    );

    await Promise.all(buildPromises);

    // Copy assets
    await this.copyAssets();

    // Generate additional files
    await this.generateIndexPage();
    await this.generateSitemap();

    console.log('✅ All pages built successfully');
  }

  /**
   * Generate build report
   */
  generateBuildReport() {
    const endTime = new Date();
    const buildTime = (endTime - this.buildStats.startTime) / 1000;

    const report = {
      buildTime: `${buildTime.toFixed(2)} seconds`,
      pagesGenerated: this.buildStats.pagesGenerated,
      errors: this.buildStats.errors,
      warnings: this.buildStats.warnings,
      timestamp: endTime.toISOString()
    };

    console.log('\n📊 Build Report:');
    console.log(`⏱️ Build time: ${report.buildTime}`);
    console.log(`📄 Pages generated: ${report.pagesGenerated}`);
    console.log(`❌ Errors: ${report.errors.length}`);
    console.log(`⚠️ Warnings: ${report.warnings.length}`);

    if (report.errors.length > 0) {
      console.log('\n❌ Errors:');
      report.errors.forEach(error => console.log(`  - ${error}`));
    }

    if (report.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      report.warnings.forEach(warning => console.log(`  - ${warning}`));
    }

    return report;
  }
}

/**
 * Main build function
 */
async function build() {
  const builder = new SiteBuilder();

  try {
    await builder.initialize();
    await builder.buildAllPages();
    const report = builder.generateBuildReport();

    console.log('\n🎉 Build completed successfully!');
    console.log(`📂 Output directory: ${builder.outputDir}/`);

    return report;

  } catch (error) {
    console.error('\n💥 Build failed:', error);
    process.exit(1);
  }
}

// Export functions
module.exports = { SiteBuilder, build };

// Run if called directly
if (require.main === module) {
  build().catch(console.error);
}