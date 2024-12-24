const express = require('express');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const app = express();
const PORT = 4000;

// Ensure data directory and files exist
const initializeDataFiles = async () => {
  const dataDir = path.join(__dirname, 'data');
  const analyticsFile = path.join(dataDir, 'analytics.json');
  const waitlistFile = path.join(dataDir, 'waitlist.json');

  try {
    // Create data directory if it doesn't exist
    await fs.mkdir(dataDir, { recursive: true });

    // Initialize files if they don't exist
    for (const file of [analyticsFile, waitlistFile]) {
      try {
        await fs.access(file);
      } catch {
        // Create with initial array structure
        await fs.writeFile(file, '[]');
      }
    }
  } catch (error) {
    console.error('Error initializing data files:', error);
  }
};

// Simplified analytics tracking with append
const trackEvent = async (req, event) => {
  const analyticsPath = path.join(__dirname, 'data', 'analytics.json');
  
  try {
    // Create event entry with additional metadata
    const eventEntry = {
      timestamp: new Date().toISOString(),
      event,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      referer: req.headers.referer || 'direct',
      path: req.path,
      // Add language from request headers if available
      language: req.headers['accept-language']?.split(',')[0] || 'unknown'
    };

    // Read file synchronously to avoid race conditions
    let analytics = [];
    try {
      const fileContent = fsSync.readFileSync(analyticsPath, 'utf8');
      analytics = JSON.parse(fileContent);
      if (!Array.isArray(analytics)) {
        analytics = [];
      }
    } catch (error) {
      console.error('Error reading analytics file:', error);
      analytics = [];
    }

    // Append new event
    analytics.push(eventEntry);

    // Write back synchronously to ensure atomic operation
    fsSync.writeFileSync(analyticsPath, JSON.stringify(analytics, null, 2));
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Initialize data files before starting the server
initializeDataFiles().then(() => {
  app.use(express.json());

  // Middleware to track page visits
  app.use((req, res, next) => {
    // Only track actual page visits, exclude assets, API calls, and translation files
    if (req.method === 'GET' && 
        !req.path.startsWith('/api/') && 
        !req.path.startsWith('/translations/') &&
        !req.path.match(/\.(js|css|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/)) {
      trackEvent(req, {
        type: 'pageview',
        path: req.path
      }).catch(console.error);
    }
    next();
  });

  // API endpoint for waiting list
  app.post('/api/waitlist', async (req, res) => {
    try {
      const { email, type, location } = req.body;
      
      await trackEvent(req, {
        type: 'form_submission',
        status: 'attempt'
      });

      const waitlistPath = path.join(__dirname, 'data', 'waitlist.json');
      let waitlist = [];
      
      try {
        const data = await fs.readFile(waitlistPath, 'utf8');
        waitlist = JSON.parse(data);
        if (!Array.isArray(waitlist)) {
          waitlist = [];
        }
      } catch (error) {
        console.error('Error reading waitlist:', error);
      }

      waitlist.push({
        email,
        type,
        location,
        timestamp: new Date().toISOString()
      });

      await fs.writeFile(waitlistPath, JSON.stringify(waitlist, null, 2));

      await trackEvent(req, {
        type: 'form_submission',
        status: 'success'
      });

      res.status(200).json({ message: 'Successfully joined waitlist' });
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      
      await trackEvent(req, {
        type: 'form_submission',
        status: 'error',
        error: error.message
      });

      res.status(500).json({ error: 'Failed to join waitlist' });
    }
  });

  // Add new tracking endpoint for client-side events
  app.post('/api/track', async (req, res) => {
    try {
      const eventData = req.body;
      
      // Track the event
      await trackEvent(req, {
        type: eventData.type,
        ...eventData
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error tracking event:', error);
      res.status(500).json({ error: 'Failed to track event' });
    }
  });

  // Serve static files
  app.use(express.static(path.join(__dirname, 'public')));

  // Add a catch-all route for SPA
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`Marketplace site running at http://localhost:${PORT}`);
    console.log(`Static files being served from: ${path.join(__dirname, 'public')}`);
  });
}); 