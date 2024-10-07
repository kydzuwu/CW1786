import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, Alert, SafeAreaView, Dimensions } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase.config';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

const { width } = Dimensions.get('window');

export default function BookedClasses() {
  const [bookedClasses, setBookedClasses] = useState([]);

  useEffect(() => {
    const fetchBookedClasses = async () => {
      if (!auth.currentUser) {
        Alert.alert("Error", "You must be logged in to view booked classes.");
        return;
      }

      try {
        const q = query(
          collection(db, 'bookings'),
          where('userId', '==', auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const classesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookedClasses(classesData);
      } catch (error) {
        console.error("Error fetching booked classes: ", error);
        Alert.alert("Error", "Failed to fetch booked classes. Please try again.");
      }
    };

    fetchBookedClasses();
  }, []);

  const renderClassItem = ({ item }) => (
    <View style={styles.classItem}>
      <ThemedText type="subtitle" style={styles.classTitle}>{item.className}</ThemedText>
      <View style={styles.classDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={18} color="#4A4A4A" />
          <ThemedText style={styles.detailText}>
            {new Date(item.date.toDate()).toLocaleDateString()}
          </ThemedText>
        </View>
        {/* Add more details as needed */}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.header}>My Booked Classes</ThemedText>
        {bookedClasses.length > 0 ? (
          <FlatList
            data={bookedClasses}
            keyExtractor={(item) => item.id}
            renderItem={renderClassItem}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <ThemedText style={styles.noClassesText}>You haven't booked any classes yet.</ThemedText>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
  classItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: width - 32, // Adjust width based on screen size
  },
  classTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  classDetails: {
    flexDirection: 'column',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4A4A4A',
  },
  noClassesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 24,
  },
});