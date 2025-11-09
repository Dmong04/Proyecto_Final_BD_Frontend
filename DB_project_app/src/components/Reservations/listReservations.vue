<template>
  <div class="container mt-4">
    <h2>Lista de Reservas</h2>

    <div v-if="loading" class="alert alert-info">Cargando reservas...</div>
    <div v-if="error" class="alert alert-danger">Error al cargar reservas.</div>

    <div v-else-if="!reservations.length" class="alert alert-info" role="alert">
      <i class="bi bi-info-circle me-2"></i>No hay reservas disponibles
    </div>

    <div v-else>
      <div class="mb-3">
        <p class="text-muted">Total de reservas: {{ reservations.length }}</p>
      </div>

      <table class="table table-striped">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Usuario</th>
            <th>Nombre Completo</th>
            <!--<th>Tour</th>
            <th>Extra</th>-->
            <th>Sub.Viaje</th>
            <th>Sub.Extra</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="reservation in paginatedReservations" :key="reservation.id">
            <td>{{ reservation.id }}</td>
            <td>{{ reservation.date }}</td>
            <td>{{ reservation.time }}</td>
            <td>{{ reservation.user?.username || '-' }}</td>
            <td>{{ reservation.user?.admin?.name || reservation.user?.client?.name || '-' }}</td>
            <!--<td>{{ reservation.detailTour?.tour?.type }}</td>
            <td>{{ reservation.detailExtra?.extra?.name }}</td> -->
            <td>{{ '$' + reservation.tourPrice }}</td>
            <td>{{ '$' + reservation.extraPrice }}</td>
            <td>{{ '$' + reservation.total }}</td>
            <td>
              <button
                class="btn btn-sm btn-primary me-2"
                @click="$router.push(`/reservations/edit/${reservation.id}`)"
                title="Editar"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-danger"  title="Eliminar" @click="deleteReservation(reservation)">
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
import { ReservationComponent } from './reservation.component'

const { reservations, loading, error, deleteReservationById } = ReservationComponent()

const currentPage = ref(1)
const pageSize = 10

const pageCount = computed(() => Math.ceil((reservations.value?.length || 0) / pageSize))

const paginatedReservations = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return (reservations.value || []).slice(start, start + pageSize)
})

function changePage(page: number) {
  if (page < 1) page = 1
  if (page > pageCount.value) page = pageCount.value
  currentPage.value = page
}

async function deleteReservation(reservation: any) {
  const confirmed = confirm(`¿Seguro que deseas eliminar el detalle extra con ID ${reservation.id}?`)
  if (confirmed) {
    await deleteReservationById(reservation)
  }
}
</script>
