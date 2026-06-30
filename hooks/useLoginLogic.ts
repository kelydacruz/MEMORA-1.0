import { useState } from 'react';
import { Alert } from 'react-native';

import {
  cadastrarUsuario,
  loginUsuario,
  logoutUsuario,
} from '../services/authService';

export function useLoginLogic() {
  const [loading, setLoading] = useState(false);

  async function login(email: string, senha: string) {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha o e-mail e a senha.');
      return null;
    }

    try {
      setLoading(true);

      const user = await loginUsuario(email, senha);

      return user;
    } catch (error) {
      Alert.alert('Erro', 'E-mail ou senha incorretos.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function cadastrar(nome: string, email: string, senha: string) {
    if (!nome || !email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return null;
    }

    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha precisa ter pelo menos 6 caracteres.');
      return null;
    }

    try {
      setLoading(true);

      const user = await cadastrarUsuario(nome, email, senha);

      return user;
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar o usuário.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      setLoading(true);

      await logoutUsuario();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    login,
    cadastrar,
    logout,
  };
}