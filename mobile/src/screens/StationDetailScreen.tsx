import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import AudioListener from '../components/AudioListener';
import Chat from '../components/Chat';

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

const StationDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { stationId } = route.params as { stationId: number };
  const [station, setStation] = useState<Station | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchStation();
  }, [stationId]);

  const fetchStation = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/stations/${stationId}`);
      setStation(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load station');
      navigation.goBack();
    }
  };

  if (!station) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const isOwner = isAuthenticated && user?.id === station.owner.id;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{station.name}</Text>
      {station.description && <Text style={styles.description}>{station.description}</Text>}
      {station.genre && <Text style={styles.genre}>Genre: {station.genre}</Text>}
      <Text style={styles.listeners}>👂 Listeners: {station.listenerCount}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Audio Stream</Text>
        {isOwner ? (
          <Text style={styles.infoText}>Publisher view - Coming soon</Text>
        ) : (
          <AudioListener stationId={station.id} />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Live Chat</Text>
        <Chat stationId={station.id} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  description: {
    color: '#aaa',
    marginBottom: 10,
  },
  genre: {
    color: '#4a9eff',
    marginBottom: 10,
  },
  listeners: {
    color: '#fff',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  infoText: {
    color: '#aaa',
    textAlign: 'center',
    padding: 20,
  },
});

export default StationDetailScreen;

