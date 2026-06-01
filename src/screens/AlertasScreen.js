// src/screens/AlertasScreen.js
import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, TextInput, Alert, Modal,
} from 'react-native';
import { alertas as dadosIniciais } from '../mock';

export default function AlertasScreen() {
  const [alertas, setAlertas] = useState(dadosIniciais);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [editando, setEditando] = useState(null);
  const [tipo, setTipo] = useState('');
  const [severidade, setSeveridade] = useState('');
  const [descricao, setDescricao] = useState('');

  function abrirCriar() {
    setEditando(null);
    setTipo('');
    setSeveridade('');
    setDescricao('');
    setModalVisivel(true);
  }

  function abrirEditar(alerta) {
    setEditando(alerta);
    setTipo(alerta.tipo_alerta);
    setSeveridade(alerta.severidade);
    setDescricao(alerta.descricao);
    setModalVisivel(true);
  }

  function salvar() {
    if (!tipo || !severidade || !descricao) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (editando) {
      setAlertas(prev =>
        prev.map(a =>
          a.id_alerta === editando.id_alerta
            ? { ...a, tipo_alerta: tipo, severidade, descricao }
            : a
        )
      );
    } else {
      const novo = {
        id_alerta: Date.now(),
        tipo_alerta: tipo,
        severidade,
        descricao,
        id_area: 1,
      };
      setAlertas(prev => [...prev, novo]);
    }

    setModalVisivel(false);
  }

  function excluir(id) {
    Alert.alert('Confirmar', 'Deseja excluir este alerta?', [
      { text: 'Cancelar' },
      { text: 'Excluir', style: 'destructive', onPress: () =>
          setAlertas(prev => prev.filter(a => a.id_alerta !== id))
      },
    ]);
  }

  function corSeveridade(s) {
    if (s === 'CRITICO') return { bg: '#FCEBEB', cor: '#A32D2D' };
    if (s === 'ALTO') return { bg: '#FAEEDA', cor: '#854F0B' };
    return { bg: '#EAF3DE', cor: '#3B6D11' };
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botaoAdicionar} onPress={abrirCriar}>
        <Text style={styles.botaoAdicionarTexto}>+ Novo Alerta</Text>
      </TouchableOpacity>

      <FlatList
        data={alertas}
        keyExtractor={item => String(item.id_alerta)}
        renderItem={({ item }) => {
          const cor = corSeveridade(item.severidade);
          return (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitulo}>{item.tipo_alerta}</Text>
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
                <TouchableOpacity onPress={() => excluir(item.id_alerta)}>
                  <Text style={styles.botaoExcluir}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
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
              placeholder="Severidade (ALTO, MEDIO, BAIXO)"
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