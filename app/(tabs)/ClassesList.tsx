import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity, Alert, SafeAreaView, Dimensions, Modal, ScrollView, Platform } from 'react-native';
import { collection, getDocs, query, where, addDoc, getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase.config';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

interface ClassInstance {
  id: string;
  comments: string;
  courseId: number;
  date: { toDate: () => Date };
  teacher: string;
}

interface YogaClass {
  id: number;
  capacity: number;
  dayOfWeek: string;
  description: string;
  duration: number;
  pricePerClass: number;
  time: string;
  typeOfClass: string;
}

interface CombinedClassInfo extends Omit<ClassInstance, 'id'>, Omit<YogaClass, 'id'> {
  id: string;
}

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', ''];

export default function ClassesList() {
  const [classInstances, setClassInstances] = useState<CombinedClassInfo[]>([]);
  const [bookedClasses, setBookedClasses] = useState<string[]>([]);
  const [searchDay, setSearchDay] = useState('');
  const [searchTime, setSearchTime] = useState<Date | null>(null);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchClassInstances();
    fetchBookedClasses();
  }, [searchDay, searchTime, sortOrder]);

  const fetchClassInstances = async () => {
    try {
      let q = collection(db, 'class_instances');
      const querySnapshot = await getDocs(q);
      
      const instancesData = await Promise.all(querySnapshot.docs.map(async (instanceDoc) => {
        const instanceData = instanceDoc.data() as ClassInstance;
        const yogaClassDoc = await getDoc(doc(db, 'yoga_classes', instanceData.courseId.toString()));
        const yogaClassData = yogaClassDoc.data() as YogaClass;
        return {
          id: instanceDoc.id,
          ...instanceData,
          ...yogaClassData,
        };
      }));

      // Filter the instances based on searchDay and searchTime
      let filteredInstances = instancesData.filter(instance => {
        const instanceDate = instance.date.toDate();
        const dayOfWeek = daysOfWeek[instanceDate.getDay()];
        const instanceTime = instance.time;

        const searchTimeString = searchTime 
          ? `${searchTime.getHours().toString().padStart(2, '0')}:${searchTime.getMinutes().toString().padStart(2, '0')}`
          : '';

        return (!searchDay || dayOfWeek === searchDay) &&
               (!searchTimeString || instanceTime === searchTimeString);
      });

      // Sort the filtered instances based on price
      filteredInstances.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.pricePerClass - b.pricePerClass;
        } else {
          return b.pricePerClass - a.pricePerClass;
        }
      });

      setClassInstances(filteredInstances);

      console.log('Fetched instances:', instancesData);
      console.log('Filtered instances:', filteredInstances);
      console.log('Search day:', searchDay);
      console.log('Search time:', searchTime);
      console.log('Sort order:', sortOrder);
    } catch (error) {
      console.error("Error fetching class instances: ", error);
    }
  };

  const fetchBookedClasses = async () => {
    if (!auth.currentUser) return;

    try {
      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const bookedClassesData = querySnapshot.docs.map(doc => doc.data().classInstanceId);
      setBookedClasses(bookedClassesData);
    } catch (error) {
      console.error("Error fetching booked classes: ", error);
    }
  };

  const handleBooking = async (classInstance: CombinedClassInfo) => {
    if (!auth.currentUser) {
      Alert.alert("Error", "You must be logged in to book a class.");
      return;
    }

    if (bookedClasses.includes(classInstance.id)) {
      Alert.alert("Already Booked", "You have already booked this class.");
      return;
    }

    Alert.alert(
      "Confirm Booking",
      `Do you want to book ${classInstance.typeOfClass} on ${formatDate(classInstance.date.toDate())} at ${classInstance.time}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes", 
          onPress: async () => {
            try {
              await addDoc(collection(db, 'bookings'), {
                userId: auth.currentUser.uid,
                classInstanceId: classInstance.id,
                courseId: classInstance.courseId,
                className: classInstance.typeOfClass,
                date: classInstance.date,
                teacher: classInstance.teacher,
                time: classInstance.time,
                duration: classInstance.duration,
                pricePerClass: classInstance.pricePerClass,
              });
              Alert.alert("Success", "Class booked successfully!");
              fetchBookedClasses(); // Refresh booked classes
            } catch (error) {
              console.error("Error booking class: ", error);
              Alert.alert("Error", "Failed to book class. Please try again.");
            }
          }
        }
      ]
    );
  };

  const formatDate = (date: Date) => {
    const dayName = daysOfWeek[date.getDay()];
    return `${dayName}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderClassItem = ({ item }: { item: CombinedClassInfo }) => (
    <View style={styles.classItem}>
      <View style={styles.classHeader}>
        <ThemedText type="subtitle" style={styles.classTitle}>{item.typeOfClass}</ThemedText>
        <ThemedText style={styles.classPrice}>${item.pricePerClass}</ThemedText>
      </View>
      <View style={styles.classDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={18} color="#4A4A4A" />
          <ThemedText style={styles.detailText}>{formatDate(item.date.toDate())}</ThemedText>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={18} color="#4A4A4A" />
          <ThemedText style={styles.detailText}>{item.time}</ThemedText>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="hourglass-outline" size={18} color="#4A4A4A" />
          <ThemedText style={styles.detailText}>{item.duration} mins</ThemedText>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="person-outline" size={18} color="#4A4A4A" />
          <ThemedText style={styles.detailText}>{item.teacher}</ThemedText>
        </View>
      </View>
      <TouchableOpacity 
        style={[styles.bookButton, bookedClasses.includes(item.id) && styles.bookedButton]} 
        onPress={() => handleBooking(item)}
        disabled={bookedClasses.includes(item.id)}
      >
        <ThemedText style={styles.bookButtonText}>
          {bookedClasses.includes(item.id) ? 'Already Booked' : 'Book Class'}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.header}>Yoga Classes</ThemedText>
        <View style={styles.searchContainer}>
          <TouchableOpacity 
            style={styles.inputContainer}
            onPress={() => setShowDayPicker(true)}
          >
            <Ionicons name="calendar-outline" size={24} color="#4A4A4A" style={styles.inputIcon} />
            <ThemedText style={styles.inputText}>
              {searchDay || 'Select day'}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.inputContainer}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons name="time-outline" size={24} color="#4A4A4A" style={styles.inputIcon} />
            <ThemedText style={styles.inputText}>
              {searchTime ? formatTime(searchTime) : 'Select time'}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={toggleSortOrder}
          >
            <Ionicons 
              name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} 
              size={24} 
              color="#FFFFFF" 
            />
            <ThemedText style={styles.sortButtonText}>
              Sort by Price
            </ThemedText>
          </TouchableOpacity>
        </View>
        <FlatList
          data={classInstances}
          keyExtractor={(item) => item.id}
          renderItem={renderClassItem}
          contentContainerStyle={styles.listContent}
        />
      </ThemedView>
      <Modal
        visible={showDayPicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Select Day</ThemedText>
            <ScrollView>
              {daysOfWeek.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={styles.dayOption}
                  onPress={() => {
                    setSearchDay(day);
                    setShowDayPicker(false);
                  }}
                >
                  <ThemedText style={styles.dayOptionText}>{day}</ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDayPicker(false)}
            >
              <ThemedText style={styles.closeButtonText}>Close</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {showTimePicker && (
        <DateTimePicker
          value={searchTime || new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(Platform.OS === 'ios');
            if (selectedTime) {
              setSearchTime(selectedTime);
            }
          }}
        />
      )}
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
  searchContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
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
    width: width - 32,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  classTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  classPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  classDetails: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4A4A4A',
  },
  bookButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  bookedButton: {
    backgroundColor: '#CCCCCC',
  },
  bookButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  dayOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dayOptionText: {
    fontSize: 18,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  sortButtonText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});