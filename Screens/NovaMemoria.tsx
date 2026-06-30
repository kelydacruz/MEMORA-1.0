import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';

import type { RootStackParamList } from '../App';
import { useMemoriasLogic } from '../hooks/useMemoriasLogic';

type Props = NativeStackScreenProps<RootStackParamList, 'NovaMemoria'>;

function dataLocalParaTexto(date: Date) {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

function textoParaDataLocal(dataTexto: string) {
  const [ano, mes, dia] = dataTexto.split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

export default function NovaMemoria({ navigation }: Props) {
  const { criarMemoria, uploadImagemImgBB, loading } = useMemoriasLogic();

  const [titulo, setTitulo] = useState('');
  const [lugar, setLugar] = useState('');
  const [relato, setRelato] = useState('');
  const [data, setData] = useState(dataLocalParaTexto(new Date()));
  const [estrelas, setEstrelas] = useState(5);
  const [imagem, setImagem] = useState('');
  const [mostrarData, setMostrarData] = useState(false);

  function formatarData(data: string) {
    if (!data) return '';

    const partes = data.split('-');

    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return data;
  }

  function selecionarData(_event: any, selectedDate?: Date) {
    setMostrarData(false);

    if (selectedDate) {
      const dataFormatada = dataLocalParaTexto(selectedDate);
      setData(dataFormatada);
    }
  }

  function escolherImagem() {
    Alert.alert('Adicionar foto', 'De onde você quer pegar a foto?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Tirar foto',
        onPress: async () => {
          const url = await uploadImagemImgBB('camera');
          if (url) {
            setImagem(url);
          }
        },
      },
      {
        text: 'Abrir galeria',
        onPress: async () => {
          const url = await uploadImagemImgBB('galeria');
          if (url) {
            setImagem(url);
          }
        },
      },
    ]);
  }

  async function handleSalvarMemoria() {
    if (!titulo.trim() || !lugar.trim() || !relato.trim() || !imagem) {
      Alert.alert('Atenção', 'Preencha todos os campos e adicione uma foto.');
      return;
    }

    const sucesso = await criarMemoria({
      titulo: titulo.trim(),
      lugar: lugar.trim(),
      relato: relato.trim(),
      data,
      estrelas,
      imagem,
    });

    if (sucesso) {
      setTitulo('');
      setLugar('');
      setRelato('');
      setData(dataLocalParaTexto(new Date()));
      setEstrelas(5);
      setImagem('');

      navigation.navigate('Home');
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Registrar Nova Memória</Text>

        {imagem ? (
          <Image source={{ uri: imagem }} style={styles.preview} />
        ) : (
          <TouchableOpacity
            style={styles.imagePlaceholder}
            onPress={escolherImagem}
          >
            <Text style={styles.imagePlaceholderText}>📸</Text>
            <Text style={styles.imagePlaceholderLabel}>
              Toque para adicionar foto
            </Text>
          </TouchableOpacity>
        )}

        {imagem && (
          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={escolherImagem}
          >
            <Text style={styles.changePhotoText}>Trocar foto</Text>
          </TouchableOpacity>
        )}

        <TextInput
          style={styles.input}
          placeholder="Título da memória"
          placeholderTextColor="#8A8A8A"
          value={titulo}
          onChangeText={setTitulo}
        />

        <TextInput
          style={styles.input}
          placeholder="Lugar"
          placeholderTextColor="#8A8A8A"
          value={lugar}
          onChangeText={setLugar}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Relato da memória"
          placeholderTextColor="#8A8A8A"
          value={relato}
          onChangeText={setRelato}
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setMostrarData(true)}
        >
          <Text style={styles.dateText}>📅 Data: {formatarData(data)}</Text>
        </TouchableOpacity>

        {mostrarData && (
          <DateTimePicker
            value={textoParaDataLocal(data)}
            mode="date"
            display="default"
            onChange={selecionarData}
          />
        )}

        <Text style={styles.label}>Avaliação</Text>

        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((estrela) => (
            <TouchableOpacity
              key={estrela}
              onPress={() => setEstrelas(estrela)}
            >
              <Text style={styles.starOption}>
                {estrela <= estrelas ? '⭐' : '☆'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSalvarMemoria}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar memória</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F1E8',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 24,
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#2F2F2F',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  imagePlaceholder: {
    width: '100%',
    height: 220,
    backgroundColor: '#FFFDF8',
    borderRadius: 24,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CDBFAE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  imagePlaceholderText: {
    fontSize: 58,
    marginBottom: 8,
  },
  imagePlaceholderLabel: {
    color: '#756E66',
    fontSize: 14,
    fontWeight: '700',
  },
  preview: {
    width: '100%',
    height: 220,
    borderRadius: 24,
    marginBottom: 12,
  },
  changePhotoButton: {
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E5D9CA',
    borderRadius: 16,
    padding: 13,
    alignItems: 'center',
    marginBottom: 16,
  },
  changePhotoText: {
    color: '#5F7F5C',
    fontWeight: '800',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5D9CA',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 12,
    color: '#2F2F2F',
  },
  textArea: {
    height: 124,
    textAlignVertical: 'top',
  },
  dateButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5D9CA',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  dateText: {
    color: '#2F2F2F',
    fontSize: 15,
    fontWeight: '700',
  },
  label: {
    color: '#2F2F2F',
    fontWeight: '800',
    marginBottom: 10,
    fontSize: 14,
  },
  starRow: {
    flexDirection: 'row',
    marginBottom: 22,
  },
  starOption: {
    fontSize: 36,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#5F7F5C',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
    shadowColor: '#5F7F5C',
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E5D9CA',
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelButtonText: {
    color: '#756E66',
    fontWeight: '800',
    fontSize: 15,
  },
});