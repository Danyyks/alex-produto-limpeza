import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface CategoryDoc {
  id: string;
  label: string;
  icon: string;
  order: number;
}

const COLLECTION = 'categories';

function requireDb() {
  if (!db) throw new Error('Firebase não está configurado neste ambiente.');
  return db;
}

export async function getCategories(): Promise<CategoryDoc[]> {
  const snap = await getDocs(collection(requireDb(), COLLECTION));
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<CategoryDoc, 'id'>) }))
    .sort((a, b) => a.order - b.order);
}

export async function createCategory(data: { label: string; icon: string; order: number }) {
  const ref = await addDoc(collection(requireDb(), COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateCategory(
  id: string,
  data: Partial<{ label: string; icon: string; order: number }>,
) {
  await updateDoc(doc(requireDb(), COLLECTION, id), { ...data, updatedAt: serverTimestamp() });
}

export async function reorderCategories(orderedIds: string[]) {
  const database = requireDb();
  const batch = writeBatch(database);
  orderedIds.forEach((id, index) => {
    batch.update(doc(database, COLLECTION, id), { order: index, updatedAt: serverTimestamp() });
  });
  await batch.commit();
}

export async function deleteCategory(id: string) {
  const database = requireDb();
  const inUse = await getDocs(
    query(collection(database, 'products'), where('categoryId', '==', id), limit(1)),
  );
  if (!inUse.empty) {
    throw new Error(
      'Não é possível excluir: existem produtos nesta categoria. Mova ou exclua os produtos primeiro.',
    );
  }
  await deleteDoc(doc(database, COLLECTION, id));
}
