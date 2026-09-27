// // src/firebase/config.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDm2hyvE3mu6i4YwqfJGlaxseyTv2il3M4",
  authDomain: "prepwisesg-2a142.firebaseapp.com",
  projectId: "prepwisesg-2a142",
  storageBucket: "prepwisesg-2a142.firebasestorage.app",
  messagingSenderId: "1057890340648",
  appId: "1:1057890340648:web:368d19067961d82a348a1d",
  measurementId: "G-HYVX7WX0LM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
//getAuth(app);
export default app;
// const analytics = getAnalytics(app);
