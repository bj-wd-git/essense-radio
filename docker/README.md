# Docker Setup

## Quick Start

1. Make sure Docker and Docker Compose are installed
2. Run from the project root:

```bash
docker compose up --build
```

This will start:
- MySQL database on port 3306
- Backend API on port 3000
- Web app on port 5173

## Services

### MySQL
- Port: 3306
- Database: essence_radio
- Root password: password (change in production!)

### Backend
- Port: 3000
- Hot reload enabled in development

### Web
- Port: 5173
- Vite dev server with hot reload

## Mobile App

The mobile app runs separately via Expo:

```bash
cd mobile
npm install
npm start
```

Then scan the QR code with Expo Go app on your phone.

