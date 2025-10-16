
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/coco_tours/api/v2',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('TOKEN')
    console.log('=== Axios Interceptor Request ===')
    console.log('URL:', config.url)
    console.log('Token en sessionStorage:', token ? `${token.substring(0, 20)}...` : 'NO EXISTE')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('Authorization header configurado')
    } else {
      console.error('NO SE ENCONTRÓ TOKEN EN SESSIONSTORAGE')
      console.log('Keys en sessionStorage:', Object.keys(sessionStorage))
    }
    
    return config
  },
  (error) => {
    console.error('Error en request interceptor:', error)
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => {
    console.log('Response exitosa:', response.status)
    return response
  },
  (error) => {
    console.error('=== Axios Interceptor Response Error ===')
    console.error('Status:', error.response?.status)
    console.error('Data:', error.response?.data)
    console.error('Headers:', error.response?.headers)
    
    if (error.response?.status === 401) {
      console.error('Error 401 - Token inválido o expirado')
      console.log('Token actual:', sessionStorage.getItem('TOKEN')?.substring(0, 20))
      
      // Comentar temporalmente la redirección para debug
      // sessionStorage.clear()
      // window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

export default api
