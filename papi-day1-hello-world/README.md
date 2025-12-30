markdown

# PAPI Day 1: Hello World – Polkadot-API 30 Days Challenge

A simple Node.js/TypeScript project to get started with Polkadot-API (PAPI), featuring a light-client connection via Smoldot and a basic block query.

## Why This Project?
- Demonstrates PAPI's "light-client first" approach for decentralized dApps.
- Uses latest stable (v1.20.0 as of Dec 2025).
- Includes troubleshooting and optional web demo.

## Prerequisites
- Node.js >= v18
- npm
- Git (for cloning)

## Quickstart: Clone and Run
1. Clone the repo:
   ```bash
   git clone https://github.com/Sage-senpai/PAPI-101.git
   cd papi-day1-hello-world

Install dependencies:bash

npm install

Generate types for Polkadot:bash

npx papi add dot -n polkadot
npx papi

Run the script:bash

npm run dev

Expect output like: "Latest finalized block: #XXXXXX" and "PAPI READY!"

Project Structuresrc/index.ts: Main script with connection and query.
public/index.html: Static HTML for browser showcase.
index/styles.css: Optional CSS for web demo 
package.json & tsconfig.json: Configured for TS/ESM.

TroubleshootingConnection slow? Smoldot syncs on first run – patience!
Errors? Run npm cache clean --force and reinstall.
More tips in the script's troubleshootingTips().

Learning ResourcesOfficial Docs: https://papi.how
GitHub: polkadot-api
Join #PAPI30Days for more days!

License: MIT
Author: Sage_senpeak
#Polkadot #Web3 #TypeScript #Blockchain

If you want a separate SETUP.md, here's that – add it alongside README for detailed steps:

```markdown
# Setup Guide: PAPI Hello World

Follow these to build from scratch or tweak the cloned repo.

### Step 1: Project Init
```bash
mkdir papi-day1-hello-world
cd papi-day1-hello-world
npm init -y
mkdir src public
touch src/index.ts public/styles.css public/index.html

Step 2: Config FilesCopy package.json, tsconfig.json from above.
Install: npm install

Step 3: Code & GeneratePaste src/index.ts code.
Run npx papi add dot -n polkadot && npx papi

Step 4: Optional WebCompile SCSS: Install sass globally (npm i -g sass), then sass src/styles.scss public/styles.css if using scss
Paste public/index.html code.
Serve: npx live-server public

Step 5: Run & Extend "npm run dev" – now hack away! Add queries like account balances next. check live server to see front end


Boom – setup complete. Day 2: Querying chain data. Drop your output screenshot! #PAPI30Days #Polkadot #Web3 #

