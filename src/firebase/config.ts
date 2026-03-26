import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBH899bsSaotNB5avxO3391nQU4RZdwaZM",
  authDomain: "aqwaal-ab61f.firebaseapp.com",
  projectId: "aqwaal-ab61f",
  storageBucket: "aqwaal-ab61f.firebasestorage.app",
  messagingSenderId: "566384437561",
  appId: "1:566384437561:web:29bf6a2ba2b9f36f6160e8"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
