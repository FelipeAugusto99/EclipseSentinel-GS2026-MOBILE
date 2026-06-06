import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, TextInput, Alert, Modal, ActivityIndicator,
} from 'react-native';
import { USE_API } from '../config';
import { sensores as dadosMock } from '../mock';
import { getSensores, createSensor, updateSensor, deleteSensor, getAreas } from '../api';

export default function SensoresScreen() {
  const [sensores, setSensores] = useState([]);
  const [idArea, setIdArea] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [editando, setEditando] = useState(null);
  const [tipo, setTipo] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    if (USE_API) {
      try {
        setLoading(true);
        const [resSensores, resAreas] = await Promise.all([getSensores(), getAreas()]);
        setSensores(resSensores.data);
        if (resAreas.data && resAreas.data.length > 0) {
          setIdArea(resAreas.data[0].id);
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados.');
      } finally {
        setLoading(false);
      }
    } else {
      setSensores(dadosMock);
    }
  }

  function abrirCriar() {
    setEditando(null);
    setTipo('');
    setStatus('');
    setModalVisivel(true);
  }

  function abrirEditar(sensor) {
    setEditando(sensor);
    setTipo(sensor.tipoSensor || sensor.tipo_sensor || '');
    setStatus(sensor.statusSensor || sensor.status_sensor || '');
    setModalVisivel(true);
  }

  async function salvar() {
    if (!tipo || !status) {
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
          tipoSensor: tipo,
          statusSensor: status,
          area: { id: idArea },
        };
        if (editando) {
          await updateSensor(editando.id, data);
        } else {
          await createSensor(data);
        }
        await carregarDados();
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar o sensor.');
      } finally {
        setLoading(false);
      }
    } else {
      if (editando) {
        setSensores(prev =>
          prev.map(s => s.id_sensor === editando.id_sensor
            ? { ...s, tipo_sensor: tipo, status_sensor: status }
            : s
          )
        );
      } else {
        setSensores(prev => [...prev, {
          id_sensor: Date.now(),
          tipo_sensor: tipo,
          status_sensor: status,
        }]);
      }
    }

    setModalVisivel(false);
  }

  async function excluir(id) {
    Alert.alert('Confirmar', 'Deseja excluir este sensor?', [
      { text: 'Cancelar' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          if (USE_API) {
            try {
              await deleteSensor(id);
              await carregarDados();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o sensor.');
            }
          } else {
            setSensores(prev => prev.filter(s => s.id_sensor !== id));
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
        <Text style={styles.botaoAdicionarTexto}>+ Novo Sensor</Text>
      </TouchableOpacity>

      <FlatList
        data={sensores}
        keyExtractor={item => String(item.id || item.id_sensor)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitulo}>{item.tipoSensor || item.tipo_sensor}</Text>
              <Text style={[
                styles.cardStatus,
                { color: (item.statusSensor || item.status_sensor) === 'ATIVO' ? '#3B6D11' : '#A32D2D' }
              ]}>
                {item.statusSensor || item.status_sensor}
              </Text>
            </View>
            <View style={styles.cardAcoes}>
              <TouchableOpacity onPress={() => abrirEditar(item)}>
                <Text style={styles.botaoEditar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => excluir(item.id || item.id_sensor)}>
                <Text style={styles.botaoExcluir}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum sensor cadastrado.</Text>}
      />

      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalFundo}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>
              {editando ? 'Editar Sensor' : 'Novo Sensor'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Tipo (TEMPERATURA, FUMACA, CO2...)"
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
  cardStatus: { fontSize: 12, fontWeight: '500', marginTop: 4 },
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