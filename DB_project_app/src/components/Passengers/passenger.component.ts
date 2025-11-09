import { ref, onMounted } from 'vue'
import passengerService, { type PassengerData } from '@/services/passenger.service'
import tourDetailService from '@/services/tour_detail.service'
import type { TourDetail } from '@/models/tour_detail'
import type { Passenger } from '@/models/passenger'
import { useRoute, useRouter } from 'vue-router'

export function PassengerComponent() {
  const route = useRoute()
  const name = ref('')
  const age = ref<number | null>(null)
  const tourDetailId = ref<number | null>(
    route.params.createdTourDetailId ? Number(route.params.createdTourDetailId) : null
  )
  const tourDetails = ref<TourDetail[]>([])
  const passengers = ref<Passenger[]>([])
  const loading = ref(false)
  const error = ref(null)


  const passengerId = Number(route.params.id)
  const isEditMode = ref(!!passengerId)

  const router = useRouter()

  const loadTourDetails = async () => {
    try {
        const response = await tourDetailService.getTripDetails()
        tourDetails.value = response.data.data
        console.log("Detalles Tour: ", tourDetails.value)
    } catch (err) {
        console.error('Error al cargar tours: ', err)
    }
  }

  const loadPassengers = async () => {
    loading.value = true
    error.value = null

    try {
        const response = await passengerService.getPassengers()
        passengers.value = response.data.data
        console.log("Pasajeros: ", passengers.value)
    } catch (err: any) {
        console.error('Error al cargar pasajeros: ', err)
        error.value = err
    } finally {
        loading.value = false
    }
  }

  const loadPassengerById = async (id: number) => {
    try {
      const response = await passengerService.getPassengerById(id)
      const passenger = response.data.data
      name.value = passenger.name
      age.value = passenger.age
      tourDetailId.value = passenger.tour_detail?.id || passenger.tour_detail || null
      console.log("Pasajero cargado para edición:", passenger)
    } catch (err: any) {
      console.error("Error al cargar pasajero por ID:", err)
      alert("Error al cargar el pasajero seleccionado.")
    }
  }

  const submitPassenger = async () => {
    try {
      const newPassenger: PassengerData = {
        name: name.value,
        age: age.value!,
        tour_detail: tourDetailId.value!,
      }
      const response = await passengerService.createPassenger(newPassenger)
      console.log(name)
      console.log(age)
      console.log(tourDetailId)
      alert('Pasajero creado con éxito')
      console.log("Pasajero creado: ", response.data)

      if (response.data && response.data.id) {
        tourDetailId.value = response.data.id
      }

    } catch (err: any) {
      console.error('Error al enviar el Pasajero: ', err)
      error.value = err
      alert('Error al crear el Pasajero' + (err.message ? ': ' + err.message : ''))
    }
  }

  const updatePassenger = async (id: number) => {
    try {
      const updatedPassenger: PassengerData = {
        name: name.value,
        age: age.value!,
        tour_detail: tourDetailId.value!,
      }
      await passengerService.updatePassenger(id, updatedPassenger)
      alert('Pasajero actualizado con éxito')
      await loadPassengers()
    } catch (err: any) {
      console.error('Error al actualizar pasajero:', err)
      error.value = err
      alert('Error al actualizar pasajero: ' + (err.message || ''))
    }
  }

  const deletePassengerById = async (passenger: any) => {
    try {
      await passengerService.deletePassenger(passenger.id)
      alert('Pasajero eliminado con éxito')
      console.log("Pasajero eliminado: ", passenger.id)
      await loadPassengers()
    } catch (err: any) {
      console.error('Error al eliminar el Pasajero: ', err)
      error.value = err
      alert('Error al eliminar el Pasajero' + (err.message ? ': ' + err.message : ''))
    }
  }

  const goBackToEdit = () => {
    router.push({ name: 'edit_tour_detail', params: { id: tourDetailId.value } })
  }

  const handleSubmit = async () => {
    if (isEditMode.value) {
      await updatePassenger(passengerId)
      router.push('/passengers')
    } else {
      await submitPassenger()
      alert('La creacion de la reserva ha finalizado con exito')
      router.push('/reservation')
    }
  }

  onMounted(async () => {
    loadTourDetails()
    loadPassengers()

    if (route.params.tourDetailId) {
      tourDetailId.value = Number(route.params.tourDetailId)
      console.log("Modo agregar detalle para tour:", tourDetailId.value)
    }

    if (route.params.id) {
      const passengerId = Number(route.params.id)
      isEditMode.value = true
      await loadPassengerById(passengerId)
    }
  })

  return {
    name,
    age,
    tourDetailId,
    tourDetails,
    passengers,
    loading,
    error,
    isEditMode,
    reload: loadPassengers,
    loadPassengerById,
    submit: handleSubmit,
    updatePassenger,
    deletePassengerById,
    goBackToEdit
  }

}
