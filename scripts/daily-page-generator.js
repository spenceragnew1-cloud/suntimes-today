// scripts/daily-page-generator.js
// Professional scaling strategy for adding pages systematically

const fs = require('fs').promises;
const path = require('path');

class ProfessionalScalingStrategy {
    constructor() {
        this.currentPhase = 1;
        this.pagesAddedToday = 0;
        this.totalPages = 0;
        this.lastRunDate = null;
        
        // Define scaling phases
        this.phases = {
            1: { // Week 1-2: Foundation
                dailyLimit: 3,
                totalTarget: 25,
                description: "Top 25 US cities - Foundation phase"
            },
            2: { // Week 3-4: Growth  
                dailyLimit: 7,
                totalTarget: 75,
                description: "Top 75 US cities - Growth phase"
            },
            3: { // Month 2: Scale
                dailyLimit: 12,
                totalTarget: 200,
                description: "Top 200 US cities - Scale phase"
            },
            4: { // Month 3+: Dominate
                dailyLimit: 20,
                totalTarget: 500,
                description: "500+ cities including international - Domination phase"
            }
        };
    }

    // Priority cities in order of population and search volume
    getPriorityCitiesList() {
        return [
            // Phase 1: Top 25 US cities (Week 1-2)
            {name: "Houston", state: "TX", lat: 29.7604, lng: -95.3698, pop: 2320268, phase: 1},
            {name: "Phoenix", state: "AZ", lat: 33.4484, lng: -112.0740, pop: 1680992, phase: 1},
            {name: "Philadelphia", state: "PA", lat: 39.9526, lng: -75.1652, pop: 1584064, phase: 1},
            {name: "San Antonio", state: "TX", lat: 29.4241, lng: -98.4936, pop: 1547253, phase: 1},
            {name: "San Diego", state: "CA", lat: 32.7157, lng: -117.1611, pop: 1423851, phase: 1},
            {name: "Dallas", state: "TX", lat: 32.7767, lng: -96.7970, pop: 1343573, phase: 1},
            {name: "San Jose", state: "CA", lat: 37.3382, lng: -121.8863, pop: 1021795, phase: 1},
            {name: "Austin", state: "TX", lat: 30.2672, lng: -97.7431, pop: 978908, phase: 1},
            {name: "Jacksonville", state: "FL", lat: 30.3322, lng: -81.6557, pop: 949611, phase: 1},
            {name: "Fort Worth", state: "TX", lat: 32.7555, lng: -97.3308, pop: 918915, phase: 1},
            {name: "Columbus", state: "OH", lat: 39.9612, lng: -82.9988, pop: 905748, phase: 1},
            {name: "Charlotte", state: "NC", lat: 35.2271, lng: -80.8431, pop: 885708, phase: 1},
            {name: "San Francisco", state: "CA", lat: 37.7749, lng: -122.4194, pop: 881549, phase: 1},
            {name: "Indianapolis", state: "IN", lat: 39.7684, lng: -86.1581, pop: 876384, phase: 1},
            {name: "Seattle", state: "WA", lat: 47.6062, lng: -122.3321, pop: 753675, phase: 1},
            {name: "Denver", state: "CO", lat: 39.7392, lng: -104.9903, pop: 715522, phase: 1},
            {name: "Washington", state: "DC", lat: 38.9072, lng: -77.0369, pop: 705749, phase: 1},
            {name: "Boston", state: "MA", lat: 42.3601, lng: -71.0589, pop: 685094, phase: 1},
            {name: "El Paso", state: "TX", lat: 31.7619, lng: -106.4850, pop: 678815, phase: 1},
            {name: "Detroit", state: "MI", lat: 42.3314, lng: -83.0458, pop: 670031, phase: 1},
            {name: "Nashville", state: "TN", lat: 36.1627, lng: -86.7816, pop: 668347, phase: 1},
            {name: "Portland", state: "OR", lat: 45.5152, lng: -122.6784, pop: 652503, phase: 1},
            {name: "Memphis", state: "TN", lat: 35.1495, lng: -90.0490, pop: 651073, phase: 1},
            {name: "Oklahoma City", state: "OK", lat: 35.4676, lng: -97.5164, pop: 695057, phase: 1},
            {name: "Las Vegas", state: "NV", lat: 36.1699, lng: -115.1398, pop: 651319, phase: 1},

            // Phase 2: Next 50 cities (Week 3-4)
            {name: "Louisville", state: "KY", lat: 38.2527, lng: -85.7585, pop: 617638, phase: 2},
            {name: "Baltimore", state: "MD", lat: 39.2904, lng: -76.6122, pop: 576498, phase: 2},
            {name: "Milwaukee", state: "WI", lat: 43.0389, lng: -87.9065, pop: 577222, phase: 2},
            {name: "Albuquerque", state: "NM", lat: 35.0844, lng: -106.6504, pop: 564559, phase: 2},
            {name: "Tucson", state: "AZ", lat: 32.2217, lng: -110.9265, pop: 548073, phase: 2},
            {name: "Fresno", state: "CA", lat: 36.7378, lng: -119.7871, pop: 542107, phase: 2},
            {name: "Sacramento", state: "CA", lat: 38.5816, lng: -121.4944, pop: 524943, phase: 2},
            {name: "Mesa", state: "AZ", lat: 33.4194, lng: -111.8315, pop: 518012, phase: 2},
            {name: "Kansas City", state: "MO", lat: 39.0997, lng: -94.5786, pop: 495327, phase: 2},
            {name: "Atlanta", state: "GA", lat: 33.7490, lng: -84.3880, pop: 498715, phase: 2},
            // ... continue with more cities

            // Phase 3: Smaller cities + tourist destinations (Month 2)
            {name: "Miami", state: "FL", lat: 25.7617, lng: -80.1918, pop: 463347, phase: 3},
            {name: "Honolulu", state: "HI", lat: 21.3099, lng: -157.8581, pop: 345064, phase: 3},
            {name: "Anchorage", state: "AK", lat: 61.2181, lng: -149.9003, pop: 291538, phase: 3},
            // ... tourist destinations, state capitals, etc.

            // Phase 4: International expansion (Month 3+)
            {name: "Toronto", state: "ON", country: "Canada", lat: 43.6532, lng: -79.3832, pop: 2930000, phase: 4},
            {name: "London", state: "England", country: "UK", lat: 51.5074, lng: -0.1278, pop: 8982000, phase: 4},
            {name: "Sydney", state: "NSW", country: "Australia", lat: -33.8688, lng: 151.2093, pop: 5312000, phase: 4}
            // ... international cities
        ];
    }

    async getCurrentPhase() {
        try {
            const stats = await this.getStats();
            const totalPages = stats.totalPages;
            
            if (totalPages < 25) return 1;
            if (totalPages < 75) return 2; 
            if (totalPages < 200) return 3;
            return 4;
        } catch (error) {
            return 1; // Default to phase 1
        }
    }

    async getStats() {
        try {
            const statsFile = path.join(__dirname, '../data/scaling-stats.json');
            const data = await fs.readFile(statsFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            // Initialize stats if file doesn't exist
            return {
                totalPages: 3, // Starting with NYC, LA, Chicago
                pagesAddedToday: 0,
                lastRunDate: null,
                currentPhase: 1
            };
        }
    }

    async updateStats(stats) {
        const statsFile = path.join(__dirname, '../data/scaling-stats.json');
        await fs.mkdir(path.dirname(statsFile), { recursive: true });
        await fs.writeFile(statsFile, JSON.stringify(stats, null, 2));
    }

    async getCitiesForToday() {
        const stats = await this.getStats();
        const currentPhase = await this.getCurrentPhase();
        const today = new Date().toDateString();
        
        // Reset daily counter if new day
        if (stats.lastRunDate !== today) {
            stats.pagesAddedToday = 0;
            stats.lastRunDate = today;
        }

        const dailyLimit = this.phases[currentPhase].dailyLimit;
        const remainingToday = dailyLimit - stats.pagesAddedToday;
        
        if (remainingToday <= 0) {
            console.log(`✅ Daily limit reached for phase ${currentPhase} (${dailyLimit} pages)`);
            return [];
        }

        // Get cities for current phase that haven't been created yet
        const allCities = this.getPriorityCitiesList();
        const phaseCities = allCities.filter(city => city.phase <= currentPhase);
        
        // Check which cities already exist
        const existingCities = await this.getExistingCities();
        const newCities = phaseCities.filter(city => {
            const slug = this.cityToSlug(city);
            return !existingCities.includes(slug);
        });

        return newCities.slice(0, remainingToday);
    }

    cityToSlug(city) {
        return `${city.name.toLowerCase().replace(/\s+/g, '-')}-${city.state.toLowerCase()}`;
    }

    async getExistingCities() {
        try {
            const locationsPath = path.join(__dirname, '../dist/locations');
            const states = await fs.readdir(locationsPath);
            const existing = [];
            
            for (const state of states) {
                const statePath = path.join(locationsPath, state);
                const files = await fs.readdir(statePath);
                const htmlFiles = files.filter(f => f.endsWith('.html'));
                existing.push(...htmlFiles.map(f => f.replace('.html', '')));
            }
            
            return existing;
        } catch (error) {
            return ['new-york-ny', 'los-angeles-ca', 'chicago-il']; // Default existing
        }
    }

    async runDailyGeneration() {
        console.log('🚀 Starting daily page generation...');
        
        const currentPhase = await this.getCurrentPhase();
        const stats = await this.getStats();
        const citiesToAdd = await this.getCitiesForToday();
        
        console.log(`📊 Current Phase: ${currentPhase} - ${this.phases[currentPhase].description}`);
        console.log(`📈 Total Pages: ${stats.totalPages}`);
        console.log(`📅 Pages Added Today: ${stats.pagesAddedToday}/${this.phases[currentPhase].dailyLimit}`);
        console.log(`🎯 Cities to Add Today: ${citiesToAdd.length}`);
        
        if (citiesToAdd.length === 0) {
            console.log('✅ No new pages to add today (daily limit reached or phase complete)');
            return;
        }

        // Generate pages for selected cities
        let pagesAdded = 0;
        for (const city of citiesToAdd) {
            try {
                await this.generateCityPage(city);
                pagesAdded++;
                console.log(`✅ Added: ${city.name}, ${city.state}`);
            } catch (error) {
                console.error(`❌ Failed to add ${city.name}: ${error.message}`);
            }
        }

        // Update stats
        stats.totalPages += pagesAdded;
        stats.pagesAddedToday += pagesAdded;
        stats.lastRunDate = new Date().toDateString();
        stats.currentPhase = currentPhase;
        
        await this.updateStats(stats);
        
        console.log(`🎉 Daily generation complete! Added ${pagesAdded} pages`);
        
        // Check if ready for next phase
        if (stats.totalPages >= this.phases[currentPhase].totalTarget && currentPhase < 4) {
            console.log(`🚀 Ready for Phase ${currentPhase + 1}!`);
            console.log(`Next phase: ${this.phases[currentPhase + 1].description}`);
        }
    }

    async generateCityPage(city) {
        // This would use your enhanced build system
        const EnhancedSiteBuilder = require('./enhanced-build');
        const builder = new EnhancedSiteBuilder();
        
        const slug = this.cityToSlug(city);
        const locationData = this.cityToLocationData(city);
        
        await builder.buildLocationPage(slug, locationData);
    }

    cityToLocationData(city) {
        // Convert city info to full location data format
        return {
            name: city.name,
            state: this.getStateName(city.state),
            stateCode: city.state,
            country: city.country || "United States",
            latitude: city.lat,
            longitude: city.lng,
            timezone: this.getTimezone(city.lat, city.lng),
            population: city.pop,
            elevation: this.estimateElevation(city.lat, city.lng),
            keywords: [`${city.name} sunrise times`, `${city.name} sunset`, `${city.state} golden hour`],
            attractions: this.generateAttractions(city),
            photoSpots: this.generatePhotoSpots(city),
            localInfo: this.generateLocalInfo(city)
        };
    }

    getStateName(code) {
        const states = {
            'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
            'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
            'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
            'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
            'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
            'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
            'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
            'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
            'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
            'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
            'DC': 'District of Columbia'
        };
        return states[code] || code;
    }

    getTimezone(lat, lng) {
        // Simple timezone detection - in production use proper timezone API
        if (lng > -68) return "America/New_York";
        if (lng > -87) return "America/Chicago"; 
        if (lng > -115) return "America/Denver";
        if (lng > -125) return "America/Los_Angeles";
        return "America/Anchorage";
    }

    estimateElevation(lat, lng) {
        // Rough elevation estimates - in production use elevation API
        // Mountain states
        if (['CO', 'WY', 'MT', 'ID', 'UT', 'NV'].includes(this.getStateFromCoords(lat, lng))) {
            return Math.floor(Math.random() * 3000) + 1000; // 1000-4000 ft
        }
        // Coastal states
        if (['FL', 'LA', 'CA', 'OR', 'WA'].includes(this.getStateFromCoords(lat, lng))) {
            return Math.floor(Math.random() * 200) + 10; // 10-200 ft
        }
        // Default
        return Math.floor(Math.random() * 800) + 200; // 200-1000 ft
    }

    getStateFromCoords(lat, lng) {
        // Simplified state detection - in production use proper geocoding
        if (lat > 47) return 'WA';
        if (lat < 26) return 'FL';
        if (lng < -115) return 'CA';
        if (lng > -80) return 'NY';
        return 'TX'; // Default
    }

    generateAttractions(city) {
        const generic = [
            {name: `${city.name} Downtown`, sunViewingInfo: `Urban sunrise and sunset views from the heart of ${city.name}`},
            {name: `${city.name} Waterfront`, sunViewingInfo: `Scenic water views perfect for golden hour photography`},
            {name: `${city.name} Parks`, sunViewingInfo: `Green spaces offering natural sunrise and sunset viewing opportunities`}
        ];
        return generic;
    }

    generatePhotoSpots(city) {
        return [
            {name: "City Overlook", description: `Elevated views of ${city.name} perfect for sunrise photography`},
            {name: "Historic District", description: `Charming architecture creates beautiful sunset backdrops`},
            {name: "Riverside/Lakefront", description: `Water reflections enhance golden hour compositions`}
        ];
    }

    generateLocalInfo(city) {
        return {
            bestViewingMonths: ["April", "May", "September", "October"],
            sunriseDirection: "East",
            sunsetDirection: "West", 
            uniqueFeatures: `${city.name} offers unique sunrise and sunset viewing opportunities with its local geography and urban layout.`,
            photographyTips: `For best results in ${city.name}, scout locations in advance and arrive 30 minutes before sunrise or sunset for optimal lighting.`,
            seasonalHighlights: `Each season in ${city.name} offers distinct photography opportunities with changing weather patterns and lighting conditions.`
        };
    }
}

// CLI interface
async function main() {
    const strategy = new ProfessionalScalingStrategy();
    
    if (process.argv.includes('--stats')) {
        const stats = await strategy.getStats();
        const phase = await strategy.getCurrentPhase();
        console.log('📊 Current Statistics:');
        console.log(`   Phase: ${phase} - ${strategy.phases[phase].description}`);
        console.log(`   Total Pages: ${stats.totalPages}`);
        console.log(`   Added Today: ${stats.pagesAddedToday}/${strategy.phases[phase].dailyLimit}`);
        console.log(`   Last Run: ${stats.lastRunDate || 'Never'}`);
        return;
    }
    
    if (process.argv.includes('--preview')) {
        const cities = await strategy.getCitiesForToday();
        console.log('🎯 Cities scheduled for today:');
        cities.forEach((city, i) => {
            console.log(`   ${i + 1}. ${city.name}, ${city.state} (Phase ${city.phase})`);
        });
        return;
    }
    
    // Run daily generation
    await strategy.runDailyGeneration();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { ProfessionalScalingStrategy };