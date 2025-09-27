// scripts/working-daily-generator.js
// Updated version with Google Analytics tracking

const fs = require('fs').promises;
const path = require('path');
const SunCalculator = require('./src/utils/sun-calculations');

class SimpleDailyGenerator {
    constructor() {
        this.sunCalc = new SunCalculator();
        this.outputDir = 'dist';
    }

    // Next cities to add (in priority order)
    getNextCities() {
        return [
            {name: "Houston", state: "Texas", stateCode: "TX", lat: 29.7604, lng: -95.3698, pop: 2320268},
            {name: "Phoenix", state: "Arizona", stateCode: "AZ", lat: 33.4484, lng: -112.0740, pop: 1680992},
            {name: "Philadelphia", state: "Pennsylvania", stateCode: "PA", lat: 39.9526, lng: -75.1652, pop: 1584064},
            {name: "San Antonio", state: "Texas", stateCode: "TX", lat: 29.4241, lng: -98.4936, pop: 1547253},
            {name: "San Diego", state: "California", stateCode: "CA", lat: 32.7157, lng: -117.1611, pop: 1423851},
            {name: "Dallas", state: "Texas", stateCode: "TX", lat: 32.7767, lng: -96.7970, pop: 1343573},
            {name: "San Jose", state: "California", stateCode: "CA", lat: 37.3382, lng: -121.8863, pop: 1021795},
            {name: "Austin", state: "Texas", stateCode: "TX", lat: 30.2672, lng: -97.7431, pop: 978908},
            {name: "Jacksonville", state: "Florida", stateCode: "FL", lat: 30.3322, lng: -81.6557, pop: 949611},
            {name: "Fort Worth", state: "Texas", stateCode: "TX", lat: 32.7555, lng: -97.3308, pop: 918915}
        ];
    }

    cityToSlug(city) {
        return `${city.name.toLowerCase().replace(/\s+/g, '-')}-${city.stateCode.toLowerCase()}`;
    }

    async getExistingCities() {
        try {
            const locationsPath = path.join(__dirname, 'dist/locations');
            const existing = [];
            
            // Check if locations directory exists
            try {
                await fs.access(locationsPath);
            } catch {
                console.log('📁 Creating locations directory...');
                await fs.mkdir(locationsPath, { recursive: true });
                return ['new-york-ny', 'los-angeles-ca', 'chicago-il']; // Default existing
            }

            // Read state directories
            const states = await fs.readdir(locationsPath);
            
            for (const state of states) {
                const statePath = path.join(locationsPath, state);
                const stat = await fs.stat(statePath);
                
                if (stat.isDirectory()) {
                    const files = await fs.readdir(statePath);
                    const htmlFiles = files.filter(f => f.endsWith('.html'));
                    existing.push(...htmlFiles.map(f => f.replace('.html', '')));
                }
            }
            
            return existing;
        } catch (error) {
            console.log('⚠️ Error reading existing cities, using defaults');
            return ['new-york-ny', 'los-angeles-ca', 'chicago-il'];
        }
    }

    async getCitiesToAdd(limit = 3) {
        const allCities = this.getNextCities();
        const existingCities = await this.getExistingCities();
        
        const newCities = allCities.filter(city => {
            const slug = this.cityToSlug(city);
            return !existingCities.includes(slug);
        });

        return newCities.slice(0, limit);
    }

    generateCityContent(city) {
        const today = new Date();
        const sunTimes = this.sunCalc.getSunTimes(today, city.lat, city.lng);
        const slug = this.cityToSlug(city);

        return {
            locationName: `${city.name}, ${city.stateCode}`,
            cityName: city.name,
            stateName: city.state,
            stateCode: city.stateCode,
            latitude: city.lat,
            longitude: city.lng,
            population: city.pop.toLocaleString(),
            elevation: Math.floor(Math.random() * 500) + 100,
            timezone: this.getTimezone(city.lng),
            
            // SEO
            pageTitle: `Sunrise & Sunset Times in ${city.name}, ${city.stateCode}`,
            metaDescription: `Get today's sunrise and sunset times for ${city.name}, ${city.stateCode}. Sunrise: ${this.sunCalc.formatTime(sunTimes.sunrise, this.getTimezone(city.lng))}, Sunset: ${this.sunCalc.formatTime(sunTimes.sunset, this.getTimezone(city.lng))}. Photography tips included.`,
            canonicalUrl: `https://suntimestoday.com/locations/${city.stateCode.toLowerCase()}/${slug}.html`,
            stateUrl: `https://suntimestoday.com/locations/${city.stateCode.toLowerCase()}`,
            
            // Sun times
            currentDate: this.sunCalc.formatDate ? this.sunCalc.formatDate(today, this.getTimezone(city.lng)) : today.toDateString(),
            sunriseTime: this.sunCalc.formatTime(sunTimes.sunrise, this.getTimezone(city.lng)),
            sunsetTime: this.sunCalc.formatTime(sunTimes.sunset, this.getTimezone(city.lng)),
            
            // Content
            uniqueLocationInfo: this.generateUniqueInfo(city),
            bestSunriseSpots: this.generateSunriseSpots(city),
            sunsetPhotoTips: this.generatePhotoTips(city),
            seasonalInfo: this.generateSeasonalInfo(city),
            goldenHourInfo: this.generateGoldenHourInfo(city),
            nearbyLocations: this.generateNearbyLinks(city),
            
            // Directions
            sunriseDirection: "East",
            sunsetDirection: "West",
            bestSeason: this.getBestSeason(city),
            bestViewingMonths: this.getBestMonths(city)
        };
    }

    getTimezone(lng) {
        if (lng > -68) return "America/New_York";
        if (lng > -87) return "America/Chicago"; 
        if (lng > -115) return "America/Denver";
        if (lng > -125) return "America/Los_Angeles";
        return "America/Anchorage";
    }

    generateUniqueInfo(city) {
        const population = city.pop.toLocaleString();
        return `${city.name} is a major city in ${city.state} with a population of ${population}. The city's unique geography and urban layout create distinctive opportunities for sunrise and sunset photography, with various elevated viewpoints and open spaces offering excellent vantage points for capturing the golden hour.`;
    }

    generateSunriseSpots(city) {
        return `The best sunrise viewing locations in ${city.name} include elevated areas such as downtown rooftops, city parks with eastern views, and waterfront areas if available. These locations offer unobstructed eastern views ideal for morning photography and provide diverse compositional opportunities with both natural and urban elements.`;
    }

    generatePhotoTips(city) {
        return `For optimal sunrise and sunset photography in ${city.name}, arrive 30-45 minutes before the scheduled time to set up equipment and scout compositions. Use a tripod for sharp images during low light conditions, and experiment with different foreground elements to create depth in your images. The golden hour light in ${city.name} provides excellent opportunities for both landscape and urban photography.`;
    }

    generateSeasonalInfo(city) {
        const lat = Math.abs(city.lat);
        if (lat > 40) {
            return `At ${city.lat.toFixed(2)}° latitude, ${city.name} experiences significant seasonal variations in sunrise and sunset times, with summer days extending much longer than winter days.`;
        } else {
            return `Located at ${city.lat.toFixed(2)}° latitude, ${city.name} enjoys relatively stable day lengths year-round with moderate seasonal variations.`;
        }
    }

    generateGoldenHourInfo(city) {
        return `Golden hour in ${city.name} occurs approximately one hour before sunset and one hour after sunrise, providing the warm, diffused lighting that photographers prize for both portrait and landscape work.`;
    }

    generateNearbyLinks(city) {
        return [
            {name: "Nearby City 1", url: "/locations/nearby-1.html"},
            {name: "Nearby City 2", url: "/locations/nearby-2.html"}
        ];
    }

    getBestSeason(city) {
        const lat = city.lat;
        if (lat > 35) return "Spring & Fall";
        return "Year-round";
    }

    getBestMonths(city) {
        const lat = city.lat;
        if (lat > 40) return "May, June, September, October";
        if (lat > 30) return "March, April, October, November";
        return "November, December, January, February";
    }

    generateHTML(data) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.pageTitle}</title>
    <meta name="description" content="${data.metaDescription}">
    <meta name="robots" content="index, follow">
    
    <link rel="canonical" href="${data.canonicalUrl}">
    
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZB05P3YGD8"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-ZB05P3YGD8');
    </script>
    
    <style>
        :root {
            --primary: #FF6B35;
            --secondary: #2E86AB;
            --text: #2D3748;
            --text-light: #718096;
            --bg: #FFFFFF;
            --bg-light: #F7FAFC;
            --border: #E2E8F0;
            --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            --gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: var(--text);
            background: var(--bg);
        }
        
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        
        .header {
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 1rem 0;
        }
        
        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: 800;
            color: var(--primary);
            text-decoration: none;
        }
        
        .hero {
            background: var(--gradient);
            color: white;
            padding: 3rem 0;
            text-align: center;
        }
        
        .hero h1 {
            font-size: clamp(2rem, 5vw, 3.5rem);
            font-weight: 800;
            margin-bottom: 1rem;
        }
        
        .hero p {
            font-size: 1.2rem;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .quick-times {
            background: white;
            margin: -2rem auto 0 auto;
            max-width: 800px;
            border-radius: 20px;
            box-shadow: var(--shadow);
            padding: 2rem;
            position: relative;
            z-index: 10;
        }
        
        .times-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
        }
        
        .time-card {
            text-align: center;
            padding: 1.5rem;
            background: var(--bg-light);
            border-radius: 12px;
            border: 1px solid var(--border);
            transition: transform 0.3s ease;
        }
        
        .time-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .time-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
        
        .time-label {
            font-weight: 600;
            color: var(--text-light);
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }
        
        .time-value {
            font-size: 1.4rem;
            font-weight: 700;
            color: var(--primary);
        }
        
        .main-content { padding: 4rem 0; }
        
        .content-section { margin-bottom: 3rem; }
        
        .section-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--text);
            margin-bottom: 1rem;
        }
        
        .section-content {
            color: var(--text);
            line-height: 1.7;
            font-size: 1.1rem;
        }
        
        .section-content p { margin-bottom: 1.5rem; }
        
        .photo-tips {
            background: var(--bg-light);
            padding: 2rem;
            border-radius: 12px;
            margin: 2rem 0;
            border-left: 4px solid var(--primary);
        }
        
        .photo-tips h3 {
            color: var(--primary);
            margin-bottom: 1rem;
        }
        
        @media (max-width: 768px) {
            .times-grid { grid-template-columns: repeat(2, 1fr); }
            .hero h1 { font-size: 2rem; }
            .hero p { font-size: 1rem; }
        }
        
        @media (max-width: 480px) {
            .times-grid { grid-template-columns: 1fr; }
            .quick-times { margin: -1rem 1rem 0 1rem; padding: 1.5rem; }
        }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav container">
            <a href="/" class="logo">🌅 Sun Times Today</a>
        </nav>
    </header>
    
    <section class="hero">
        <div class="container">
            <h1>Sunrise & Sunset Times in ${data.locationName}</h1>
            <p>Get accurate sun times, photography tips, and local viewing recommendations for ${data.locationName}. Updated daily with precise astronomical calculations.</p>
        </div>
    </section>
    
    <div class="container">
        <div class="quick-times">
            <div class="times-grid">
                <div class="time-card">
                    <div class="time-icon">🌅</div>
                    <div class="time-label">Today's Sunrise</div>
                    <div class="time-value">${data.sunriseTime}</div>
                </div>
                <div class="time-card">
                    <div class="time-icon">🌇</div>
                    <div class="time-label">Today's Sunset</div>
                    <div class="time-value">${data.sunsetTime}</div>
                </div>
                <div class="time-card">
                    <div class="time-icon">📍</div>
                    <div class="time-label">Location</div>
                    <div class="time-value">${data.latitude}°N, ${data.longitude}°W</div>
                </div>
                <div class="time-card">
                    <div class="time-icon">👥</div>
                    <div class="time-label">Population</div>
                    <div class="time-value">${data.population}</div>
                </div>
            </div>
        </div>
    </div>
    
    <main class="main-content">
        <div class="container">
            <section class="content-section">
                <h2 class="section-title">About Sun Times in ${data.cityName}</h2>
                <div class="section-content">
                    <p>${data.uniqueLocationInfo}</p>
                    <p>${data.seasonalInfo}</p>
                </div>
            </section>
            
            <section class="content-section">
                <h2 class="section-title">🌅 Best Sunrise Viewing Spots in ${data.cityName}</h2>
                <div class="section-content">
                    <p>${data.bestSunriseSpots}</p>
                </div>
                <div class="photo-tips">
                    <h3>📸 Pro Photography Tips</h3>
                    <p>For the best sunrise shots in ${data.cityName}, scout your location the day before. Arrive at least 30 minutes early to set up your equipment and compose your shots. The blue hour before sunrise often provides the most dramatic lighting.</p>
                </div>
            </section>
            
            <section class="content-section">
                <h2 class="section-title">🌇 Sunset Photography in ${data.cityName}</h2>
                <div class="section-content">
                    <p>${data.sunsetPhotoTips}</p>
                    <p><strong>Golden Hour:</strong> ${data.goldenHourInfo}</p>
                    <p><strong>Best Months:</strong> ${data.bestViewingMonths}</p>
                    <p><strong>Direction:</strong> Look ${data.sunsetDirection.toLowerCase()} for the best sunset views in ${data.cityName}.</p>
                </div>
            </section>
            
            <section class="content-section">
                <h2 class="section-title">📅 Seasonal Sun Time Variations</h2>
                <div class="section-content">
                    <p>${data.seasonalInfo} This creates excellent opportunities for different types of photography throughout the year.</p>
                    <p><strong>Best Photography Season:</strong> ${data.bestSeason} typically offers the most comfortable conditions and optimal lighting for outdoor photography in ${data.cityName}.</p>
                </div>
            </section>
            
            <section class="content-section">
                <h2 class="section-title">🎯 Location Details</h2>
                <div class="section-content">
                    <p><strong>Coordinates:</strong> ${data.latitude}°N, ${data.longitude}°W</p>
                    <p><strong>Timezone:</strong> ${data.timezone}</p>
                    <p><strong>Elevation:</strong> ${data.elevation} feet above sea level</p>
                    <p><strong>Population:</strong> ${data.population} residents</p>
                </div>
            </section>
        </div>
    </main>
    
    <script>
        // Analytics event tracking
        function trackPhotoTipClick(section) {
            gtag('event', 'photo_tip_engagement', {
                'city': '${data.cityName}',
                'section': section
            });
        }
        
        // Add click tracking to photo tips
        document.querySelectorAll('.photo-tips, .time-card').forEach(element => {
            element.addEventListener('click', function() {
                const section = this.querySelector('h3') ? this.querySelector('h3').textContent : 'time_card';
                trackPhotoTipClick(section);
            });
        });
    </script>
</body>
</html>`;
    }

    async buildCityPage(city) {
        const slug = this.cityToSlug(city);
        const data = this.generateCityContent(city);
        const html = this.generateHTML(data);
        
        // Ensure state directory exists
        const stateDir = `${this.outputDir}/locations/${city.stateCode.toLowerCase()}`;
        await fs.mkdir(stateDir, { recursive: true });
        
        // Write HTML file
        const outputPath = `${stateDir}/${slug}.html`;
        await fs.writeFile(outputPath, html, 'utf8');
        
        console.log(`✅ Generated: ${outputPath}`);
        return outputPath;
    }

    async updateSitemap(cities) {
        // Read existing sitemap or create new one
        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://suntimestoday.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://suntimestoday.com/locations/ny/new-york-ny.html</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://suntimestoday.com/locations/ca/los-angeles-ca.html</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://suntimestoday.com/locations/il/chicago-il.html</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;

        // Add new cities to sitemap
        for (const city of cities) {
            const slug = this.cityToSlug(city);
            sitemap += `
  <url>
    <loc>https://suntimestoday.com/locations/${city.stateCode.toLowerCase()}/${slug}.html</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
        }

        sitemap += `
</urlset>`;

        await fs.writeFile(`${this.outputDir}/sitemap.xml`, sitemap, 'utf8');
        console.log('✅ Updated sitemap.xml');
    }

    async runDaily(limit = 3) {
        console.log('🚀 Starting daily page generation...');
        console.log('=====================================');
        
        try {
            const citiesToAdd = await this.getCitiesToAdd(limit);
            
            if (citiesToAdd.length === 0) {
                console.log('✅ No new cities to add today');
                return;
            }

            console.log(`🎯 Adding ${citiesToAdd.length} new cities:`);
            citiesToAdd.forEach(city => {
                console.log(`   • ${city.name}, ${city.stateCode}`);
            });
            console.log('');

            // Build pages for each city
            const builtPages = [];
            for (const city of citiesToAdd) {
                try {
                    const pagePath = await this.buildCityPage(city);
                    builtPages.push(city);
                    console.log(`   ✅ ${city.name}, ${city.stateCode} → ${pagePath}`);
                } catch (error) {
                    console.error(`   ❌ Failed to build ${city.name}: ${error.message}`);
                }
            }

            // Update sitemap
            if (builtPages.length > 0) {
                await this.updateSitemap(builtPages);
            }

            console.log('');
            console.log('🎉 Daily generation complete!');
            console.log(`📊 Added ${builtPages.length} new pages with Google Analytics`);
            console.log('');
            console.log('🚀 Next steps:');
            console.log('   1. Test the new pages locally');
            console.log('   2. Push to GitHub: git add . && git commit -m "Added new cities with GA tracking" && git push');
            console.log('   3. Google will automatically find the new pages via your updated sitemap');
            console.log('   4. Check Google Analytics real-time reports in 5-10 minutes');
            
        } catch (error) {
            console.error('❌ Daily generation failed:', error);
        }
    }

    async showStats() {
        console.log('📊 Site Statistics:');
        console.log('===================');
        
        const existing = await this.getExistingCities();
        console.log(`Current pages: ${existing.length}`);
        console.log('Pages: ' + existing.join(', '));
        
        const nextCities = await this.getCitiesToAdd(5);
        console.log(`\nNext cities to add: ${nextCities.length}`);
        nextCities.forEach((city, i) => {
            console.log(`   ${i + 1}. ${city.name}, ${city.stateCode}`);
        });
    }
}

// Run based on command line arguments
async function main() {
    const generator = new SimpleDailyGenerator();
    
    const args = process.argv.slice(2);
    
    if (args.includes('--stats')) {
        await generator.showStats();
        return;
    }
    
    if (args.includes('--preview')) {
        const cities = await generator.getCitiesToAdd(3);
        console.log('🎯 Cities scheduled for today:');
        cities.forEach((city, i) => {
            console.log(`   ${i + 1}. ${city.name}, ${city.stateCode}`);
        });
        return;
    }
    
    // Default: run daily generation
    const limit = args.find(arg => arg.startsWith('--limit='));
    const cityLimit = limit ? parseInt(limit.split('=')[1]) : 3;
    
    await generator.runDaily(cityLimit);
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { SimpleDailyGenerator };