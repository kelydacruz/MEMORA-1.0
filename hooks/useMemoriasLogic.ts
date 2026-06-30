import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';

import { auth } from '../firebase';

import {
  criarMemoriaFirestore,
  editarMemoriaFirestore,
  excluirMemoriaFirestore,
  escutarMemoriasDoUsuario,
  Memoria,
  NovaMemoria,
} from '../services/memoriaService';

import { enviarImagemImgBB } from '../services/imgbbService';

export type { Memoria, NovaMemoria };

export function useMemoriasLogic() {
  const [user, setUser] = useState<User | null>(null);
  const [memorias, setMemorias] = useState<Memoria[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (usuario) => {
      setUser(usuario);

      if (!usuario) {
        setMemorias([]);
      }
    });

    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const unsubscribeMemorias = escutarMemoriasDoUsuario(
      user.uid,
      (listaMemorias) => {
        setMemorias(listaMemorias);
      }
    );

    return unsubscribeMemorias;
  }, [user]);

  async function criarMemoria(memoria: NovaMemoria) {
    if (!user) {
      Alert.alert('Erro', 'Usuário não está logado.');
      return false;
    }

    if (
      !memoria.titulo ||
      !memoria.lugar ||
      !memoria.relato ||
      !memoria.data ||
      !memoria.imagem
    ) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return false;
    }

    if (memoria.estrelas < 1 || memoria.estrelas > 5) {
      Alert.alert('Atenção', 'Escolha uma avaliação de 1 a 5 estrelas.');
      return false;
    }

    try {
      setLoading(true);

      await criarMemoriaFirestore(user.uid, memoria);

      Alert.alert('Sucesso', 'Memória cadastrada com sucesso!');
      return true;
    } catch (error) {
      console.log('Erro ao criar memória:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar a memória.');
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function editarMemoria(id: string, memoria: Partial<NovaMemoria>) {
    if (!id) {
      Alert.alert('Erro', 'Memória não encontrada.');
      return false;
    }

    if (
      memoria.estrelas !== undefined &&
      (memoria.estrelas < 1 || memoria.estrelas > 5)
    ) {
      Alert.alert('Atenção', 'Escolha uma avaliação de 1 a 5 estrelas.');
      return false;
    }

    try {
      setLoading(true);

      await editarMemoriaFirestore(id, memoria);

      Alert.alert('Sucesso', 'Memória atualizada com sucesso!');
      return true;
    } catch (error) {
      console.log('Erro ao editar memória:', error);
      Alert.alert('Erro', 'Não foi possível editar a memória.');
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function excluirMemoria(id: string) {
    if (!id) {
      Alert.alert('Erro', 'Memória não encontrada.');
      return false;
    }

    try {
      setLoading(true);

      await excluirMemoriaFirestore(id);

      Alert.alert('Sucesso', 'Memória excluída com sucesso!');
      return true;
    } catch (error) {
      console.log('Erro ao excluir memória:', error);
      Alert.alert('Erro', 'Não foi possível excluir a memória.');
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function uploadImagemImgBB(origem: 'camera' | 'galeria') {
    try {
      setLoading(true);

      const url = await enviarImagemImgBB(origem);

      if (!url) {
        return null;
      }

      return url;
    } catch (error) {
      console.log('Erro ao enviar imagem:', error);
      Alert.alert('Erro', 'Não foi possível enviar a imagem para o ImgBB.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    user,
    memorias,
    loading,
    criarMemoria,
    editarMemoria,
    excluirMemoria,
    uploadImagemImgBB,
  };
}