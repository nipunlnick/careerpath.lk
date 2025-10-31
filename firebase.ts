import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from 'firebase/firestore';

// =================================================================
// FIREBASE PROJECT CONFIGURATION
// =================================================================
// Use environment variables for security, with fallback values for development
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key-here",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project-id.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project-id.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

let app: FirebaseApp;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Only initialize Firebase if the config is properly set
const isConfigValid = firebaseConfig.projectId !== "your-project-id" && 
                     firebaseConfig.apiKey !== "your-api-key-here" &&
                     !firebaseConfig.apiKey.includes('XXX');

if (isConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Enhanced error handling for Firestore connection issues
    if (db) {
      // Disable network initially to prevent connection errors during initialization
      disableNetwork(db).then(() => {
        console.log("Firestore network disabled during initialization");
        // Re-enable network after a brief delay
        setTimeout(() => {
          enableNetwork(db!).then(() => {
            console.log("Firestore network re-enabled");
          }).catch((error) => {
            console.warn("Failed to re-enable Firestore network:", error);
          });
        }, 1000);
      }).catch((error) => {
        console.warn("Failed to disable Firestore network:", error);
      });
    }
    
    console.log("Firebase initialized successfully");
  } catch (e) {
    console.error("Firebase initialization failed:", e);
    console.error("Please check your Firebase configuration in .env.local");
    // auth and db will remain null
  }
} else {
  console.warn(
    "⚠️  Firebase configuration is missing or incomplete. " +
    "Firebase features (Auth, Firestore) are disabled. " +
    "To enable Firebase:\n" +
    "1. Create a Firebase project at https://console.firebase.google.com/\n" +
    "2. Enable Authentication with Google provider\n" +
    "3. Copy your project config to .env.local file\n" +
    "4. Restart the development server"
  );
}

// Helper function to check Firebase connectivity
export const checkFirebaseConnection = async (): Promise<boolean> => {
  if (!db) return false;
  
  try {
    // Try to enable network if it's disabled
    await enableNetwork(db);
    return true;
  } catch (error) {
    console.warn("Firebase connection check failed:", error);
    return false;
  }
};

// Helper function to safely disable Firebase network
export const safeDisableNetwork = async (): Promise<void> => {
  if (!db) return;
  
  try {
    await disableNetwork(db);
    console.log("Firebase network safely disabled");
  } catch (error) {
    console.warn("Failed to disable Firebase network:", error);
  }
};

// Helper function to safely enable Firebase network
export const safeEnableNetwork = async (): Promise<void> => {
  if (!db) return;
  
  try {
    await enableNetwork(db);
    console.log("Firebase network safely enabled");
  } catch (error) {
    console.warn("Failed to enable Firebase network:", error);
  }
};

// Export Firebase services
export { auth, db };
