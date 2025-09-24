const express = require('express');
const path = require('path');
const fs = require('fs-extra');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));

// Serve generated content
app.use('/locations', express.static('public/locations'));
app.use('/assets', express.static('public/assets'));
app.use('/images', express.static('public/images'));

// API endpoint for real-time sunrise/sunset data
app.get('/api/suntimes/:location', async (req, res) => {
  const { location } = req.params;
  const today = new Date().toISOString().split('T')[0];

  try {
    // Load location data
    const locationData = await fs.readJson(`src/data/locations/${location}.json`);
    res.json({
      location: locationData.name,
      date: today,
      sunrise: locationData.sunrise,
      sunset: locationData.sunset,
      coordinates: locationData.coordinates
    });
  } catch (error) {
    res.status(404).json({ error: 'Location not found' });
  }
});

// Development route to trigger page generation
app.get('/dev/generate', (req, res) => {
  const { spawn } = require('child_process');
  const generate = spawn('claude', ['run', 'scripts/generate-pages.claude']);

  generate.on('close', (code) => {
    res.json({ status: code === 0 ? 'success' : 'error', code });
  });
});

app.listen(PORT, () => {
  console.log(`🌅 SunTimes Today dev server running on http://localhost:${PORT}`);
  console.log(`📍 Locations: http://localhost:${PORT}/locations`);
  console.log(`🔧 Generate: http://localhost:${PORT}/dev/generate`);
});