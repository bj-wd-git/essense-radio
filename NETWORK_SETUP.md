# Network Setup Guide

## Using Network IP Instead of Localhost

To access the app from other devices on your network (phones, tablets, other computers), you need to use your computer's network IP address instead of `localhost`.

## Quick Setup

### Option 1: Use the Network Config Button (Recommended)

1. Open the web app in your browser
2. Click the **"Configure Network"** button in the top navigation
3. Click **"Auto-Detect"** to automatically detect your IP
4. Or manually enter your computer's IP address
5. Click **"Save"** and refresh the page

### Option 2: Manual Setup

#### Find Your IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually starts with 192.168.x.x)

**Mac/Linux:**
```bash
ifconfig
# or
ip addr
```
Look for your network interface (usually `en0` on Mac, `eth0` or `wlan0` on Linux)

#### Set the IP in the App

1. Open browser console (F12)
2. Run: `localStorage.setItem('network_ip', 'YOUR_IP_HERE')`
3. Refresh the page

Example:
```javascript
localStorage.setItem('network_ip', '192.168.1.100');
location.reload();
```

## Accessing from Mobile/Other Devices

1. Ensure your computer and mobile device are on the same Wi-Fi network
2. Find your computer's IP address (see above)
3. Configure the network IP in the web app
4. On your mobile device, open: `http://YOUR_IP:5173`

Example: `http://192.168.1.100:5173`

## Docker Network Access

If using Docker, you may need to:

1. **Update docker-compose.yml** to bind to all interfaces:
   ```yaml
   ports:
     - "0.0.0.0:3000:3000"  # Instead of just "3000:3000"
     - "0.0.0.0:5173:5173"
   ```

2. **Restart containers:**
   ```bash
   docker compose down
   docker compose up
   ```

## Troubleshooting

### Can't Connect from Mobile

1. **Check firewall:** Ensure ports 3000 and 5173 are allowed
   - Windows: Windows Defender Firewall
   - Mac: System Preferences > Security & Privacy > Firewall
   - Linux: `ufw allow 3000` and `ufw allow 5173`

2. **Check network:** Ensure both devices are on the same network

3. **Check IP address:** Verify you're using the correct IP
   - The IP should be your local network IP (192.168.x.x or 10.x.x.x)
   - Not 127.0.0.1 or localhost

### CORS Errors

The backend is configured to allow all origins in development. If you see CORS errors:
- Check that the backend is running
- Verify the IP address is correct
- Try clearing browser cache

### Socket.IO Connection Issues

If chat or WebRTC isn't working:
- Ensure the network IP is set correctly
- Check that both HTTP and WebSocket connections use the same IP
- Verify firewall allows WebSocket connections (port 3000)

## Production Deployment

For production, you should:
1. Set specific allowed origins in `backend/src/main.ts`
2. Use environment variables for API URLs
3. Configure proper CORS policies
4. Use HTTPS for WebRTC (required in production)

