import { ref, onMounted } from 'vue'
import tourDetailService, { type TripDetailData } from '@/services/tour_detail.service'
import tourService from '@/services/tour.service'
import reservationService from '@/services/reservation.service'
import type { TourDetail } from '@/models/tour_detail'
import type { Tour } from '@/models/tour'
import type { Reservation } from '@/models/reservation'
import { useRoute, useRouter } from 'vue-router'

export function TourDetailComponet() {
  const origin = ref('')
  const destination = ref('')
  const tourId = ref<number | null>(null)
  const reservationId = ref<number | null>(null)
  const router = useRouter()
  const route = useRoute()
  const tourDetailId = ref<number | null>(
  route.params.id ? Number(route.params.id) : null
  )
  const isEditMode = ref(!!tourDetailId.value)

  const extraDetailId = ref<number | null>(
    route.params.createdExtraDetailId ? Number(route.params.createdExtraDetailId) : null
  )
  const tours = ref<Tour[]>([])
  const reservations = ref<Reservation[]>([])
  const tourDetails = ref<TourDetail[]>([])
  const loading = ref(false)
  const error = ref(null)

  const loadTours = async () => {
    try {
      const response = await tourService.getTours()
      tours.value = response.data.data
      console.log('Tours cargados:', tours.value)
    } catch (err) {
      console.error('Error al cargar tours:', err)
    }
  }

  const loadReservations = async () => {
    try {
      const response = await reservationService.getReservations()
      reservations.value = response.data.data
      console.log('Reservaciones cargadas:', reservations.value)
    } catch (err) {
      console.error('Error al cargar reservaciones:', err)
    }
  }

  const loadTourDetails = async () => {
      loading.value = true
      error.value = null

      try {
          const response = await tourDetailService.getTripDetails()
          tourDetails.value = response.data.data
          console.log("Detalles Tour: ", tourDetails.value)
      } catch (err: any) {
          console.error('Error al cargar tours: ', err)
          error.value = err
      } finally {
          loading.value = false
      }
  }

  const loadTourDetailById = async (id: number) => {
    try {
      const response = await tourDetailService.getTripDetailById(id)
      const tourDetail = response.data.data
      origin.value = tourDetail.origin
      destination.value = tourDetail.destination
      tourId.value = tourDetail.tour?.id || tourDetail.tour || null
      reservationId.value = tourDetail.reservations?.id || tourDetail.reservations || null
      console.log("Detalle de tour cargado para edición:", tourDetail)
    } catch (err: any) {
      console.error("Error al cargar detalle de tour por ID:", err)
      alert("Error al cargar el detalle de tour seleccionado.")
    }
  }

  const submitTourDetail = async () => {
    try {
      const newTourDetail: TripDetailData = {
        origin: origin.value,
        destination: destination.value,
        tour: tourId.value!,
        reservations: reservationId.value!
      }
      const response = await tourDetailService.createTripDetail(newTourDetail)
      console.log(origin)
      console.log(destination)
      console.log(tourId)
      console.log(reservationId)
      alert('Detalle del tour creado con éxito')
      console.log("Detalle tour creado: ", response.data)

      const allTourDetails = await tourDetailService.getTripDetails()
      const relatedTourDetails = allTourDetails.data.data.filter(
        (td: any) => td.reservations && td.reservations.id === reservationId.value
      )

      if (relatedTourDetails.length === 0) {
        console.error("No se encontró ningún tour detail para la reservación.")
        return
      }

      const lastTourDetail = relatedTourDetails[relatedTourDetails.length - 1]
      const createdTourDetailId = lastTourDetail.id

      router.push(`/passengers/next/${reservationId.value}/${createdTourDetailId}`)
    } catch (err: any) {
      console.error('Error al enviar el detalle tour: ', err)
      error.value = err
      alert('Error al crear el detalle tour' + (err.message ? ': ' + err.message : ''))
    }
  }

  const updateTourDetail = async (id: number) => {
    try {
      const updatedTourDetail: TripDetailData = {
        origin: origin.value,
        destination: destination.value,
        tour: tourId.value!,
        reservations: reservationId.value!
      }
      await tourDetailService.updateTripDetail(id, updatedTourDetail)
      alert('Detalle de tour actualizado con éxito')

            // Guardar el ID actual del tour detail en sessionStorage
      if (tourDetailId.value) {
        sessionStorage.setItem("currentTourDetailId", tourDetailId.value.toString());
      }

      // ✅ Verificamos si el usuario venía desde extra detail
      const cameFromPassenger = sessionStorage.getItem("returnFromPassenger");
      const returnTourDetailId = sessionStorage.getItem("returnToTourDetailId");

      if (cameFromPassenger && returnTourDetailId) {
        console.log("Redirigiendo de nuevo a Passenger...");
        sessionStorage.removeItem("returnFromPassenger");
        sessionStorage.removeItem("returnToTourDetailId");

        router.push(`/passengers/add/${returnTourDetailId}`);
        return;
      }
      // Si no venía de Extra Detail, vuelve al listado normal
      router.push('/detalles_tour')

    } catch (err: any) {
      console.error('Error al actualizar detalle de tour:', err)
      error.value = err
      alert('Error al actualizar detalle de tour: ' + (err.message || ''))
    }
  }

  const deleteTourDetailById = async (tourDetail: any) => {
    try {
      await tourDetailService.deleteTripDetail(tourDetail.id)
      alert(`Detalle del tour con ID ${tourDetail.id} eliminado con éxito`)
      console.log(`Detalle del tour con ID ${tourDetail.id} eliminado`)
      await loadTourDetails()
    } catch (err: any) {
      console.error('Error al eliminar el detalle del tour: ', err)
      alert('Error al eliminar el detalle del tour' + (err.message ? ': ' + err.message : ''))
    }
  }

  const goBackToEdit = () => {
    // Guardamos el ID de reserva y el contexto
    if (extraDetailId.value) {
      sessionStorage.setItem("returnFromExtraDetail", extraDetailId.value.toString());
      sessionStorage.setItem("returnFromTourDetail", "true");
    }

    router.push({ name: 'edit_extra_detail', params: { id: extraDetailId.value } });
  }

  const handleSubmit = async () => {
    if (isEditMode.value) {
      if (!tourDetailId.value) {
        console.error('No hay ID de tourDetail para actualizar.')
        return
      }
      await updateTourDetail(tourDetailId.value)

    } else {
      await submitTourDetail()
    }
  }

  onMounted(async () => {
    loadTours()
    loadReservations()
    loadTourDetails()

    if (route.params.reservationId) {
      reservationId.value = Number(route.params.reservationId)
      console.log("Modo agregar detalle para reserva:", reservationId.value)
    }

    if (route.params.id) {
      const tourDetailId = Number(route.params.id)
      isEditMode.value = true
      await loadTourDetailById(tourDetailId)
    }
  })

  return {
    origin,
    destination,
    tourId,
    reservationId,
    tours,
    reservations,
    tourDetails,
    loading,
    error,
    isEditMode,
    reload: loadTourDetails,
    submit: handleSubmit,
    deleteTourDetailById,
    goBackToEdit
  }

}
