import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Station {
  id: number;
  name: string;
  description: string;
  genre: string;
  status: string;
  isLive: boolean;
  streamKey: string;
}

const MyStationsScreen = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate('Login' as never);
      return;
    }
    fetchMyStations();
  }, [isAuthenticated]);

  const fetchMyStations = async () => {
    try {
      const response = await axios.get('http://localhost:3000/stations/my/stations');
      setStations(response.data);
    } catch (error) {
      console.error('Failed to fetch stations:', error);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post('http://localhost:3000/stations', { name, description, genre });
      setShowCreateForm(false);
      setName('');
      setDescription('');
      setGenre('');
      fetchMyStations();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create station');
    }
  };

  const renderStation = ({ item }: { item: Station }) => (
    <View style={styles.stationCard}>
      <Text style={styles.stationName}>{item.name}</Text>
      {item.description && <Text style={styles.stationDescription}>{item.description}</Text>}
      {item.genre && <Text style={styles.stationGenre}>{item.genre}</Text>}
      <Text style={styles.stationStatus}>Status: {item.status}</Text>
      <Text style={styles.streamKey}>Stream Key: {item.streamKey}</Text>
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => navigation.navigate('StationDetail' as never, { stationId: item.id } as never)}
      >
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Stations</Text>
        <TouchableOpacity onPress={() => setShowCreateForm(!showCreateForm)}>
          <Text style={styles.createButton}>{showCreateForm ? 'Cancel' : 'Create'}</Text>
        </TouchableOpacity>
      </View>

      {showCreateForm && (
        <View style={styles.createForm}>
          <TextInput
            style={styles.input}
            placeholder="Station Name"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            placeholderTextColor="#666"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Genre"
            placeholderTextColor="#666"
            value={genre}
            onChangeText={setGenre}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleCreate}>
            <Text style={styles.submitButtonText}>Create Station</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={stations}
        renderItem={renderStation}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  createButton: {
    color: '#4a9eff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createForm: {
    padding: 20,
    backgroundColor: '#1a1a1a',
    margin: 15,
    borderRadius: 8,
  },
  input: {
    backgroundColor: '#0a0a0a',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4a9eff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    padding: 15,
  },
  stationCard: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  stationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  stationDescription: {
    color: '#aaa',
    marginBottom: 8,
  },
  stationGenre: {
    color: '#4a9eff',
    fontSize: 14,
    marginBottom: 8,
  },
  stationStatus: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 4,
  },
  streamKey: {
    color: '#666',
    fontSize: 12,
    marginBottom: 10,
  },
  viewButton: {
    backgroundColor: '#4a9eff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MyStationsScreen;

