import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDy1hlfu2GR-lwLQPfIEAt9qiWTF3GHX24",
  authDomain: "booking-app-b2ab1.firebaseapp.com",
  projectId: "booking-app-b2ab1",
  storageBucket: "booking-app-b2ab1.firebasestorage.app",
  messagingSenderId: "257832145790",
  appId: "1:257832145790:web:eb416ac50d0ae464b5592f",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
