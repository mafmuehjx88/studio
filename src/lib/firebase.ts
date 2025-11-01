import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyA93FWGsO63Q8xGprgue4rhJ0Xkqu0vN2A",
  authDomain: "marioapp-a39c5.firebaseapp.com",
  projectId: "marioapp-a39c5",
  storageBucket: "marioapp-a39c5.appspot.com",
  messagingSenderId: "861023932769",
  appId: "1:861023932769:web:28052061e0a9fdc106f520",
  measurementId: "G-TH3MXQ0HDM"
};

// The `useFetchStreams` is a temporary flag to deal with a known issue in the Firestore SDK.
const app = !getApps().length ? initializeApp(firebaseConfig, { useFetchStreams: false }) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
