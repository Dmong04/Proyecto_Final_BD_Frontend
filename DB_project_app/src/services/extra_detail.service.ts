import api from '@/api/api'

export interface ExtraDetailData {
  participants: number
  extra: number
  reservations: number
}

export default {
  getExtraDetails() {
    return api.get('/extra_details/all')
  },

  createExtraDetail(data: ExtraDetailData) {
    return api.post('/extra_details', data)
  },

  updateExtraDetail(id: number, updatedData: Partial<ExtraDetailData>) {
    return api.put(`/extra_details/${id}`, updatedData)
  },

  getExtraDetailById(id: number) {
    return api.get(`/extra_details/${id}`)
  },

  deleteExtraDetail(id: number) {
    return api.delete(`/extra_details/${id}`)
  }
}
