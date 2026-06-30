import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

import { auth } from '../firebase';

export async function cadastrarUsuario(
  nome: string,
  email: string,
  senha: string
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      senha
    );

    await updateProfile(userCredential.user, {
      displayName: nome,
    });

    return userCredential.user;
  } catch (error) {
    console.error('[authService] Erro ao cadastrar usuário:', error);
    throw error;
  }
}

export async function loginUsuario(email: string, senha: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    return userCredential.user;
  } catch (error) {
    console.error('[authService] Erro ao logar usuário:', error);
    throw error;
  }
}

export async function logoutUsuario() {
  await signOut(auth);
}