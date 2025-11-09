<template>
  <div class="container mt-4">
    <h2>Lista de Detalles Extras</h2>

    <div v-if="loading" class="alert alert-info">Cargando detalles...</div>
    <div v-if="error" class="alert alert-danger">Error al cargar detalles.</div>

    <div v-else-if="!extraDetails.length" class="alert alert-info" role="alert">
      <i class="bi bi-info-circle me-2"></i>No hay detalles extras disponibles
    </div>

    <div v-else>
      <div class="mb-3">
        <p class="text-muted">Total de detalles extras: {{ extraDetails.length }}</p>
      </div>

      <table class="table table-striped">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Cantidad de personas</th>
            <th>Precio total</th>
            <th>Extra</th>
            <th>Reservacion</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="extra_detail in paginatedExtraDetail" :key="extra_detail.id">
            <td>{{ extra_detail.id }}</td>
            <td>{{ extra_detail.participants }}</td>
            <td>{{ '$' + extra_detail.price }}</td>
            <td>{{ extra_detail.extra?.name || '-' }}</td>
            <td>{{ extra_detail.reservations?.date || '-' }}</td>
            <td>
              <button
                class="btn btn-sm btn-primary me-2"
                @click="$router.push(`/detalles_extra/edit/${extra_detail.id}`)"
                title="Editar"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-danger"  title="Eliminar" @click="deleteExtraDetail(extra_detail)">
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
import { ExtraDetailComponet } from '../Extra_detail/extra_detail.component'

const { extraDetails, loading, error, deleteExtraDetailById } = ExtraDetailComponet()

const currentPage = ref(1)
const pageSize = 10

const pageCount = computed(() => Math.ceil((extraDetails.value?.length || 0) / pageSize))

const paginatedExtraDetail = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return (extraDetails.value || []).slice(start, start + pageSize)
})

function changePage(page: number) {
  if (page < 1) page = 1
  if (page > pageCount.value) page = pageCount.value
  currentPage.value = page
}

async function deleteExtraDetail(extraDetail: any) {
  const confirmed = confirm(`¿Seguro que deseas eliminar el detalle extra con ID ${extraDetail.id}?`)
  if (confirmed) {
    await deleteExtraDetailById(extraDetail)
  }
}

</script>
