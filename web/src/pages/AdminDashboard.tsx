import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { getApiUrl } from '../utils/getApiUrl';

interface Dashboard {
  totalStations: number;
  liveStations: number;
  totalUsers: number;
  pendingStations: number;
}

interface Station {
  id: number;
  name: string;
  status: string;
  isLive: boolean;
  owner: {
    username: string;
  };
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
}

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const { logout } = useAuth();

  useEffect(() => {
    fetchDashboard();
    fetchStations();
    fetchUsers();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/admin/dashboard`);
      setDashboard(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    }
  };

  const fetchStations = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/admin/stations`);
      setStations(response.data);
    } catch (error) {
      console.error('Failed to fetch stations:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/admin/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const approveStation = async (id: number) => {
    try {
      await axios.patch(`${getApiUrl()}/admin/stations/${id}/approve`);
      fetchStations();
      fetchDashboard();
    } catch (error) {
      alert('Failed to approve station');
    }
  };

  const rejectStation = async (id: number) => {
    try {
      await axios.patch(`${getApiUrl()}/admin/stations/${id}/reject`);
      fetchStations();
      fetchDashboard();
    } catch (error) {
      alert('Failed to reject station');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '2rem' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Admin Dashboard</h1>
        <div>
          <Link to="/stations" style={{ marginRight: '1rem', color: '#4a9eff' }}>Stations</Link>
          <button onClick={logout} style={{ padding: '0.5rem 1rem', background: '#ff4444', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </nav>

      {dashboard && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
            <h3 style={{ color: '#aaa', marginBottom: '0.5rem' }}>Total Stations</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{dashboard.totalStations}</p>
          </div>
          <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
            <h3 style={{ color: '#aaa', marginBottom: '0.5rem' }}>Live Stations</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4a9eff' }}>{dashboard.liveStations}</p>
          </div>
          <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
            <h3 style={{ color: '#aaa', marginBottom: '0.5rem' }}>Total Users</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{dashboard.totalUsers}</p>
          </div>
          <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
            <h3 style={{ color: '#aaa', marginBottom: '0.5rem' }}>Pending</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffaa00' }}>{dashboard.pendingStations}</p>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h2>Pending Stations</h2>
          <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', maxHeight: '500px', overflowY: 'auto' }}>
            {stations.filter(s => s.status === 'pending').map((station) => (
              <div key={station.id} style={{ marginBottom: '1rem', padding: '1rem', background: '#0a0a0a', borderRadius: '4px' }}>
                <h3>{station.name}</h3>
                <p style={{ color: '#aaa', fontSize: '0.875rem' }}>By: {station.owner.username}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => approveStation(station.id)}
                    style={{ padding: '0.5rem 1rem', background: '#4a9eff', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectStation(station.id)}
                    style={{ padding: '0.5rem 1rem', background: '#ff4444', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2>All Users</h2>
          <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', maxHeight: '500px', overflowY: 'auto' }}>
            {users.map((user) => (
              <div key={user.id} style={{ marginBottom: '1rem', padding: '1rem', background: '#0a0a0a', borderRadius: '4px' }}>
                <h3>{user.username}</h3>
                <p style={{ color: '#aaa', fontSize: '0.875rem' }}>{user.email}</p>
                <p style={{ color: '#aaa', fontSize: '0.875rem' }}>Role: {user.role} | Status: {user.isActive ? 'Active' : 'Inactive'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

