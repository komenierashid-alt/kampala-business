import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDk_f-5RiKXYsxJyX9QtXquh-1gSN8QQcQ",
  authDomain: "kampala-business.firebaseapp.com",
  projectId: "kampala-business",
  storageBucket: "kampala-business.firebasestorage.app",
  messagingSenderId: "942834725537",
  appId: "1:942834725537:web:4c746311a7de0b267b6e0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
