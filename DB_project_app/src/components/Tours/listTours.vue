<template>
  <div class="container mt-4">
    <h2 class="mb-4">
      <i class="bi bi-map me-2"></i>Tours Disponibles
    </h2>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando tours...</span>
      </div>
      <p class="mt-3">Cargando tours...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
      <button v-if="!error.includes('sesión')" @click="fetchTours" class="btn btn-sm btn-outline-danger ms-3">
        Reintentar
      </button>
    </div>

    <div v-else-if="!tours.length" class="alert alert-info" role="alert">
      <i class="bi bi-info-circle me-2"></i>No hay tours disponibles
    </div>

    <div v-else>
      <div class="mb-3">
        <p class="text-muted">Total de tours: {{ tours.length }}</p>
      </div>

      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tour in paginatedTours" :key="tour.id">
              <td>{{ tour.id }}</td>
              <td>{{ tour.type }}</td>
              <td>{{ tour.description }}</td>
              <td>${{ tour.price?.toFixed(2) }}</td>
              <td>
                <button class="btn btn-sm btn-primary me-2" title="Editar">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger"  title="Eliminar" @click="deleteTour(tour)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <nav v-if="totalPages > 1" aria-label="Tours pagination" class="mt-4">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">
              Anterior
            </button>
          </li>
          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
          >
            <button class="page-link" @click="currentPage = page">
              {{ page }}
            </button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="currentPage++" :disabled="currentPage === totalPages">
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/services/axios.config'

interface Tour {
  id: number
  description: string
  price: number
  type: string
}

const tours = ref<Tour[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const currentPage = ref(1)
const itemsPerPage = 10

const deleteTourById = async (tour: any) => {
  try {
    await deleteTour(tour.id)
    alert('Usuario eliminado correctamente')
    await tours.value.filter(t => t.id !== tour.id)
  } catch (err: any) {
    console.error('Error al eliminar Tour:', err)
    alert('Error al eliminar Tour: ' + (err.message || ''))
  }
}

async function deleteTour(tour: any) {
  const confirmed = confirm(`¿Seguro que deseas eliminar?`)
  if (confirmed) {
    await deleteTourById(tour)
  }
}

const paginatedTours = computed(() => {
  if (!Array.isArray(tours.value)) {
    console.error('tours.value no es un array:', tours.value)
    return []
  }

  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return tours.value.slice(start, end)
})

const totalPages = computed(() => {
  if (!Array.isArray(tours.value)) return 0
  return Math.ceil(tours.value.length / itemsPerPage)
})

const fetchTours = async () => {
  loading.value = true
  error.value = null

  try {
    console.log('=== Fetch Tours ===')
    console.log('SessionStorage keys:', Object.keys(sessionStorage))
    console.log('TOKEN existe:', !!sessionStorage.getItem('TOKEN'))
    console.log('USER_ROLE:', sessionStorage.getItem('USER_ROLE'))

    const token = sessionStorage.getItem('TOKEN')
    if (!token) {
      throw new Error('No hay token disponible')
    }

    console.log('Token (primeros 30 chars):', token.substring(0, 30))
    console.log('Haciendo petición a /tours/all...')

    const response = await api.get('/tours/all')

    console.log('✅ Response recibida:', response.status)
    console.log('Response data:', response.data)
    console.log('Tipo de response.data:', typeof response.data)
    console.log('Es array?', Array.isArray(response.data))

    if (Array.isArray(response.data)) {
      tours.value = response.data
      console.log('✅ Tours asignados:', tours.value.length)
    } else if (response.data && Array.isArray(response.data.data)) {
      tours.value = response.data.data
      console.log('✅ Tours asignados desde data.data:', tours.value.length)
    } else if (response.data && Array.isArray(response.data.tours)) {
      tours.value = response.data.tours
      console.log('✅ Tours asignados desde data.tours:', tours.value.length)
    } else {
      console.error('❌ Formato de respuesta inesperado:', response.data)
      tours.value = []
      error.value = 'Formato de datos incorrecto'
    }
  } catch (err: any) {
    console.error('=== Error en fetchTours ===')
    console.error('Error completo:', err)
    console.error('Error message:', err.message)
    console.error('Error response status:', err.response?.status)
    console.error('Error response data:', err.response?.data)
    console.error('Error response headers:', err.response?.headers)

    if (err.response?.status === 401) {
      error.value = 'Sesión expirada. Por favor, inicia sesión nuevamente.'
      console.error('❌ Token rechazado por el servidor')

      // Esperar 2 segundos antes de redirigir
      setTimeout(() => {
        sessionStorage.clear()
        window.location.href = '/login'
      }, 2000)
    } else if (!sessionStorage.getItem('TOKEN')) {
      error.value = 'No hay sesión activa. Redirigiendo al login...'
      setTimeout(() => {
        window.location.href = '/login'
      }, 1000)
    } else {
      error.value = err.response?.data?.message || err.message || 'Error al cargar los tours'
    }
    tours.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  console.log('=== Componente ListTours montado ===')
  console.log('Verificando autenticación...')

  const token = sessionStorage.getItem('TOKEN')
  const role = sessionStorage.getItem('USER_ROLE')

  console.log('Token existe:', !!token)
  console.log('Role:', role)

  if (!token) {
    console.error('❌ No hay token, redirigiendo a login')
    error.value = 'No hay sesión activa'
    loading.value = false
    setTimeout(() => {
      window.location.href = '/login'
    }, 1000)
    return
  }

  fetchTours()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.table {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
}
</style>
