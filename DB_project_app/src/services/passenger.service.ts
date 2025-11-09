import api from '@/api/api'

export interface PassengerData {
  name: string
  age: number
  tour_detail: number
}

export default {
  getPassengers() {
    return api.get('/passengers/all')
  },

  createPassenger(data: PassengerData) {
    return api.post('/passengers', data)
  },

  updatePassenger(id: number, updatedData: Partial<PassengerData>) {
    return api.put(`/passengers/${id}`, updatedData)
  },

  getPassengerById(id: number) {
    return api.get(`/passengers/${id}`)
  },
  deletePassenger(id: number) {
    return api.delete(`/passengers/${id}`)
  }
}
