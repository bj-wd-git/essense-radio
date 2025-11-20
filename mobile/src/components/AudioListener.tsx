import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

interface AudioListenerProps {
  stationId: number;
}

const AudioListener: React.FC<AudioListenerProps> = ({ stationId }) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    // WebRTC implementation for mobile - simplified for now
    Alert.alert('Info', 'Audio streaming will be implemented with WebRTC');
    setIsListening(true);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <View style={styles.container}>
      {!isListening ? (
        <TouchableOpacity style={styles.button} onPress={startListening}>
          <Text style={styles.buttonText}>Start Listening</Text>
        </TouchableOpacity>
      ) : (
        <View>
          <Text style={styles.statusText}>🎧 Listening...</Text>
          <TouchableOpacity style={styles.stopButton} onPress={stopListening}>
            <Text style={styles.buttonText}>Stop Listening</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#4a9eff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    color: '#4a9eff',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default AudioListener;

