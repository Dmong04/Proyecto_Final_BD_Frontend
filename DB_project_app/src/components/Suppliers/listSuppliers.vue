<template>
  <div class="container mt-5">
    <div class="card shadow-lg">
      <div class="card-header custom-header text-center">
        <h2 class="mb-0">Lista de Proveedores</h2>
      </div>
      <div class="card-body">
        <div class="d-flex justify-content-between mb-3">
          <button @click="reload" class="btn btn-secondary">
            <i class="bi bi-arrow-clockwise"></i> Recargar
          </button>
          <router-link to="/suppliers/add" class="btn btn-primary">
            <i class="bi bi-plus-circle"></i> Agregar Proveedor
          </router-link>
        </div>

        <div v-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>

        <div v-else-if="error" class="alert alert-danger">
          Error al cargar proveedores: {{ error }}
        </div>

        <div v-else-if="suppliers.length === 0" class="alert alert-info">
          No hay proveedores registrados
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover table-striped">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Dirección</th>
                <th>Teléfonos</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="supplier in suppliers" :key="supplier.id">
                <td>{{ supplier.id }}</td>
                <td>{{ supplier.name }}</td>
                <td>{{ supplier.email }}</td>
                <td>{{ supplier.address }}</td>
                <td>
                  <span v-if="supplier.phones && supplier.phones.length > 0">
                    <span v-for="(phone, index) in supplier.phones" :key="phone.id">
                      {{ phone.phone }}<span v-if="index < supplier.phones.length - 1">, </span>
                    </span>
                  </span>
                  <span v-else class="text-muted">Sin teléfonos</span>
                </td>
                <td class="text-center">
                  <router-link 
                    :to="`/suppliers/edit/${supplier.id}`" 
                    class="btn btn-sm btn-warning me-2"
                  >
                    <i class="bi bi-pencil"></i> Editar
                  </router-link>
                  <button 
                    @click="deleteSupplierById(supplier)" 
                    class="btn btn-sm btn-danger"
                  >
                    <i class="bi bi-trash"></i> Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SupplierComponent } from './supplier.component'

const {
  suppliers,
  loading,
  error,
  reload,
  deleteSupplierById
} = SupplierComponent()
</script>

<style scoped>
.custom-header {
  background: linear-gradient(135deg, #022135 0%, #054e80 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 0.5rem 0.5rem 0 0;
}

.card {
  border: none;
  border-radius: 0.5rem;
}

.table {
  margin-bottom: 0;
}

.table thead th {
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>