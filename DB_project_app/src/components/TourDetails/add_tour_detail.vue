<template>
  <div class="container mt-5">
    <div class="card shadow-lg border-0 rounded-4">
      <div class="card-header custom-header">
        <h4 class="mb-0">
          <i class="bi bi-file-earmark-plus"></i>
          {{ isEditMode ? 'Editar Detalle de Tour' : 'Agregar Detalle de Tour' }}
        </h4>
      </div>

      <div class="card-body">
        <form @submit.prevent="submit">
          <div class="details row mb-3">
            <div class="col-md-6 mb-3">
              <label for="origin" class="form-label">Origen</label>
              <input type="text" id="origin" class="form-control" v-model="origin" required />
            </div>

            <div class="col-md-6 mb-3">
              <label for="destination" class="form-label">Destino</label>
              <input type="text" id="destination" class="form-control" v-model="destination" required />
            </div>

            <div class="col-md-6 mb-3">
              <label for="tour" class="form-label">Tour</label>
              <select id="tour" class="form-select" v-model="tourId" required>
                <option disabled value="">Seleccione un tour</option>
                <option v-for="tour in tours" :key="tour.id" :value="tour.id">
                  {{ tour.type }}
                </option>
              </select>
            </div>

            <div class="col-md-6 mb-3">
              <label for="reservation" class="form-label">Reservación</label>
              <select id="reservation" class="form-select" v-model="reservationId" required>
                <option disabled value="">Seleccione una reservación</option>
                <option v-for="r in reservations" :key="r.id" :value="r.id">
                  {{ r.date }} - {{ r.time }} - {{ r.user?.username || '-' }}
                </option>
              </select>
            </div>

            <div class="d-flex justify-content-center mt-4">
              <button
                v-if="!isEditMode"
                type="button"
                class="btn btn-dark btn-sm me-2"
                @click="goBackToEdit"
              >
                <i class="bi bi-arrow-left"></i> Volver
              </button>

              <button type="submit" class="btn btn-dark btn-sm">
                <i class="bi bi-save me-2"></i>
                {{ isEditMode ? 'Actualizar' : 'Guardar' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TourDetailComponet } from '../TourDetails/tour_detail.component'
const { origin, destination, tourId, reservationId, tours, reservations, isEditMode, submit, goBackToEdit } = TourDetailComponet()
</script>
