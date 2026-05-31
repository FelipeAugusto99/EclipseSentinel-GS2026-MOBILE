import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { areas, alertas, sensores, ocorrencias } from '../mock';
 
export default function HomeScreen() {
  const alertasCriticos = alertas.filter(a => a.severidade === 'ALTO' || a.severidade === 'CRITICO').length;
  const sensoresAtivos = sensores.filter(s => s.status_sensor === 'ATIVO').length;
 
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Resumo do Sistema</Text>
 
      <View style={styles.grid}>
        <View style={[styles.card, { borderLeftColor: '#1D6A3E' }]}>
          <Text style={styles.cardNumero}>{areas.length}</Text>
          <Text style={styles.cardLabel}>Áreas Monitoradas</Text>
        </View>
 
        <View style={[styles.card, { borderLeftColor: '#E24B4A' }]}>
          <Text style={styles.cardNumero}>{alertasCriticos}</Text>
          <Text style={styles.cardLabel}>Alertas Críticos</Text>
        </View>
 
        <View style={[styles.card, { borderLeftColor: '#378ADD' }]}>
          <Text style={styles.cardNumero}>{sensoresAtivos}</Text>
          <Text style={styles.cardLabel}>Sensores Ativos</Text>
        </View>
 
        <View style={[styles.card, { borderLeftColor: '#BA7517' }]}>
          <Text style={styles.cardNumero}>{ocorrencias.length}</Text>
          <Text style={styles.cardLabel}>Ocorrências</Text>
        </View>
      </View>
 
      <Text style={styles.secao}>Últimos Alertas</Text>
      {alertas.slice(0, 3).map(alerta => (
        <View key={alerta.id_alerta} style={styles.item}>
          <Text style={styles.itemTitulo}>{alerta.tipo_alerta}</Text>
          <Text style={[
            styles.badge,
            alerta.severidade === 'ALTO' || alerta.severidade === 'CRITICO'
              ? styles.badgeAlto
              : styles.badgeMedio
          ]}>
            {alerta.severidade}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    width: '47%',
  },
  cardNumero: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  cardLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  secao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitulo: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  badge: {
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  badgeAlto: {
    backgroundColor: '#FCEBEB',
    color: '#A32D2D',
  },
  badgeMedio: {
    backgroundColor: '#FAEEDA',
    color: '#854F0B',
  },
});
 