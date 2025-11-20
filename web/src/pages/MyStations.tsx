import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { getApiUrl } from '../utils/getApiUrl';

interface Station {
  id: number;
  name: string;
  description: string;
  genre: string;
  status: string;
  isLive: boolean;
  listenerCount: number;
  streamKey: string;
}

const MyStations = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchMyStations();
  }, [isAuthenticated, navigate]);

  const fetchMyStations = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/stations/my/stations`);
      setStations(response.data);
    } catch (error) {
      console.error('Failed to fetch stations:', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${getApiUrl()}/stations`, { name, description, genre });
      setShowCreateForm(false);
      setName('');
      setDescription('');
      setGenre('');
      fetchMyStations();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create station');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>My Stations</h1>
        <div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#4a9eff',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginRight: '1rem',
            }}
          >
            {showCreateForm ? 'Cancel' : 'Create Station'}
          </button>
          <Link to="/stations" style={{ color: '#4a9eff' }}>Back to Stations</Link>
        </div>
      </div>

      {showCreateForm && (
        <form
          onSubmit={handleCreate}
          style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}
        >
          <h2>Create New Station</h2>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Station Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', background: '#0a0a0a', color: '#fff' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', background: '#0a0a0a', color: '#fff', minHeight: '100px' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', background: '#0a0a0a', color: '#fff' }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '0.75rem 1.5rem',
              background: '#4a9eff',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Create
          </button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {stations.map((station) => (
          <div
            key={station.id}
            style={{
              background: '#1a1a1a',
              padding: '1.5rem',
              borderRadius: '8px',
              border: station.isLive ? '2px solid #4a9eff' : '1px solid #333',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
              <h2 style={{ margin: 0 }}>{station.name}</h2>
              <span style={{ fontSize: '0.75rem', color: '#aaa' }}>{station.status}</span>
            </div>
            {station.description && <p style={{ color: '#aaa', marginBottom: '0.5rem' }}>{station.description}</p>}
            {station.genre && <p style={{ color: '#4a9eff', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{station.genre}</p>}
            <p style={{ fontSize: '0.875rem', color: '#aaa', marginBottom: '1rem' }}>Stream Key: {station.streamKey}</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link
                to={`/stations/${station.id}`}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  background: '#4a9eff',
                  borderRadius: '4px',
                  color: '#fff',
                  textDecoration: 'none',
                  textAlign: 'center',
                }}
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyStations;

