import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHJkkNQePKN9-S6mXygj-3TZoNM4pyTlc",
  authDomain: "kopigepos.firebaseapp.com",
  projectId: "kopigepos",
  storageBucket: "kopigepos.firebasestorage.app",
  messagingSenderId: "860707524554",
  appId: "1:860707524554:web:9f3988c4bb7c1df0854933",
  measurementId: "G-6N0FTRX2X8",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
