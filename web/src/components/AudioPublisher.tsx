import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { getApiUrl, getSocketUrl } from '../utils/getApiUrl';
import StreamDebug from './StreamDebug';

interface AudioPublisherProps {
  stationId: number;
  streamKey: string;
}

const AudioPublisher: React.FC<AudioPublisherProps> = ({ stationId, streamKey }) => {
  const [isLive, setIsLive] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const startPublishing = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;

      // Connect to streaming socket
      const socketUrl = `${getSocketUrl()}/streaming`;
      console.log('Connecting to streaming at:', socketUrl);
      socketRef.current = io(socketUrl, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      socketRef.current.on('connect', () => {
        console.log('Streaming socket connected');
        socketRef.current?.emit('publish', { stationId, streamKey });
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Streaming connection error:', error);
        setError('Failed to connect to streaming server. Check your network configuration.');
        setIsLive(false);
      });

      socketRef.current.on('error', (data: { message: string }) => {
        console.error('Streaming error:', data);
        setError(data.message || 'Streaming error occurred');
        setIsLive(false);
      });

      socketRef.current.on('publisher_ready', () => {
        console.log('Publisher ready');
        // Peer connection should already be created, but ensure it exists
        if (!peerConnectionRef.current) {
          startWebRTC();
        }
      });

      socketRef.current.on('offer', async (data: { offer: RTCSessionDescriptionInit; socketId: string }) => {
        console.log('Received offer from listener:', data.socketId);
        // Ensure peer connection exists
        if (!peerConnectionRef.current) {
          console.log('Creating peer connection for incoming offer');
          startWebRTC();
        }
        
        if (peerConnectionRef.current) {
          try {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
            console.log('Set remote description from listener offer');
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            console.log('Created and set local answer');
            socketRef.current?.emit('answer', {
              stationId,
              answer,
              socketId: data.socketId,
            });
            console.log('Sent answer to listener:', data.socketId);
          } catch (error) {
            console.error('Error handling offer:', error);
            setError('Failed to process listener connection. Please try again.');
          }
        } else {
          console.error('Peer connection not available when offer received');
          setError('WebRTC connection not ready. Please try again.');
        }
      });

      socketRef.current.on('ice-candidate', async (data: { candidate: RTCIceCandidateInit; socketId?: string }) => {
        if (peerConnectionRef.current && data.candidate) {
          try {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
            console.log('Added ICE candidate from listener');
          } catch (error) {
            console.error('Error adding ICE candidate:', error);
          }
        }
      });

      // Create WebRTC peer connection immediately (before backend call)
      startWebRTC();
      
      // Start stream on backend
      await axios.post(`${getApiUrl()}/stations/${stationId}/start`);
      setIsLive(true);
      setConnectionStatus('connecting');
      setError('');
    } catch (error: any) {
      console.error('Failed to start publishing:', error);
      setError(error.response?.data?.message || 'Failed to start publishing. Please check microphone permissions.');
      setIsLive(false);
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    }
  };

  const startWebRTC = () => {
    // Close existing connection if any
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    });

    if (localStreamRef.current) {
      const tracks = localStreamRef.current.getTracks();
      console.log('Adding tracks to peer connection:', tracks.length);
      tracks.forEach(track => {
        console.log('Adding track:', track.kind, track.id, track.enabled);
        pc.addTrack(track, localStreamRef.current!);
      });
      console.log('Publisher tracks added. Senders:', pc.getSenders().length);
    } else {
      console.warn('No local stream available when creating peer connection');
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        console.log('Publisher ICE candidate:', event.candidate.candidate.substring(0, 50));
        // Broadcast ICE candidate to all listeners in the station room
        socketRef.current.emit('ice-candidate', {
          stationId,
          candidate: event.candidate,
        });
      } else if (!event.candidate) {
        console.log('Publisher ICE gathering complete');
      }
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      console.log('Publisher connection state:', state);
      setConnectionStatus(state);
      if (state === 'failed' || state === 'disconnected') {
        console.error('Publisher connection failed');
        setError('Connection lost. Please try again.');
      } else if (state === 'connected') {
        setError('');
        console.log('Publisher connected to listener');
      }
    };

    pc.ontrack = (event) => {
      console.log('Publisher received track (unexpected):', event.track.kind);
    };

    peerConnectionRef.current = pc;
    console.log('Publisher WebRTC peer connection created and ready for offers');
  };

  const stopPublishing = async () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    await axios.post(`${getApiUrl()}/stations/${stationId}/stop`);
    setIsLive(false);
    setConnectionStatus('');
    setError('');
  };

  return (
    <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
      {error && (
        <div style={{ 
          background: '#ff4444', 
          color: '#fff', 
          padding: '0.75rem', 
          borderRadius: '4px', 
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}
      {!isLive ? (
        <button
          onClick={startPublishing}
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
          Go Live
        </button>
      ) : (
        <div>
          <div style={{ marginBottom: '1rem', color: '#4a9eff' }}>
            🔴 Broadcasting Live
            {connectionStatus && (
              <span style={{ marginLeft: '1rem', fontSize: '0.875rem', color: '#aaa' }}>
                ({connectionStatus})
              </span>
            )}
          </div>
          <button
            onClick={stopPublishing}
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
            Stop Stream
          </button>
          {process.env.NODE_ENV === 'development' && (
            <StreamDebug 
              stream={localStreamRef.current} 
              peerConnection={peerConnectionRef.current} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AudioPublisher;

