# Day 16: Polkadot Event Observatory

A real-time event monitoring dashboard that connects to Polkadot mainnet and displays blockchain events as they happen, powered by PAPI event subscriptions.

## 🎯 Features

### **Real Event Monitoring**
- ✅ **Live Event Streaming**: Connect to Polkadot mainnet via light client
- ✅ **Multiple Event Types**: Monitor transfers, staking, treasury, and more
- ✅ **Real-time Updates**: Events appear instantly without polling
- ✅ **Type-safe Event Handling**: Full TypeScript support with proper types

### **Advanced Features**
- **Smart Filtering**: Filter events by type, amount, and address
- **Real-time Analytics**: Event statistics and trend visualization
- **Event Details**: View raw event data and formatted information
- **Export Capabilities**: Save event logs for analysis

### **Technical Highlights**
- PAPI event subscriptions with zero polling
- Smoldot light client for decentralized access
- Material-UI with custom dark theme
- Responsive design for all devices
- Production-ready error handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern web browser

### Installation

```bash
# Clone/download the project files
cd papi-day16-event-observatory

# Install dependencies
npm install

# Generate PAPI types for Polkadot
npm run papi

# Start development server
npm run dev