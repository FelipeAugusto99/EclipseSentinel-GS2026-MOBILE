import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, TextInput, Alert, Modal,
} from 'react-native';
import { ocorrencias as dadosIniciais } from '../mock';
 
export default function OcorrenciasScreen() {
  const [ocorrencias, setOcorrencias] = useState(dadosIniciais);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [editando, setEditando] = useState(null);
  const [descricao, setDescricao] = useState('');
 
  function abrirCriar() {
    setEditando(null);
    setDescricao('');
    setModalVisivel(true);
  }
 
  function abrirEditar(occ) {
    setEditando(occ);
    setDescricao(occ.descricao);
    setModalVisivel(true);
  }
 
  function salvar() {
    if (!descricao) {
      Alert.alert('Atenção', 'Preencha a descrição.');
      return;
    }
 
    if (editando) {
      setOcorrencias(prev =>
        prev.map(o =>
          o.id_ocorrencia === editando.id_ocorrencia
            ? { ...o, descricao }
            : o
        )
      );
    } else {
      const nova = {
        id_ocorrencia: Date.now(),
        descricao,
        id_usuario: 1,
        id_area: 1,
      };
      setOcorrencias(prev => [...prev, nova]);
    }
 
    setModalVisivel(false);
  }
 
  function excluir(id) {
    Alert.alert('Confirmar', 'Deseja excluir esta ocorrência?', [
      { text: 'Cancelar' },
      { text: 'Excluir', style: 'destructive', onPress: () =>
          setOcorrencias(prev => prev.filter(o => o.id_ocorrencia !== id))
      },
    ]);
  }
 
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botaoAdicionar} onPress={abrirCriar}>
        <Text style={styles.botaoAdicionarTexto}>+ Nova Ocorrência</Text>
      </TouchableOpacity>
 
      <FlatList
        data={ocorrencias}
        keyExtractor={item => String(item.id_ocorrencia)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitulo}>Ocorrência #{item.id_ocorrencia}</Text>
              <Text style={styles.cardDesc}>{item.descricao}</Text>
            </View>
            <View style={styles.cardAcoes}>
              <TouchableOpacity onPress={() => abrirEditar(item)}>
                <Text style={styles.botaoEditar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => excluir(item.id_ocorrencia)}>
                <Text style={styles.botaoExcluir}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
 