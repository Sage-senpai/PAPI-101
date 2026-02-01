# 🚀 Chain Info API Service

A **production-ready Node.js backend service** that delivers real-time Polkadot blockchain data through REST API and WebSocket connections. Built with TypeScript, Express, and PAPI (Polkadot API).

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.7.2-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- 📡 **Real-time blockchain data** via REST API
- 🔌 **WebSocket support** for live block updates
- ⚡ **High-performance caching** with NodeCache
- 🛡️ **Rate limiting** and security middleware
- 📊 **Prometheus metrics** for monitoring
- 🏥 **Health check endpoints**
- 🐳 **Docker support** for easy deployment
- 📝 **Comprehensive logging** with Winston
- 🔒 **Type-safe** end-to-end TypeScript

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Service](#running-the-service)
- [API Endpoints](#api-endpoints)
- [WebSocket API](#websocket-api)
- [Frontend Dashboard](#frontend-dashboard)
- [Docker Deployment](#docker-deployment)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **TypeScript** 5.x
- Basic understanding of blockchain concepts

## 📦 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd chain-info-api-service
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3005
NODE_ENV=development
PAPI_CHAIN=polkadot
LOG_LEVEL=info
```

## ⚙️ Configuration

The service can be configured via environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3005` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `PAPI_CHAIN` | Blockchain to connect to | `polkadot` |
| `PAPI_TIMEOUT` | Connection timeout (ms) | `30000` |
| `RATE_LIMIT_MAX` | Max requests per 15 minutes | `100` |
| `CACHE_TTL` | Cache time-to-live (seconds) | `300` |
| `LOG_LEVEL` | Logging level | `info` |
| `CORS_ORIGIN` | CORS origin | `*` |

## 🚀 Running the Service

### Development Mode

```bash
npm run dev
```

This starts the service with hot-reload using nodemon.

### Production Mode

```bash
# Build the TypeScript code
npm run build

# Start the compiled service
npm start
```

### Verify the service is running

```bash
curl http://localhost:3005/
```

Expected response:
```json
{
  "service": "Chain Info API Service",
  "version": "1.0.0",
  "endpoints": {
    "chain": "/api/chain",
    "health": "/api/health",
    "metrics": "/api/metrics",
    "websocket": "/ws"
  }
}
```

## 📡 API Endpoints

### GET `/api/chain/version`

Get chain runtime version information.

**Response:**
```json
{
  "success": true,
  "data": {
    "specName": "polkadot",
    "specVersion": 1002000,
    "implVersion": 0,
    "transactionVersion": 24,
    "stateVersion": 1
  },
  "metadata": {
    "processingTime": "15ms",
    "timestamp": "2026-01-29T10:30:00.000Z"
  }
}
```

### GET `/api/chain/constants`

Get blockchain constants.

**Response:**
```json
{
  "success": true,
  "data": {
    "system": {
      "blockHashCount": 250,
      "blockWeights": {...}
    },
    "balances": {
      "existentialDeposit": "10000000000"
    }
  }
}
```

### GET `/api/chain/latest`

Get the latest block number.

**Response:**
```json
{
  "success": true,
  "data": {
    "blockNumber": 18456789
  }
}
```

### GET `/api/chain/block/:number`

Get information about a specific block.

**Parameters:**
- `number` (integer): Block number

**Response:**
```json
{
  "success": true,
  "data": {
    "number": 123456,
    "hash": "0x...",
    "timestamp": "2026-01-29T10:30:00.000Z"
  }
}
```

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "uptime": 3600,
  "checks": {
    "papi": {
      "status": "healthy",
      "message": "Connected to blockchain"
    },
    "cache": {
      "status": "healthy"
    }
  }
}
```

### GET `/api/metrics`

Prometheus-compatible metrics endpoint.

## 🔌 WebSocket API

Connect to `ws://localhost:3005/ws` for real-time updates.

### Connection

```javascript
const ws = new WebSocket('ws://localhost:3005/ws');

ws.onopen = () => {
  console.log('Connected to Chain Info API');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};
```

### Message Types

#### Block Update
```json
{
  "type": "block",
  "data": {
    "number": 18456789,
    "timestamp": "2026-01-29T10:30:00.000Z"
  }
}
```

#### Connection Confirmation
```json
{
  "type": "connection",
  "message": "Connected to Chain Info API WebSocket",
  "timestamp": "2026-01-29T10:30:00.000Z"
}
```

### Client Commands

Send JSON messages to interact with the WebSocket:

```javascript
// Subscribe to updates
ws.send(JSON.stringify({ type: 'subscribe' }));

// Ping
ws.send(JSON.stringify({ type: 'ping' }));
```

## 🎨 Frontend Dashboard

A beautiful, real-time dashboard is included to visualize blockchain data.

### Running the Dashboard

1. Start the backend service:
```bash
npm run dev
```

2. Open the frontend in your browser:
```bash
# Using Python
python3 -m http.server 8000 --directory frontend

# Or using Node.js http-server
npx http-server frontend -p 8000
```

3. Navigate to `http://localhost:8000`

### Dashboard Features

- 📊 **Real-time block updates**
- ⚡ **Chain version information**
- 🏥 **Health status monitoring**
- 💎 **Chain constants display**
- 🔌 **Live WebSocket feed**
- 🎨 **Modern, animated UI**

## 🐳 Docker Deployment

### Build and Run with Docker

```bash
# Build the image
npm run docker:build

# Run the container
npm run docker:run
```

### Using Docker Compose

```bash
# Start the service
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the service
docker-compose down
```

## 📁 Project Structure

```
chain-info-api-service/
├── src/
│   ├── api/
│   │   ├── controllers/          # Request handlers
│   │   │   ├── chain.controller.ts
│   │   │   └── health.controller.ts
│   │   └── routes/               # Route definitions
│   │       ├── chain.routes.ts
│   │       ├── health.routes.ts
│   │       └── metrics.routes.ts
│   ├── services/                 # Business logic
│   │   ├── papi.service.ts       # PAPI blockchain connection
│   │   ├── cache.service.ts      # Caching layer
│   │   ├── websocket.service.ts  # WebSocket management
│   │   └── metrics.service.ts    # Prometheus metrics
│   ├── middleware/               # Express middleware
│   │   ├── rateLimiter.ts
│   │   ├── errorHandler.ts
│   │   └── requestLogger.ts
│   ├── config/                   # Configuration
│   │   └── environment.ts
│   ├── utils/                    # Utilities
│   │   └── logger.ts
│   └── app.ts                    # Application entry point
├── frontend/                     # Web dashboard
│   └── index.html
├── logs/                         # Log files (auto-generated)
├── dist/                         # Compiled JavaScript (auto-generated)
├── package.json
├── tsconfig.json
├── Dockerfile
├── docker-compose.yml
├── nodemon.json
└── README.md
```

## 🛠️ Development

### Available Scripts

```bash
# Development with hot-reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Code Style

The project uses ESLint with TypeScript for code quality:

```bash
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## 📊 Monitoring

### Prometheus Metrics

The service exposes Prometheus metrics at `/api/metrics`:

- `http_request_duration_seconds` - HTTP request duration
- `http_requests_total` - Total HTTP requests
- `websocket_active_connections` - Active WebSocket connections
- Node.js default metrics (memory, CPU, etc.)

### Grafana Dashboard

Import the metrics into Grafana for visualization:

1. Add Prometheus data source pointing to your service
2. Query the `/api/metrics` endpoint
3. Create custom dashboards

### Logs

Logs are written to:
- `logs/app.log` - All logs
- `logs/error.log` - Error logs only
- Console (in development mode)

Log levels: `error`, `warn`, `info`, `debug`

## 🔍 Troubleshooting

### Service won't start

**Issue:** Port already in use
```
Error: listen EADDRINUSE: address already in use :::3005
```

**Solution:**
```bash
# Find and kill the process using port 3005
lsof -ti:3005 | xargs kill -9

# Or use a different port
PORT=3006 npm run dev
```

### Can't connect to blockchain

**Issue:** PAPI initialization fails
```
Failed to initialize PAPI service
```

**Solutions:**
1. Check your internet connection
2. Verify the chain name in `.env`
3. Increase timeout: `PAPI_TIMEOUT=60000`
4. Check firewall settings

### WebSocket connection fails

**Issue:** WebSocket won't connect

**Solutions:**
1. Ensure the backend is running
2. Check CORS settings in `.env`
3. Verify WebSocket URL in frontend
4. Check browser console for errors

### High memory usage

**Solutions:**
1. Reduce cache TTL: `CACHE_TTL=60`
2. Lower rate limit: `RATE_LIMIT_MAX=50`
3. Monitor with: `curl http://localhost:3005/api/health`

## 📝 API Rate Limiting

The service implements rate limiting:
- **100 requests per 15 minutes** by default
- Returns `429 Too Many Requests` when exceeded
- Configurable via `RATE_LIMIT_MAX` environment variable

## 🔒 Security

- ✅ Helmet.js for security headers
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Input validation
- ✅ Error handling without stack traces in production

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check the troubleshooting section
- Review the API documentation at `/api-docs`

## 🎯 Roadmap

- [ ] GraphQL API support
- [ ] Authenticated endpoints
- [ ] Historical data queries
- [ ] Multi-chain support
- [ ] Enhanced caching strategies
- [ ] Load balancing support

---

**Built with ❤️ for the Polkadot ecosystem**

🌐 **Live Demo:** Coming soon  
📚 **Documentation:** `/api-docs`  
💬 **Community:** Join our Discord