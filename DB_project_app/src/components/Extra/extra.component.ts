import { ref, onMounted } from 'vue'
import extraService from '@/services/extra.service'
import type { Extra } from '@/models/extra'

export function ExtraComponet() {
  const name = ref('')
  const description = ref('')
  const unit_price = ref<number | null>(null)

  const extras = ref<Extra[]>([])
  const loading = ref(false)
  const error = ref(null)

  const loadExtras = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await extraService.getExtras()
      
      // Verifica la estructura de la respuesta
      console.log('Response completa:', response)
      console.log('Response data:', response.data)
      
      // Asigna los datos correctamente
      if (Array.isArray(response.data)) {
        extras.value = response.data
      } else if (response.data && Array.isArray(response.data.data)) {
        extras.value = response.data.data
      } else if (response.data && Array.isArray(response.data.extras)) {
        extras.value = response.data.extras
      } else {
        console.error('Formato inesperado:', response.data)
        extras.value = []
      }
      
      console.log('Extras cargados:', extras.value)
      
      // Verifica que cada extra tenga unit_price
      extras.value.forEach((extra: any) => {
        console.log(`Extra ${extra.id}:`, {
          name: extra.name,
          description: extra.description,
          unit_price: extra.unit_price
        })
      })
    } catch (err: any) {
      console.error('Error al cargar extras:', err)
      error.value = err
      extras.value = []
    } finally {
      loading.value = false
    }
  }

  const submitExtra = async () => {
    try {
      if (unit_price.value === null) {
        alert('Por favor ingrese un precio')
        return
      }
      
      const newExtra = {
        name: name.value,
        description: description.value,
        unit_price: unit_price.value
      }
      const response = await extraService.createExtra(newExtra)
      console.log('Extra creado:', response.data)
      alert('Extra creado con éxito')
      
      // Limpiar formulario
      name.value = ''
      description.value = ''
      unit_price.value = null
      
      await loadExtras()
    } catch (err: any) {
      console.error('Error al crear extra:', err)
      error.value = err
      alert('Error al crear extra: ' + (err.message || ''))
    }
  }

  const deleteExtraById = async (extra: any) => {
    try {
      if (!confirm(`¿Está seguro de eliminar el extra "${extra.name}"?`)) {
        return
      }
      
      await extraService.deleteExtra(extra.id)
      alert('Extra eliminado correctamente')
      await loadExtras()
    } catch (err: any) {
      console.error('Error al eliminar extra:', err)
      alert('Error al eliminar extra: ' + (err.message || ''))
    }
  }

  return {
    name,
    description,
    unit_price,
    extras,
    loading,
    error,
    loadExtras,
    submitExtra,
    deleteExtraById
  }
}