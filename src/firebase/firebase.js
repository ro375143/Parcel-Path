import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-INEqPfAs34zeDcuME3LTKreBMAF5rpM",
  authDomain: "parcel-path-ce430.firebaseapp.com",
  projectId: "parcel-path-ce430",
  storageBucket: "parcel-path-ce430.appspot.com",
  messagingSenderId: "411942267288",
  appId: "1:411942267288:web:70a4129c535f22930de3ed"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
export { db, auth };
