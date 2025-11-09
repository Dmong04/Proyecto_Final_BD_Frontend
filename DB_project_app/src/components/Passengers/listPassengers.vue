<template>
  <div class="container mt-4">
    <h2>Lista Pasajeros</h2>

    <div v-if="loading" class="alert alert-info">Cargando Pasajeros...</div>
    <div v-if="error" class="alert alert-danger">Error al cargar Pasajeros.</div>

    <div v-else-if="!passengers.length" class="alert alert-info" role="alert">
      <i class="bi bi-info-circle me-2"></i>No hay pasajeros disponibles
    </div>

    <div v-else>
      <div class="mb-3">
        <p class="text-muted">Total de pasajeros: {{ passengers.length }}</p>
      </div>

      <table class="table table-striped">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Detalle del Tour</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="passenger in paginatedPassenger" :key="passenger.id">
            <td>{{ passenger.id }}</td>
            <td>{{ passenger.name }}</td>
            <td>{{ passenger.age }}</td>
            <td>{{ passenger.tour_detail?.origin || '-' }}</td>
            <td>
              <button
                class="btn btn-sm btn-primary me-2"
                @click="$router.push(`/passengers/edit/${passenger.id}`)"
                title="Editar"
              >
                <i class="bi bi-pencil"></i>
              </button>

              <button class="btn btn-sm btn-danger"  title="Eliminar" @click="deletePassenger(passenger)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <nav v-if="pageCount > 1" aria-label="">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }" @click="changePage(currentPage - 1)">
            <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Anterior</a>
          </li>

          <li v-for="page in pageCount" :key="page" class="page-item" :class="{ active: currentPage === page }"
            @click="changePage(page)">
            <a class="page-link" href="#">{{ page }}</a>
          </li>

          <li class="page-item" :class="{ disabled: currentPage === pageCount }" @click="changePage(currentPage + 1)">
            <a class="page-link" href="#">Siguiente</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PassengerComponent } from '../Passengers/passenger.component'

const { passengers, loading, error, deletePassengerById } = PassengerComponent()

const currentPage = ref(1)
const pageSize = 10

const pageCount = computed(() => Math.ceil((passengers.value?.length || 0) / pageSize))

const paginatedPassenger = computed(() => {
const start = (currentPage.value - 1) * pageSize
return (passengers.value || []).slice(start, start + pageSize)
})

function changePage(page: number) {
if (page < 1) page = 1
if (page > pageCount.value) page = pageCount.value
currentPage.value = page
}

async function deletePassenger(passenger: any) {
  const confirmed = confirm(`¿Seguro que deseas eliminar el detalle extra con ID ${passenger.id}?`)
  if (confirmed) {
    await deletePassengerById(passenger)
  }
}
</script>
