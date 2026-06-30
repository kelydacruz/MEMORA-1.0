import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../App';
import { useLoginLogic } from '../hooks/useLoginLogic';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function Login({ navigation }: Props) {
  const { login, loading } = useLoginLogic();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function handleLogin() {
    const user = await login(email, senha);

    if (user) {
      navigation.replace('Home');
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.logo}>Memora 🌿</Text>

        <Text style={styles.subtitle}>
          Suas histórias,{'\n'}suas memórias.{'\n'}Para sempre.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#8A8A8A"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#8A8A8A"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={() => Alert.alert('Aviso', 'Função não implementada.')}
        >
          <Text style={styles.forgot}>Esqueci minha senha</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.secondaryButtonText}>Criar conta</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Diário digital de viagens</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F1E8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 430,
    backgroundColor: '#FFFDF8',
    borderRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#E5D9CA',
    shadowColor: '#2F2F2F',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },
  logo: {
    fontSize: 44,
    color: '#5F7F5C',
    textAlign: 'center',
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: -1,
  },
  subtitle: {
    textAlign: 'center',
    color: '#5F5A54',
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 28,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4D8C8',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 12,
    color: '#2F2F2F',
  },
  forgot: {
    color: '#5F7F5C',
    textAlign: 'right',
    marginTop: 2,
    marginBottom: 18,
    fontSize: 13,
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: '#5F7F5C',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#5F7F5C',
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C9B89F',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#5F7F5C',
    fontSize: 15,
    fontWeight: '800',
  },
  footer: {
    marginTop: 22,
    color: '#8C8378',
    fontSize: 13,
    textAlign: 'center',
  },
});
