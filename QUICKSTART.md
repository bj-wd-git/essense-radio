# Quick Start Guide

## 🚀 Fastest Way to Get Started

### Option 1: Docker (Recommended)

```bash
# 1. Install dependencies (one time)
npm run install:all

# 2. Start everything
docker compose up --build
```

That's it! Open:
- Web app: http://localhost:5173
- API: http://localhost:3000
- MySQL: localhost:3306

### Option 2: Manual Setup

```bash
# 1. Install all dependencies
npm run install:all

# 2. Set up environment
cp backend/.env.example backend/.env
# Edit backend/.env with your settings

# 3. Start MySQL (or use Docker just for MySQL)
docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=essence_radio mysql:8.0

# 4. Start backend (Terminal 1)
npm run dev:backend

# 5. Start web (Terminal 2)
npm run dev:web

# 6. Start mobile (Terminal 3, optional)
npm run dev:mobile
```

## 📱 First Steps

1. **Register a new account** at http://localhost:5173/register
2. **Create a station** from "My Stations"
3. **Go Live** from your station page
4. **Open another browser** and listen to your station

## 🔑 Creating an Admin User

After registering your first user, run this SQL:

```sql
UPDATE users SET role = 'admin' WHERE username = 'your-username';
```

Or use the MySQL container:

```bash
docker exec -it essence-mysql mysql -uroot -ppassword essence_radio
```

Then run the UPDATE query above.

## ⚠️ Installation Notes

### Dependency Warnings
You may see deprecation warnings during installation. These are normal and don't affect functionality:
- Some packages use older dependencies that show warnings
- The mobile app uses `--legacy-peer-deps` to handle React version conflicts
- These warnings are safe to ignore for development

### Security Vulnerabilities
Some npm audit warnings may appear. For development, these are generally safe. For production:
- Review vulnerabilities: `npm audit` (in each app directory)
- Update packages when possible
- Use `npm audit fix` carefully (may break things)

## 🐛 Troubleshooting

### Port Already in Use
- Change ports in `docker-compose.yml` or stop conflicting services
- Backend: Change `PORT` in `backend/.env`
- Web: Change port in `web/vite.config.ts`

### Database Connection Error
- Ensure MySQL is running: `docker ps`
- Check credentials in `backend/.env`
- Wait a few seconds after starting MySQL (it needs time to initialize)

### WebRTC Not Working
- Use HTTPS or localhost (WebRTC requires secure context)
- Grant microphone permissions in browser
- Check browser console for errors

### Mobile App Issues
- Install Expo Go app on your phone
- Ensure phone and computer are on same network
- For Android emulator, use `npm run android` instead

## 📚 Next Steps

- Read [SETUP.md](./SETUP.md) for detailed setup
- Check [readme.md](./readme.md) for full documentation
- Explore the codebase structure

