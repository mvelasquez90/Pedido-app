
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7UdHlJ7EsIjBF-PydqFI0R_-jfRDJdsc",
  authDomain: "pedido-app-c480a.firebaseapp.com",
  projectId: "pedido-app-c480a",
  storageBucket: "pedido-app-c480a.firebasestorage.app",
  messagingSenderId: "374591751717",
  appId: "1:374591751717:web:ec7db5d8f1d22e7577a1cc"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
