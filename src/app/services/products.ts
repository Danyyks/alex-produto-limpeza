import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ProductDoc {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  imagePath: string | null;
  active: boolean;
  /** Opções de perfume/variante (ex: "Lavanda", "Flores Brancas") — produtos
   * antigos podem não ter esse campo salvo no Firestore ainda. */
  fragrances?: string[];
}

const COLLECTION = 'products';

function requireDb() {
  if (!db) throw new Error('Firebase não está configurado neste ambiente.');
  return db;
}

export async function getProducts(): Promise<ProductDoc[]> {
  const snap = await getDocs(collection(requireDb(), COLLECTION));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ProductDoc, 'id'>) }));
}

/** Gera um ID de documento antecipadamente — usado pelo ProductForm pra subir a
 * imagem pro Storage num caminho estável antes de criar o doc do produto. */
export function newProductId(): string {
  return doc(collection(requireDb(), COLLECTION)).id;
}

export async function createProduct(id: string, data: Omit<ProductDoc, 'id'>) {
  await setDoc(doc(requireDb(), COLLECTION, id), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProduct(id: string, data: Partial<Omit<ProductDoc, 'id'>>) {
  await updateDoc(doc(requireDb(), COLLECTION, id), { ...data, updatedAt: serverTimestamp() });
}

export async function setProductActive(id: string, active: boolean) {
  await updateProduct(id, { active });
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(requireDb(), COLLECTION, id));
}
