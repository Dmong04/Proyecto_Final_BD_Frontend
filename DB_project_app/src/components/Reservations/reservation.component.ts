import { ref, onMounted } from 'vue'
import reservationService, { type ReservationData } from '@/services/reservation.service'
import type { Reservation } from '@/models/reservation'
import { useRoute, useRouter  } from 'vue-router'

export function ReservationComponent() {
  const date = ref('')
  const time = ref('')
  const description = ref('')
  const userId = ref(Number(sessionStorage.getItem("USER_ID"))) // Reemplaza con el ID del usuario actual

  const reservations = ref<Reservation[]>([])
  const loading = ref(false)
  const error = ref(null)

  const route = useRoute()
  const reservationId = Number(route.params.id)
  const isEditMode = ref(!!reservationId)

  const router = useRouter()


  const loadReservations = async () => {
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

  const loadReservationById = async (id: number) => {
    try {
      const response = await reservationService.getReservationById(id)
      const reservation = response.data.data
      date.value = reservation.date
      time.value = reservation.time
      description.value = reservation.description
      userId.value = reservation.user.id
      console.log("Reserva cargada para edición:", reservation)
    } catch (err: any) {
      console.error("Error al cargar reserva por ID:", err)
      alert("Error al cargar la reserva seleccionada.")
    }
  }

  const submitReservation = async () => {
    try {
      const newReservation: ReservationData = {
        date: date.value,
        time: time.value,
        description: description.value,
        user_id: userId.value
      }
      const response = await reservationService.createReservation(newReservation)
      console.log(date)
      console.log(time)
      console.log(description)
      console.log(userId)
      alert('Reserva creada con éxito')
      console.log("Reserva creada: ", response.data)


      const allReservations = await reservationService.getReservations()
      const userReservations = allReservations.data.data.filter(
        (r: any) => r.user.id === userId.value
      )
      const lastReservation = userReservations[userReservations.length - 1]
      const createdId = lastReservation.id

      router.push(`/detalles_extra/next/${createdId}`)

    } catch (err: any) {
      console.error('Error al enviar la reserva: ', err)
      error.value = err
      alert('Error al crear la reserva' + (err.message ? ': ' + err.message : ''))
    }
  }

  const updateReservation = async (id: number) => {
    try {
      const updatedReservation: ReservationData = {
        date: date.value,
        time: time.value,
        description: description.value,
        user_id: userId.value
      }
      await reservationService.updateReservation(id, updatedReservation)
      alert('Reserva actualizado con éxito')

      // ✅ Verificamos si el usuario venía desde extra detail
      const cameFromExtraDetail = sessionStorage.getItem("returnFromExtraDetail");
      const returnReservationId = sessionStorage.getItem("returnToReservationId");

      if (cameFromExtraDetail && returnReservationId) {
        console.log("Redirigiendo de nuevo a Extra Detail...");
        sessionStorage.removeItem("returnFromExtraDetail");
        sessionStorage.removeItem("returnToReservationId");

        router.push(`/detalles_extra/add/${returnReservationId}`);
        return;
      }

      // Si no venía de Extra Detail, vuelve al listado normal
      router.push("/reservation");

    } catch (err: any) {
      console.error('Error al actualizar reserva:', err)
      error.value = err
      alert('Error al actualizar reserva: ' + (err.message || ''))
    }
  }

  const deleteReservationById = async (reservation: any) => {
    try {
      await reservationService.deleteReservation(reservation.id)
      alert(`Reserva con ID ${reservation.id} eliminada con éxito`)
      console.log(`Reserva con ID ${reservation.id} eliminada`)
      await loadReservations()
    } catch (err: any) {
      console.error('Error al eliminar la reserva: ', err)
      alert('Error al eliminar la reserva' + (err.message ? ': ' + err.message : ''))
    }
  }

  const handleSubmit = async () => {
    if (isEditMode.value) {
      await updateReservation(reservationId)
    } else {
      await submitReservation()
    }
  }

  onMounted(async () => {
    loadReservations()

    if (isEditMode.value) {
      await loadReservationById(reservationId)
    }
  })

  return {
    date,
    time,
    description,
    userId,
    reservations,
    loading,
    error,
    isEditMode,
    reload: loadReservations,
    submit: handleSubmit,
    deleteReservationById,
    loadReservationById
  }
}
