
import api from '@/api/api'

export interface ExtraDetailData {
  person_count: number     
  extra_id: number         
  reservation_id: number   
}

export default {
  getExtraDetails() {
    return api.get('/extra_details/all')
  },

  createExtraDetail(data: ExtraDetailData) {
    console.log('Service: Creating extra detail with:', data)
    return api.post('/extra_details', data)
      .catch(error => {
        console.error('Service error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        })
        throw error
      })
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
