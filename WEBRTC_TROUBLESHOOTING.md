# WebRTC Streaming Troubleshooting

## Common Issues and Solutions

### 1. "Go Live" Button Doesn't Work

**Symptoms:**
- Clicking "Go Live" does nothing
- No error message appears
- Microphone permission not requested

**Solutions:**
- Check browser console for errors (F12)
- Ensure you're using HTTPS or localhost (WebRTC requires secure context)
- Grant microphone permissions when prompted
- Try a different browser (Chrome, Firefox, Edge)

### 2. "Failed to connect to streaming server"

**Symptoms:**
- Error message appears immediately after clicking "Go Live"
- Socket.IO connection fails

**Solutions:**
- Check network IP configuration (use "Configure Network" button)
- Verify backend is running: `docker compose ps`
- Check backend logs: `docker compose logs backend`
- Ensure ports 3000 and 5173 are not blocked by firewall

### 3. Broadcasting but No Audio Received

**Symptoms:**
- Publisher shows "Broadcasting Live"
- Listener connects but hears nothing
- Connection state shows "connected" but no audio

**Solutions:**
- Check browser console for WebRTC errors
- Verify microphone is working (test in another app)
- Check if audio element is receiving stream (browser DevTools)
- Try refreshing both publisher and listener pages
- Check network connectivity (WebRTC needs good connection)

### 4. Connection State Stuck on "connecting"

**Symptoms:**
- Status shows "connecting" but never changes to "connected"
- No audio after waiting

**Solutions:**
- Check firewall settings (allow WebRTC traffic)
- Verify STUN servers are accessible
- Try different network (some networks block WebRTC)
- Check if behind NAT/firewall (may need TURN server)

### 5. "No active publisher for this station"

**Symptoms:**
- Listener gets error when trying to connect
- Publisher not detected

**Solutions:**
- Ensure publisher clicked "Go Live" first
- Wait a few seconds after publisher goes live
- Check that station is marked as live in database
- Refresh listener page

## Debugging Steps

### 1. Check Browser Console

Open browser DevTools (F12) and check Console tab for:
- WebRTC connection errors
- Socket.IO connection errors
- ICE candidate errors
- Media stream errors

### 2. Check Network Tab

In DevTools Network tab:
- Verify Socket.IO connection (look for WebSocket upgrade)
- Check API calls to `/stations/:id/start`
- Verify no CORS errors

### 3. Check Backend Logs

```bash
docker compose logs -f backend
```

Look for:
- Streaming client connections
- Offer/answer exchanges
- ICE candidate forwarding
- Error messages

### 4. Test WebRTC Connection

In browser console, test WebRTC:
```javascript
// Test getUserMedia
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => console.log('Microphone works:', stream))
  .catch(err => console.error('Microphone error:', err));

// Test RTCPeerConnection
const pc = new RTCPeerConnection();
console.log('WebRTC supported:', !!pc);
```

## Network Requirements

### For Local Development
- Both devices on same Wi-Fi network
- Firewall allows ports 3000, 5173
- No VPN that blocks local traffic

### For Production
- HTTPS required (WebRTC needs secure context)
- TURN server recommended for NAT traversal
- Consider using SFU (Mediasoup/Janus) for multiple listeners

## Current Limitations

1. **One-to-One Only**: Current implementation works best with one listener at a time
2. **No TURN Server**: May not work behind strict NATs/firewalls
3. **Basic STUN**: Uses free Google STUN servers
4. **No Recording**: Audio is not recorded on server

## Future Improvements

- Add TURN server support
- Integrate Mediasoup or Janus SFU for multiple listeners
- Add connection quality indicators
- Implement reconnection logic
- Add audio level meters
- Support for video streaming

## Testing Checklist

- [ ] Publisher can click "Go Live"
- [ ] Microphone permission granted
- [ ] Backend receives publish event
- [ ] Station marked as live
- [ ] Listener can click "Start Listening"
- [ ] WebRTC offer/answer exchange works
- [ ] ICE candidates exchanged
- [ ] Audio plays on listener side
- [ ] Connection state shows "connected"
- [ ] Multiple listeners (if supported)

