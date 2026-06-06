// =========================================================
// TROQUE O BASEURL PELO IP DO BACKEND 
// =========================================================

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://20.195.199.26:8080',
  timeout: 5000,
});

// AREAS
export const getAreas = () => api.get('/areas');
export const createArea = (data) => api.post('/areas', data);
export const updateArea = (id, data) => api.put(`/areas/${id}`, data);
export const deleteArea = (id) => api.delete(`/areas/${id}`);

// ALERTAS
export const getAlertas = () => api.get('/alertas');
export const createAlerta = (data) => api.post('/alertas', data);
export const updateAlerta = (id, data) => api.put(`/alertas/${id}`, data);
export const deleteAlerta = (id) => api.delete(`/alertas/${id}`);

// SENSORES
export const getSensores = () => api.get('/sensores');
export const createSensor = (data) => api.post('/sensores', data);
export const updateSensor = (id, data) => api.put(`/sensores/${id}`, data);
export const deleteSensor = (id) => api.delete(`/sensores/${id}`);

// OCORRENCIAS
export const getOcorrencias = () => api.get('/ocorrencias');
export const createOcorrencia = (data) => api.post('/ocorrencias', data);
export const updateOcorrencia = (id, data) => api.put(`/ocorrencias/${id}`, data);
export const deleteOcorrencia = (id) => api.delete(`/ocorrencias/${id}`);

export default api;