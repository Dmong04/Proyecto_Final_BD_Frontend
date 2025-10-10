import api from "@/api/api"
import { useRouter } from "vue-router"
import { ref } from "vue"

export function useAuth() {
  const username = ref('')
  const password = ref('')
  const error = ref(false)
  const router = useRouter()

  const login = async () => {
    error.value = false
    try {
      const response = await api.post('auth/login', {
        username: username.value,
        password: password.value,
      })
      
      console.log('Login response:', response.data)
      
      // Extract the data from the response
      const { token, username: user, role } = response.data.data || response.data
      
      // Store token and user info in localStorage
      if (token) {
        localStorage.setItem('token', token)
        localStorage.setItem('username', user)
        localStorage.setItem('role', role)
        console.log('Token saved:', token.substring(0, 20) + '...')
      } else {
        console.error('No token received from server')
        error.value = true
        return
      }
      
      // Also keep sessionStorage for backward compatibility if needed
      sessionStorage.setItem('ROLE', role)
      
      router.push('/home')
    } catch (err) {
      console.error('Login error:', err)
      error.value = true
    }
  }

  const logout = () => {
    // Clear both localStorage and sessionStorage
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
    sessionStorage.removeItem('ROLE')
    router.push('/login')
  }

  const isAuthenticated = () => {
    return !!localStorage.getItem('token')
  }

  const getToken = () => {
    return localStorage.getItem('token')
  }

  const getRole = () => {
    return localStorage.getItem('role') || sessionStorage.getItem('ROLE')
  }

  return {
    username,
    password,
    error,
    login,
    logout,
    isAuthenticated,
    getToken,
    getRole
  }
}