
<template>
  <div class="container mt-5">
    <div class="card shadow-lg">
      <div class="card-header custom-header text-center">
        <h2 class="mb-0">{{ isEditMode ? 'Editar Proveedor' : 'Agregar Proveedor' }}</h2>
      </div>
      <div class="card-body p-4">
        <form @submit.prevent="submit">
          <!-- Nombre -->
          <div class="mb-3">
            <label for="name" class="form-label fw-bold">Nombre del Proveedor</label>
            <input
              type="text"
              class="form-control"
              id="name"
              v-model="name"
              placeholder="Ingrese el nombre del proveedor"
              required
            />
          </div>

          <!-- Email -->
          <div class="mb-3">
            <label for="email" class="form-label fw-bold">Email</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="email"
                placeholder="ejemplo@correo.com"
                required
              />
            </div>
          </div>

          <!-- Dirección -->
          <div class="mb-3">
            <label for="address" class="form-label fw-bold">Dirección</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-geo-alt"></i>
              </span>
              <textarea
                class="form-control"
                id="address"
                v-model="address"
                rows="3"
                placeholder="Ingrese la dirección del proveedor"
                required
              ></textarea>
            </div>
          </div>

          <!-- Descripción -->
          <div class="mb-3">
            <label for="description" class="form-label fw-bold">Descripción</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-file-text"></i>
              </span>
              <textarea
                class="form-control"
                id="description"
                v-model="description"
                rows="3"
                placeholder="Ingrese la descripción del proveedor"
                required
              ></textarea>
            </div>
          </div>

          <!-- Teléfono -->
          <div class="mb-3">
            <label for="phone" class="form-label fw-bold">Teléfono</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-telephone"></i>
              </span>
              <input
                type="tel"
                class="form-control"
                id="phone"
                v-model="phone"
                placeholder="Ingrese 8 dígitos"
                pattern="[0-9]{8}"
                required
              />
            </div>
          </div>

          <!-- Botones -->
          <div class="d-flex justify-content-between mt-4">
            <router-link to="/suppliers" class="btn btn-secondary">
              <i class="bi bi-arrow-left"></i> Cancelar
            </router-link>
            <button type="submit" class="btn btn-primary">
              <i class="bi bi-check-circle"></i> 
              {{ isEditMode ? 'Actualizar' : 'Guardar' }} Proveedor
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SupplierComponent } from './supplier.component'

const {
  name,
  email,
  address,
  description,
  phone,
  isEditMode,
  submit
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
  max-width: 800px;
  margin: 0 auto;
}

label {
  color: #495057;
  font-size: 0.95rem;
}

.input-group-text {
  background-color: #f8f9fa;
  border-right: none;
}

input.form-control,
textarea.form-control {
  border-left: none;
  padding: 0.75rem;
}

input.form-control:focus,
textarea.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

button.btn {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

button.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
