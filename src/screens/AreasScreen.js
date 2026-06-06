import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, TextInput, Alert, Modal, ActivityIndicator,
} from 'react-native';
import { USE_API } from '../config';
import { areas as dadosMock } from '../mock';
import { getAreas, createArea, updateArea, deleteArea } from '../api';

export default function AreasScreen() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [editando, setEditando] = useState(null);
  const [nome, setNome] = useState('');
  const [risco, setRisco] = useState('');

  useEffect(() => {
    carregarAreas();
  }, []);

  async function carregarAreas() {
    if (USE_API) {
      try {
        setLoading(true);
        const res = await getAreas();
        setAreas(res.data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar as áreas.');
      } finally {
        setLoading(false);
      }
    } else {
      setAreas(dadosMock);
    }
  }

  function abrirCriar() {
    setEditando(null);
    setNome('');
    setRisco('');
    setModalVisivel(true);
  }

  function abrirEditar(area) {
    setEditando(area);
    setNome(area.nome || '');
    setRisco(area.nivelRisco || '');
    setModalVisivel(true);
  }

  async function salvar() {
    if (!nome || !risco) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (USE_API) {
      try {
        setLoading(true);
        const data = {
          nome,
          nivelRisco: risco,
          status: 'SEGURA',
          localizacao: { latitude: 0.0, longitude: 0.0 },
        };
        if (editando) {
          await updateArea(editando.id, data);
        } else {
          await createArea(data);
        }
        await carregarAreas();
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar a área.');
      } finally {
        setLoading(false);
      }
    } else {
      if (editando) {
        setAreas(prev =>
          prev.map(a => a.id_area === editando.id_area
            ? { ...a, nome_area: nome, nivel_risco: risco }
            : a
          )
        );
      } else {
        setAreas(prev => [...prev, {
          id_area: Date.now(),
          nome_area: nome,
          nivel_risco: risco,
          status_area: 'ATIVA',
        }]);
      }
    }

    setModalVisivel(false);
  }

  async function excluir(id) {
    Alert.alert('Confirmar', 'Deseja excluir esta área?', [
      { text: 'Cancelar' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          if (USE_API) {
            try {
              await deleteArea(id);
              await carregarAreas();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a área.');
            }
          } else {
            setAreas(prev => prev.filter(a => a.id_area !== id));
          }
        }
      },
    ]);
  }

  function corRisco(nivel) {
    if (nivel === 'CRITICO') return '#E24B4A';
    if (nivel === 'ALTO') return '#BA7517';
    if (nivel === 'MEDIO') return '#378ADD';
    return '#639922';
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
        <Text style={styles.botaoAdicionarTexto}>+ Nova Área</Text>
      </TouchableOpacity>

      <FlatList
        data={areas}
        keyExtractor={item => String(item.id || item.id_area)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitulo}>{item.nome || item.nome_area}</Text>
              <Text style={[styles.badge, { color: corRisco(item.nivelRisco || item.nivel_risco) }]}>
                {item.nivelRisco || item.nivel_risco}
              </Text>
              <Text style={styles.cardStatus}>{item.status || item.status_area}</Text>
            </View>
            <View style={styles.cardAcoes}>
              <TouchableOpacity onPress={() => abrirEditar(item)}>
                <Text style={styles.botaoEditar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => excluir(item.id || item.id_area)}>
                <Text style={styles.botaoExcluir}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhuma área cadastrada.</Text>}
      />

      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalFundo}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>
              {editando ? 'Editar Área' : 'Nova Área'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nome da área"
              placeholderTextColor="#999"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              style={styles.input}
              placeholder="Nível de risco (ALTO, MEDIO, BAIXO)"
              placeholderTextColor="#999"
              value={risco}
              onChangeText={setRisco}
              autoCapitalize="characters"
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
  badge: { fontSize: 12, fontWeight: 'bold', marginTop: 2 },
  cardStatus: { fontSize: 12, color: '#888', marginTop: 2 },
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