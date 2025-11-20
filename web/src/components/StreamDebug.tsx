import { useEffect, useRef } from 'react';

interface StreamDebugProps {
  stream: MediaStream | null;
  peerConnection: RTCPeerConnection | null;
}

const StreamDebug: React.FC<StreamDebugProps> = ({ stream, peerConnection }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (stream && audioRef.current) {
      audioRef.current.srcObject = stream;
      audioRef.current.play().catch(console.error);
    }
  }, [stream]);

  if (!stream && !peerConnection) return null;

  return (
    <div style={{ 
      background: '#2a2a2a', 
      padding: '1rem', 
      borderRadius: '4px', 
      marginTop: '1rem',
      fontSize: '0.75rem',
      color: '#aaa'
    }}>
      <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>Debug Info</h4>
      {stream && (
        <div>
          <p>Stream Tracks: {stream.getTracks().length}</p>
          {stream.getTracks().map((track, i) => (
            <p key={i}>
              Track {i}: {track.kind} - {track.enabled ? 'enabled' : 'disabled'} - {track.readyState}
            </p>
          ))}
        </div>
      )}
      {peerConnection && (
        <div>
          <p>Connection State: {peerConnection.connectionState}</p>
          <p>ICE State: {peerConnection.iceConnectionState}</p>
          <p>Signaling State: {peerConnection.signalingState}</p>
        </div>
      )}
      {stream && (
        <audio 
          ref={audioRef} 
          autoPlay 
          controls 
          style={{ width: '100%', marginTop: '0.5rem' }}
        />
      )}
    </div>
  );
};

export default StreamDebug;

