
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = {
  apiKey: "AIzaSyC7UdHlJ7EsIjBF-PydqFI0R_-jfRDJdsc",
  authDomain: "pedido-app-c480a.firebaseapp.com",
  projectId: "pedido-app-c480a",
  storageBucket: "pedido-app-c480a.firebasestorage.app",
  messagingSenderId: "374591751717",
  appId: "1:374591751717:web:ec7db5d8f1d22e7577a1cc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const productos = JSON.parse(fs.readFileSync("productos.json", "utf-8"));

async function subir() {
  for (const p of productos) {
    await addDoc(collection(db, "productos"), p);
    console.log("✅ Subido:", p.nombre);
  }
  console.log("🎉 TODOS LOS PRODUCTOS SUBIDOS");
}

subir();
