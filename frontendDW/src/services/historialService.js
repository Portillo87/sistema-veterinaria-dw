import api from '@/services/api.js'

// Servicio de historial clínico: centraliza las llamadas HTTP al endpoint /historial.
// El historial se filtra siempre por mascota, nunca se obtiene de forma global.
export const historialService = {
  // Obtiene todas las consultas médicas asociadas a una mascota específica
  getByMascota: (mascotaId) => api.get(`/historial/mascota/${mascotaId}`),

  // Registra una nueva consulta médica en el historial
  create: (data) => api.post('/historial', data),

  // Actualiza una consulta médica existente por su ID
  update: (id, data) => api.put(`/historial/${id}`, data),

  // Elimina una consulta médica del historial por su ID
  delete: (id) => api.delete(`/historial/${id}`)
}
