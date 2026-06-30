import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { StackActions } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';

import type { RootStackParamList } from '../App';
import { useLoginLogic } from '../hooks/useLoginLogic';
import { Memoria, useMemoriasLogic } from '../hooks/useMemoriasLogic';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

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

export default function Home({ navigation }: Props) {
  const { logout } = useLoginLogic();

  const {
    user,
    memorias,
    loading,
    editarMemoria,
    excluirMemoria,
    uploadImagemImgBB,
  } = useMemoriasLogic();

  const [busca, setBusca] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [memoriaSelecionada, setMemoriaSelecionada] = useState<Memoria | null>(
    null
  );

  const [tituloEdit, setTituloEdit] = useState('');
  const [lugarEdit, setLugarEdit] = useState('');
  const [relatoEdit, setRelatoEdit] = useState('');
  const [dataEdit, setDataEdit] = useState('');
  const [estrelasEdit, setEstrelasEdit] = useState(1);
  const [imagemEdit, setImagemEdit] = useState('');

  const [mostrarData, setMostrarData] = useState(false);

  const memoriasFiltradas = useMemo(() => {
    return memorias.filter((memoria) => {
      const texto = `${memoria.titulo} ${memoria.lugar}`.toLowerCase();
      return texto.includes(busca.toLowerCase());
    });
  }, [busca, memorias]);

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

  async function handleLogout() {
    await logout();

    const rootNavigation = navigation.getParent()?.getParent();

    if (rootNavigation) {
      rootNavigation.dispatch(StackActions.replace('Login'));
      return;
    }

    navigation.replace('Login');
  }

  function abrirModal(memoria: Memoria) {
    setMemoriaSelecionada(memoria);
    setTituloEdit(memoria.titulo);
    setLugarEdit(memoria.lugar);
    setRelatoEdit(memoria.relato);
    setDataEdit(memoria.data);
    setEstrelasEdit(memoria.estrelas);
    setImagemEdit(memoria.imagem);
    setModalVisible(true);
  }

  function fecharModal() {
    setModalVisible(false);
    setMemoriaSelecionada(null);
    setMostrarData(false);
  }

  async function salvarEdicao() {
    if (!memoriaSelecionada?.id) {
      Alert.alert('Erro', 'Memória não encontrada.');
      return;
    }

    const sucesso = await editarMemoria(memoriaSelecionada.id, {
      titulo: tituloEdit,
      lugar: lugarEdit,
      relato: relatoEdit,
      data: dataEdit,
      estrelas: estrelasEdit,
      imagem: imagemEdit,
    });

    if (sucesso) {
      fecharModal();
    }
  }

  function confirmarExclusao(memoria: Memoria) {
    if (!memoria.id) return;

    Alert.alert('Excluir memória', `Deseja excluir "${memoria.titulo}"?`, [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => excluirMemoria(memoria.id!),
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Olá, {user?.displayName || 'viajante'}! 🌿
          </Text>
          <Text style={styles.subtitle}>Que bom te ver por aqui!</Text>
        </View>

        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.newButton}
            onPress={() => navigation.navigate('NovaMemoria')}
          >
            <Text style={styles.newButtonText}>+ Nova</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔎</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar memórias..."
          placeholderTextColor="#8A8A8A"
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <View style={styles.rowTitle}>
        <Text style={styles.sectionTitle}>Memórias recentes</Text>
      </View>

      <FlatList
        data={memoriasFiltradas}
        keyExtractor={(item) => item.id || item.titulo}
        numColumns={2}
        columnWrapperStyle={styles.column}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Nenhuma memória cadastrada.</Text>
            <Text style={styles.emptySubtext}>
              Toque em “Nova” para registrar sua primeira viagem.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate('DetalheMemoria', { memoriaId: item.id! })
            }
          >
            <Image source={{ uri: item.imagem }} style={styles.cardImage} />

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.titulo}
              </Text>

              <Text style={styles.cardLugar} numberOfLines={1}>
                📍 {item.lugar}
              </Text>

              <Text style={styles.cardData}>📅 {formatarData(item.data)}</Text>

              <Text style={styles.stars}>{renderEstrelas(item.estrelas)}</Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => abrirModal(item)}
                >
                  <Text style={styles.actionText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => confirmarExclusao(item)}
                >
                  <Text style={styles.deleteText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} animationType="fade" transparent>
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
                  <Text style={styles.saveButtonText}>
                    {loading ? '⏳ Salvando...' : '✓ Salvar alterações'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={fecharModal}
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
    backgroundColor: '#F7F1E8',
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  header: {
    backgroundColor: '#FFFDF8',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5D9CA',
    shadowColor: '#2F2F2F',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    gap: 14,
  },
  greeting: {
    fontSize: 23,
    color: '#2F2F2F',
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    color: '#756E66',
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  newButton: {
    flex: 1,
    backgroundColor: '#5F7F5C',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#5F7F5C',
    shadowOpacity: 0.2,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  newButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: '#F2E8DC',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1D2C0',
  },
  logoutText: {
    color: '#5F7F5C',
    fontWeight: '800',
    fontSize: 14,
  },
  searchBox: {
    marginTop: 18,
    backgroundColor: '#FFFDF8',
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5D9CA',
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    color: '#2F2F2F',
    fontSize: 15,
  },
  rowTitle: {
    marginTop: 22,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2F2F2F',
    letterSpacing: -0.3,
  },
  listContent: {
    paddingBottom: 24,
  },
  column: {
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFDF8',
    borderRadius: 22,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5D9CA',
    shadowColor: '#2F2F2F',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 118,
    backgroundColor: '#EFE7DD',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2F2F2F',
    marginBottom: 5,
    lineHeight: 18,
  },
  cardLugar: {
    color: '#756E66',
    fontSize: 12,
  },
  cardData: {
    color: '#756E66',
    fontSize: 12,
    marginTop: 4,
  },
  stars: {
    marginTop: 6,
    fontSize: 12,
  },
  actions: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#5F7F5C',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#F8E2DC',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  deleteText: {
    color: '#A34436',
    fontSize: 11,
    fontWeight: '800',
  },
  emptyBox: {
    backgroundColor: '#FFFDF8',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E5D9CA',
  },
  emptyText: {
    fontSize: 17,
    color: '#2F2F2F',
    fontWeight: '800',
  },
  emptySubtext: {
    color: '#756E66',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 29, 24, 0.55)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#FFFDF8',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '92%',
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 12,
  },
  modalHandle: {
    width: 44,
    height: 5,
    backgroundColor: '#D6C8B6',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2F2F2F',
    marginBottom: 22,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#5F7F5C',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2F2F2F',
    marginBottom: 7,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5D9CA',
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#2F2F2F',
  },
  textArea: {
    height: 118,
    textAlignVertical: 'top',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5D9CA',
    marginVertical: 16,
  },
  dateButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5D9CA',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateIcon: {
    fontSize: 21,
    marginRight: 12,
  },
  dateContent: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#8C8378',
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2F2F2F',
  },
  ratingSection: {
    marginTop: 14,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingHorizontal: 14,
  },
  starButton: {
    padding: 6,
  },
  starOption: {
    fontSize: 32,
  },
  imageButton: {
    backgroundColor: '#5F7F5C',
    borderRadius: 16,
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
    fontWeight: '800',
    fontSize: 15,
  },
  preview: {
    width: '100%',
    height: 170,
    borderRadius: 18,
    marginBottom: 12,
    marginTop: 8,
  },
  buttonGroup: {
    marginTop: 20,
    gap: 10,
  },
  saveButton: {
    backgroundColor: '#5F7F5C',
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    padding: 13,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5D9CA',
  },
  cancelButtonText: {
    color: '#756E66',
    fontWeight: '800',
    fontSize: 15,
  },
});