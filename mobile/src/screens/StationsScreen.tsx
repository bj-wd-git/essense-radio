import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Station {
  id: number;
  name: string;
  description: string;
  genre: string;
  isLive: boolean;
  listenerCount: number;
  owner: {
    username: string;
    displayName: string;
  };
}

const StationsScreen = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await axios.get('http://localhost:3000/stations');
      setStations(response.data);
    } catch (error) {
      console.error('Failed to fetch stations:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStations();
    setRefreshing(false);
  };

  const renderStation = ({ item }: { item: Station }) => (
    <TouchableOpacity
      style={[styles.stationCard, item.isLive && styles.liveCard]}
      onPress={() => navigation.navigate('StationDetail' as never, { stationId: item.id } as never)}
    >
      <View style={styles.stationHeader}>
        <Text style={styles.stationName}>{item.name}</Text>
        {item.isLive && <Text style={styles.liveBadge}>LIVE</Text>}
      </View>
      {item.description && <Text style={styles.stationDescription}>{item.description}</Text>}
      {item.genre && <Text style={styles.stationGenre}>{item.genre}</Text>}
      <View style={styles.stationFooter}>
        <Text style={styles.stationOwner}>By: {item.owner.displayName || item.owner.username}</Text>
        <Text style={styles.listenerCount}>👂 {item.listenerCount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Essence Radio</Text>
        <View style={styles.headerButtons}>
          {isAuthenticated ? (
            <>
              <TouchableOpacity onPress={() => navigation.navigate('MyStations' as never)}>
                <Text style={styles.headerLink}>My Stations</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={logout}>
                <Text style={styles.headerLink}>Logout</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
              <Text style={styles.headerLink}>Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <FlatList
        data={stations}
        renderItem={renderStation}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
  headerButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  headerLink: {
    color: '#4a9eff',
    fontSize: 16,
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
  liveCard: {
    borderColor: '#4a9eff',
    borderWidth: 2,
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  liveBadge: {
    backgroundColor: '#ff4444',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
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
  stationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  stationOwner: {
    color: '#aaa',
    fontSize: 14,
  },
  listenerCount: {
    color: '#aaa',
    fontSize: 14,
  },
});

export default StationsScreen;

