import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA0DyuGrlysl1lmyFXEwIwxtFBCkyR1Vh8",
  authDomain: "fitcheck-51994.firebaseapp.com",
  projectId: "fitcheck-51994",
  storageBucket: "fitcheck-51994.firebasestorage.app",
  messagingSenderId: "526863784303",
  appId: "1:526863784303:web:2e51892233eccfcfa5309a",
  measurementId: "G-ZPPT385B3N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally (safeguard for non-browser environments)
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
