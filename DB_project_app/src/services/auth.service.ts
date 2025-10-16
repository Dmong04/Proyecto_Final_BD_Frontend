
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const API_URL = 'http://localhost:8080/coco_tours/api/v2/auth'

interface LoginResponse {
  data: {
    name: string
    username: string
    role: string
    token: string
  }
  success: boolean
  message: string
}

export const useAuth = () => {
  const router = useRouter()
  const isAuthenticated = ref(false)
  const userRole = ref<string | null>(null)
  const username = ref('')
  const password = ref('')
  const error = ref(false)

  const login = async () => {
    try {
      error.value = false
      console.log('=== Intentando login ===')
      console.log('Username:', username.value)
      console.log('URL:', `${API_URL}/login`)

      const response = await axios.post<LoginResponse>(
        `${API_URL}/login`,
        {
          username: username.value,
          password: password.value
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      console.log('Login response:', response.data)

      if (response.data.success && response.data.data.token) {
        const { token, role, name, username: user } = response.data.data
        
        // Limpiar sessionStorage primero
        sessionStorage.clear()
        
        // Guardar en sessionStorage
        sessionStorage.setItem('TOKEN', token)
        sessionStorage.setItem('USER_ROLE', role)
        sessionStorage.setItem('USER_NAME', name)
        sessionStorage.setItem('USERNAME', user)
        
        console.log('✅ Datos guardados en sessionStorage')
        console.log('Token (primeros 30 chars):', token.substring(0, 30))
        console.log('Role:', role)
        console.log('Name:', name)
        console.log('Username:', user)
        
        // Verificar que se guardó correctamente
        console.log('Verificación - TOKEN:', sessionStorage.getItem('TOKEN') ? 'OK' : 'ERROR')
        console.log('Verificación - USER_ROLE:', sessionStorage.getItem('USER_ROLE'))
        
        isAuthenticated.value = true
        userRole.value = role

        // Pequeño delay para asegurar que el storage se actualice
        await new Promise(resolve => setTimeout(resolve, 100))

        // Redirigir según el rol
        console.log('Redirigiendo a:', role === 'ADMIN' ? '/home' : '/client-home')
        
        if (role === 'ADMIN') {
          await router.push('/home')
        } else if (role === 'CLIENT') {
          await router.push('/client-home')
        }

        console.log('Redirección completada')
        return { success: true, role }
      }

      error.value = true
      return { success: false, message: 'Credenciales inválidas' }
    } catch (err: any) {
      console.error('=== Error en login ===')
      console.error('Error completo:', err)
      console.error('Error response:', err.response)
      console.error('Error status:', err.response?.status)
      console.error('Error data:', err.response?.data)
      
      error.value = true
      return {
        success: false,
        message: err.response?.data?.message || 'Error al iniciar sesión'
      }
    }
  }

  const logout = () => {
    sessionStorage.clear()
    isAuthenticated.value = false
    userRole.value = null
    username.value = ''
    password.value = ''
    console.log('Sesión cerrada - Storage limpiado')
    router.push('/login')
  }

  const checkAuth = () => {
    const token = sessionStorage.getItem('TOKEN')
    const role = sessionStorage.getItem('USER_ROLE')
    
    console.log('CheckAuth - Token existe:', !!token)
    console.log('CheckAuth - Role:', role)
    
    if (token && role) {
      isAuthenticated.value = true
      userRole.value = role
      return true
    }
    
    isAuthenticated.value = false
    userRole.value = null
    return false
  }

  const getToken = () => {
    return sessionStorage.getItem('TOKEN')
  }

  const getUserRole = () => {
    return sessionStorage.getItem('USER_ROLE')
  }

  return {
    login,
    logout,
    checkAuth,
    getToken,
    getUserRole,
    isAuthenticated,
    userRole,
    username,
    password,
    error
  }
}
