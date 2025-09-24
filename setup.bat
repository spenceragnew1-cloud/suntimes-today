@echo off
echo 🚀 Setting up SunTimes Today project...
echo.

REM Create main project directory
cd Desktop
if exist suntimes-today-claude rmdir /s /q suntimes-today-claude
mkdir suntimes-today-claude
cd suntimes-today-claude

echo ✅ Created project directory

REM Create folder structure
mkdir src\data src\templates src\utils src\generators
mkdir public\assets public\images
mkdir dist scripts reports

echo ✅ Created folder structure

REM Create package.json
(
echo {
echo   "name": "suntimes-today",
echo   "version": "1.0.0",
echo   "description": "Automated sunrise/sunset calculator with programmatic SEO",
echo   "scripts": {
echo     "dev": "node scripts/dev-server.js",
echo     "build": "node scripts/build-all.js",
echo     "generate": "node scripts/generate-location-data.js",
echo     "daily": "claude run scripts/daily-update.claude"
echo   },
echo   "dependencies": {
echo     "handlebars": "^4.7.8",
echo     "express": "^4.18.2",
echo     "fs-extra": "^11.1.1"
echo   }
echo }
) > package.json

echo ✅ Created package.json

REM Create .env file
(
echo # Add your Google Analytics ID here
echo GA_TRACKING_ID=
echo SITE_URL=https://suntimestoday.com
echo CLAUDE_API_KEY=
) > .env

echo ✅ Created .env file

REM Create .gitignore
(
echo node_modules/
echo dist/
echo .env
echo .DS_Store
echo *.log
echo .claude/
) > .gitignore

echo ✅ Created .gitignore

REM Create sun-calculations.js
(
echo // src/utils/sun-calculations.js
echo class SunCalculator {
echo   constructor^(^) {
echo     this.J1970 = 2440588;
echo     this.J2000 = 2451545;
echo     this.deg2rad = Math.PI / 180;
echo     this.M0 = 357.5291 * this.deg2rad;
echo     this.M1 = 0.98560028 * this.deg2rad;
echo     this.C1 = 1.9148 * this.deg2rad;
echo     this.C2 = 0.0200 * this.deg2rad;
echo     this.C3 = 0.0003 * this.deg2rad;
echo     this.P = 102.9372 * this.deg2rad;
echo     this.a = 1.0;
echo     this.e = 0.0167;
echo     this.th0 = 280.1600 * this.deg2rad;
echo     this.th1 = 360.9856235 * this.deg2rad;
echo   }
echo.
echo   // Convert date to Julian day
echo   toJulianDay^(date^) {
echo     return date.valueOf^(^) / 86400000 - 0.5 + this.J1970;
echo   }
echo.
echo   // Calculate solar mean anomaly
echo   solarMeanAnomaly^(d^) {
echo     return this.M0 + this.M1 * d;
echo   }
echo.
echo   // Calculate equation of center
echo   equationOfCenter^(M^) {
echo     return this.C1 * Math.sin^(M^) + this.C2 * Math.sin^(2 * M^) + this.C3 * Math.sin^(3 * M^);
echo   }
echo.
echo   // Calculate ecliptic longitude
echo   eclipticLongitude^(M^) {
echo     const C = this.equationOfCenter^(M^);
echo     return M + C + this.P + Math.PI;
echo   }
echo.
echo   // Calculate solar declination
echo   sunDeclination^(l^) {
echo     return Math.asin^(Math.sin^(l^) * Math.sin^(23.4397 * this.deg2rad^)^);
echo   }
echo.
echo   // Calculate right ascension
echo   rightAscension^(l^) {
echo     return Math.atan2^(Math.sin^(l^) * Math.cos^(23.4397 * this.deg2rad^), Math.cos^(l^)^);
echo   }
echo.
echo   // Get sun times for a specific date and location
echo   getSunTimes^(date, lat, lng, altitude = -0.833^) {
echo     const lw = lng * -this.deg2rad;
echo     const phi = lat * this.deg2rad;
echo     const d = this.toJulianDay^(date^) - this.J2000;
echo     const M = this.solarMeanAnomaly^(d^);
echo     const L = this.eclipticLongitude^(M^);
echo     const dec = this.sunDeclination^(L^);
echo.
echo     const h = altitude * this.deg2rad;
echo     let H;
echo
echo     try {
echo       H = Math.acos^(^(Math.sin^(h^) - Math.sin^(phi^) * Math.sin^(dec^)^) / ^(Math.cos^(phi^) * Math.cos^(dec^)^)^);
echo     } catch ^(e^) {
echo       // Polar day/night
echo       return {
echo         sunrise: null,
echo         sunset: null,
echo         polarEvent: 'polar'
echo       };
echo     }
echo.
echo     const Jset = this.J2000 + d + 0.0053 * Math.sin^(M^) - 0.0069 * Math.sin^(2 * L^) + H / ^(2 * Math.PI^);
echo     const Jrise = Jset - 2 * H / ^(2 * Math.PI^);
echo.
echo     const sunrise = new Date^(^(Jrise - this.J1970 + 0.5^) * 86400000^);
echo     const sunset = new Date^(^(Jset - this.J1970 + 0.5^) * 86400000^);
echo.
echo     return {
echo       sunrise,
echo       sunset,
echo       polarEvent: 'none'
echo     };
echo   }
echo.
echo   // Format time for display
echo   formatTime^(date, timezone^) {
echo     if ^(!date^) return null;
echo
echo     return date.toLocaleTimeString^('en-US', {
echo       timeZone: timezone,
echo       hour: '2-digit',
echo       minute: '2-digit',
echo       hour12: true
echo     }^);
echo   }
echo }
echo.
echo module.exports = SunCalculator;
) > src\utils\sun-calculations.js

echo ✅ Created sun-calculations.js

REM Create location data generator
(
echo // scripts/generate-location-data.js
echo const fs = require^('fs'^).promises;
echo const path = require^('path'^);
echo.
echo // Top 10 US cities data
echo const locationData = {
echo   "new-york-ny": {
echo     name: "New York",
echo     state: "New York",
echo     stateCode: "NY",
echo     country: "United States",
echo     latitude: 40.7128,
echo     longitude: -74.0060,
echo     timezone: "America/New_York",
echo     population: 8336817,
echo     elevation: 33,
echo     keywords: ["NYC", "Big Apple", "Manhattan"],
echo     attractions: ["Central Park", "Times Square", "Brooklyn Bridge"],
echo     photoSpots: ["Brooklyn Bridge Park", "Top of the Rock"]
echo   },
echo   "los-angeles-ca": {
echo     name: "Los Angeles",
echo     state: "California",
echo     stateCode: "CA",
echo     country: "United States",
echo     latitude: 34.0522,
echo     longitude: -118.2437,
echo     timezone: "America/Los_Angeles",
echo     population: 3979576,
echo     elevation: 87,
echo     keywords: ["LA", "City of Angels", "Hollywood"],
echo     attractions: ["Hollywood Sign", "Griffith Observatory"],
echo     photoSpots: ["Griffith Observatory", "Manhattan Beach Pier"]
echo   },
echo   "chicago-il": {
echo     name: "Chicago",
echo     state: "Illinois",
echo     stateCode: "IL",
echo     country: "United States",
echo     latitude: 41.8781,
echo     longitude: -87.6298,
echo     timezone: "America/Chicago",
echo     population: 2693976,
echo     elevation: 181,
echo     keywords: ["Windy City", "Chi-town"],
echo     attractions: ["Millennium Park", "Navy Pier"],
echo     photoSpots: ["North Avenue Beach", "Lakefront Trail"]
echo   }
echo };
echo.
echo async function generateLocationData^(^) {
echo   try {
echo     await fs.mkdir^(path.join^(__dirname, '../src/data'^), { recursive: true }^);
echo
echo     await fs.writeFile^(
echo       path.join^(__dirname, '../src/data/locations.json'^),
echo       JSON.stringify^(locationData, null, 2^)
echo     ^);
echo.
echo     console.log^('✅ Location data generated successfully!'^);
echo     console.log^(`📍 Generated ${Object.keys^(locationData^).length} locations`^);
echo
echo     return locationData;
echo   } catch ^(error^) {
echo     console.error^('❌ Error generating location data:', error^);
echo     throw error;
echo   }
echo }
echo.
echo if ^(require.main === module^) {
echo   generateLocationData^(^).catch^(console.error^);
echo }
echo.
echo module.exports = { generateLocationData, locationData };
) > scripts\generate-location-data.js

echo ✅ Created location data generator

REM Create build system
(
echo // scripts/build-all.js
echo const fs = require^('fs'^).promises;
echo const path = require^('path'^);
echo const SunCalculator = require^('../src/utils/sun-calculations'^);
echo.
echo class SiteBuilder {
echo   constructor^(^) {
echo     this.sunCalc = new SunCalculator^(^);
echo     this.outputDir = 'dist';
echo   }
echo.
echo   async initialize^(^) {
echo     await fs.mkdir^(this.outputDir, { recursive: true }^);
echo     await fs.mkdir^(`${this.outputDir}/locations`, { recursive: true }^);
echo     console.log^('✅ Initialized build system'^);
echo   }
echo.
echo   async buildLocationPage^(slug, locationData^) {
echo     const today = new Date^(^);
echo     const sunTimes = this.sunCalc.getSunTimes^(today, locationData.latitude, locationData.longitude^);
echo
echo     const html = `<!DOCTYPE html>
echo ^<html lang="en"^>
echo ^<head^>
echo   ^<meta charset="UTF-8"^>
echo   ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^>
echo   ^<title^>Sunrise ^& Sunset Times in ${locationData.name}, ${locationData.stateCode}^</title^>
echo   ^<meta name="description" content="Get accurate sunrise and sunset times for ${locationData.name}, ${locationData.stateCode}. Updated daily."^>
echo ^</head^>
echo ^<body^>
echo   ^<h1^>Sun Times for ${locationData.name}, ${locationData.stateCode}^</h1^>
echo   ^<p^>Population: ${locationData.population.toLocaleString^(^)}^</p^>
echo   ^<p^>Coordinates: ${locationData.latitude}°N, ${locationData.longitude}°W^</p^>
echo   ^<p^>Today's Sunrise: ${this.sunCalc.formatTime^(sunTimes.sunrise, locationData.timezone^)}^</p^>
echo   ^<p^>Today's Sunset: ${this.sunCalc.formatTime^(sunTimes.sunset, locationData.timezone^)}^</p^>
echo ^</body^>
echo ^</html^>`;
echo.
echo     const outputPath = `${this.outputDir}/locations/${slug}.html`;
echo     await fs.writeFile^(outputPath, html, 'utf8'^);
echo     console.log^(`✅ Generated: ${outputPath}`^);
echo   }
echo.
echo   async buildAllPages^(^) {
echo     console.log^('🏗️ Building all location pages...'^);
echo
echo     try {
echo       const locationsFile = await fs.readFile^('src/data/locations.json', 'utf8'^);
echo       const locations = JSON.parse^(locationsFile^);
echo
echo       for ^(const [slug, locationData] of Object.entries^(locations^)^) {
echo         await this.buildLocationPage^(slug, locationData^);
echo       }
echo
echo       console.log^('🎉 Build completed successfully!'^);
echo     } catch ^(error^) {
echo       console.error^('❌ Build failed:', error^);
echo     }
echo   }
echo }
echo.
echo async function build^(^) {
echo   const builder = new SiteBuilder^(^);
echo   await builder.initialize^(^);
echo   await builder.buildAllPages^(^);
echo }
echo.
echo if ^(require.main === module^) {
echo   build^(^).catch^(console.error^);
echo }
echo.
echo module.exports = { SiteBuilder, build };
) > scripts\build-all.js

echo ✅ Created build system

REM Create Claude automation script
(
echo // scripts/daily-update.claude
echo // Daily automation script for Claude Code
echo.
echo console.log^('🌅 Running daily Sun Times automation...'^);
echo.
echo // This script will be enhanced by Claude Code for:
echo // 1. Generating new location pages
echo // 2. Updating existing content
echo // 3. Creating blog posts
echo // 4. SEO optimization
echo // 5. Automated deployment
echo.
echo const { build } = require^('./build-all'^);
echo.
echo async function runDailyUpdate^(^) {
echo   try {
echo     console.log^('📅 Starting daily update...'^);
echo     await build^(^);
echo     console.log^('✅ Daily update completed'^);
echo   } catch ^(error^) {
echo     console.error^('❌ Daily update failed:', error^);
echo   }
echo }
echo.
echo runDailyUpdate^(^);
) > scripts\daily-update.claude

echo ✅ Created Claude automation script

REM Create simple index.html
(
echo ^<!DOCTYPE html^>
echo ^<html lang="en"^>
echo ^<head^>
echo   ^<meta charset="UTF-8"^>
echo   ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^>
echo   ^<title^>Sun Times Today - Accurate Sunrise ^& Sunset Calculator^</title^>
echo ^</head^>
echo ^<body^>
echo   ^<h1^>🌅 Sun Times Today^</h1^>
echo   ^<p^>Your automated sunrise and sunset calculator^</p^>
echo   ^<p^>^<a href="locations/"^>View Location Pages^</a^>^</p^>
echo ^</body^>
echo ^</html^>
) > dist\index.html

echo ✅ Created homepage

echo.
echo 🎉 SETUP COMPLETE!
echo.
echo Your project is ready at: %cd%
echo.
echo Next steps:
echo 1. Edit .env file and add your Google Analytics ID
echo 2. Run: npm install
echo 3. Run: npm run generate
echo 4. Run: npm run build
echo 5. Check the dist folder for your generated pages!
echo.
echo Files created:
echo ✅ Project structure
echo ✅ Package.json with dependencies
echo ✅ Sun calculation system
echo ✅ Location data for top 3 cities
echo ✅ Build system
echo ✅ Claude automation script
echo ✅ Basic homepage
echo.
echo Ready to generate your first pages!
pause