# joaia_demo_backend

Simple express backend

## Quick Start

### 1. Clone & Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a .env file in the root directory

```bash
MONGO_URI=YOUR_KEY
GEMINI_API_KEY=YOUR_KEY
GOOGLE_PLACES_KEY=YOUR_KEY
```

### 3. Start

```bash
npm run dev
```

## Architecture overview

- Framework & Runtime: Built with Express, TypeScript, and Node.js, structured with separate layers for routing,
  schemas, and external data services.
- Validation: Uses Zod schemas at the entry point of every route to parse and validate parameters/request bodies
  dynamically.
- Simple mongodb native client for profile storage although message/plan storage has not been implemented
- Error Handling: simple async middleware
- Fallback Reliability: some static JSON seed data if API's are down

## Core Services & API Routes

### /users

- Handles quick, simple creation profiles without mandatory early auth bottlenecks.
- Saves standalone application preferences and structural timestamps directly to MongoDB collection blocks.

### /chat
- Powers chat structures using Gemini built on structured application/json system schema rules.
- Generates rich response components mapping types like texts, maps, multi-route tour selections, and contextual trivia.
- uses the resolveMessages function to execute additional logic like searching for locations. aka budget LangChain

### /places
- uses the Google Places API to execute query string maps

### /routes
- Uses Google Directions API (V2) to map out dynamic multipoint paths
- Parses and decodes high-density compressed string geometries into accessible frontend geospatial point paths.