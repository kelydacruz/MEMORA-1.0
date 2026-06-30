import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '../firebase';

export type Memoria = {
  id?: string;
  uid: string;
  titulo: string;
  lugar: string;
  relato: string;
  data: string;
  estrelas: number;
  imagem: string;
  createdAt?: string;
};

export type NovaMemoria = {
  titulo: string;
  lugar: string;
  relato: string;
  data: string;
  estrelas: number;
  imagem: string;
};

export async function criarMemoriaFirestore(
  uid: string,
  memoria: NovaMemoria
) {
  await addDoc(collection(db, 'memorias'), {
    uid,
    titulo: memoria.titulo,
    lugar: memoria.lugar,
    relato: memoria.relato,
    data: memoria.data,
    estrelas: memoria.estrelas,
    imagem: memoria.imagem,
    createdAt: new Date().toISOString(),
  });
}

export function escutarMemoriasDoUsuario(
  uid: string,
  callback: (memorias: Memoria[]) => void
) {
  const memoriasRef = collection(db, 'memorias');

  const q = query(memoriasRef, where('uid', '==', uid));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const lista: Memoria[] = [];

    snapshot.forEach((documento) => {
      lista.push({
        id: documento.id,
        ...(documento.data() as Omit<Memoria, 'id'>),
      });
    });

    lista.sort((a, b) => {
      const dataA = a.createdAt || '';
      const dataB = b.createdAt || '';

      return dataB.localeCompare(dataA);
    });

    callback(lista);
  });

  return unsubscribe;
}

export async function editarMemoriaFirestore(
  id: string,
  memoria: Partial<NovaMemoria>
) {
  const memoriaRef = doc(db, 'memorias', id);

  await updateDoc(memoriaRef, {
    ...memoria,
  });
}

export async function excluirMemoriaFirestore(id: string) {
  await deleteDoc(doc(db, 'memorias', id));
}