import { ref, onMounted } from 'vue'
import reservationService, { type ReservationData } from '@/services/reservation.service'
import type { Reservation } from '@/models/reservation'

export function ReservationComponent() {
  const date = ref('')
  const time = ref('')
  const description = ref('')
  const userId = Number(sessionStorage.getItem("USER_ID")) // Reemplaza con el ID del usuario actual

  const reservations = ref<Reservation[]>([])
  const loading = ref(false)
  const error = ref(null)


  const loadTours = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await reservationService.getReservations()
      reservations.value = response.data.data
      console.log("Reservas: ", reservations.value)
    } catch (err: any) {
      console.error('Error al cargar reservas: ', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  const submitReservation = async () => {
    try {
      const newReservation: ReservationData = {
        date: date.value,
        time: time.value,
        description: description.value,
        user: { id: userId }
      }
      const response = await reservationService.createReservation(newReservation)
      console.log(date)
      console.log(time)
      console.log(description)
      console.log(userId)
    alert('Reserva creada con éxito')
    console.log("Reserva creada: ", response.data)
    await loadTours()
    } catch (err: any) {
      console.error('Error al enviar la reserva: ', err)
      error.value = err
      alert('Error al crear la reserva' + (err.message ? ': ' + err.message : ''))
    }
  }

  onMounted(() => {
    loadTours()
  })

  return {
    date,
    time,
    description,
    userId,
    reservations,
    loading,
    error,
    reload: loadTours,
    submit: submitReservation
  }
}