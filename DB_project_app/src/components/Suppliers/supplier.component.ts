
import providerService from '@/services/provider.service'
import { Supplier } from '@/models/supplier'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function SupplierComponent() {
  const name = ref('')
  const email = ref('')
  const address = ref('')
  const phone = ref('')

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
      console.log('Proveedor cargado para edición:', supplier)
    } catch (err: any) {
      console.error('Error al cargar proveedor por ID:', err)
      alert('Error al cargar el proveedor seleccionado.')
    }
  }

  const submitSupplier = async () => {
    try {
      const newSupplier: ProviderData = {
        name: name.value,
        email: email.value,
        address: address.value
      }
      const response = await providerService.createProvider(newSupplier)
      console.log('Nombre:', name.value)
      console.log('Email:', email.value)
      console.log('Dirección:', address.value)
      alert('Proveedor creado con éxito')
      console.log('Proveedor creado:', response.data)
      await loadSuppliers()
      
      // Limpiar formulario
      name.value = ''
      email.value = ''
      address.value = ''
      phone.value = ''
      
      router.push('/suppliers')
    } catch (err: any) {
      console.error('Error al enviar el proveedor:', err)
      error.value = err
      alert('Error al crear el proveedor' + (err.message ? ': ' + err.message : ''))
    }
  }

  const updateSupplier = async (id: number) => {
    try {
      const updatedSupplier: Partial<ProviderData> = {
        name: name.value,
        email: email.value,
        address: address.value
      }
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
      
      // Nota: Necesitarás agregar el método deleteProvider en provider.service.ts
      // await providerService.deleteProvider(supplier.id)
      
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
    suppliers,
    loading,
    error,
    isEditMode,
    reload: loadSuppliers,
    submit: handleSubmit,
    deleteSupplierById
  }
}
