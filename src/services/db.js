import { db } from "./firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

export async function getProductos() {
  const snap = await getDocs(collection(db, "productos"));
  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// 👇 guardar lista
export async function guardarLista(lista) {
  await addDoc(collection(db, "listas"), lista);
}

export async function guardarProducto(producto) {
  await addDoc(collection(db, "productos"), producto);
}

export async function getListas() {
  const snap = await getDocs(collection(db, "listas"));
  return snap.docs.map(doc => doc.data());
}
