import api from '@/api/api'

export interface ReservationData {
  date: string
  time: string
  description: string  
  user: { id: number }
}

export default {
  getReservations() {
    return api.get('/reservation/all')
  },

  createReservation(reservationData: ReservationData) {
    return api.post('/reservation', reservationData)
  },

  updateReservation(id: number, updatedData: Partial<ReservationData>) {
    return api.put(`/reservation/${id}`, updatedData)
  },

  getReservtaionById(id: number) {
    return api.get(`/reservation/${id}`)
  },
}
