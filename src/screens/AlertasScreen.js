import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, TextInput, Alert, Modal, ActivityIndicator,
} from 'react-native';
import { USE_API } from '../config';
import { alertas as dadosMock } from '../mock';
import { getAlertas, createAlerta, updateAlerta, deleteAlerta, getAreas } from '../api';

export default function AlertasScreen() {
  const [alertas, setAlertas] = useState([]);
  const [idArea, setIdArea] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [editando, setEditando] = useState(null);
  const [tipo, setTipo] = useState('');
  const [severidade, setSeveridade] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    if (USE_API) {
      try {
        setLoading(true);
        const [resAlertas, resAreas] = await Promise.all([getAlertas(), getAreas()]);
        setAlertas(resAlertas.data);
        if (resAreas.data && resAreas.data.length > 0) {
          setIdArea(resAreas.data[0].id);
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados.');
      } finally {
        setLoading(false);
      }
    } else {
      setAlertas(dadosMock);
    }
  }

  function abrirCriar() {
    setEditando(null);
    setTipo('');
    setSeveridade('');
    setDescricao('');
    setModalVisivel(true);
  }

  function abrirEditar(alerta) {
    setEditando(alerta);
    setTipo(alerta.tipoAlerta || alerta.tipo_alerta || '');
    setSeveridade(alerta.severidade || '');
    setDescricao(alerta.descricao || '');
    setModalVisivel(true);
  }

  async function salvar() {
    if (!tipo || !severidade || !descricao) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
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
          tipoAlerta: tipo,
          severidade,
          descricao,
          area: { id: idArea },
        };
        if (editando) {
          await updateAlerta(editando.id, data);
        } else {
          await createAlerta(data);
        }
        await carregarDados();
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar o alerta.');
      } finally {
        setLoading(false);
      }
    } else {
      if (editando) {
        setAlertas(prev =>
          prev.map(a => a.id_alerta === editando.id_alerta
            ? { ...a, tipo_alerta: tipo, severidade, descricao }
            : a
          )
        );
      } else {
        setAlertas(prev => [...prev, {
          id_alerta: Date.now(),
          tipo_alerta: tipo,
          severidade,
          descricao,
        }]);
      }
    }

    setModalVisivel(false);
  }

  async function excluir(id) {
    Alert.alert('Confirmar', 'Deseja excluir este alerta?', [
      { text: 'Cancelar' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          if (USE_API) {
            try {
              await deleteAlerta(id);
              await carregarDados();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o alerta.');
            }
          } else {
            setAlertas(prev => prev.filter(a => a.id_alerta !== id));
          }
        }
      },
    ]);
  }

  function corSeveridade(s) {
    if (s === 'ALTA' || s === 'ALTO') return { bg: '#FCEBEB', cor: '#A32D2D' };
    if (s === 'MEDIA' || s === 'MEDIO') return { bg: '#FAEEDA', cor: '#854F0B' };
    return { bg: '#EAF3DE', cor: '#3B6D11' };
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
        <Text style={styles.botaoAdicionarTexto}>+ Novo Alerta</Text>
      </TouchableOpacity>

      <FlatList
        data={alertas}
        keyExtractor={item => String(item.id || item.id_alerta)}
        renderItem={({ item }) => {
          const cor = corSeveridade(item.severidade);
          return (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitulo}>{item.tipoAlerta || item.tipo_alerta}</Text>
                <Text style={styles.cardDesc}>{item.descricao}</Text>
                <View style={[styles.badge, { backgroundColor: cor.bg }]}>
                  <Text style={[styles.badgeTexto, { color: cor.cor }]}>
                    {item.severidade}
                  </Text>
                </View>
              </View>
              <View style={styles.cardAcoes}>
                <TouchableOpacity onPress={() => abrirEditar(item)}>
                  <Text style={styles.botaoEditar}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => excluir(item.id || item.id_alerta)}>
                  <Text style={styles.botaoExcluir}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum alerta cadastrado.</Text>}
      />

      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalFundo}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>
              {editando ? 'Editar Alerta' : 'Novo Alerta'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Tipo (QUEIMADA, DESMATAMENTO...)"
              placeholderTextColor="#999"
              value={tipo}
              onChangeText={setTipo}
              autoCapitalize="characters"
            />
            <TextInput
              style={styles.input}
              placeholder="Severidade (ALTA, MEDIA, BAIXA)"
              placeholderTextColor="#999"
              value={severidade}
              onChangeText={setSeveridade}
              autoCapitalize="characters"
            />
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              placeholderTextColor="#999"
              value={descricao}
              onChangeText={setDescricao}
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
  cardTitulo: { fontSize: 15, fontWeight: '500', color: '#333' },
  cardDesc: { fontSize: 12, color: '#666', marginTop: 2, marginBottom: 6 },
  badge: { alignSelf: 'flex-start', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  badgeTexto: { fontSize: 11, fontWeight: 'bold' },
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