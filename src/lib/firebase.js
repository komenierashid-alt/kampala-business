import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "TEMP",
  authDomain: "kampala-business.firebaseapp.com",
  projectId: "kampala-business",
  storageBucket: "kampala-business.appspot.com",
  messagingSenderId: "REPLACE",
  appId: "REPLACE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function getProducts() {
  const snap = await getDocs(collection(db, "products"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
