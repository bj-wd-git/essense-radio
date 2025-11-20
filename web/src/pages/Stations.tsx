import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { getApiUrl } from '../utils/getApiUrl';
import NetworkConfig from '../components/NetworkConfig';

interface Station {
  id: number;
  name: string;
  description: string;
  genre: string;
  isLive: boolean;
  listenerCount: number;
  owner: {
    id: number;
    username: string;
    displayName: string;
  };
}

const Stations = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const { isAuthenticated, logout, isAdmin } = useAuth();

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/stations`);
      setStations(response.data);
    } catch (error) {
      console.error('Failed to fetch stations:', error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '2rem' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Essence Radio</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <NetworkConfig />
          {isAuthenticated ? (
            <>
              <Link to="/my-stations" style={{ marginRight: '1rem', color: '#4a9eff' }}>My Stations</Link>
              {isAdmin && <Link to="/admin" style={{ marginRight: '1rem', color: '#4a9eff' }}>Admin</Link>}
              <button onClick={logout} style={{ padding: '0.5rem 1rem', background: '#ff4444', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={{ color: '#4a9eff' }}>Login</Link>
          )}
        </div>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {stations.map((station) => (
          <Link
            key={station.id}
            to={`/stations/${station.id}`}
            style={{
              background: '#1a1a1a',
              padding: '1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#fff',
              border: station.isLive ? '2px solid #4a9eff' : '1px solid #333',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
              <h2 style={{ margin: 0 }}>{station.name}</h2>
              {station.isLive && (
                <span style={{ background: '#ff4444', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                  LIVE
                </span>
              )}
            </div>
            {station.description && <p style={{ color: '#aaa', marginBottom: '0.5rem' }}>{station.description}</p>}
            {station.genre && <p style={{ color: '#4a9eff', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{station.genre}</p>}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#aaa' }}>
              <span>By: {station.owner.displayName || station.owner.username}</span>
              <span>👂 {station.listenerCount}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Stations;

