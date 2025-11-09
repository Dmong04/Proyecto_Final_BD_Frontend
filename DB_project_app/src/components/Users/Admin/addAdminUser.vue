<template>
  <div class="container mt-5">
    <div class="card shadow-lg border-0 rounded-4">
      <div class="card-header custom-header">
        <h4 class="mb-0">
          <i class="bi bi-file-earmark-plus"></i> Agregar Usuario Administrador
        </h4>
      </div>

      <div class="card-body">
        <form @submit.prevent="submitAdminUser">
          <div class="details row mb-3">
            <div class="col-md-6 mb-3">
              <label for="name" class="form-label">Nombre</label>
              <input type="text" id="name" class="form-control" v-model="name" required />
            </div>

            <div class="col-md-6 mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="text" id="email" class="form-control" v-model="email" required />
            </div>

            <div class="col-md-6 mb-3">
              <label for="username" class="form-label">Nombre de usuario</label>
              <input type="text" id="username" class="form-control" v-model="username" required />
            </div>

            <div class="col-md-6 mb-3">
              <label for="password" class="form-label">Contraseña</label>
              <input type="password" id="password" class="form-control" v-model="password" required />
            </div>

            <div class="d-flex justify-content-center mt-4">
              <button type="submit" class="btn btn-dark btn-sm">
                <i class="bi bi-save me-2"></i>Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserComponent } from '../user.component'
const { name, email, username, password, submitAdminUser } = UserComponent()
</script>
