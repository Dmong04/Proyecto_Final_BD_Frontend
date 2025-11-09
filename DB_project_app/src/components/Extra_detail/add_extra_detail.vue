<template>
  <div class="container mt-5">
    <div class="card shadow-lg border-0 rounded-4">
      <div class="card-header custom-header">
        <h4 class="mb-0">
          <i class="bi bi-file-earmark-plus"></i>
          {{ isEditMode ? 'Editar Detalle de Extra' : 'Agregar Detalle de Extra' }}
        </h4>
      </div>

      <div class="card-body">
        <form @submit.prevent="submit">
          <div class="details row mb-3">
            <div class="col-md-6 mb-3">
              <label for="person_count" class="form-label">Cantidad de personas</label>
              <input type="number" id="person_count" class="form-control" v-model="person_count" required />
            </div>

            <div class="col-md-6 mb-3">
              <label for="extra" class="form-label">Extra</label>
              <select id="extra" class="form-select" v-model="extraId" required>
                <option disabled value="">Seleccione un extra</option>
                <option v-for="extra in extras" :key="extra.id" :value="extra.id">
                  {{ extra.name }}
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
import { ExtraDetailComponet } from '../Extra_detail/extra_detail.component'
const { person_count, extraId, reservationId, extras, reservations, isEditMode, submit, goBackToEdit } = ExtraDetailComponet()
</script>
