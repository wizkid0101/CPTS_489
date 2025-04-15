// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCs0TV8OzZJ7lAsIXqy4k7in21kiehDLQg",
  authDomain: "video-game-marketplace.firebaseapp.com",
  projectId: "video-game-marketplace",
  storageBucket: "video-game-marketplace.firebasestorage.app",
  messagingSenderId: "741674446668",
  appId: "1:741674446668:web:4c2e52bb4e9360db9629e9",
  measurementId: "G-HGY4PEQZY9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ These are what your app needs:
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);

