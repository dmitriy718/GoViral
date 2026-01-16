import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const hasConfig = Object.values(firebaseConfig).every((value) => Boolean(value));
const isTest = import.meta.env.MODE === 'test' || import.meta.env.VITE_MOCK_MODE === 'true';

if (!hasConfig && !isTest) {
  console.error('Firebase config is missing. Check VITE_FIREBASE_* environment variables.');
  throw new Error('Firebase configuration missing');
}

// Initialize with dummy data if missing but in test mode
const app = initializeApp(hasConfig ? firebaseConfig : { apiKey: 'dummy', authDomain: 'dummy', projectId: 'dummy' });
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();
