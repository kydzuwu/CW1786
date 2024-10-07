import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyD2KD_aBfWXcLmYkO1-tyV7FTetO26ACuY",
    authDomain: "yogaadmin-2eb00.firebaseapp.com",
    projectId: "yogaadmin-2eb00",
    storageBucket: "yogaadmin-2eb00.appspot.com",
    messagingSenderId: "457876930282",
    appId: "1:457876930282:web:3ac5eba1d9bada56006193",
    measurementId: "G-K8C0PK02WD"
};

let app;
let auth;
let db;

if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
    db = getFirestore(app);
} else {
    app = getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
}

export { app, auth, db };