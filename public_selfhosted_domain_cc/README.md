 # deskflot - Desk Space Rental Marketplace

A modern marketplace application for renting desk spaces by the hour, built with Node.js, Express, and Tailwind CSS.

## Features

- Multilingual support (EN, FR, DE, ES, IT, ET)
- Built-in analytics tracking
- Waitlist system with data storage
- Modern UI with Tailwind CSS
- Responsive design
- Real-time language switching
- Smooth popup notifications

## Project Structure

```/
/public_selfhosted_domain_cc/
├── app.js                 # Express server and API endpoints
├── data/                  # Data storage (gitignored)
│   ├── analytics.json     # Analytics tracking data
│   └── waitlist.json     # Waitlist submissions
├── public/               # Static assets
│   ├── css/             # Compiled CSS
│   ├── js/              # Client-side JavaScript
│   │   ├── main.js      # Main JavaScript functionality
│   │   └── i18n.js      # Internationalization handling
│   └── translations/    # Language files
│       ├── en.json
│       ├── fr.json
│       ├── de.json
│       ├── es.json
│       ├── it.json
│       └── et.json
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A modern web browser

## Quick Start

1. Install dependencies:
```npm install```

2. Create data directory and initialize files:
```bash
mkdir -p data
echo "[]" > data/analytics.json
echo "[]" > data/waitlist.json
```
3. Start development server:
```bash
npm run dev
```

4. In a separate terminal, watch CSS changes:
```bash
npm run css:watch
```

The app will be available at http://localhost:4000

## Available Scripts
```bash
npm run dev - Start development server with hot reload
npm run css:watch - Watch and compile CSS changes
npm run css:build - Build CSS for production
npm start - Start production server
```

## Configuration

Create a .env file in the project root:
```env
PORT=4000              # Application port
NODE_ENV=development   # Environment (development/production)
```

## Features Documentation

1. Analytics Tracking
- Automatically tracks page visits
- Filters out asset requests
- Stores data in data/analytics.json
- Tracks form submissions and events

2. Multilingual Support
- Language selection persists across sessions
- Easy to add new languages
- Real-time language switching
- Supports RTL languages

3. Waitlist System
- Collects email, type, and location
- Data stored in data/waitlist.json
- Success/error notifications
- Form validation

4. UI Components
- Modern navigation with mobile support
- Hero section with gradient text
- Feature grid
- Smooth popup notifications
- Responsive design

## Adding a New Language

1. Create a new JSON file in public/translations/
2. Copy structure from en.json
3. Translate all values
4. Add language option to the selector in index.html

## Development Guidelines

1. CSS Modifications
- Add custom styles to styles.css
- Use Tailwind utility classes when possible
- Run css:watch during development

2. JavaScript Changes
- Main functionality in main.js
- Language handling in i18n.js
- Use ES6+ features

3. Analytics Implementation
- Track new events in app.js
- Add event types as needed
- Implement data retention if required

## Production Deployment

1. Build assets:
```bash
npm run css:build
```
2. Set environment:
```env
NODE_ENV=production
```
3. Start server:
```bash
npm start
```
## Security Considerations

1. Data Storage
- All sensitive data in data/ directory
- Directory is gitignored
- Implement backup strategy

2. Form Protection
- Input validation
- Rate limiting
- CSRF protection

3. Analytics Privacy
- IP anonymization
- Data retention policies
- GDPR compliance

## Troubleshooting

1. CSS not updating
- Ensure css:watch is running
- Clear browser cache
- Check for PostCSS errors

2. Language not switching
- Check browser console
- Verify JSON file format
- Clear localStorage

3. Analytics not tracking
- Check data directory permissions
- Verify file write access
- Check server logs

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

## Support

For issues:
1. Check troubleshooting guide
2. Review existing issues
3. Open new issue with details

## Future Enhancements

- User authentication
- Booking system
- Payment integration
- Host dashboard
- Review system
- Search functionality
- Map integration