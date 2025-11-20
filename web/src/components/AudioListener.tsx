import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getSocketUrl } from '../utils/getApiUrl';
import StreamDebug from './StreamDebug';

interface AudioListenerProps {
  stationId: number;
}

const AudioListener: React.FC<AudioListenerProps> = ({ stationId }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [receivedStream, setReceivedStream] = useState<MediaStream | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const startListening = () => {
    try {
      const socketUrl = `${getSocketUrl()}/streaming`;
      console.log('Connecting to streaming at:', socketUrl);
      socketRef.current = io(socketUrl, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      socketRef.current.on('connect', () => {
        console.log('Streaming socket connected');
        socketRef.current?.emit('subscribe', { stationId });
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Streaming connection error:', error);
        setError('Failed to connect to streaming server. Check your network configuration.');
        setIsListening(false);
      });

      socketRef.current.on('error', (data: { message: string }) => {
        console.error('Streaming error:', data);
        setError(data.message || 'Streaming error occurred');
        setIsListening(false);
      });

      socketRef.current.on('subscriber_ready', () => {
        console.log('Subscriber ready');
        startWebRTC();
      });

      socketRef.current.on('answer', async (data: { answer: RTCSessionDescriptionInit }) => {
        console.log('Received answer from publisher');
        if (peerConnectionRef.current) {
          try {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
            console.log('Set remote description from publisher');
          } catch (error) {
            console.error('Error setting remote description:', error);
            setError('Failed to establish connection.');
          }
        }
      });

      socketRef.current.on('ice-candidate', async (data: { candidate: RTCIceCandidateInit }) => {
        if (peerConnectionRef.current && data.candidate) {
          try {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
            console.log('Added ICE candidate from publisher');
          } catch (error) {
            console.error('Error adding ICE candidate:', error);
          }
        }
      });

      setIsListening(true);
    } catch (error) {
      console.error('Failed to start listening:', error);
      setError('Failed to connect to stream');
    }
  };

  const startWebRTC = async () => {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      });

      pc.ontrack = (event) => {
        console.log('=== TRACK RECEIVED ===');
        console.log('Track kind:', event.track.kind);
        console.log('Track ID:', event.track.id);
        console.log('Track enabled:', event.track.enabled);
        console.log('Track readyState:', event.track.readyState);
        console.log('Streams count:', event.streams.length);
        console.log('Event streams:', event.streams);
        
        // Ensure track is enabled
        if (!event.track.enabled) {
          console.log('Enabling track');
          event.track.enabled = true;
        }
        
        let stream: MediaStream;
        
        if (event.streams && event.streams.length > 0) {
          stream = event.streams[0];
          console.log('Using stream from event, tracks:', stream.getTracks().length);
        } else {
          // Create stream from track
          console.log('Creating new stream from track');
          stream = new MediaStream([event.track]);
        }
        
        setReceivedStream(stream);
        console.log('Stream set in state, tracks:', stream.getTracks().length);
        
        if (audioRef.current) {
          // Remove old stream if any
          if (audioRef.current.srcObject) {
            const oldStream = audioRef.current.srcObject as MediaStream;
            oldStream.getTracks().forEach(track => {
              track.stop();
              console.log('Stopped old track:', track.id);
            });
          }
          
          console.log('Setting srcObject on audio element');
          audioRef.current.srcObject = stream;
          
          // Log audio element state
          console.log('Audio element srcObject:', audioRef.current.srcObject);
          console.log('Audio element readyState:', audioRef.current.readyState);
          
          // Force play with error handling
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log('✅ Audio playback started successfully');
              setError('');
            }).catch((err) => {
              console.error('❌ Audio play error:', err);
              setError('Audio playback failed. Please click play button or check browser audio settings.');
            });
          }
        } else {
          console.error('Audio element ref is null!');
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.emit('ice-candidate', {
            stationId,
            candidate: event.candidate,
          });
          console.log('Sent ICE candidate to publisher');
        }
      };

      pc.onconnectionstatechange = () => {
        const state = pc.connectionState;
        console.log('Listener connection state:', state);
        setConnectionStatus(state);
        if (state === 'connected') {
          setError('');
          console.log('Successfully connected to publisher');
        } else if (state === 'failed') {
          setError('Connection failed. Please try again.');
          console.error('Listener connection failed');
        } else if (state === 'disconnected') {
          setError('Connection lost. Please try again.');
          console.error('Listener connection disconnected');
        } else if (state === 'connecting') {
          setError('');
          console.log('Connecting to publisher...');
        }
      };

      pc.oniceconnectionstatechange = () => {
        const iceState = pc.iceConnectionState;
        console.log('ICE connection state:', iceState);
        setConnectionStatus(`${pc.connectionState} (ICE: ${iceState})`);
        if (iceState === 'failed') {
          setError('Network connection failed. Please check your internet connection and try again.');
        } else if (iceState === 'connected' || iceState === 'completed') {
          setError('');
          console.log('✅ ICE connection established');
        }
      };

      pc.onicegatheringstatechange = () => {
        console.log('ICE gathering state:', pc.iceGatheringState);
      };

      // Wait a bit to ensure publisher is ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create offer and send to publisher
      const offer = await pc.createOffer({ 
        offerToReceiveAudio: true,
        offerToReceiveVideo: false 
      });
      await pc.setLocalDescription(offer);
      console.log('Created offer, sending to publisher:', offer.type);

      socketRef.current?.emit('offer', {
        stationId,
        offer,
      });

      peerConnectionRef.current = pc;
      
      // Set timeout to check if connection established
      setTimeout(() => {
        if (pc.connectionState !== 'connected' && pc.connectionState !== 'connecting') {
          console.warn('Connection not established after 10 seconds');
          if (pc.connectionState === 'new' || pc.connectionState === 'checking') {
            setError('Connection taking longer than expected. Please wait or try again.');
          }
        }
      }, 10000);
    } catch (error) {
      console.error('Error starting WebRTC:', error);
      setError('Failed to establish connection. Please try again.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.emit('leave_station', { stationId });
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    if (audioRef.current) {
      if (audioRef.current.srcObject) {
        const stream = audioRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      audioRef.current.srcObject = null;
    }
    setReceivedStream(null);
    setIsListening(false);
    setConnectionStatus('');
    setError('');
  };

  return (
    <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
      {error && <div style={{ color: '#ff4444', marginBottom: '1rem' }}>{error}</div>}
      {!isListening ? (
        <button
          onClick={startListening}
          style={{
            padding: '1rem 2rem',
            background: '#4a9eff',
            border: 'none',
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem',
          }}
        >
          Start Listening
        </button>
      ) : (
        <div>
          <div style={{ marginBottom: '1rem', color: '#4a9eff' }}>
            🎧 Listening...
            {connectionStatus && (
              <span style={{ marginLeft: '1rem', fontSize: '0.875rem', color: '#aaa' }}>
                ({connectionStatus})
              </span>
            )}
          </div>
          <audio 
            ref={audioRef} 
            autoPlay 
            controls 
            style={{ width: '100%', marginBottom: '1rem' }}
            onLoadedMetadata={() => {
              console.log('Audio metadata loaded');
              if (audioRef.current) {
                audioRef.current.play().catch(err => {
                  console.error('Auto-play failed:', err);
                  setError('Please click play to start audio');
                });
              }
            }}
            onError={(e) => {
              console.error('Audio element error:', e);
              setError('Audio playback error. Please check browser console.');
            }}
          />
          <button
            onClick={stopListening}
            style={{
              padding: '1rem 2rem',
              background: '#ff4444',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            Stop Listening
          </button>
          {process.env.NODE_ENV === 'development' && (
            <StreamDebug 
              stream={receivedStream} 
              peerConnection={peerConnectionRef.current} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AudioListener;

