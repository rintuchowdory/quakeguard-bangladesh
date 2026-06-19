# 📡 QuakeGuard Bangladesh
### Live Earthquake Risk Monitor

Real-time seismic activity dashboard focused on Bangladesh — tracking earthquakes across South & Southeast Asia with live risk assessment, city-level distance mapping, and alert notifications.

🌐 **Live:** [rintuchowdory.github.io/quakeguard-bangladesh](https://rintuchowdory.github.io/quakeguard-bangladesh)

---

## Why Bangladesh?

Bangladesh is a hidden seismic risk zone:
- 🏙️ Extreme population density (Dhaka: ~22M people)
- 🏗️ Millions of older, unreinforced buildings
- 🌏 Proximity to Himalayan and Northeast Indian fault zones
- 📈 Rapid urbanization without updated seismic codes

---

## Features

| Feature | Description |
|---|---|
| 🗺️ Live Map | Dark-theme Leaflet map with magnitude-colored markers |
| 📊 Statistics | Total quakes, strongest, avg magnitude, near-BD count |
| 🎯 Risk Assessment | Dynamic risk level (Low/Medium/High/Critical) with scoring |
| ⚠️ Alert System | Auto-alerts for M5.5+ within 1000 km of Bangladesh |
| 🏙️ City Dashboard | Distance from latest quake for Dhaka, Chittagong, Sylhet, Rajshahi, Khulna |
| 📈 Charts | Magnitude distribution + 7-day activity trend |
| ⏱️ Time Ranges | 24h / 7 days / 30 days / 1 year historical view |
| 🔄 Auto-refresh | Updates every 5 minutes from USGS live API |

---

## Tech Stack

- **Frontend:** Next.js 14 + TypeScript + TailwindCSS
- **Map:** Leaflet.js (dark CARTO tiles)
- **Charts:** Chart.js + react-chartjs-2
- **Data:** USGS Earthquake Hazards Program API (M3.5+, regional filter)
- **Deployment:** GitHub Actions CI/CD → GitHub Pages
- **Container:** Docker + nginx (alternative deploy)

---

## Getting Started

```bash
# Install
npm install

# Dev
npm run dev

# Build + export
npm run build
```

## Docker

```bash
docker build -t quakeguard-bd .
docker run -p 8080:80 quakeguard-bd
# → http://localhost:8080
```

---

## Risk Score Algorithm

| Factor | Points |
|---|---|
| Magnitude ≥7.0 | +40 |
| Magnitude ≥6.0 | +25 |
| Magnitude ≥5.0 | +15 |
| Distance <200 km | +35 |
| Distance <400 km | +25 |
| Distance <700 km | +15 |
| Shallow depth <30 km | +15 |
| 5+ quakes in region | +10 |

**Score → Level:** <20 = Low · 20–44 = Medium · 45–69 = High · 70+ = Critical

---

## Data Source

All earthquake data is sourced from the [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/fdsnws/event/1/) API.
Data updates every 5 minutes. Minimum magnitude M3.5 displayed.

---

## Setting up GitHub Pages deployment

1. Go to repo **Settings → Pages**
2. Source: **GitHub Actions**
3. Add the workflow file at `.github/workflows/deploy.yml` (see project notes — this file requires the `workflow` OAuth scope to push via API/integrations, so add it directly via the GitHub web UI if needed)
4. Push to `main` — the site builds and deploys automatically

---

*Built by [Rintu Chowdory](https://github.com/rintuchowdory) · Bangladesh 🇧🇩*
