import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';

import type { RootStackParamList } from '../App';
import { useMemoriasLogic } from '../hooks/useMemoriasLogic';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalheMemoria'>;

function dataLocalParaTexto(date: Date) {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

function textoParaDataLocal(dataTexto: string) {
  const partes = dataTexto.split('-').map(Number);

  if (partes.length !== 3) {
    return new Date();
  }

  const [ano, mes, dia] = partes;

  if (!ano || !mes || !dia) {
    return new Date();
  }

  return new Date(ano, mes - 1, dia);
}

export default function DetalheMemoria({ route, navigation }: Props) {
  const { memoriaId } = route.params;

  const { memorias, editarMemoria, excluirMemoria, uploadImagemImgBB, loading } =
    useMemoriasLogic();

  const memoria = memorias.find((m) => m.id === memoriaId);

  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [tituloEdit, setTituloEdit] = useState('');
  const [lugarEdit, setLugarEdit] = useState('');
  const [relatoEdit, setRelatoEdit] = useState('');
  const [dataEdit, setDataEdit] = useState('');
  const [estrelasEdit, setEstrelasEdit] = useState(1);
  const [imagemEdit, setImagemEdit] = useState('');
  const [mostrarData, setMostrarData] = useState(false);

  function formatarData(data: string) {
    if (!data) return '';

    const partes = data.split('-');

    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return data;
  }

  function renderEstrelas(quantidade: number) {
    return '⭐'.repeat(quantidade);
  }

  function abrirModalEdicao() {
    if (!memoria) {
      Alert.alert('Erro', 'Memória não encontrada.');
      return;
    }

    setTituloEdit(memoria.titulo);
    setLugarEdit(memoria.lugar);
    setRelatoEdit(memoria.relato);
    setDataEdit(memoria.data);
    setEstrelasEdit(memoria.estrelas);
    setImagemEdit(memoria.imagem);
    setModalEditVisible(true);
  }

  function fecharModalEdicao() {
    setModalEditVisible(false);
    setMostrarData(false);
  }

  async function salvarEdicao() {
    if (!memoria || !memoria.id) {
      Alert.alert('Erro', 'Memória não encontrada.');
      return;
    }

    const sucesso = await editarMemoria(memoria.id, {
      titulo: tituloEdit,
      lugar: lugarEdit,
      relato: relatoEdit,
      data: dataEdit,
      estrelas: estrelasEdit,
      imagem: imagemEdit,
    });

    if (sucesso) {
      fecharModalEdicao();
    }
  }

  function confirmarExclusao() {
    if (!memoria || !memoria.id) return;

    const idMemoria = memoria.id;

    Alert.alert('Excluir memória', `Deseja excluir "${memoria.titulo}"?`, [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await excluirMemoria(idMemoria);
          navigation.goBack();
        },
      },
    ]);
  }

  function escolherImagemEdicao() {
    Alert.alert('Trocar imagem', 'De onde você quer pegar a foto?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Tirar foto',
        onPress: async () => {
          const url = await uploadImagemImgBB('camera');

          if (url) {
            setImagemEdit(url);
          }
        },
      },
      {
        text: 'Abrir galeria',
        onPress: async () => {
          const url = await uploadImagemImgBB('galeria');

          if (url) {
            setImagemEdit(url);
          }
        },
      },
    ]);
  }

  function selecionarData(_event: any, selectedDate?: Date) {
    setMostrarData(false);

    if (selectedDate) {
      const dataFormatada = dataLocalParaTexto(selectedDate);
      setDataEdit(dataFormatada);
    }
  }

  function getDataAtualEdit() {
    if (!dataEdit) {
      return new Date();
    }

    return textoParaDataLocal(dataEdit);
  }

  if (!memoria) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Memória não encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: memoria.imagem }} style={styles.imagem} />

        <View style={styles.content}>
          <Text style={styles.titulo}>{memoria.titulo}</Text>

          <Text style={styles.lugar}>📍 {memoria.lugar}</Text>

          <Text style={styles.data}>📅 {formatarData(memoria.data)}</Text>

          <Text style={styles.stars}>{renderEstrelas(memoria.estrelas)}</Text>

          <View style={styles.divider} />

          <Text style={styles.relato}>{memoria.relato}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={abrirModalEdicao}
            >
              <Text style={styles.editText}>✏️ Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={confirmarExclusao}
            >
              <Text style={styles.deleteText}>🗑️ Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal visible={modalEditVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHandle} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalContent}
            >
              <Text style={styles.modalTitle}>✏️ Editar Memória</Text>

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Informações principais</Text>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Título</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite o título"
                    placeholderTextColor="#CCCCCC"
                    value={tituloEdit}
                    onChangeText={setTituloEdit}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Lugar</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite o local da viagem"
                    placeholderTextColor="#CCCCCC"
                    value={lugarEdit}
                    onChangeText={setLugarEdit}
                  />
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Relato</Text>

                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Conte sua experiência nessa viagem..."
                  placeholderTextColor="#CCCCCC"
                  value={relatoEdit}
                  onChangeText={setRelatoEdit}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Data e Avaliação</Text>

                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setMostrarData(true)}
                >
                  <Text style={styles.dateIcon}>📅</Text>

                  <View style={styles.dateContent}>
                    <Text style={styles.dateLabel}>Data da viagem</Text>
                    <Text style={styles.dateValue}>
                      {dataEdit
                        ? formatarData(dataEdit)
                        : 'Toque para selecionar'}
                    </Text>
                  </View>
                </TouchableOpacity>

                {mostrarData && (
                  <DateTimePicker
                    value={getDataAtualEdit()}
                    mode="date"
                    display="default"
                    onChange={selecionarData}
                  />
                )}

                <View style={styles.ratingSection}>
                  <Text style={styles.fieldLabel}>Avaliação</Text>

                  <View style={styles.starRow}>
                    {[1, 2, 3, 4, 5].map((estrela) => (
                      <TouchableOpacity
                        key={estrela}
                        onPress={() => setEstrelasEdit(estrela)}
                        style={styles.starButton}
                      >
                        <Text style={styles.starOption}>
                          {estrela <= estrelasEdit ? '⭐' : '☆'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Foto</Text>

                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={escolherImagemEdicao}
                >
                  <Text style={styles.imageIcon}>📸</Text>
                  <Text style={styles.imageButtonText}>Trocar foto</Text>
                </TouchableOpacity>

                {imagemEdit ? (
                  <Image source={{ uri: imagemEdit }} style={styles.preview} />
                ) : null}
              </View>

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={salvarEdicao}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveButtonText}>
                      ✓ Salvar alterações
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={fecharModalEdicao}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4EC',
  },
  imagem: {
    width: '100%',
    height: 280,
  },
  content: {
    padding: 18,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2F2F2F',
    marginBottom: 8,
  },
  lugar: {
    fontSize: 16,
    color: '#5F7F5C',
    marginBottom: 8,
  },
  data: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 8,
  },
  stars: {
    fontSize: 16,
    marginBottom: 16,
  },
  relato: {
    fontSize: 15,
    color: '#2F2F2F',
    lineHeight: 22,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#5F7F5C',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  editText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#F7E1DD',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteText: {
    color: '#A34436',
    fontWeight: 'bold',
    fontSize: 15,
  },
  errorText: {
    fontSize: 16,
    color: '#A34436',
    textAlign: 'center',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D4CCC0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2F2F2F',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5F7F5C',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2F2F2F',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F5F2ED',
    borderWidth: 1.5,
    borderColor: '#E8DFD3',
    borderRadius: 12,
    padding: 13,
    fontSize: 15,
    color: '#2F2F2F',
    fontWeight: '500',
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8DFD3',
    marginVertical: 18,
  },
  dateButton: {
    backgroundColor: '#F5F2ED',
    borderWidth: 1.5,
    borderColor: '#E8DFD3',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  dateContent: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2F2F2F',
  },
  ratingSection: {
    marginTop: 14,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  starButton: {
    padding: 6,
  },
  starOption: {
    fontSize: 32,
  },
  imageButton: {
    backgroundColor: '#5F7F5C',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  imageIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  imageButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  preview: {
    width: '100%',
    height: 160,
    borderRadius: 14,
    marginBottom: 12,
    marginTop: 8,
  },
  buttonGroup: {
    marginTop: 20,
    gap: 10,
  },
  saveButton: {
    backgroundColor: '#5F7F5C',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#F5F2ED',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8DFD3',
  },
  cancelButtonText: {
    color: '#666666',
    fontWeight: '600',
    fontSize: 15,
  },
});