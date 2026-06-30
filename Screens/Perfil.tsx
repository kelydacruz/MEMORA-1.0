import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { StackActions } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../App';
import { useLoginLogic } from '../hooks/useLoginLogic';
import { useMemoriasLogic } from '../hooks/useMemoriasLogic';

type Props = NativeStackScreenProps<RootStackParamList, 'Perfil'>;

export default function Perfil({ navigation }: Props) {
  const { logout } = useLoginLogic();
  const { user } = useMemoriasLogic();

  async function handleLogout() {
    await logout();
    const rootNavigation = navigation.getParent();

    if (rootNavigation) {
      rootNavigation.dispatch(StackActions.replace('Login'));
      return;
    }

    navigation.replace('Login');
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarEmoji}>👤</Text>
        </View>

        <Text style={styles.nameText}>{user?.displayName || 'Viajante'}</Text>
        <Text style={styles.emailText}>{user?.email || 'email@exemplo.com'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações da Conta</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>E-mail</Text>
          <Text style={styles.infoValue}>{user?.email || 'Não disponível'}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>ID do Usuário</Text>
          <Text style={styles.infoValue}>{user?.uid || 'Não disponível'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferências</Text>

        <TouchableOpacity style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>🔔 Notificações</Text>
          <Text style={styles.preferenceValue}>Ativadas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>🌙 Modo escuro</Text>
          <Text style={styles.preferenceValue}>Desativado</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>🌍 Idioma</Text>
          <Text style={styles.preferenceValue}>Português</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F1E8',
  },
  profileHeader: {
    alignItems: 'center',
    margin: 18,
    paddingVertical: 30,
    paddingHorizontal: 18,
    backgroundColor: '#FFFDF8',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E5D9CA',
    shadowColor: '#2F2F2F',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E8F1E3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D1DFC9',
  },
  avatarEmoji: {
    fontSize: 48,
  },
  nameText: {
    fontSize: 23,
    fontWeight: '800',
    color: '#2F2F2F',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  emailText: {
    fontSize: 14,
    color: '#756E66',
  },
  section: {
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2F2F2F',
    marginBottom: 12,
  },
  infoBox: {
    backgroundColor: '#FFFDF8',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5D9CA',
  },
  infoLabel: {
    fontSize: 12,
    color: '#8C8378',
    marginBottom: 4,
    fontWeight: '700',
  },
  infoValue: {
    fontSize: 14,
    color: '#2F2F2F',
    fontWeight: '700',
  },
  preferenceItem: {
    backgroundColor: '#FFFDF8',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5D9CA',
  },
  preferenceLabel: {
    fontSize: 15,
    color: '#2F2F2F',
    fontWeight: '700',
  },
  preferenceValue: {
    fontSize: 13,
    color: '#5F7F5C',
    fontWeight: '800',
  },
  logoutButton: {
    backgroundColor: '#A64B3C',
    paddingVertical: 15,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 18,
  },
  logoutButtonText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
