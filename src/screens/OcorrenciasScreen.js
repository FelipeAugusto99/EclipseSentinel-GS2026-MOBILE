import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, TextInput, Alert, Modal, ActivityIndicator,
} from 'react-native';
import { USE_API } from '../config';
import { ocorrencias as dadosMock } from '../mock';
import { getOcorrencias, createOcorrencia, updateOcorrencia, deleteOcorrencia, getAreas } from '../api';

export default function OcorrenciasScreen() {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [idArea, setIdArea] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [editando, setEditando] = useState(null);
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    if (USE_API) {
      try {
        setLoading(true);
        const [resOcorrencias, resAreas] = await Promise.all([getOcorrencias(), getAreas()]);
        setOcorrencias(resOcorrencias.data);
        if (resAreas.data && resAreas.data.length > 0) {
          setIdArea(resAreas.data[0].id);
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados.');
      } finally {
        setLoading(false);
      }
    } else {
      setOcorrencias(dadosMock);
    }
  }

  function abrirCriar() {
    setEditando(null);
    setDescricao('');
    setModalVisivel(true);
  }

  function abrirEditar(occ) {
    setEditando(occ);
    setDescricao(occ.descricao || '');
    setModalVisivel(true);
  }

  async function salvar() {
    if (!descricao) {
      Alert.alert('Atenção', 'Preencha a descrição.');
      return;
    }

    if (USE_API) {
      if (!idArea) {
        Alert.alert('Atenção', 'Nenhuma área cadastrada. Crie uma área primeiro.');
        return;
      }
      try {
        setLoading(true);
        const data = {
          descricao,
          imagemUrl: '',
          usuario: { id: 1 },
          area: { id: idArea },
        };
        if (editando) {
          await updateOcorrencia(editando.id, data);
        } else {
          await createOcorrencia(data);
        }
        await carregarDados();
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar a ocorrência.');
      } finally {
        setLoading(false);
      }
    } else {
      if (editando) {
        setOcorrencias(prev =>
          prev.map(o => o.id_ocorrencia === editando.id_ocorrencia
            ? { ...o, descricao }
            : o
          )
        );
      } else {
        setOcorrencias(prev => [...prev, {
          id_ocorrencia: Date.now(),
          descricao,
        }]);
      }
    }

    setModalVisivel(false);
  }

  async function excluir(id) {
    Alert.alert('Confirmar', 'Deseja excluir esta ocorrência?', [
      { text: 'Cancelar' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          if (USE_API) {
            try {
              await deleteOcorrencia(id);
              await carregarDados();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a ocorrência.');
            }
          } else {
            setOcorrencias(prev => prev.filter(o => o.id_ocorrencia !== id));
          }
        }
      },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1D6A3E" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botaoAdicionar} onPress={abrirCriar}>
        <Text style={styles.botaoAdicionarTexto}>+ Nova Ocorrência</Text>
      </TouchableOpacity>

      <FlatList
        data={ocorrencias}
        keyExtractor={item => String(item.id || item.id_ocorrencia)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitulo}>
                Ocorrência #{item.id || item.id_ocorrencia}
              </Text>
              <Text style={styles.cardDesc}>{item.descricao}</Text>
            </View>
            <View style={styles.cardAcoes}>
              <TouchableOpacity onPress={() => abrirEditar(item)}>
                <Text style={styles.botaoEditar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => excluir(item.id || item.id_ocorrencia)}>
                <Text style={styles.botaoExcluir}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhuma ocorrência cadastrada.</Text>}
      />

      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalFundo}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>
              {editando ? 'Editar Ocorrência' : 'Nova Ocorrência'}
            </Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Descrição da ocorrência"
              placeholderTextColor="#999"
              value={descricao}
              onChangeText={setDescricao}
              multiline
            />
            <TouchableOpacity style={styles.botaoSalvar} onPress={salvar}>
              <Text style={styles.botaoSalvarTexto}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisivel(false)}>
              <Text style={styles.botaoCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 8, color: '#666' },
  botaoAdicionar: {
    backgroundColor: '#1D6A3E', borderRadius: 8,
    padding: 12, alignItems: 'center', marginBottom: 16,
  },
  botaoAdicionarTexto: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  card: {
    backgroundColor: '#fff', borderRadius: 8, padding: 14,
    marginBottom: 10, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
  },
  cardInfo: { flex: 1 },
  cardTitulo: { fontSize: 14, fontWeight: '500', color: '#333' },
  cardDesc: { fontSize: 12, color: '#666', marginTop: 4 },
  cardAcoes: { flexDirection: 'row', gap: 12 },
  botaoEditar: { color: '#378ADD', fontWeight: '500', fontSize: 13 },
  botaoExcluir: { color: '#E24B4A', fontWeight: '500', fontSize: 13 },
  vazio: { textAlign: 'center', color: '#888', marginTop: 40 },
  modalFundo: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', padding: 24,
  },
  modalBox: { backgroundColor: '#fff', borderRadius: 12, padding: 24 },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  input: {
    borderWidth: 0.5, borderColor: '#ddd', borderRadius: 8,
    padding: 12, marginBottom: 12, fontSize: 14, color: '#333',
  },
  botaoSalvar: {
    backgroundColor: '#1D6A3E', borderRadius: 8,
    padding: 12, alignItems: 'center', marginTop: 4,
  },
  botaoSalvarTexto: { color: '#fff', fontWeight: 'bold' },
  botaoCancelar: { textAlign: 'center', color: '#888', marginTop: 12, fontSize: 14 },
});