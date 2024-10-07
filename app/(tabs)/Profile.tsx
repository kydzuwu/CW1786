import React from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { auth } from '../../firebase.config';

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error(error);
      Alert.alert('Logout failed', 'Please try again.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>Profile</ThemedText>
      <ThemedView style={styles.infoContainer}>
        <Ionicons name="person-circle-outline" size={80} color="#4CAF50" />
        <ThemedText style={styles.email}>{user?.email}</ThemedText>
      </ThemedView>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  email: {
    fontSize: 18,
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});