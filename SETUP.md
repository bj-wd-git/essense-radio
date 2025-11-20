# Setup Guide

## Initial Setup

1. **Install Dependencies**

   Backend:
   ```bash
   cd backend
   npm install
   ```

   Web:
   ```bash
   cd web
   npm install
   ```

   Mobile:
   ```bash
   cd mobile
   npm install
   ```

2. **Database Setup**

   The MySQL database will be automatically created when using Docker. For manual setup:

   ```sql
   CREATE DATABASE essence_radio;
   ```

3. **Environment Configuration**

   Copy `.env.example` to `.env` in the backend directory and update values.

## Running the Application

### Option 1: Docker (Recommended)

```bash
docker compose up --build
```

### Option 2: Manual

Terminal 1 - Backend:
```bash
cd backend
npm run start:dev
```

Terminal 2 - Web:
```bash
cd web
npm run dev
```

Terminal 3 - Mobile:
```bash
cd mobile
npm start
```

## Creating Admin User

To create an admin user, you can either:

1. Manually update the database:
   ```sql
   UPDATE users SET role = 'admin' WHERE username = 'your-username';
   ```

2. Or modify the registration code to set the first user as admin.

## Testing WebRTC

1. Open two browser windows
2. In one window, login as a station owner and go to your station
3. Click "Go Live" and allow microphone access
4. In the other window, open the same station and click "Start Listening"
5. You should hear the audio stream

## Troubleshooting

### Port Already in Use
- Change ports in `docker-compose.yml` or stop conflicting services

### Database Connection Issues
- Ensure MySQL is running and credentials match `.env` file
- Check Docker logs: `docker compose logs mysql`

### WebRTC Not Working
- Ensure HTTPS or localhost (WebRTC requires secure context)
- Check browser console for errors
- Verify microphone permissions are granted

