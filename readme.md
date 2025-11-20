# Essence Radio — Live Audio Streaming App

A simple live radio app where users can create stations, go live using WebRTC audio, let others listen instantly, and chat live using WebSockets.

## 🚀 Tech Stack

- **Frontend**: React (Web), React Native (Expo) for Mobile
- **Backend**: NestJS (Node.js), MySQL (TypeORM)
- **Realtime**: WebSockets (Socket.IO), WebRTC
- **Deployment**: Docker

## ✨ Features

- Create and manage radio stations
- Live audio streaming via WebRTC
- Real-time chat
- User authentication
- Admin dashboard

## 🐳 Quick Start with Docker

```bash
# Start all services
docker compose up --build

# Access the app
# Web: http://localhost:5173
# Backend API: http://localhost:3000
```

## 📋 Manual Setup

### Backend
```bash
cd backend
npm install
npm run start:dev
```

### Web
```bash
cd web
npm install
npm run dev
```

### Mobile
```bash
cd mobile
npm install
npm start
```

## 🔧 Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=essence_radio
JWT_SECRET=your-secret-key
PORT=3000
```

### Web
```
VITE_API_URL=http://localhost:3000
```

## 📚 API Endpoints

- `POST /auth/register` - Register user
- `POST /auth/login` - Login
- `GET /stations` - List stations
- `POST /stations` - Create station
- `GET /stations/:id` - Get station details
- `POST /stations/:id/start` - Start streaming
- `POST /stations/:id/stop` - Stop streaming

## 📝 License

MIT
