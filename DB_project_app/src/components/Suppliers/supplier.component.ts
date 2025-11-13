
import providerService from '@/services/provider.service'
import { Supplier } from '@/models/supplier'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function SupplierComponent() {
  const name = ref('')
  const email = ref('')
  const address = ref('')
  const phone = ref('')
  const description = ref('')

  const suppliers = ref<Supplier[]>([])
  const loading = ref(false)
  const error = ref(null)
  
  const router = useRouter()
  const route = useRoute()
  const supplierId = ref<number | null>(
    route.params.id ? Number(route.params.id) : null
  )
  const isEditMode = ref(!!supplierId.value)

  const loadSuppliers = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await providerService.getProviders()
      suppliers.value = response.data.data
      console.log('Proveedores cargados:', suppliers.value)
    } catch (err: any) {
      console.error('Error al cargar proveedores:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  const loadSupplierById = async (id: number) => {
    try {
      const response = await providerService.getProviderById(id)
      const supplier = response.data.data
      name.value = supplier.name
      email.value = supplier.email
      address.value = supplier.address
      phone.value = supplier.phone || ''
      description.value = supplier.description || ''
      console.log('Proveedor cargado para edición:', supplier)
    } catch (err: any) {
      console.error('Error al cargar proveedor por ID:', err)
      alert('Error al cargar el proveedor seleccionado.')
    }
  }

  const submitSupplier = async () => {
    try {
      if (!name.value || !email.value || !address.value || !description.value || !phone.value) {
        alert('Por favor completa todos los campos requeridos')
        return
      }

      // Validar que el teléfono tenga exactamente 8 dígitos
      if (!/^\d{8}$/.test(phone.value)) {
        alert('El teléfono debe contener exactamente 8 dígitos')
        return
      }

      const newSupplier = {
        name: name.value,
        description: description.value,
        email: email.value,
        phone: phone.value
      }

      console.log('=== SUPPLIER PAYLOAD ===')
      console.log('Enviando proveedor:', JSON.stringify(newSupplier, null, 2))

      const response = await providerService.createProvider(newSupplier)
      
      console.log('✅ Respuesta del servidor:', response.data)
      alert('Proveedor guardado con éxito')
      
      // Limpiar campos
      name.value = ''
      email.value = ''
      address.value = ''
      description.value = ''
      phone.value = ''
      
      // Recargar lista y redirigir
      await loadSuppliers()
      router.push('/suppliers')
      
    } catch (error: any) {
      console.error('❌ Error al enviar el proveedor:', error)
      console.error('Status:', error.response?.status)
      console.error('Status Text:', error.response?.statusText)
      console.error('Response Data:', error.response?.data)
      console.error('Error Message:', error.message)
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Error desconocido'
      
      alert(`❌ Error al guardar el proveedor:\n\n${errorMessage}`)
    }
  }

  const updateSupplier = async (id: number) => {
    try {
      if (!name.value || !email.value || !address.value || !description.value || !phone.value) {
        alert('Por favor completa todos los campos requeridos')
        return
      }

      if (!/^\d{8}$/.test(phone.value)) {
        alert('El teléfono debe contener exactamente 8 dígitos')
        return
      }

      const updatedSupplier = {
        name: name.value,
        description: description.value,
        email: email.value,
        phone: phone.value
      }

      console.log('=== UPDATE SUPPLIER PAYLOAD ===')
      console.log('Actualizando proveedor:', JSON.stringify(updatedSupplier, null, 2))

      await providerService.updateProvider(id, updatedSupplier)
      alert('Proveedor actualizado con éxito')
      await loadSuppliers()
      router.push('/suppliers')
    } catch (err: any) {
      console.error('Error al actualizar proveedor:', err)
      error.value = err
      alert('Error al actualizar proveedor: ' + (err.message || ''))
    }
  }

  const deleteSupplierById = async (supplier: any) => {
    try {
      if (!confirm(`¿Está seguro de eliminar el proveedor "${supplier.name}"?`)) {
        return
      }
      
      await providerService.deleteProvider(supplier.id)
      alert('Proveedor eliminado correctamente')
      await loadSuppliers()
    } catch (err: any) {
      console.error('Error al eliminar proveedor:', err)
      alert('Error al eliminar proveedor: ' + (err.message || ''))
    }
  }

  const handleSubmit = async () => {
    if (isEditMode.value && supplierId.value) {
      await updateSupplier(supplierId.value)
    } else {
      await submitSupplier()
    }
  }

  onMounted(async () => {
    await loadSuppliers()
    
    if (supplierId.value) {
      await loadSupplierById(supplierId.value)
    }
  })

  return {
    name,
    email,
    address,
    phone,
    description,
    suppliers,
    loading,
    error,
    isEditMode,
    reload: loadSuppliers,
    submit: handleSubmit,
    deleteSupplierById
  }
}
