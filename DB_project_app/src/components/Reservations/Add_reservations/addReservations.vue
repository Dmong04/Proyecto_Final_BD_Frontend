<template>
  <div class="container mt-5">
    <div class="card shadow-lg border-0 rounded-4">
      <div class="card-header custom-header">
        <h4 class="mb-0">
          <i class="bi bi-file-earmark-plus"></i>
          {{ isEditMode ? 'Editar Reserva' : 'Agregar Reserva' }}
        </h4>
      </div>

      <div class="card-body">
        <form @submit.prevent="submit">
          <div class="details row mb-3">
              <div class="row mt-5">
                <h2>Reservación</h2><br />
                <div class="col-md-6 mb-3">
                  <label for="fecha" class="form-label">Fecha</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-calendar-event"></i>
                    </span>
                    <input type="date" id="fecha" class="form-control" v-model="date" required />
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="hora" class="form-label">Hora</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-clock"></i>
                    </span>
                    <input type="time" id="hora" class="form-control" v-model="time" required />
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="descripcion" class="form-label">Descripción</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-pencil-square"></i>
                  </span>
                  <input type="text" id="descripcion" class="form-control" v-model="description" required />
                </div>
              </div>

              <div class="d-flex justify-content-center mt-4">
                <button type="submit" class="btn btn-dark btn-sm">
                  <i class="bi bi-save me-2"></i>
                  {{ isEditMode ? 'Actualizar' : 'Continuar' }}
                </button>
              </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ReservationComponent } from '../reservation.component';
const { date, time, description, submit, isEditMode} = ReservationComponent();
</script>
