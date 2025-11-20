import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Socket } from 'socket.io-client';
import AudioPublisher from '../components/AudioPublisher';
import AudioListener from '../components/AudioListener';
import Chat from '../components/Chat';
import { getApiUrl } from '../utils/getApiUrl';

interface Station {
  id: number;
  name: string;
  description: string;
  genre: string;
  isLive: boolean;
  listenerCount: number;
  streamKey?: string;
  owner: {
    id: number;
    username: string;
    displayName: string;
  };
}

const StationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [station, setStation] = useState<Station | null>(null);
  const { user, isAuthenticated } = useAuth();
  const chatSocket = useRef<Socket | null>(null);

  useEffect(() => {
    fetchStation();
    return () => {
      if (chatSocket.current) {
        chatSocket.current.disconnect();
      }
    };
  }, [id]);

  const fetchStation = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/stations/${id}`);
      setStation(response.data);
    } catch (error) {
      console.error('Failed to fetch station:', error);
    }
  };

  if (!station) {
    return <div style={{ padding: '2rem', color: '#fff' }}>Loading...</div>;
  }

  const isOwner = isAuthenticated && user?.id === station.owner.id;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '2rem' }}>
      <Link to="/stations" style={{ color: '#4a9eff', marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to Stations
      </Link>
      <h1>{station.name}</h1>
      {station.description && <p style={{ color: '#aaa', marginBottom: '1rem' }}>{station.description}</p>}
      {station.genre && <p style={{ color: '#4a9eff', marginBottom: '1rem' }}>Genre: {station.genre}</p>}
      <p style={{ marginBottom: '1rem' }}>👂 Listeners: {station.listenerCount}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div>
          <h2>Audio Stream</h2>
          {isOwner ? (
            <AudioPublisher stationId={station.id} streamKey={station.streamKey || ''} />
          ) : (
            <AudioListener stationId={station.id} />
          )}
        </div>
        <div>
          <h2>Live Chat</h2>
          <Chat stationId={station.id} />
        </div>
      </div>
    </div>
  );
};

export default StationDetail;

