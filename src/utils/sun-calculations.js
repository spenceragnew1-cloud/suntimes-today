// src/utils/sun-calculations.js
// High-precision solar position calculations based on astronomical algorithms

class SunCalculator {
  constructor() {
    // Julian day constants
    this.J1970 = 2440588;  // Julian day for Jan 1, 1970
    this.J2000 = 2451545;  // Julian day for Jan 1, 2000

    // Conversion constants
    this.deg2rad = Math.PI / 180;
    this.rad2deg = 180 / Math.PI;

    // Solar orbital elements (simplified)
    this.M0 = 357.5291 * this.deg2rad;    // Mean anomaly at epoch
    this.M1 = 0.98560028 * this.deg2rad;  // Mean anomaly rate
    this.C1 = 1.9148 * this.deg2rad;      // Equation of center coefficients
    this.C2 = 0.0200 * this.deg2rad;
    this.C3 = 0.0003 * this.deg2rad;
    this.P = 102.9372 * this.deg2rad;     // Perihelion longitude

    // Earth's orbital parameters
    this.obliquity = 23.4397 * this.deg2rad;  // Earth's axial tilt

    // Solar disc diameter (approximately 32 arcminutes)
    this.SUNRISE_SUNSET_ANGLE = -0.833;  // Standard refraction + sun's radius
    this.CIVIL_DAWN_DUSK_ANGLE = -6;     // Civil twilight
    this.NAUTICAL_DAWN_DUSK_ANGLE = -12; // Nautical twilight
    this.ASTRONOMICAL_DAWN_DUSK_ANGLE = -18; // Astronomical twilight
  }

  /**
   * Convert JavaScript Date to Julian day number
   * @param {Date} date - The date to convert
   * @returns {number} Julian day number
   */
  toJulianDay(date) {
    return date.valueOf() / 86400000 - 0.5 + this.J1970;
  }

  /**
   * Convert Julian day number back to JavaScript Date
   * @param {number} julianDay - Julian day number
   * @returns {Date} JavaScript Date object
   */
  fromJulianDay(julianDay) {
    return new Date((julianDay + 0.5 - this.J1970) * 86400000);
  }

  /**
   * Calculate days since J2000 epoch
   * @param {Date} date - Input date
   * @returns {number} Days since J2000
   */
  daysSinceJ2000(date) {
    return this.toJulianDay(date) - this.J2000;
  }

  /**
   * Calculate solar mean anomaly
   * @param {number} d - Days since J2000
   * @returns {number} Mean anomaly in radians
   */
  solarMeanAnomaly(d) {
    return this.M0 + this.M1 * d;
  }

  /**
   * Calculate equation of center (sun's position correction)
   * @param {number} M - Mean anomaly in radians
   * @returns {number} Equation of center in radians
   */
  equationOfCenter(M) {
    return this.C1 * Math.sin(M) +
           this.C2 * Math.sin(2 * M) +
           this.C3 * Math.sin(3 * M);
  }

  /**
   * Calculate ecliptic longitude of the sun
   * @param {number} M - Mean anomaly in radians
   * @returns {number} Ecliptic longitude in radians
   */
  eclipticLongitude(M) {
    const C = this.equationOfCenter(M);
    return M + C + this.P + Math.PI;
  }

  /**
   * Calculate solar declination
   * @param {number} l - Ecliptic longitude in radians
   * @returns {number} Solar declination in radians
   */
  sunDeclination(l) {
    return Math.asin(Math.sin(l) * Math.sin(this.obliquity));
  }

  /**
   * Calculate right ascension
   * @param {number} l - Ecliptic longitude in radians
   * @returns {number} Right ascension in radians
   */
  rightAscension(l) {
    return Math.atan2(Math.sin(l) * Math.cos(this.obliquity), Math.cos(l));
  }

  /**
   * Calculate sidereal time at Greenwich
   * @param {number} d - Days since J2000
   * @param {number} lw - Longitude west in radians
   * @returns {number} Sidereal time in radians
   */
  siderealTime(d, lw) {
    return (280.16 + 360.9856235 * d) * this.deg2rad - lw;
  }

  /**
   * Calculate hour angle for given sun altitude
   * @param {number} h - Sun altitude in degrees
   * @param {number} phi - Observer latitude in radians
   * @param {number} d - Solar declination in radians
   * @returns {number|null} Hour angle in radians, or null for polar day/night
   */
  hourAngle(h, phi, d) {
    const H0 = h * this.deg2rad;
    const cosH = (Math.sin(H0) - Math.sin(phi) * Math.sin(d)) /
                 (Math.cos(phi) * Math.cos(d));

    // Check for polar day/night conditions
    if (cosH > 1) {
      return null; // Sun never rises (polar night)
    }
    if (cosH < -1) {
      return null; // Sun never sets (polar day)
    }

    return Math.acos(cosH);
  }

  /**
   * Calculate solar noon and nadir times
   * @param {Date} date - Input date
   * @param {number} lat - Latitude in degrees
   * @param {number} lng - Longitude in degrees
   * @returns {Object} Object with solarNoon and nadir times
   */
  getSolarNoonAndNadir(date, lat, lng) {
    const lw = lng * -this.deg2rad;
    const phi = lat * this.deg2rad;
    const d = this.daysSinceJ2000(date);
    const M = this.solarMeanAnomaly(d);
    const L = this.eclipticLongitude(M);

    const n = Math.round(d - 0.0009 - lw / (2 * Math.PI));
    const ds = 0.0009 + lw / (2 * Math.PI);
    const Jnoon = this.J2000 + n + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);

    const solarNoon = this.fromJulianDay(Jnoon);
    const nadir = this.fromJulianDay(Jnoon - 0.5);

    return { solarNoon, nadir };
  }

  /**
   * Get sun times for a specific date and location
   * @param {Date} date - The date to calculate for
   * @param {number} lat - Latitude in degrees (positive = North)
   * @param {number} lng - Longitude in degrees (positive = East)
   * @param {number} altitude - Solar altitude angle in degrees (default: -0.833)
   * @returns {Object} Object containing sunrise, sunset, and other sun times
   */
  getSunTimes(date, lat, lng, altitude = this.SUNRISE_SUNSET_ANGLE) {
    const lw = lng * -this.deg2rad;
    const phi = lat * this.deg2rad;
    const d = this.daysSinceJ2000(date);

    const M = this.solarMeanAnomaly(d);
    const L = this.eclipticLongitude(M);
    const dec = this.sunDeclination(L);
    const H = this.hourAngle(altitude, phi, dec);

    // Check for polar conditions
    if (H === null) {
      const { solarNoon, nadir } = this.getSolarNoonAndNadir(date, lat, lng);

      // Determine if it's polar day or night based on sun's declination
      const sunNeverSets = (lat > 0 && dec > 0 && lat + dec * this.rad2deg > 90) ||
                          (lat < 0 && dec < 0 && lat + dec * this.rad2deg < -90);

      return {
        sunrise: null,
        sunset: null,
        solarNoon,
        nadir,
        polarEvent: sunNeverSets ? 'polar_day' : 'polar_night',
        daylightHours: sunNeverSets ? 24 : 0
      };
    }

    // Calculate Julian days for sunset and sunrise
    const n = Math.round(d - 0.0009 - lw / (2 * Math.PI));
    const ds = 0.0009 + lw / (2 * Math.PI) + H / (2 * Math.PI);
    const Jset = this.J2000 + n + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
    const Jrise = Jset - 2 * H / (2 * Math.PI);

    const sunrise = this.fromJulianDay(Jrise);
    const sunset = this.fromJulianDay(Jset);
    const { solarNoon, nadir } = this.getSolarNoonAndNadir(date, lat, lng);

    // Calculate daylight hours
    const daylightMs = sunset.getTime() - sunrise.getTime();
    const daylightHours = daylightMs / (1000 * 60 * 60);

    return {
      sunrise,
      sunset,
      solarNoon,
      nadir,
      polarEvent: 'none',
      daylightHours: Math.max(0, daylightHours)
    };
  }

  /**
   * Get twilight times (civil, nautical, astronomical)
   * @param {Date} date - The date to calculate for
   * @param {number} lat - Latitude in degrees
   * @param {number} lng - Longitude in degrees
   * @returns {Object} Object containing all twilight times
   */
  getTwilightTimes(date, lat, lng) {
    const sunrise = this.getSunTimes(date, lat, lng, this.SUNRISE_SUNSET_ANGLE);
    const civil = this.getSunTimes(date, lat, lng, this.CIVIL_DAWN_DUSK_ANGLE);
    const nautical = this.getSunTimes(date, lat, lng, this.NAUTICAL_DAWN_DUSK_ANGLE);
    const astronomical = this.getSunTimes(date, lat, lng, this.ASTRONOMICAL_DAWN_DUSK_ANGLE);

    return {
      // Sunrise/sunset
      sunrise: sunrise.sunrise,
      sunset: sunrise.sunset,
      solarNoon: sunrise.solarNoon,

      // Civil twilight
      civilDawn: civil.sunrise,
      civilDusk: civil.sunset,

      // Nautical twilight
      nauticalDawn: nautical.sunrise,
      nauticalDusk: nautical.sunset,

      // Astronomical twilight
      astronomicalDawn: astronomical.sunrise,
      astronomicalDusk: astronomical.sunset,

      // Additional info
      daylightHours: sunrise.daylightHours,
      polarEvent: sunrise.polarEvent
    };
  }

  /**
   * Format time for display with timezone support
   * @param {Date|null} date - Date object to format
   * @param {string} timezone - IANA timezone identifier
   * @param {Object} options - Formatting options
   * @returns {string|null} Formatted time string
   */
  formatTime(date, timezone, options = {}) {
    if (!date) return null;

    const defaultOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone
    };

    return date.toLocaleTimeString('en-US', { ...defaultOptions, ...options });
  }

  /**
   * Format duration in hours and minutes
   * @param {number} hours - Duration in decimal hours
   * @returns {string} Formatted duration string
   */
  formatDuration(hours) {
    if (hours === 0) return '0h 0m';
    if (hours === 24) return '24h 0m';

    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  }

  /**
   * Get sunrise/sunset times for multiple days
   * @param {Date} startDate - Start date
   * @param {number} days - Number of days to calculate
   * @param {number} lat - Latitude in degrees
   * @param {number} lng - Longitude in degrees
   * @returns {Array} Array of sun times for each day
   */
  getSunTimesRange(startDate, days, lat, lng) {
    const results = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < days; i++) {
      const sunTimes = this.getSunTimes(currentDate, lat, lng);
      results.push({
        date: new Date(currentDate),
        ...sunTimes
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return results;
  }
}

module.exports = SunCalculator;