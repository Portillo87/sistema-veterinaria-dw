import api from '@/services/api.js'

// Servicio de propietarios: centraliza todas las llamadas HTTP al endpoint /propietarios.
export const propietarioService = {
  // Obtiene todos los propietarios ordenados por nombre (orden definido en el backend)
  getAll: () => api.get('/propietarios'),

  // Obtiene un propietario específico por su ID
  getById: (id) => api.get(`/propietarios/${id}`),

  // Registra un nuevo propietario en la base de datos
  create: (data) => api.post('/propietarios', data),

  // Actualiza los datos de un propietario existente
  update: (id, data) => api.put(`/propietarios/${id}`, data),

  // Elimina un propietario de la base de datos por su ID
  delete: (id) => api.delete(`/propietarios/${id}`)
}
