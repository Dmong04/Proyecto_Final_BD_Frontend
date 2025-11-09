<template>
  <div class="container mt-5">
    <div class="card shadow-lg border-0 rounded-4">
      <div class="card-header custom-header">
        <h4 class="mb-0">
          <i class="bi bi-file-earmark-plus"></i>
          {{ isEditMode ? 'Editar Pasajero' : 'Agregar Pasajero' }}
        </h4>
      </div>

      <div class="card-body">
        <form @submit.prevent="submit">
          <div class="row mb-3">
            <div class="col-md-6 mb-3">
              <label for="name" class="form-label">Nombre</label>
              <input type="text" id="name" class="form-control" v-model="name" required />
            </div>

            <div class="col-md-6 mb-3">
              <label for="age" class="form-label">Edad</label>
              <input type="number" id="age" class="form-control" v-model="age" required />
            </div>

            <div class="col-md-6 mb-3">
              <label for="tour_detail" class="form-label">Detalle del Tour</label>
              <select id="tour_detail" class="form-select" v-model="tourDetailId" required>
                <option disabled value="">Seleccione el detalle del tour</option>
                <option v-for="tour in tourDetails" :key="tour.id" :value="tour.id">
                  {{ tour.origin }} - {{ tour.destination }}
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
import { PassengerComponent } from '../Passengers/passenger.component'
const { name, age, tourDetailId, tourDetails, submit, isEditMode, goBackToEdit } = PassengerComponent()
</script>
