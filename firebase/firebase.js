// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCPdl-GmU1ID4QME59MDFHclcQx4oP0n8",
  authDomain: "gumtree-c1ede.firebaseapp.com",
  projectId: "gumtree-c1ede",
  storageBucket: "gumtree-c1ede.appspot.com",
  messagingSenderId: "649841103678",
  appId: "1:649841103678:web:0d04d3ddbdeeafdc85926f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app)
export {auth, db}