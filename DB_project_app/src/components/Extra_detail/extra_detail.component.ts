import { ref, onMounted, } from 'vue'
import extraDetailService, { type ExtraDetailData } from '@/services/extra_detail.service'
import extraService from '@/services/extra.service'
import reservationService from '@/services/reservation.service'
import type { ExtraDetail } from '@/models/extra_detail'
import type { Extra } from '@/models/extra'
import type { Reservation } from '@/models/reservation'
import { useRoute, useRouter } from 'vue-router'

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

  const loadExtras = async () => {
    try {
      const response = await extraService.getExtras()
      extras.value = response.data.data
      console.log('Extras cargados:', extras.value)
    } catch (err) {
      console.error('Error al cargar extras:', err)
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

  const loadExtraDetails = async () => {
      loading.value = true
      error.value = null

      try {
          const response = await extraDetailService.getExtraDetails()
          extraDetails.value = response.data.data
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

      extraDetailId.value = extraDetail.id;
      sessionStorage.setItem("currentExtraDetailId", extraDetail.id.toString());
    } catch (err: any) {
      console.error("Error al cargar detalle extra por ID:", err)
      alert("Error al cargar el detalle extra seleccionado.")
    }
  }

  const submitExtraDetail = async () => {
    try {
      const newExtraDetail: ExtraDetailData = {
        participants: person_count.value ?? 0,
        extra: extraId.value!,
        reservations: reservationId.value!
      }
      const response = await extraDetailService.createExtraDetail(newExtraDetail)
      console.log(person_count)
      console.log(extraId)
      console.log(reservationId)
      alert('Detalle del extra creado con éxito')
      console.log("Detalle extra creado: ", response.data)
      console.log("Respuesta completa del backend:", response)


      const allExtraDetails = await extraDetailService.getExtraDetails()
      const relatedExtraDetails = allExtraDetails.data.data.filter(
        (ed: any) => ed.reservations && ed.reservations.id === reservationId.value
      )

      if (relatedExtraDetails.length === 0) {
        console.error("No se encontró ningún detalle extra para la reservación.")
        return
      }

      const lastExtraDetail = relatedExtraDetails[relatedExtraDetails.length - 1]
      const createdExtraDetailId = lastExtraDetail.id


      // Guarda el ID actual antes de pasar al siguiente paso
      sessionStorage.setItem("currentExtraDetailId", createdExtraDetailId.toString());

      router.push(`/detalles_tour/next/${reservationId.value}/${createdExtraDetailId}`)
    } catch (err: any) {
      console.error('Error al enviar el detalle extra: ', err)
      error.value = err
      alert('Error al crear el detalle extra' + (err.message ? ': ' + err.message : ''))
    }
  }

  const updateExtraDetail = async (id: number) => {
    try {
      const updatedExtraDetail: ExtraDetailData = {
        participants: person_count.value ?? 0,
        extra: extraId.value!,
        reservations: reservationId.value!
      }
      await extraDetailService.updateExtraDetail(id, updatedExtraDetail)
      alert('Detalle extra actualizado con éxito')

      if (extraDetailId.value) {
        sessionStorage.setItem("currentExtraDetailId", extraDetailId.value.toString());
      }


      const cameFromTourDetail = sessionStorage.getItem("returnFromTourDetail");
      const returnExtraDetailId = sessionStorage.getItem("returnToExtraDetailId");

      if (cameFromTourDetail && returnExtraDetailId) {
        console.log("Redirigiendo de nuevo a Tour Detail...");
        sessionStorage.removeItem("returnFromTourDetail");
        sessionStorage.removeItem("returnToExtraDetailId");

        sessionStorage.removeItem("returnFromTourDetail");
        sessionStorage.removeItem("returnToExtraDetailId");
        sessionStorage.removeItem("currentExtraDetailId");

        router.push(`/detalles_tour/add/${returnExtraDetailId}`);
        return;
      }

      sessionStorage.removeItem("currentExtraDetailId");
      router.push("/extra_details");


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
    // Guardamos el ID de reserva y el contexto
    if (reservationId.value) {
      sessionStorage.setItem("returnToReservationId", reservationId.value.toString());
      sessionStorage.setItem("returnFromExtraDetail", "true");
    }

    router.push({ name: 'EditReservation', params: { id: reservationId.value } });
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
    loadExtras()
    loadReservations()
    loadExtraDetails()



    if (route.params.reservationId) {
      reservationId.value = Number(route.params.reservationId)
      console.log("Modo agregar detalle para reserva:", reservationId.value)
    }

    if (route.params.id) {
      const id = Number(route.params.id);
      extraDetailId.value = id;
      isEditMode.value = true;
      await loadExtraDetailById(id);
    } else {
      const storedId = sessionStorage.getItem("currentExtraDetailId");
      if (storedId) {
        extraDetailId.value = Number(storedId);
        console.log("ID restaurado desde sessionStorage:", extraDetailId.value);
        await loadExtraDetailById(extraDetailId.value);
      }
    }

    sessionStorage.removeItem("currentExtraDetailId");
    sessionStorage.removeItem("returnFromTourDetail");
    sessionStorage.removeItem("returnToExtraDetailId");

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
    goBackToEdit
  }

}
