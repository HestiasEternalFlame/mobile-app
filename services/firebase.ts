// services/firebase.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Firebase configuration using environment variables
const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!
};

// Validate that all required config values are present
const requiredKeys: (keyof FirebaseConfig)[] = [
  'apiKey', 
  'authDomain', 
  'projectId', 
  'storageBucket', 
  'messagingSenderId', 
  'appId'
];

const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  throw new Error(`Missing Firebase configuration: ${missingKeys.join(', ')}`);
}

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Auth - Firebase v9+ handles React Native persistence automatically
export const auth: Auth = getAuth(app);

// Initialize Firestore (for storing user profile data)
export const db: Firestore = getFirestore(app);

// Export the app instance if needed
export default app;