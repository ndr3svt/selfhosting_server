# Self-Hosted Multi-Domain Server

A Node.js-based reverse proxy server that handles multiple domains, each running as an independent application.

This repository presents a methodology for self-hosting a custom domain using a low-cost home infrastructure. It leverages Cloudflare and IPv6 to proxy traffic between your domain's DNS and the IPv6 address of your home machine.

It also demonstrates an example of hosting multiple domains on the same server by routing traffic based on URL patterns to your locally hosted Node.js applications.

This offers a compact and highly cost-effective solution for hosting a wide range of applications, including simple websites, web apps, APIs, SaaS Products, WebSocket managers, database servers, and more—whatever you need.

This solution is perfect for building and testing your products with close-to-zero costs, even enabling you to serve them to real users and customers. It allows you to validate your business idea before deciding to scale it further.


## Requirements
- You'll need a domain, which you can purchase from any domain registrar. In this example, we use a domain registered through Namecheap.
- You'll also need a spare machine, preferably a headless one to minimize energy consumption. This could be a Raspberry Pi, Mac Mini, or a similar device. Ideally, the machine should run Linux or Unix for smoother installation of npm, Node.js modules, and IPv6-related protocols.
- Lastly, you'll need a free Cloudflare account and a stable internet connection. The faster the connection, the better the performance.


## Architecture

```/
├── server.js # Main reverse proxy server
├── package.json # Root dependencies
├── public_selfhosted_domain_cc/ # deskflot marketplace app with node js schadcn tailwind 
│ ├── app.js # Marketplace server
│ ├── public/ # Static assets
│ ├── data/ # Local data storage (gitignored)
│ └── package.json # App-specific dependencies
├── public_selfhosted_domain_cc/ # Other domain applications
│ ├── app.js
│ └── ...
└── README.md
```

## Current Domains

1. **deskflot** (`public_selfhosted_domain_cc/`)
   - Desk space rental marketplace
   - Features: Analytics tracking, multilingual support, waitlist system
   - Port: 4000

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Domain names configured to point to your server

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd self-hosting
```


3. Install dependencies for each domain:

```bash
# Install deskflot dependencies
cd public_selfhosted_domain_cc
npm install
cd ..
## Repeat for other domains
```

## Configuration

### 1. Root Server (server.js)

The main reverse proxy server handles incoming requests and routes them to the appropriate domain application.

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PROXY_PORT=80 # Main proxy server port
HTTPS_PORT=443 # HTTPS port (if using SSL)
SSL_CERT_PATH=/path/to/cert
SSL_KEY_PATH=/path/to/key
```


### 2. Domain Applications

Each domain runs as a separate application with its own configuration.

#### deskflot (public_selfhosted_domain_cc)
Create a `.env` file in the domain directory:

```env
PORT=4000
NODE_ENV=development
```

## Running the Project

### Development Mode

1. Start the main proxy server:

```bash
In root directory
npm run dev
```


2. Start the deskflot application:

```bash
In public_selfhosted_domain_cc directory
npm run dev
```

3. Build and watch CSS for deskflot:

```bash
In public_selfhosted_domain_cc directory
npm run css:watch
```



### Production Mode

1. Build assets for all domains:

```bash
Build deskflot CSS
cd public_selfhosted_domain_cc
npm run css:build
cd ..
```

2. Start all services:

```bash
Start main proxy server
npm start
Start deskflot (in a new terminal)
cd public_selfhosted_domain_cc
npm start
```
## Adding a New Domain

1. Create a new directory for your domain:

```bash
mkdir my_new_domain
cd my_new_domain
```

2. Initialize the domain application:


```bash
npm init
npm install express
```


3. Create the basic files:
   - `app.js`: Main application file
   - `public/`: Static assets
   - `package.json`: Dependencies
   - `.env`: Environment configuration

4. Update the root `server.js` to include the new domain routing:



```javascript
// In server.js
const domains = {
'deskflot.cc': 4000,
'mynewdomain.com': 4001 // Add your new domain
};
```


## Domain-Specific Documentation

- [deskflot Marketplace Documentation more complex architecture](./public_selfhosted_domain_cc/README.md)
- [simple demo domain with less complex architecture](./public_selfhosted_domain/README.md)

## Security Considerations

1. SSL/HTTPS
   - Configure SSL certificates for each domain
   - Use Let's Encrypt for free certificates
   - Update SSL paths in root `.env`

2. Data Privacy
   - Each domain's data is isolated
   - Analytics and user data are stored separately
   - Sensitive files are gitignored

3. Rate Limiting
   - Implement rate limiting per domain
   - Configure appropriate limits based on usage

## Backup

1. Data Directories
   - Back up each domain's `data/` directory
   - Implement regular backup schedule
   - Store backups securely

2. Configuration
   - Back up all `.env` files
   - Document any custom configurations

## Monitoring

1. Logs
   - Each domain maintains its own logs
   - Proxy server logs all routing
   - Monitor for errors and issues

2. Analytics
   - Domain-specific analytics tracking
   - Server resource monitoring

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support:
1. Check domain-specific documentation
2. Open an issue in the repository
3. Contact the maintainers

## Roadmap

- [ ] Add more domain templates
- [ ] Implement shared authentication
- [ ] Add monitoring dashboard
- [ ] Automated SSL renewal
- [ ] Docker support


