
import api from '@/api/api'

export interface ProviderData {
  name: string
  description: string
  email: string
  phone: string
}

export default {
  getProviders() {
    return api.get('/supplier/all')
  },

  createProvider(providerData: ProviderData) {
    return api.post('/supplier', providerData)
  },

  updateProvider(id: number, updatedData: Partial<ProviderData>) {
    return api.put(`/supplier/${id}`, updatedData)
  },

  getProviderById(id: number) {
    return api.get(`/supplier/${id}`)
  },

  deleteProvider(id: number) {
    return api.delete(`/supplier/${id}`)
  }
}
