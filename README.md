# Smart Bus Tracker

Live bus tracking, ETAs, and routes — built with Next.js (App Router) and TailwindCSS, featuring Leaflet maps, Server-Sent Events for live updates, and a minimal driver simulator.

## Features (MVP)

- Live bus tracking on a map
- Search buses and view route info
- Select a stop to view ETAs (distance/speed based)
- Driver simulator to send mock GPS updates
- Authority dashboard with live locations and route stats
- PWA basics: manifest, theme-color, installable

## Tech Stack

- Next.js (App Router), React, TailwindCSS v4
- Leaflet + React-Leaflet for maps
- SSE for real-time location streaming
- In-memory mock data layer (buses, routes, stops, locations)

## Project Structure

- `src/lib/data.js` — Mock data and in-memory location store
- `src/lib/eta.js` — ETA computation util
- `src/lib/events.js` — Simple pub/sub for streaming
- `src/app/api/` — REST + SSE endpoints
- `src/components/MapView.jsx` — SSR-safe Leaflet map
- `src/app/page.js` — Commuter UI
- `src/app/driver/page.js` — Driver simulator
- `src/app/dashboard/page.js` — authority dashboard
- `public/manifest.json`, `public/icons/*` — PWA assets

## Run Locally

1. Install deps (already done in scaffold):
    ```bash
    npm install
    ```
2. Start dev server:
    ```bash
    npm run dev
    ```
3. Open http://localhost:3000

If you recently edited the SSE stream (`/api/stream/locations`), fully restart the dev server to clear stale module state (Ctrl+C then `npm run dev`).

## Demo Guide

- Home page: live map + buses list. Select a stop in the header to view ETAs (auto-refresh every 10s).
- Driver simulator: http://localhost:3000/driver
  - Choose a bus (b1 or b3), click Start to send updates every 3s.
- Dashboard: http://localhost:3000/dashboard
  - Shows total/active buses and a live table of locations.

## API Endpoints

- `GET /api/buses` → `{ buses, routes, stops }`
- `GET /api/location/:busId` → latest location
- `POST /api/location/update` → update bus location
- `GET /api/eta/:stopId` → ETAs for a stop
- `GET /api/locations` → all current locations
- `GET /api/stream/locations` → SSE stream

## Notes

- This project uses an in-memory store for simplicity (ideal for hackathon/demo). Replace with a database (e.g., Postgres + Redis) for production.
- For push notifications, integrate Firebase Cloud Messaging.
