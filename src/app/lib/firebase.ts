import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

/**
 * Bootstrap mínimo do Firebase: só `app` e `db` (Firestore) — usados pela loja
 * (catálogo público) e por services/*.ts. `auth`/`storage` são inicializados
 * dentro de services/auth.ts e services/storage.ts, que só o painel /admin
 * importa — assim o code-splitting do AdminRoutes (App.tsx) mantém firebase/auth
 * e firebase/storage fora do bundle da loja.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

export const app: FirebaseApp | undefined = isFirebaseConfigured
  ? initializeApp(firebaseConfig as Required<typeof firebaseConfig>)
  : undefined;

export const db: Firestore | undefined = app ? getFirestore(app) : undefined;
