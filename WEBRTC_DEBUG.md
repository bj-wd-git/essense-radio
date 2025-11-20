# WebRTC Debugging Guide

## Quick Test Steps

1. **Open Browser Console (F12)** on both publisher and listener
2. **Publisher**: Click "Go Live"
   - Check console for: "Publisher WebRTC peer connection created"
   - Check for: "Adding tracks to peer connection"
   - Verify microphone permission granted

3. **Listener**: Click "Start Listening"
   - Check console for: "Created offer, sending to publisher"
   - Check for: "Received answer from publisher"
   - Check for: "Received track from publisher"

4. **Check Connection States**:
   - Publisher should show: "connected" or "connecting"
   - Listener should show: "connected" or "connecting"

## Common Issues

### Issue 1: No Audio Received

**Symptoms:**
- Connection shows "connected" but no sound
- Audio element shows but no playback

**Debug:**
```javascript
// In browser console (listener side)
const audio = document.querySelector('audio');
console.log('Audio srcObject:', audio?.srcObject);
console.log('Audio tracks:', audio?.srcObject?.getTracks());
console.log('Audio readyState:', audio?.readyState);
```

**Solutions:**
- Check if track is enabled: `audio.srcObject.getTracks()[0].enabled`
- Try manually playing: `audio.play()`
- Check browser audio settings
- Verify microphone is working on publisher side

### Issue 2: Connection Never Establishes

**Symptoms:**
- Connection state stuck on "connecting" or "checking"
- No "connected" state

**Debug:**
```javascript
// Check ICE connection state
pc.iceConnectionState // Should be "connected" or "checking"
pc.connectionState // Should be "connected"
```

**Solutions:**
- Check firewall settings
- Try different network (some networks block WebRTC)
- Check if behind NAT (may need TURN server)
- Verify STUN servers are accessible

### Issue 3: Offer/Answer Not Exchanged

**Symptoms:**
- No "Received offer" or "Received answer" in console
- Connection never starts

**Debug:**
- Check backend logs: `docker compose logs backend | grep -i offer`
- Verify Socket.IO connection is working
- Check network tab for WebSocket messages

**Solutions:**
- Verify backend is running
- Check Socket.IO connection status
- Ensure network IP is configured correctly

## Manual Testing

### Test 1: Verify Microphone Works
```javascript
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    console.log('Microphone works!', stream.getTracks());
    const audio = new Audio();
    audio.srcObject = stream;
    audio.play();
  })
  .catch(err => console.error('Microphone error:', err));
```

### Test 2: Test WebRTC Locally
Open two browser tabs on the same page and test WebRTC connection directly.

### Test 3: Check Network
```javascript
// Check if WebRTC is supported
console.log('RTCPeerConnection:', typeof RTCPeerConnection);
console.log('getUserMedia:', typeof navigator.mediaDevices?.getUserMedia);
```

## Expected Console Output

### Publisher Console:
```
Connecting to streaming at: http://localhost:3000/streaming
Streaming socket connected
Publisher ready
Publisher WebRTC peer connection created
Adding tracks to peer connection: 1
Publisher tracks added. Senders: 1
Received offer from listener: [socket-id]
Set remote description from listener offer
Created and set local answer
Sent answer to listener: [socket-id]
Publisher ICE candidate: ...
Publisher connection state: connected
```

### Listener Console:
```
Connecting to streaming at: http://localhost:3000/streaming
Streaming socket connected
Subscriber ready
Created offer, sending to publisher: offer
Received answer from publisher
Set remote description from publisher
Sent ICE candidate to publisher
Received track from publisher: audio [track-id]
Audio stream set to audio element
Audio playback started
Listener connection state: connected
```

## If Still Not Working

1. **Check Browser Compatibility**:
   - Chrome/Edge: Best support
   - Firefox: Good support
   - Safari: May have issues

2. **Try Different Browser**:
   - WebRTC support varies by browser

3. **Check Network**:
   - Both devices on same network
   - No VPN that blocks local traffic
   - Firewall allows WebRTC

4. **Use TURN Server** (for production):
   - Current setup uses only STUN
   - TURN needed for strict NATs
   - Consider using services like Twilio TURN

5. **Consider SFU**:
   - For multiple listeners, use Mediasoup or Janus
   - Current P2P only works well for 1-2 listeners

