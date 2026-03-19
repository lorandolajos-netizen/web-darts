# 🎯 Web Darts - Render Deployment Guide

## Quick Start on Render

### 1. Deploy to Render
- Go to [render.com](https://render.com)
- Click **New +** → **Web Service**
- Connect your GitHub repository `lorandolajos-netizen/web-darts`
- Render will auto-detect `render.yaml` and deploy automatically

### 2. Environment Setup
- The app uses `PORT` from environment (default 3000)
- Node.js 18+ required
- Dependencies: Express, Socket.IO

### 3. Access Your App
Your app will be live at: `https://web-darts-[random].onrender.com`

## Local Development

```bash
npm install
npm start
```

Server runs on `http://localhost:3000`

## Game Features
- **Dashboard** (`/public/dashboard.html`) - Live game status with player rankings
- **Scorer** (`/public/scor.html`) - Enter dart scores (0-180)
- **Winner** (`/public/winner.html`) - Display top player
- **Registration** (`/public/index.html`) - Player sign-up

## API Endpoints
- `POST /api/register` - Register new player
- `POST /api/score` - Submit a score
- `POST /api/undo` - Undo last score
- `POST /api/createboard` - Create game board

## Real-time Updates
Socket.IO enables live score updates across all connected clients.