# README.md

# Essence Radio — Live Audio Streaming App

A simple live radio app where users can:

* Create a station
* Go live using **WebRTC** audio
* Let others listen instantly
* Chat live using **WebSockets**
* Save audio **locally on their device only** (no server storage)

Admin can manage stations and users.

---

## 🚀 Tech Stack

### **Frontend**

* React (Web)
* React Native (Expo) for Android & iOS

### **Backend**

* NestJS (Node.js)
* MySQL (TypeORM)
* WebSockets (Socket.IO)
* WebRTC (Mediasoup or Janus SFU)

### **Deployment**

* Docker (One-click run)

---

## ✨ Features

### User

* Browse stations
* Listen live
* Live chat
* Save audio locally

### Publisher

* Create station
* Start/stop live streaming
* Moderate chat

### Admin

* Approve stations
* Manage users
* Basic dashboard

---

## 📡 How Streaming Works

1. Publisher clicks **Go Live**.
2. Audio → WebRTC → Media Server (SFU).
3. Listeners join and receive the stream.
4. Chat handled via WebSockets.
5. No audio stored on server — users save locally.

---

## 🗄️ Database (MySQL)

Stores only metadata:

* Users
* Stations
* Chat messages
* No audio storage

---

## 🚀 Quick Deploy

Deploy to free hosting in 5 minutes:

**Railway (Recommended)**:
```bash
npm install -g @railway/cli
railway login
cd backend && railway init && railway up
cd ../web && railway init && railway up
```

See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for detailed instructions.

**Other Options**: Vercel, Render, Fly.io - see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🛠️ Setup

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- For mobile: Expo Go app on your phone

### Quick Start with Docker

1. Clone the repository:
```bash
git clone <repo>
cd essence
```

2. Start all services:
```bash
docker compose up --build
```

3. Access the services:
- Backend API: `http://localhost:3000`
- Web app: `http://localhost:5173`
- MySQL: `localhost:3306`

### Manual Setup (Development)

#### Backend
```bash
cd backend
npm install
npm run start:dev
```

#### Web
```bash
cd web
npm install
npm run dev
```

#### Mobile
```bash
cd mobile
npm install
npm start
```

Then scan the QR code with Expo Go app.

### Environment Variables

Create `.env` files in `backend/` and `web/` directories:

**backend/.env:**
```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=essence_radio
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

---

## 📁 Monorepo Structure

```
/essence-radio
  /backend       → NestJS API + signalling
  /web           → React web client
  /mobile        → Expo mobile app
  /docker        → Docker configs
```

---

## 🔌 API Endpoints (Basic)

* `POST /auth/login`
* `POST /stations`
* `GET /stations`
* `POST /stations/:id/start`
* `POST /stations/:id/stop`

---

## 🔊 WebSocket Events

* `join_station`
* `offer`
* `answer`
* `ice-candidate`
* `chat_message`

---

## 📖 Additional Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Get started in 5 minutes
- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guidelines

## 🧪 Future Add-ons

* Push notifications
* Station analytics
* Multi-host rooms
* SFU integration (Mediasoup/Janus) for better scalability
* Audio recording and local storage
* Station scheduling

## 📝 Project Status

✅ **Completed:**
- Monorepo structure
- Backend API with all modules
- Web application
- Mobile application (Expo)
- Docker setup
- WebRTC basic implementation
- Real-time chat
- Admin panel

🚧 **In Progress / Future:**
- Production-ready WebRTC SFU integration
- Comprehensive testing
- CI/CD pipeline
- Production deployment guides

---

