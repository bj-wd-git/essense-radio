**Project Name:** Essence Radio

**Goal:** Build a simple live-audio radio app where users can create stations, go live using WebRTC, let others listen, chat live, and optionally save audio locally on their own device (no server-side recordings). Admin panel manages stations and users.

**Tech Requirements:**

* Backend: **NestJS**, MySQL, WebSockets (Socket.IO)
* Realtime Audio: **WebRTC** + SFU (Mediasoup or Janus)
* Frontend: **React** (Web), **React Native (Expo)** for mobile
* Deployment: **Docker** (one-click setup)
* No server audio storage — only metadata saved

**Cursor Instructions:**

1. Scaffold a **monorepo** with three apps:

   * `/backend` → NestJS API + Socket.IO signalling
   * `/web` → React web app
   * `/mobile` → Expo React Native app
2. Add Docker setup for all services.
3. Generate base modules:

   * Auth (JWT)
   * Stations (CRUD)
   * Live Streaming (signalling endpoints)
   * Chat (Socket.IO)
4. Create sample WebRTC publisher + listener components.
5. Add MySQL database connection and entities.
6. Include simple admin panel routes.
