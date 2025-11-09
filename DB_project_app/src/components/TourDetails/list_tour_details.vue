<template>
  <div class="container mt-4">
    <h2>Lista de Detalles del Tour</h2>

    <div v-if="loading" class="alert alert-info">Cargando detalles...</div>
    <div v-if="error" class="alert alert-danger">Error al cargar detalles.</div>

    <div v-else-if="!tourDetails.length" class="alert alert-info" role="alert">
      <i class="bi bi-info-circle me-2"></i>No hay detalles de tour disponibles
    </div>

    <div v-else>
      <div class="mb-3">
        <p class="text-muted">Total de detalles de tour: {{ tourDetails.length }}</p>
      </div>

      <table class="table table-striped">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Tour</th>
            <th>Reservacion</th>
            <th>Proveedor</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="tour_detail in paginatedTourDetail" :key="tour_detail.id">
            <td>{{ tour_detail.id }}</td>
            <td>{{ tour_detail.origin }}</td>
            <td>{{ tour_detail.destination }}</td>
            <td>{{ tour_detail.tour?.type || '-' }}</td>
            <td>{{ tour_detail.reservations?.date || '-' }}</td>
            <td>{{ tour_detail.provider?.name || '-' }}</td>
            <td>
              <button
                class="btn btn-sm btn-primary me-2"
                @click="$router.push(`/detalles_tour/edit/${tour_detail.id}`)"
                title="Editar"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-danger"  title="Eliminar" @click="deleteTourDetail(tour_detail)">
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
import { TourDetailComponet } from '../TourDetails/tour_detail.component'

const { tourDetails, loading, error, deleteTourDetailById } = TourDetailComponet()

const currentPage = ref(1)
const pageSize = 10

const pageCount = computed(() => Math.ceil((tourDetails.value?.length || 0) / pageSize))

const paginatedTourDetail = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return (tourDetails.value || []).slice(start, start + pageSize)
})

function changePage(page: number) {
  if (page < 1) page = 1
  if (page > pageCount.value) page = pageCount.value
  currentPage.value = page
}

async function deleteTourDetail(tour_detail: any) {
  const confirmed = confirm(`¿Seguro que deseas eliminar el detalle extra con ID ${tour_detail.id}?`)
  if (confirmed) {
    await deleteTourDetailById(tour_detail)
  }
}
</script>
