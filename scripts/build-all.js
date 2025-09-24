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
   * Generate site index page
   */
  async generateIndexPage() {
    const locationEntries = Object.entries(locationData)
      .sort(([,a], [,b]) => b.population - a.population)
      .map(([slug, location]) => `
        <div class="location-card">
          <h3><a href="locations/${slug}.html">${location.name}, ${location.stateCode}</a></h3>
          <p>Population: ${location.population.toLocaleString()}</p>
          <p>${location.description.substring(0, 150)}...</p>
        </div>
      `).join('');

    const indexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SunTimes Today - Accurate Sunrise & Sunset Calculator for Major US Cities</title>
    <meta name="description" content="Get precise sunrise and sunset times for major US cities. Daily updated solar calculations for ${Object.keys(locationData).length} locations across America.">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .header h1 {
            font-size: 3em;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        .locations-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .location-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }
        .location-card h3 {
            margin-top: 0;
        }
        .location-card a {
            color: #2c3e50;
            text-decoration: none;
        }
        .location-card a:hover {
            color: #667eea;
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>🌅 SunTimes Today</h1>
            <p>Accurate sunrise and sunset times for major US cities</p>
            <p><strong>${Object.keys(locationData).length} locations</strong> • Updated daily with precise astronomical calculations</p>
        </header>

        <div class="locations-grid">
            ${locationEntries}
        </div>

        <footer style="text-align: center; margin-top: 40px; color: #7f8c8d;">
            <p>Last updated: ${new Date().toLocaleDateString()}</p>
        </footer>
    </div>
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
   * Build all pages
   */
  async buildAllPages() {
    console.log('🏗️ Building all location pages...');

    // Build location pages in parallel for better performance
    const buildPromises = Object.entries(locationData).map(([slug, location]) =>
      this.buildLocationPage(slug, location)
    );

    await Promise.all(buildPromises);

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