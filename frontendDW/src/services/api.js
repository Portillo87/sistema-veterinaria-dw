import axios from 'axios'

// Instancia de Axios configurada con la URL base del servidor backend.
// Centralizar la baseURL aquí evita duplicarla en cada servicio:
// si el puerto del backend cambia, solo se modifica este archivo.
const api = axios.create({
  baseURL: 'https://sistema-veterinaria-dw.onrender.com'
})

export default api
