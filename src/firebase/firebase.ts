import { initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const hasRequiredConfig = Object.values(firebaseConfig).every(Boolean);

export const isFirebaseConfigured = hasRequiredConfig;

let auth: Auth | null = null;
let firestore: Firestore | null = null;

if (hasRequiredConfig) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app);

  void enableIndexedDbPersistence(firestore).catch((error) => {
    console.warn("No se pudo activar la persistencia de Firestore", error);
  });
} else {
  console.warn("Firebase no configurado: la app funcionará solo en modo local");
}

export { auth, firestore };
