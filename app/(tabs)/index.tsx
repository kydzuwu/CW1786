import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, View } from 'react-native';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { auth } from '../../firebase.config';

const FeatureItem = ({ icon, title, description }) => (
  <View style={styles.featureItem}>
    <Ionicons name={icon} size={24} color="#4CAF50" />
    <View style={styles.featureTextContainer}>
      <ThemedText style={styles.featureTitle}>{title}</ThemedText>
      <ThemedText style={styles.featureDescription}>{description}</ThemedText>
    </View>
  </View>
);

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error(error);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#45a049']}
        style={styles.header}
      >
        <Image
          source={require('../../assets/images/yoga-logo.jpg')}
          style={styles.logo}
        />
        <ThemedText style={styles.title}>Welcome to Universal Yoga</ThemedText>
      </LinearGradient>
      
      <ThemedView style={styles.content}>
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>About Our App</ThemedText>
          <ThemedText style={styles.sectionText}>
            Universal Yoga is your personal gateway to wellness and inner peace. Our app connects you with a variety of yoga classes, suited for all levels and preferences.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Key Features</ThemedText>
          <FeatureItem 
            icon="search" 
            title="Browse Classes" 
            description="Explore a wide range of yoga classes"
          />
          <FeatureItem 
            icon="calendar" 
            title="Book Classes" 
            description="Easily book and manage your yoga sessions"
          />
          <FeatureItem 
            icon="person" 
            title="Personalized Experience" 
            description="Track your progress and get personalized recommendations"
          />
          <FeatureItem 
            icon="compass" 
            title="Explore Styles" 
            description="Discover various yoga styles and instructors"
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Getting Started</ThemedText>
          <ThemedText style={styles.sectionText}>
            1. Browse classes in the 'Classes' tab{'\n'}
            2. Book your preferred classes{'\n'}
            3. View your bookings in 'My Classes'{'\n'}
            4. Enjoy your yoga journey!
          </ThemedText>
        </ThemedView>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
