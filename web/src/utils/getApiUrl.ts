// Get API URL - use network IP if available, fallback to localhost
export const getApiUrl = (): string => {
  // Check if we have a stored network IP
  const storedIp = localStorage.getItem('network_ip');
  if (storedIp) {
    return `http://${storedIp}:3000`;
  }
  
  // Check environment variable
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && !envUrl.includes('localhost')) {
    return envUrl;
  }
  
  // Try to detect network IP from current location
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:3000`;
    }
  }
  
  // Fallback to localhost
  return 'http://localhost:3000';
};

// Get Socket.IO URL
export const getSocketUrl = (): string => {
  return getApiUrl();
};

