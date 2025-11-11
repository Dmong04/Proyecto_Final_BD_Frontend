import api from '@/api/api'

export interface ProviderData {
  name: string
  email: string
  address: string  // Cambiado de 'description' a 'address'
}

export default {
  getProviders() {
    return api.get('/provider')
  },

  createProvider(providerData: ProviderData) {
    return api.post('/provider', providerData)
  },

  updateProvider(id: number, updatedData: Partial<ProviderData>) {
    return api.put(`/provider/${id}`, updatedData)
  },

  getProviderById(id: number) {
    return api.get(`/provider/${id}`)
  },

  deleteProvider(id: number) {
    return api.delete(`/provider/${id}`)
  }
}