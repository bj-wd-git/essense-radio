import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import { getSocketUrl } from '../utils/getApiUrl';

interface ChatMessage {
  id: number;
  message: string;
  userId: number;
  stationId: number;
  createdAt: string;
  user: {
    id: number;
    username: string;
    displayName: string;
  };
}

interface ChatProps {
  stationId: number;
}

const Chat: React.FC<ChatProps> = ({ stationId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const socketUrl = getSocketUrl();
    console.log('Connecting to chat at:', socketUrl);
    
    socketRef.current = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current.on('connect', () => {
      console.log('Chat connected');
      setIsConnected(true);
      socketRef.current?.emit('join_station', { stationId });
      socketRef.current?.emit('get_chat_history', { stationId });
    });

    socketRef.current.on('disconnect', () => {
      console.log('Chat disconnected');
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Chat connection error:', error);
      setIsConnected(false);
    });

    socketRef.current.on('chat_history', (history: ChatMessage[]) => {
      setMessages(history.reverse());
    });

    socketRef.current.on('chat_message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave_station', { stationId });
        socketRef.current.disconnect();
      }
    };
  }, [stationId, isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isAuthenticated || !user) return;

    socketRef.current?.emit('chat_message', {
      stationId,
      userId: user.id,
      message: newMessage.trim(),
    });

    setNewMessage('');
  };

  if (!isAuthenticated) {
    return (
      <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
        <p style={{ color: '#aaa' }}>Please login to chat</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', height: '500px' }}>
      {!isConnected && (
        <div style={{ background: '#ffaa00', color: '#000', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.875rem' }}>
          Connecting to chat...
        </div>
      )}
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#4a9eff', marginBottom: '0.25rem' }}>
              {msg.user.displayName || msg.user.username}
            </div>
            <div style={{ color: '#fff' }}>{msg.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #333',
              background: '#0a0a0a',
              color: '#fff',
            }}
          />
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
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;

