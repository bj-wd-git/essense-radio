# Troubleshooting Guide

## Installation Issues

### Bcrypt Native Module Error (Docker)

**Problem:** `Error loading shared library bcrypt_lib.node: Exec format error`

**Cause:** Native modules like `bcrypt` are compiled for your host OS (Windows), but Docker runs Linux containers. The binary is incompatible.

**Solution:**
The Dockerfile has been updated to:
1. Install build tools (python3, make, g++)
2. Rebuild bcrypt on container startup

If you still see this error:
```bash
# Rebuild the container
docker compose down
docker compose build --no-cache backend
docker compose up
```

The container will automatically rebuild bcrypt on startup to match the container's architecture.

### Dependency Resolution Errors

**Problem:** `ERESOLVE unable to resolve dependency tree`

**Solution:**
- The mobile app uses `--legacy-peer-deps` flag automatically
- If you see this error, run: `cd mobile && npm install --legacy-peer-deps`
- This is normal for Expo projects due to React version requirements

### Deprecation Warnings

**Problem:** Many deprecation warnings during `npm install`

**Solution:**
- These are normal and safe to ignore for development
- They come from transitive dependencies (dependencies of dependencies)
- The app will work fine despite these warnings
- For production, consider updating packages gradually

### Security Vulnerabilities

**Problem:** `npm audit` shows vulnerabilities

**Solution:**
- For development: Generally safe to ignore
- For production: Review each vulnerability
- Run `npm audit fix` carefully (test after running)
- Some vulnerabilities may require manual updates

## Runtime Issues

### Backend Won't Start

**Problem:** Backend fails to start

**Solutions:**
1. **Check MySQL is running:**
   ```bash
   docker ps  # Should show mysql container
   ```

2. **Check environment variables:**
   ```bash
   # Ensure backend/.env exists and has correct values
   cat backend/.env
   ```

3. **Check port 3000 is available:**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Unix/Mac
   lsof -i :3000
   ```

4. **Check database connection:**
   - Verify MySQL credentials in `.env`
   - Ensure database `essence_radio` exists
   - Wait a few seconds after starting MySQL (it needs time to initialize)

### Web App Won't Start

**Problem:** Web app fails to start or shows errors

**Solutions:**
1. **Check port 5173 is available:**
   ```bash
   # Change port in web/vite.config.ts if needed
   ```

2. **Clear cache:**
   ```bash
   cd web
   rm -rf node_modules/.vite
   npm run dev
   ```

3. **Check API connection:**
   - Ensure backend is running on port 3000
   - Check `VITE_API_URL` in environment (if set)

### Mobile App Issues

**Problem:** Expo app won't start

**Solutions:**
1. **Clear Expo cache:**
   ```bash
   cd mobile
   npx expo start -c
   ```

2. **Check network:**
   - Phone and computer must be on same network
   - For Android emulator, use `npm run android`
   - For iOS simulator, use `npm run ios`

3. **API connection:**
   - Use your computer's IP address instead of localhost
   - Example: `http://192.168.1.100:3000`
   - Update `mobile/src/contexts/AuthContext.tsx`

### WebRTC Not Working

**Problem:** Audio streaming doesn't work

**Solutions:**
1. **Check browser permissions:**
   - Grant microphone access when prompted
   - Check browser settings for microphone permissions

2. **Use HTTPS or localhost:**
   - WebRTC requires secure context
   - `localhost` works, but not `127.0.0.1` in some browsers
   - For production, use HTTPS

3. **Check browser console:**
   - Look for WebRTC errors
   - Check network tab for failed requests

4. **Firewall/Network:**
   - Ensure ports are not blocked
   - Check firewall settings

### Database Connection Errors

**Problem:** `ECONNREFUSED` or database errors

**Solutions:**
1. **MySQL not running:**
   ```bash
   docker compose up mysql
   ```

2. **Wrong credentials:**
   - Check `backend/.env` file
   - Default: `root` / `password`

3. **Database doesn't exist:**
   - TypeORM will create it automatically in development
   - Or create manually: `CREATE DATABASE essence_radio;`

4. **Connection timeout:**
   - Wait 10-20 seconds after starting MySQL
   - Check MySQL logs: `docker compose logs mysql`

### Socket.IO Connection Issues

**Problem:** Chat or WebRTC signalling not working

**Solutions:**
1. **Check CORS settings:**
   - Verify origins in `backend/src/main.ts`
   - Add your frontend URL if different

2. **Check WebSocket support:**
   - Some proxies block WebSockets
   - Try direct connection

3. **Check Socket.IO version:**
   - Ensure client and server versions are compatible
   - Current: Socket.IO 4.6.0

## Docker Issues

### Docker Compose Fails

**Problem:** `docker compose up` fails

**Solutions:**
1. **Check Docker is running:**
   ```bash
   docker ps
   ```

2. **Check ports are available:**
   - 3000 (backend)
   - 5173 (web)
   - 3306 (MySQL)

3. **Rebuild containers:**
   ```bash
   docker compose down
   docker compose up --build
   ```

4. **Check logs:**
   ```bash
   docker compose logs
   docker compose logs backend
   docker compose logs mysql
   ```

### Container Keeps Restarting

**Problem:** Container exits immediately

**Solutions:**
1. **Check logs:**
   ```bash
   docker compose logs <service-name>
   ```

2. **Check environment variables:**
   - Ensure all required env vars are set
   - Check `.env` files exist

3. **Check file permissions:**
   - Ensure Docker can read project files

## Common Error Messages

### "Cannot find module"

**Solution:**
```bash
# Reinstall dependencies
cd <app-directory>
rm -rf node_modules package-lock.json
npm install
```

### "Port already in use"

**Solution:**
- Change port in configuration
- Or stop the service using the port
- Windows: `netstat -ano | findstr :PORT`
- Unix/Mac: `lsof -i :PORT`

### "JWT_SECRET is not defined"

**Solution:**
- Create `backend/.env` file
- Add `JWT_SECRET=your-secret-key`
- Restart backend

### "Database connection failed"

**Solution:**
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database exists
- Check network connectivity

## Getting Help

1. **Check logs:**
   - Backend: Console output or `docker compose logs backend`
   - Web: Browser console
   - Mobile: Expo logs or `npx expo start --tunnel`

2. **Verify setup:**
   - All dependencies installed
   - Environment variables set
   - Services running

3. **Check documentation:**
   - README.md
   - QUICKSTART.md
   - SETUP.md

4. **Common fixes:**
   - Restart services
   - Clear caches
   - Reinstall dependencies
   - Check network/firewall

