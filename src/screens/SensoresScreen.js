import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, TextInput, Alert, Modal,
} from 'react-native';
import { sensores as dadosIniciais } from '../mock';

export default function SensoresScreen() {
  const [sensores, setSensores] = useState(dadosIniciais);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [editando, setEditando] = useState(null);
  const [tipo, setTipo] = useState('');
  const [status, setStatus] = useState('');

  function abrirCriar() {
    setEditando(null);
    setTipo('');
    setStatus('');
    setModalVisivel(true);
  }

  function abrirEditar(sensor) {
    setEditando(sensor);
    setTipo(sensor.tipo_sensor);
    setStatus(sensor.status_sensor);
    setModalVisivel(true);
  }

  function salvar() {
    if (!tipo || !status) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (editando) {
      setSensores(prev =>
        prev.map(s =>
          s.id_sensor === editando.id_sensor
            ? { ...s, tipo_sensor: tipo, status_sensor: status }
            : s
        )
      );
    } else {
      const novo = {
        id_sensor: Date.now(),
        tipo_sensor: tipo,
        status_sensor: status,
        id_area: 1,
      };
      setSensores(prev => [...prev, novo]);
    }

    setModalVisivel(false);
  }

  function excluir(id) {
    Alert.alert('Confirmar', 'Deseja excluir este sensor?', [
      { text: 'Cancelar' },
      { text: 'Excluir', style: 'destructive', onPress: () =>
          setSensores(prev => prev.filter(s => s.id_sensor !== id))
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botaoAdicionar} onPress={abrirCriar}>
        <Text style={styles.botaoAdicionarTexto}>+ Novo Sensor</Text>
      </TouchableOpacity>

      <FlatList
        data={sensores}
        keyExtractor={item => String(item.id_sensor)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitulo}>{item.tipo_sensor}</Text>
              <Text style={[
                styles.cardStatus,
                { color: item.status_sensor === 'ATIVO' ? '#3B6D11' : '#A32D2D' }
              ]}>
                {item.status_sensor}
              </Text>
            </View>
            <View style={styles.cardAcoes}>
              <TouchableOpacity onPress={() => abrirEditar(item)}>
                <Text style={styles.botaoEditar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => excluir(item.id_sensor)}>
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
              {editando ? 'Editar Sensor' : 'Novo Sensor'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Tipo (FUMACA, TEMPERATURA, CO2...)"
              placeholderTextColor="#999"
              value={tipo}
              onChangeText={setTipo}
              autoCapitalize="characters"
            />

            <TextInput
              style={styles.input}
              placeholder="Status (ATIVO, INATIVO)"
              placeholderTextColor="#999"
              value={status}
              onChangeText={setStatus}
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
  cardStatus: { fontSize: 12, fontWeight: '500', marginTop: 4 },
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