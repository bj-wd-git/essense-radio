import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

interface ChatMessage {
  id: number;
  message: string;
  userId: number;
  createdAt: string;
  user: {
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
  const socketRef = useRef<Socket | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    socketRef.current = io('http://localhost:3000');

    socketRef.current.on('connect', () => {
      socketRef.current?.emit('join_station', { stationId });
      socketRef.current?.emit('get_chat_history', { stationId });
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

  const sendMessage = () => {
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
      <View style={styles.container}>
        <Text style={styles.infoText}>Please login to chat</Text>
      </View>
    );
  }

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={styles.message}>
      <Text style={styles.messageUser}>{item.user.displayName || item.user.username}</Text>
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        style={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    height: 300,
  },
  messagesList: {
    flex: 1,
    marginBottom: 10,
  },
  message: {
    marginBottom: 10,
  },
  messageUser: {
    color: '#4a9eff',
    fontSize: 12,
    marginBottom: 4,
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  sendButton: {
    backgroundColor: '#4a9eff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoText: {
    color: '#aaa',
    textAlign: 'center',
    padding: 20,
  },
});

export default Chat;

