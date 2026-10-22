import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";

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

export async function addProduct(name, price, qty) {
  await addDoc(collection(db, "products"), {
    name, price: Number(price), qty: Number(qty),
    createdAt: serverTimestamp()
  });
}
