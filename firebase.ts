import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
} from '@env';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket:
    FIREBASE_STORAGE_BUCKET || `${FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

// Verifica se as variáveis essenciais estão definidas e exibe aviso útil em runtime
if (!FIREBASE_API_KEY || !FIREBASE_PROJECT_ID || !FIREBASE_APP_ID) {
  console.error('[Firebase] Variáveis de ambiente faltando:', {
    apiKey: !!FIREBASE_API_KEY,
    projectId: !!FIREBASE_PROJECT_ID,
    appId: !!FIREBASE_APP_ID,
    storageBucket: !!FIREBASE_STORAGE_BUCKET,
  });
}

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('[Firebase] Falha ao inicializar o app Firebase:', error);
  // Re-throw para que o erro seja visível durante desenvolvimento
  throw error;
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };