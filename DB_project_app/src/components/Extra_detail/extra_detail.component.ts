import { ref, onMounted } from 'vue'
import extraDetailService, { type ExtraDetailData } from '@/services/extra_detail.service'
import extraService from '@/services/extra.service'
import reservationService from '@/services/reservation.service'
import type { ExtraDetail } from '@/models/extra_detail'
import type { Extra } from '@/models/extra'
import type { Reservation } from '@/models/reservation'
import { useRoute, useRouter } from 'vue-router'
import tourDetailService from '@/services/tour_detail.service'
import type { TourDetail } from '@/models/tour_detail'

export function ExtraDetailComponet() {
  const person_count = ref<number | null>(null)
  const extraId = ref<number | null>(null)
  const router = useRouter()
  const route = useRoute()
  const extraDetailId = ref<number | null>(
    route.params.id ? Number(route.params.id) : null
  )
  const isEditMode = ref(!!extraDetailId.value)
  const reservationId = ref<number | null>(null)

  const extras = ref<Extra[]>([])
  const reservations = ref<Reservation[]>([])
  const extraDetails = ref<ExtraDetail[]>([])
  const loading = ref(false)
  const error = ref(null)
  const tourDetails = ref<TourDetail[]>([])

  // Add this function to calculate passenger count correctly
  const getPassengerCountForReservation = (resId: number): number => {
    // Count passengers from tour_detail for this reservation
    const tourDetailsForRes = tourDetails.value.filter(
      td => td.reservation_id === resId || (td.reservation && td.reservation.id === resId)
    )
    
    let totalPassengers = 0
    tourDetailsForRes.forEach(td => {
      if (td.passengers && Array.isArray(td.passengers)) {
        totalPassengers += td.passengers.length
      }
    })
    
    console.log(`Passengers for reservation ${resId}:`, totalPassengers)
    return totalPassengers
  }

  const loadExtras = async () => {
    try {
      const response = await extraService.getExtras()
      
      // Normaliza los datos - asegúrate de que tenga la propiedad 'price'
      let data: any[] = []
      if (Array.isArray(response.data)) {
        data = response.data
      } else if (response.data && Array.isArray(response.data.data)) {
        data = response.data.data
      }
      
      extras.value = data.map((extra: any) => ({
        id: extra.id,
        name: extra.name || '',
        description: extra.description || '',
        price: extra.price ?? extra.unit_price ?? extra.unitPrice ?? 0
      }))
      
      console.log('Extras cargados:', extras.value)
    } catch (err) {
      console.error('Error al cargar extras:', err)
    }
  }

  const loadReservations = async () => {
    try {
      const response = await reservationService.getReservations()
      
      let data: any[] = []
      if (Array.isArray(response.data)) {
        data = response.data
      } else if (response.data && Array.isArray(response.data.data)) {
        data = response.data.data
      }
      
      reservations.value = data
      console.log('Reservaciones cargadas:', reservations.value)
    } catch (err) {
      console.error('Error al cargar reservaciones:', err)
    }
  }

  const loadExtraDetails = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await extraDetailService.getExtraDetails()
      
      let data: any[] = []
      if (Array.isArray(response.data)) {
        data = response.data
      } else if (response.data && Array.isArray(response.data.data)) {
        data = response.data.data
      }
      
      extraDetails.value = data
      console.log("Detalles Extra: ", extraDetails.value)
    } catch (err: any) {
      console.error('Error al cargar extras: ', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  const loadExtraDetailById = async (id: number) => {
    try {
      const response = await extraDetailService.getExtraDetailById(id)
      const extraDetail = response.data.data
      person_count.value = extraDetail.participants
      extraId.value = extraDetail.extra?.id ?? null
      reservationId.value = extraDetail.reservations?.id ?? null
      console.log("Detalle extra cargado para edición:", extraDetail)

      extraDetailId.value = extraDetail.id
      sessionStorage.setItem("currentExtraDetailId", extraDetail.id.toString())
    } catch (err: any) {
      console.error("Error al cargar detalle extra por ID:", err)
      alert("Error al cargar el detalle extra seleccionado.")
    }
  }

  const loadTourDetails = async () => {
    try {
      const response = await tourDetailService.getTripDetails()
      
      let data: any[] = []
      if (Array.isArray(response.data)) {
        data = response.data
      } else if (response.data && Array.isArray(response.data.data)) {
        data = response.data.data
      }
      
      tourDetails.value = data
      console.log("Tour Details cargados:", tourDetails.value)
    } catch (err) {
      console.error('Error al cargar tour details:', err)
    }
  }

  // Update validateAndLogPayload to include business logic validation
  const validateAndLogPayload = (payload: ExtraDetailData) => {
    console.log('=== PAYLOAD VALIDATION ===')
    console.log('Full payload:', JSON.stringify(payload, null, 2))
    console.log('person_count:', payload.person_count, 'Type:', typeof payload.person_count)
    console.log('extra_id:', payload.extra_id, 'Type:', typeof payload.extra_id)
    console.log('reservation_id:', payload.reservation_id, 'Type:', typeof payload.reservation_id)
    
    if (!payload.person_count || payload.person_count <= 0) {
      console.error('❌ Invalid person_count:', payload.person_count)
      return false
    }
    if (!payload.extra_id || payload.extra_id <= 0) {
      console.error('❌ Invalid extra_id:', payload.extra_id)
      return false
    }
    if (!payload.reservation_id || payload.reservation_id <= 0) {
      console.error('❌ Invalid reservation_id:', payload.reservation_id)
      return false
    }

    // Validate that participants don't exceed reservation passengers
    const passengerCount = getPassengerCountForReservation(payload.reservation_id)
    console.log('Passenger count for reservation:', passengerCount)
    console.log('Requested participants:', payload.person_count)
    
    if (payload.person_count > passengerCount) {
      console.error('❌ Participants exceed passenger count:', payload.person_count, '>', passengerCount)
      return false
    }

    console.log('✅ Payload validation passed')
    return true
  }

  const submitExtraDetail = async () => {
    try {
      if (!person_count.value || !extraId.value || !reservationId.value) {
        alert('Por favor completa todos los campos requeridos')
        return
      }

      const newExtraDetail: ExtraDetailData = {
        person_count: person_count.value,
        extra_id: extraId.value,
        reservation_id: reservationId.value
      }
      
      // Validate payload before sending
      if (!validateAndLogPayload(newExtraDetail)) {
        const passengerCount = getPassengerCountForReservation(reservationId.value)
        alert(`❌ Error de validación:\n\nLa cantidad de participantes (${person_count.value}) no puede superar el número de pasajeros en la reservación (${passengerCount}).`)
        return
      }

      console.log('Enviando payload:', newExtraDetail)
      const response = await extraDetailService.createExtraDetail(newExtraDetail)
      alert('Detalle del extra creado con éxito')
      console.log("Detalle extra creado: ", response.data)

      // Get the created extra detail ID from the response
      let createdExtraDetailId: number | null = null
      
      if (response.data && response.data.data && response.data.data.id) {
        createdExtraDetailId = response.data.data.id
      } else if (response.data && response.data.id) {
        createdExtraDetailId = response.data.id
      } else {
        const allExtraDetails = await extraDetailService.getExtraDetails()
        
        let allData: any[] = []
        if (Array.isArray(allExtraDetails.data)) {
          allData = allExtraDetails.data
        } else if (allExtraDetails.data && Array.isArray(allExtraDetails.data.data)) {
          allData = allExtraDetails.data.data
        }
        
        const relatedExtraDetails = allData.filter(
          (ed: any) => ed.reservations && ed.reservations.id === reservationId.value
        )

        if (relatedExtraDetails.length === 0) {
          console.error("No se encontró ningún detalle extra para la reservación.")
          return
        }

        const lastExtraDetail = relatedExtraDetails[relatedExtraDetails.length - 1]
        createdExtraDetailId = lastExtraDetail.id
      }

      if (!createdExtraDetailId) {
        console.error("No se pudo obtener el ID del detalle extra creado.")
        return
      }

      sessionStorage.setItem("currentExtraDetailId", createdExtraDetailId.toString())
      router.push(`/detalles_tour/next/${reservationId.value}/${createdExtraDetailId}`)
    } catch (err: any) {
      console.error('❌ Error al enviar el detalle extra: ', err)
      console.error('Response status:', err.response?.status)
      console.error('Response data:', err.response?.data)
      console.error('Error message:', err.message)
      error.value = err
      alert('Error al crear el detalle extra: ' + (err.response?.data?.message || err.message || 'Error desconocido'))
    }
  }

  const updateExtraDetail = async (id: number) => {
    try {
      if (!person_count.value || !extraId.value || !reservationId.value) {
        alert('Por favor completa todos los campos requeridos')
        return
      }

      const updatedExtraDetail: ExtraDetailData = {
        person_count: person_count.value,
        extra_id: extraId.value,
        reservation_id: reservationId.value
      }
      
      await extraDetailService.updateExtraDetail(id, updatedExtraDetail)
      alert('Detalle extra actualizado con éxito')

      if (extraDetailId.value) {
        sessionStorage.setItem("currentExtraDetailId", extraDetailId.value.toString())
      }

      const cameFromTourDetail = sessionStorage.getItem("returnFromTourDetail")
      const returnExtraDetailId = sessionStorage.getItem("returnToExtraDetailId")

      if (cameFromTourDetail && returnExtraDetailId) {
        console.log("Redirigiendo de nuevo a Tour Detail...")
        sessionStorage.removeItem("returnFromTourDetail")
        sessionStorage.removeItem("returnToExtraDetailId")
        sessionStorage.removeItem("currentExtraDetailId")

        router.push(`/detalles_tour/add/${returnExtraDetailId}`)
        return
      }

      sessionStorage.removeItem("currentExtraDetailId")
      router.push("/extra_details")
    } catch (err: any) {
      console.error('Error al actualizar detalle extra:', err)
      error.value = err
      alert('Error al actualizar detalle extra: ' + (err.message || ''))
    }
  }

  const deleteExtraDetailById = async (extraDetail: any) => {
    try {
      await extraDetailService.deleteExtraDetail(extraDetail.id)
      alert('Detalle extra eliminado correctamente')
      await loadExtraDetails()
    } catch (err: any) {
      console.error('Error al eliminar detalle extra:', err)
      alert('Error al eliminar detalle extra: ' + (err.message || ''))
    }
  }

  const goBackToEdit = () => {
    if (reservationId.value) {
      sessionStorage.setItem("returnToReservationId", reservationId.value.toString())
      sessionStorage.setItem("returnFromExtraDetail", "true")
    }

    router.push({ name: 'EditReservation', params: { id: reservationId.value } })
  }

  const handleSubmit = async () => {
    if (isEditMode.value) {
      if (!extraDetailId.value) {
        console.error('No hay ID de detalle extra para actualizar.')
        return
      }
      await updateExtraDetail(extraDetailId.value)
    } else {
      await submitExtraDetail()
    }
  }

  onMounted(async () => {
    await loadExtras()
    await loadReservations()
    await loadExtraDetails()
    await loadTourDetails()

    if (route.params.reservationId) {
      reservationId.value = Number(route.params.reservationId)
      console.log("Modo agregar detalle para reserva:", reservationId.value)
    }

    if (route.params.id) {
      const id = Number(route.params.id)
      extraDetailId.value = id
      isEditMode.value = true
      await loadExtraDetailById(id)
    } else {
      const storedId = sessionStorage.getItem("currentExtraDetailId")
      if (storedId) {
        extraDetailId.value = Number(storedId)
        console.log("ID restaurado desde sessionStorage:", extraDetailId.value)
        await loadExtraDetailById(extraDetailId.value)
      }
    }

    sessionStorage.removeItem("currentExtraDetailId")
    sessionStorage.removeItem("returnFromTourDetail")
    sessionStorage.removeItem("returnToExtraDetailId")
  })

  return {
    person_count,
    extraId,
    reservationId,
    extras,
    reservations,
    extraDetails,
    loading,
    error,
    isEditMode,
    reload: loadExtraDetails,
    submit: handleSubmit,
    deleteExtraDetailById,
    goBackToEdit,
    getPassengerCountForReservation
  }
}