
// Enhanced build script with new templates
const fs = require('fs').promises;
const path = require('path');
const SunCalculator = require('../src/utils/sun-calculations');

class EnhancedSiteBuilder {
    constructor() {
        this.sunCalc = new SunCalculator();
        this.outputDir = 'dist';
    }

    async buildLocationPage(slug, locationData) {
        const today = new Date();
        const sunTimes = this.sunCalc.getTwilightTimes(today, locationData.latitude, locationData.longitude);
        const basicSunTimes = this.sunCalc.getSunTimes(today, locationData.latitude, locationData.longitude);
        const dayLength = this.calculateDayLength(basicSunTimes.sunrise, basicSunTimes.sunset);
        
        // Enhanced content generation with more SEO data
        const pageData = {
            // Basic info
            locationName: `${locationData.name}, ${locationData.stateCode}`,
            cityName: locationData.name,
            stateName: locationData.state,
            stateCode: locationData.stateCode,
            country: locationData.country || 'United States',
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            timezone: locationData.timezone,
            elevation: locationData.elevation || 0,
            population: locationData.population ? locationData.population.toLocaleString() : 'N/A',
            
            // URLs and SEO
            pageTitle: `Sunrise & Sunset Times in ${locationData.name}, ${locationData.stateCode}`,
            metaDescription: `Get today's sunrise and sunset times for ${locationData.name}, ${locationData.stateCode}. Sunrise: ${this.sunCalc.formatTime(basicSunTimes.sunrise, locationData.timezone)}, Sunset: ${this.sunCalc.formatTime(basicSunTimes.sunset, locationData.timezone)}. Photography tips and viewing spots included.`,
            canonicalUrl: `https://suntimestoday.com/locations/${locationData.stateCode.toLowerCase()}/${slug}.html`,
            stateUrl: `https://suntimestoday.com/locations/${locationData.stateCode.toLowerCase()}`,
            
            // Current sun data
            currentDate: today.toLocaleDateString(),
            sunriseTime: this.sunCalc.formatTime(basicSunTimes.sunrise, locationData.timezone),
            sunsetTime: this.sunCalc.formatTime(basicSunTimes.sunset, locationData.timezone),
            civilDawn: this.sunCalc.formatTime(sunTimes.civilDawn, locationData.timezone),
            civilDusk: this.sunCalc.formatTime(sunTimes.civilDusk, locationData.timezone),
            nauticalDawn: this.sunCalc.formatTime(sunTimes.nauticalDawn, locationData.timezone),
            nauticalDusk: this.sunCalc.formatTime(sunTimes.nauticalDusk, locationData.timezone),
            astronomicalDawn: this.sunCalc.formatTime(sunTimes.astronomicalDawn, locationData.timezone),
            astronomicalDusk: this.sunCalc.formatTime(sunTimes.astronomicalDusk, locationData.timezone),
            
            // Day length info
            dayLengthHours: dayLength ? dayLength.hours : 'N/A',
            dayLengthMinutes: dayLength ? dayLength.minutes : 'N/A',
            dayLengthComparison: this.generateDayLengthComparison(dayLength, today),
            
            // Enhanced content
            uniqueLocationInfo: this.generateUniqueLocationInfo(locationData),
            bestSunriseSpots: this.generateBestSunriseSpots(locationData),
            sunsetPhotoTips: this.generatePhotoTips(locationData),
            seasonalInfo: this.generateSeasonalInfo(locationData),
            goldenHourInfo: this.generateGoldenHourInfo(locationData, sunTimes),
            
            // Nearby locations
            nearbyLocations: this.generateNearbyLinks(locationData, slug),
            stateLocations: this.generateStateLinks(locationData),
            
            // Photo spots and attractions
            photoSpots: this.generatePhotoSpots(locationData),
            attractions: this.generateAttractions(locationData),
            
            // Directions and tips
            sunriseDirection: locationData.localInfo?.sunriseDirection || 'East',
            sunsetDirection: locationData.localInfo?.sunsetDirection || 'West',
            bestSeason: this.getBestSeason(locationData),
            bestViewingMonths: locationData.localInfo?.bestViewingMonths?.join(', ') || 'Year-round'
        };
        
        // Generate complete HTML using template
        const html = this.generateEnhancedHTML(pageData);
        
        // Ensure directory exists
        const stateDir = `${this.outputDir}/locations/${locationData.stateCode.toLowerCase()}`;
        await fs.mkdir(stateDir, { recursive: true });
        
        // Write file
        const outputPath = `${stateDir}/${slug}.html`;
        await fs.writeFile(outputPath, html, 'utf8');
        
        console.log(`✅ Generated enhanced page: ${outputPath}`);
        return outputPath;
    }

    generateEnhancedHTML(data) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.pageTitle}</title>
    <meta name="description" content="${data.metaDescription}">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${data.pageTitle}">
    <meta property="og:description" content="${data.metaDescription}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${data.canonicalUrl}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${data.canonicalUrl}">
    
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${process.env.G-ZB05P3YGD8}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.GA_TRACKING_ID}');
    </script>
    
    <style>
        /* Enhanced CSS styling */
        :root {
            --primary: #FF6B35;
            --primary-light: #FF8A65;
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
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: var(--text);
            background: var(--bg);
        }
        
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        
        .header {
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: 800;
            color: var(--primary);
            text-decoration: none;
        }
        
        .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
        }
        
        .nav-links a {
            color: var(--text);
            text-decoration: none;
            font-weight: 500;
        }
        
        .nav-links a:hover { color: var(--primary); }
        
        .breadcrumbs {
            padding: 1rem 0;
            background: var(--bg-light);
            border-bottom: 1px solid var(--border);
        }
        
        .breadcrumb-list {
            display: flex;
            list-style: none;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        
        .breadcrumb-item a {
            color: var(--secondary);
            text-decoration: none;
        }
        
        .breadcrumb-item:not(:last-child)::after {
            content: '→';
            margin-left: 0.5rem;
            color: var(--text-light);
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
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .time-card {
            text-align: center;
            padding: 1.5rem;
            background: var(--bg-light);
            border-radius: 12px;
            border: 1px solid var(--border);
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
        
        .time-date {
            font-size: 0.8rem;
            color: var(--text-light);
            margin-top: 0.25rem;
        }
        
        .main-content { padding: 4rem 0; }
        
        .content-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 3rem;
            margin-bottom: 3rem;
        }
        
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
        
        .sidebar {
            background: var(--bg-light);
            padding: 2rem;
            border-radius: 16px;
            height: fit-content;
            position: sticky;
            top: 100px;
        }
        
        .sidebar-section { margin-bottom: 2rem; }
        
        .sidebar-title {
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--text);
            margin-bottom: 1rem;
        }
        
        .info-list { list-style: none; }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 0.75rem 0;
            border-bottom: 1px solid var(--border);
        }
        
        .info-item:last-child { border-bottom: none; }
        
        .info-label {
            font-weight: 500;
            color: var(--text-light);
        }
        
        .info-value {
            font-weight: 600;
            color: var(--text);
        }
        
        .photography-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }
        
        .photo-spot-card {
            background: white;
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 1.5rem;
            transition: transform 0.3s ease;
        }
        
        .photo-spot-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow);
        }
        
        .spot-name {
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 0.5rem;
        }
        
        .spot-description {
            color: var(--text-light);
            font-size: 0.9rem;
        }
        
        .related-section {
            background: var(--bg-light);
            padding: 3rem 0;
            margin-top: 4rem;
        }
        
        .related-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
        }
        
        .related-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            border: 1px solid var(--border);
            text-decoration: none;
            color: inherit;
            transition: all 0.3s ease;
        }
        
        .related-card:hover {
            transform: translateY(-3px);
            box-shadow: var(--shadow);
            text-decoration: none;
        }
        
        .related-title {
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 0.5rem;
        }
        
        .related-description {
            color: var(--text-light);
            font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
            .content-grid { grid-template-columns: 1fr; }
            .sidebar { position: static; margin-top: 2rem; }
            .times-grid { grid-template-columns: repeat(2, 1fr); }
            .nav-links { display: none; }
        }
        
        @media (max-width: 480px) {
            .times-grid { grid-template-columns: 1fr; }
            .photography-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav container">
            <a href="/" class="logo">🌅 Sun Times Today</a>
            <ul class="nav-links">
                <li><a href="/">Calculator</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/locations">Cities</a></li>
            </ul>
        </nav>
    </header>
    
    <div class="breadcrumbs">
        <div class="container">
            <ul class="breadcrumb-list">
                <li class="breadcrumb-item"><a href="/">Home</a></li>
                <li class="breadcrumb-item"><a href="${data.stateUrl}">${data.stateName}</a></li>
                <li class="breadcrumb-item">${data.cityName}</li>
            </ul>
        </div>
    </div>
    
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
                    <div class="time-date">${data.currentDate}</div>
                </div>
                <div class="time-card">
                    <div class="time-icon">🌇</div>
                    <div class="time-label">Today's Sunset</div>
                    <div class="time-value">${data.sunsetTime}</div>
                    <div class="time-date">${data.currentDate}</div>
                </div>
                <div class="time-card">
                    <div class="time-icon">⏱️</div>
                    <div class="time-label">Day Length</div>
                    <div class="time-value">${data.dayLengthHours}h ${data.dayLengthMinutes}m</div>
                    <div class="time-date">${data.dayLengthComparison}</div>
                </div>
                <div class="time-card">
                    <div class="time-icon">✨</div>
                    <div class="time-label">Golden Hour</div>
                    <div class="time-value">1 hour before sunset</div>
                    <div class="time-date">Best for photography</div>
                </div>
            </div>
        </div>
    </div>
    
    <main class="main-content">
        <div class="container">
            <div class="content-grid">
                <div class="main-column">
                    <section class="content-section">
                        <h2 class="section-title">About Sun Times in ${data.cityName}</h2>
                        <div class="section-content">
                            <p>${data.locationName} is located at coordinates ${data.latitude}°N, ${data.longitude}°W in the ${data.timezone} timezone. ${data.uniqueLocationInfo}</p>
                            
                            <p>${data.seasonalInfo} This makes ${data.cityName} an excellent location for both sunrise and sunset photography throughout the year.</p>
                            
                            <p>The city's elevation of ${data.elevation} feet above sea level creates unique viewing conditions that photographers and outdoor enthusiasts appreciate.</p>
                        </div>
                    </section>
                    
                    <section class="content-section">
                        <h2 class="section-title">🌅 Best Sunrise Viewing Spots in ${data.cityName}</h2>
                        <div class="section-content">
                            <p>${data.bestSunriseSpots}</p>
                        </div>
                        
                        <div class="photography-grid">
                            <div class="photo-spot-card">
                                <div class="spot-name">Downtown Area</div>
                                <div class="spot-description">Urban sunrise views with city skyline silhouettes</div>
                            </div>
                            <div class="photo-spot-card">
                                <div class="spot-name">Elevated Viewpoints</div>
                                <div class="spot-description">Hills and tall buildings offer panoramic sunrise views</div>
                            </div>
                            <div class="photo-spot-card">
                                <div class="spot-name">Waterfront Areas</div>
                                <div class="spot-description">Reflections on water create stunning sunrise compositions</div>
                            </div>
                        </div>
                    </section>
                    
                    <section class="content-section">
                        <h2 class="section-title">📸 Photography Tips for ${data.cityName}</h2>
                        <div class="section-content">
                            <p>${data.sunsetPhotoTips}</p>
                            
                            <p><strong>Golden Hour in ${data.cityName}:</strong> ${data.goldenHourInfo}</p>
                            
                            <p><strong>Best Photography Months:</strong> The optimal months for sunrise and sunset photography in ${data.cityName} are ${data.bestViewingMonths}. During these periods, you'll experience the most favorable weather conditions and lighting.</p>
                            
                            <p><strong>Equipment Recommendations:</strong> For the best results, bring a tripod for sharp images during low light conditions. A wide-angle lens can capture the expansive sky, while a telephoto lens is perfect for isolating the sun against interesting foreground elements.</p>
                        </div>
                    </section>
                    
                    <section class="content-section">
                        <h2 class="section-title">🗓️ Seasonal Variations</h2>
                        <div class="section-content">
                            <p>At ${data.latitude}° latitude, ${data.cityName} experiences noticeable seasonal changes in sunrise and sunset times. Summer days are significantly longer than winter days, providing varied opportunities for photography throughout the year.</p>
                            
                            <p>Understanding these seasonal changes helps in planning photography sessions and outdoor activities. The dramatic difference between summer and winter sun times offers diverse photographic opportunities throughout the year.</p>
                        </div>
                    </section>
                </div>
                
                <aside class="sidebar">
                    <div class="sidebar-section">
                        <h3 class="sidebar-title">📍 Location Details</h3>
                        <ul class="info-list">
                            <li class="info-item">
                                <span class="info-label">Coordinates</span>
                                <span class="info-value">${data.latitude}°N, ${data.longitude}°W</span>
                            </li>
                            <li class="info-item">
                                <span class="info-label">Timezone</span>
                                <span class="info-value">${data.timezone}</span>
                            </li>
                            <li class="info-item">
                                <span class="info-label">Elevation</span>
                                <span class="info-value">${data.elevation} ft</span>
                            </li>
                            <li class="info-item">
                                <span class="info-label">Population</span>
                                <span class="info-value">${data.population}</span>
                            </li>
                        </ul>
                    </div>
                    
                    <div class="sidebar-section">
                        <h3 class="sidebar-title">🌅 Extended Sun Times</h3>
                        <ul class="info-list">
                            <li class="info-item">
                                <span class="info-label">Civil Dawn</span>
                                <span class="info-value">${data.civilDawn}</span>
                            </li>
                            <li class="info-item">
                                <span class="info-label">Sunrise</span>
                                <span class="info-value">${data.sunriseTime}</span>
                            </li>
                            <li class="info-item">
                                <span class="info-label">Sunset</span>
                                <span class="info-value">${data.sunsetTime}</span>
                            </li>
                            <li class="info-item">
                                <span class="info-label">Civil Dusk</span>
                                <span class="info-value">${data.civilDusk}</span>
                            </li>
                            <li class="info-item">
                                <span class="info-label">Nautical Dusk</span>
                                <span class="info-value">${data.nauticalDusk}</span>
                            </li>
                        </ul>
                    </div>
                    
                    <div class="sidebar-section">
                        <h3 class="sidebar-title">💡 Quick Tips</h3>
                        <ul class="info-list">
                            <li class="info-item">
                                <span class="info-label">Best Season</span>
                                <span class="info-value">${data.bestSeason}</span>
                            </li>
                            <li class="info-item">
                                <span class="info-label">Sunrise Direction</span>
                                <span class="info-value">${data.sunriseDirection}</span>
                            </li>
                            <li class="info-item">
                                <span class="info-label">Sunset Direction</span>
                                <span class="info-value">${data.sunsetDirection}</span>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    </main>
    
    <section class="related-section">
        <div class="container">
            <h2 class="section-title">🌍 Related Sun Time Locations</h2>
            <div class="related-grid">
                ${data.nearbyLocations.map(location => `
                    <a href="${location.url}" class="related-card">
                        <div class="related-title">${location.name} Sun Times</div>
                        <div class="related-description">Explore sun times and photography tips for ${location.name}</div>
                    </a>
                `).join('')}
            </div>
        </div>
    </section>
    
    <script>
        // Real-time updates and analytics
        function updateCurrentTime() {
            const now = new Date();
            const timeElements = document.querySelectorAll('[data-live-time]');
            
            timeElements.forEach(element => {
                const timezone = element.dataset.timezone || '${data.timezone}';
                const formattedTime = now.toLocaleTimeString('en-US', {
                    timeZone: timezone,
                    hour12: true,
                    hour: '2-digit',
                    minute: '2-digit'
                });
                element.textContent = formattedTime;
            });
        }
        
        setInterval(updateCurrentTime, 60000);
        updateCurrentTime();
        
        // Google Analytics events
        function trackPhotoSpotClick(spotName) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'photo_spot_click', {
                    'spot_name': spotName,
                    'city': '${data.cityName}',
                    'state': '${data.stateCode}'
                });
            }
        }
        
        document.querySelectorAll('.photo-spot-card').forEach(card => {
            card.addEventListener('click', function() {
                const spotName = this.querySelector('.spot-name').textContent;
                trackPhotoSpotClick(spotName);
            });
        });
    </script>
</body>
</html>`;
    }

    // Helper methods for generating content
    generateUniqueLocationInfo(locationData) {
        const elevation = locationData.elevation || 0;
        const population = locationData.population ? locationData.population.toLocaleString() : 'unknown';
        
        return `With a population of ${population} and an elevation of ${elevation} feet, this location offers unique viewing conditions. The local geography and urban layout create distinctive opportunities for sunrise and sunset photography.`;
    }

    generateBestSunriseSpots(locationData) {
        const spots = locationData.photoSpots || locationData.attractions || [];
        if (spots.length === 0) {
            return `Explore elevated areas and open spaces facing east for the best sunrise views in ${locationData.name}. Popular spots include downtown areas, parks, and waterfront locations.`;
        }
        
        return `Popular sunrise viewing spots include ${spots.slice(0, 3).join(', ')}. These locations offer unobstructed eastern views ideal for morning photography and provide diverse compositional opportunities.`;
    }

    generatePhotoTips(locationData) {
        const localInfo = locationData.localInfo || {};
        let tips = `For sunrise and sunset photography in ${locationData.name}, `;
        
        if (localInfo.sunsetDirection) {
            tips += `position yourself with clear views to the ${localInfo.sunsetDirection.toLowerCase()}. `;
        }
        
        tips += `Arrive 30-45 minutes before sunrise or sunset for the best golden hour lighting. Use a tripod for sharp images during low light conditions, and experiment with different compositions including foreground elements.`;
        
        return tips;
    }

    generateSeasonalInfo(locationData) {
        const lat = Math.abs(locationData.latitude);
        
        if (lat > 45) {
            return `At ${locationData.latitude.toFixed(2)}° latitude, ${locationData.name} experiences significant seasonal variations with long summer days and short winter days.`;
        } else if (lat > 30) {
            return `${locationData.name} enjoys moderate seasonal variation with noticeable differences between summer and winter daylight hours.`;
        } else {
            return `Located at ${locationData.latitude.toFixed(2)}° latitude, ${locationData.name} has relatively stable day lengths year-round with gentle seasonal variations.`;
        }
    }

    generateGoldenHourInfo(locationData, sunTimes) {
        return `Golden hour in ${locationData.name} occurs approximately one hour before sunset and one hour after sunrise, providing the warm, soft lighting that photographers prize. This timing varies slightly throughout the year based on seasonal sun angle changes.`;
    }

    generateNearbyLinks(locationData, currentSlug) {
        // Generate links to nearby cities - this would be enhanced with real data
        return [
            { name: 'Nearby City 1', url: '/locations/nearby-city-1.html' },
            { name: 'Nearby City 2', url: '/locations/nearby-city-2.html' }
        ];
    }

    generateStateLinks(locationData) {
        // Generate links to other cities in the same state
        return [
            { name: 'State City 1', url: '/locations/state-city-1.html' },
            { name: 'State City 2', url: '/locations/state-city-2.html' }
        ];
    }

    generatePhotoSpots(locationData) {
        return [
            { name: 'Downtown Area', description: 'Urban sunrise views with city skyline' },
            { name: 'Waterfront', description: 'Reflections create stunning compositions' },
            { name: 'Elevated Areas', description: 'Panoramic views of the surrounding landscape' }
        ];
    }

    generateAttractions(locationData) {
        const attractions = locationData.attractions || ['City Center', 'Main Park', 'Historic District'];
        return attractions.map(name => ({
            name,
            sunViewingInfo: `Great vantage point for sunrise and sunset photography in ${locationData.name}`
        }));
    }

    getBestSeason(locationData) {
        const lat = Math.abs(locationData.latitude);
        if (lat > 40) return 'Spring & Fall';
        if (lat > 30) return 'Fall & Winter';
        return 'Year-round';
    }

    generateDayLengthComparison(dayLength, date) {
        if (!dayLength) return '';
        
        const month = date.getMonth();
        if (month >= 2 && month <= 4) return 'Days are getting longer';
        if (month >= 5 && month <= 7) return 'Longest days of the year';
        if (month >= 8 && month <= 10) return 'Days are getting shorter';
        return 'Shortest days of the year';
    }

    calculateDayLength(sunriseDate, sunsetDate) {
        if (!sunriseDate || !sunsetDate) {
            return { hours: 0, minutes: 0 };
        }

        const diffMs = sunsetDate.getTime() - sunriseDate.getTime();
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return { hours, minutes };
    }

    async buildAllPages() {
        console.log('🏗️ Building enhanced location pages...');

        try {
            const locationsFile = await fs.readFile('src/data/locations.json', 'utf8');
            const locations = JSON.parse(locationsFile);

            let pageCount = 0;
            for (const [slug, locationData] of Object.entries(locations)) {
                await this.buildLocationPage(slug, locationData);
                pageCount++;
            }

            console.log(`🎉 Built ${pageCount} enhanced pages successfully!`);

        } catch (error) {
            console.error('❌ Build failed:', error);
        }
    }
}

module.exports = EnhancedSiteBuilder;
