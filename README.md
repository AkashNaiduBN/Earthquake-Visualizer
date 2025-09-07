# Earthquake Visualizer (USGS + React + Leaflet)

A take-home solution that visualizes live **USGS earthquake feeds** on an interactive map, with filters, country search, and charts.

---

## Tech Stack
- **React 18 + Vite** (fast dev & build)  
- **TailwindCSS** for styling  
- **React-Leaflet + Leaflet** (maps with OpenStreetMap tiles)  
- **Axios** for API fetching  
- **Recharts** for magnitude distribution & timeline charts  

---

## Features
- Switch earthquake feed window: **Past Hour / 24h / 7 Days / 30 Days**  
- Filter earthquakes by **minimum magnitude**  
- **Country Search** → auto-zoom map & filter quakes to that country  
- Interactive **map markers** (size & color scale by magnitude)  
- **Charts View**:  
  - Magnitude distribution (bar chart)  
  - Timeline of magnitudes (line chart)  
- **Auto-refresh** data every 5 minutes (toggle)  
- Fully **responsive** & mobile-friendly  
- **Error & loading states** handled gracefully  

---
## Project Structure
earthquake-visualizer/
  ├─ public/
  │   └─ favicon.svg
  ├─ src/
  │   ├─ components/
  │   │   ├─ Charts.jsx        # Data visualizations (Recharts)
  │   │   ├─ Legend.jsx        # Color legend for magnitudes
  │   │   ├─ MapView.jsx       # Interactive Leaflet map & markers
  │   │   └─ Sidebar.jsx       # Filters, country search, toggles
  │   ├─ hooks/
  │   │   └─ useEarthquakes.js # Fetch & filter earthquake data
  │   ├─ utils/
  │   │   └─ format.js         # Date/time & number formatting
  │   ├─ App.jsx               # Main layout & routing logic
  │   ├─ main.jsx              # React entrypoint
  │   └─ styles.css            # Tailwind + global styles
  ├─ index.html
  ├─ package.json
  ├─ postcss.config.js
  ├─ tailwind.config.js
  ├─ vite.config.js
  └─ README.md

---

## Getting Started

> Requires Node.js 18+

```bash
# install dependencies
npm install

# start dev server
npm run dev

# build production bundle
npm run build

# preview local build
npm run preview

Deployed in Codesandbox

## Deployment
This project is deployed on *CodeSandbox*.  
•⁠  ⁠The GitHub repository was imported into CodeSandbox.  
•⁠  ⁠The framework was automatically detected as *Vite*.  
•⁠  ⁠Build command: ⁠ npm run build ⁠  
•⁠  ⁠Output directory: ⁠ dist ⁠  

## Data Sources
Earthquake Data: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
Geocoding: https://nominatim.openstreetmap.org/ui/search.html