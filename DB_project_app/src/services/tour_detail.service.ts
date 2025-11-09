import api from '@/api/api'

export interface TripDetailData {
  origin: string
  destination: string
  tour: number
  reservations: number
}

export default {
  getTripDetails() {
    return api.get('/tour_details/all')
  },

  createTripDetail(data: TripDetailData) {
    return api.post('/tour_details', data)
  },

  updateTripDetail(id: number, updatedData: Partial<TripDetailData>) {
    return api.put(`/tour_details/${id}`, updatedData)
  },

  getTripDetailById(id: number) {
    return api.get(`/tour_details/${id}`)
  },

  deleteTripDetail(id: number) {
    return api.delete(`/tour_details/${id}`)
  }
}
