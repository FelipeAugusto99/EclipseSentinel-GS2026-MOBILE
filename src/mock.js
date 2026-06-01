export const areas = [
  { id_area: 1, nome_area: 'Amazônia Norte', nivel_risco: 'ALTO', status_area: 'ATIVA' },
  { id_area: 2, nome_area: 'Pantanal', nivel_risco: 'MEDIO', status_area: 'ATIVA' },
  { id_area: 3, nome_area: 'Cerrado', nivel_risco: 'ALTO', status_area: 'ATIVA' },
  { id_area: 4, nome_area: 'Mata Atlântica', nivel_risco: 'CRITICO', status_area: 'ATIVA' },
  { id_area: 5, nome_area: 'Caatinga', nivel_risco: 'MEDIO', status_area: 'ATIVA' },
];
 
export const alertas = [
  { id_alerta: 1, tipo_alerta: 'QUEIMADA', severidade: 'ALTO', descricao: 'Foco de queimada detectado', id_area: 1 },
  { id_alerta: 2, tipo_alerta: 'DESMATAMENTO', severidade: 'MEDIO', descricao: 'Desmatamento identificado', id_area: 2 },
  { id_alerta: 3, tipo_alerta: 'INVASAO', severidade: 'ALTO', descricao: 'Invasão de área protegida', id_area: 3 },
  { id_alerta: 4, tipo_alerta: 'QUEIMADA', severidade: 'CRITICO', descricao: 'Grande foco de incêndio', id_area: 4 },
  { id_alerta: 5, tipo_alerta: 'DESMATAMENTO', severidade: 'BAIXO', descricao: 'Área em monitoramento', id_area: 5 },
];
 
export const sensores = [
  { id_sensor: 1, tipo_sensor: 'FUMACA', status_sensor: 'ATIVO', id_area: 1 },
  { id_sensor: 2, tipo_sensor: 'TEMPERATURA', status_sensor: 'ATIVO', id_area: 1 },
  { id_sensor: 3, tipo_sensor: 'UMIDADE', status_sensor: 'INATIVO', id_area: 2 },
  { id_sensor: 4, tipo_sensor: 'CO2', status_sensor: 'ATIVO', id_area: 3 },
  { id_sensor: 5, tipo_sensor: 'FUMACA', status_sensor: 'ATIVO', id_area: 4 },
];
 
export const ocorrencias = [
  { id_ocorrencia: 1, descricao: 'Foco de fumaça detectado por sensor', id_usuario: 1, id_area: 1 },
  { id_ocorrencia: 2, descricao: 'Desmatamento registrado por imagem', id_usuario: 1, id_area: 2 },
  { id_ocorrencia: 3, descricao: 'Invasão identificada no perímetro', id_usuario: 1, id_area: 3 },
];