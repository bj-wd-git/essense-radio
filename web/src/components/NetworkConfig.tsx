import { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/getApiUrl';

const NetworkConfig = () => {
  const [networkIp, setNetworkIp] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('network_ip');
    if (stored) {
      setNetworkIp(stored);
    }
  }, []);

  const handleSave = () => {
    if (networkIp.trim()) {
      localStorage.setItem('network_ip', networkIp.trim());
      alert('Network IP saved! Please refresh the page.');
      window.location.reload();
    }
  };

  const handleDetect = async () => {
    try {
      // Try to get IP from a service
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setNetworkIp(data.ip);
    } catch (error) {
      // Fallback: try to detect from current location
      const hostname = window.location.hostname;
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        setNetworkIp(hostname);
      } else {
        alert('Could not auto-detect. Please enter your computer\'s IP address manually.\n\nOn Windows: ipconfig\nOn Mac/Linux: ifconfig');
      }
    }
  };

  if (!showConfig) {
    return (
      <button
        onClick={() => setShowConfig(true)}
        style={{
          padding: '0.5rem 1rem',
          background: '#333',
          border: 'none',
          borderRadius: '4px',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '0.875rem',
        }}
      >
        Configure Network
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: '#1a1a1a',
      padding: '2rem',
      borderRadius: '8px',
      border: '1px solid #333',
      zIndex: 1000,
      minWidth: '400px',
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Network Configuration</h3>
      <p style={{ color: '#aaa', fontSize: '0.875rem', marginBottom: '1rem' }}>
        Enter your computer's IP address to access from other devices on your network.
      </p>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff' }}>
          Network IP Address:
        </label>
        <input
          type="text"
          value={networkIp}
          onChange={(e) => setNetworkIp(e.target.value)}
          placeholder="192.168.1.100"
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '4px',
            border: '1px solid #333',
            background: '#0a0a0a',
            color: '#fff',
            marginBottom: '0.5rem',
          }}
        />
        <button
          onClick={handleDetect}
          style={{
            padding: '0.5rem 1rem',
            background: '#4a9eff',
            border: 'none',
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '0.875rem',
            marginRight: '0.5rem',
          }}
        >
          Auto-Detect
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('network_ip');
            setNetworkIp('');
            alert('Network IP cleared! Using localhost.');
            window.location.reload();
          }}
          style={{
            padding: '0.5rem 1rem',
            background: '#666',
            border: 'none',
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          Use Localhost
        </button>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setShowConfig(false)}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#666',
            border: 'none',
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
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
          Save
        </button>
      </div>
      <p style={{ color: '#666', fontSize: '0.75rem', marginTop: '1rem', marginBottom: 0 }}>
        Current API URL: {getApiUrl()}
      </p>
    </div>
  );
};

export default NetworkConfig;

