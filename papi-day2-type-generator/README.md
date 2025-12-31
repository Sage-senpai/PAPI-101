# PAPI Type Generator – Day 2 Challenge

Banner art here – generate one at patorjk.com/software/taag (type "PAPI Types" in Big font, copy-paste ASCII). Or use figlet CLI: npm i -g figlet; figlet "PAPI Day 2".

## Overview
Auto-gens TS types from Polkadot metadata. No manual work!

## Features
- Auto-types from chain
- Explorer utility
- Easy updates

## Quick Start
1. `npm install`
2. `npm run setup` (gens types)
3. `npm run explore` (views structure)
4. `npm start` (full run)

## Structure
- src/index.js: Main setup
- src/utils/explorer.js: Type inspector
- .papi/descriptors: Generated types

## Update Types
Re-run `npm run setup` after upgrades.

Part of #PAPI30Days