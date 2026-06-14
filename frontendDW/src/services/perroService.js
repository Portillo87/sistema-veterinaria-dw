import api from '@/services/api.js'

// Servicio de mascotas: centraliza todas las llamadas HTTP al endpoint /perros.
// Las respuestas incluyen el propietario completo gracias al populate() del backend.
export const perroService = {
  // Obtiene todas las mascotas con información del propietario (populate)
  getAll: () => api.get('/perros'),

  // Obtiene una mascota específica por su ID, con el propietario populado
  getById: (id) => api.get(`/perros/${id}`),

  // Registra una nueva mascota en la base de datos
  create: (data) => api.post('/perros', data),

  // Actualiza los datos de una mascota existente
  update: (id, data) => api.put(`/perros/${id}`, data),

  // Elimina una mascota de la base de datos por su ID
  delete: (id) => api.delete(`/perros/${id}`)
}
