import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Sobre'>;

export default function Sobre({ navigation }: Props) {
  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      alert('Não foi possível abrir o link');
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Memora 🌿</Text>
        <Text style={styles.version}>Versão 1.0.0</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre o App</Text>

        <Text style={styles.description}>
          <Text style={{ fontWeight: 'bold' }}>Memora</Text> é um aplicativo de diário digital para armazenar e compartilhar suas memórias de viagem. Capture os momentos mais especiais das suas aventuras pelo mundo!
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Funcionalidades</Text>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>📸</Text>
          <Text style={styles.featureText}>
            <Text style={{ fontWeight: 'bold' }}>Galeria de Fotos:</Text> Adicione imagens das suas viagens
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>📝</Text>
          <Text style={styles.featureText}>
            <Text style={{ fontWeight: 'bold' }}>Histórias:</Text> Escreva relatos detalhados sobre cada viagem
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>⭐</Text>
          <Text style={styles.featureText}>
            <Text style={{ fontWeight: 'bold' }}>Avaliações:</Text> Classifique seus destinos de 1 a 5 estrelas
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🔒</Text>
          <Text style={styles.featureText}>
            <Text style={{ fontWeight: 'bold' }}>Segurança:</Text> Suas memórias são seguras na nuvem
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🔍</Text>
          <Text style={styles.featureText}>
            <Text style={{ fontWeight: 'bold' }}>Busca:</Text> Encontre rapidamente suas memórias favoritas
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✨ Criado Com</Text>

        <View style={styles.techItem}>
          <Text style={styles.techName}>React Native</Text>
          <Text style={styles.techDesc}>Framework para desenvolvimento mobile</Text>
        </View>

        <View style={styles.techItem}>
          <Text style={styles.techName}>Expo</Text>
          <Text style={styles.techDesc}>Plataforma de desenvolvimento</Text>
        </View>

        <View style={styles.techItem}>
          <Text style={styles.techName}>Firebase</Text>
          <Text style={styles.techDesc}>Autenticação e banco de dados</Text>
        </View>

        <View style={styles.techItem}>
          <Text style={styles.techName}>ImgBB</Text>
          <Text style={styles.techDesc}>Hospedagem de imagens</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📞 Contato</Text>

        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => handleOpenLink('mailto:suporte@memora.com')}
        >
          <Text style={styles.contactIcon}>✉️</Text>
          <View style={styles.contactContent}>
            <Text style={styles.contactLabel}>E-mail</Text>
            <Text style={styles.contactValue}>suporte@memora.com</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => handleOpenLink('https://www.instagram.com')}
        >
          <Text style={styles.contactIcon}>📱</Text>
          <View style={styles.contactContent}>
            <Text style={styles.contactLabel}>Instagram</Text>
            <Text style={styles.contactValue}>@memora_app</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Feito com ❤️ para viajantes
        </Text>
        <Text style={styles.footerSubtext}>
          © 2026 Memora. Todos os direitos reservados.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F1E8',
  },
  header: {
    alignItems: 'center',
    margin: 18,
    paddingVertical: 30,
    paddingHorizontal: 18,
    backgroundColor: '#5F7F5C',
    borderRadius: 28,
    shadowColor: '#5F7F5C',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  logo: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 5,
    letterSpacing: -0.5,
  },
  version: {
    fontSize: 12,
    color: '#EAF1E5',
    fontWeight: '700',
  },
  section: {
    marginHorizontal: 18,
    marginBottom: 14,
    padding: 16,
    backgroundColor: '#FFFDF8',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E5D9CA',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2F2F2F',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#5F5A54',
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#F7F1E8',
    padding: 12,
    borderRadius: 14,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 13,
    color: '#5F5A54',
    lineHeight: 20,
  },
  techItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F7F1E8',
    borderRadius: 14,
    marginBottom: 10,
  },
  techName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#5F7F5C',
  },
  techDesc: {
    fontSize: 12,
    color: '#756E66',
    marginTop: 3,
  },
  contactButton: {
    backgroundColor: '#F7F1E8',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: '#756E66',
    fontWeight: '700',
  },
  contactValue: {
    fontSize: 14,
    color: '#5F7F5C',
    fontWeight: '800',
    marginTop: 2,
  },
  legalItem: {
    backgroundColor: '#F7F1E8',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legalText: {
    fontSize: 14,
    color: '#2F2F2F',
    fontWeight: '700',
  },
  legalArrow: {
    fontSize: 18,
    color: '#5F7F5C',
    fontWeight: '800',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 26,
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#5F7F5C',
    fontWeight: '800',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#8C8378',
  },
});
