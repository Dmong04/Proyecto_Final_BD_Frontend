// src/composables/useListUsers.ts
import { ref, onMounted } from 'vue'
import userService from '@/services/user.service'
import type { UserAdminData, UserClientData } from '@/services/user.service'
import type { User } from '@/models/user'

export function UserComponent() {
  const name = ref('')
  const email = ref('')
  const username = ref('')
  const password = ref('')
  const phone = ref('')

  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref(null)

  const loadUsers = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await userService.getusers()
      users.value = response.data.data
    } catch (err: any) {
      console.error('Error al cargar usuarios:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

    const submitAdminUser = async () => {
      try {
        const newAdminUser: UserAdminData = {
          name: name.value,
          email: email.value,
          username: username.value,
          password: password.value,
        }
        const response = await userService.createAdminUser(newAdminUser)
        console.log(name)
        console.log(email)
        console.log(username)
        console.log(password)
      alert('Usuario creado con éxito')
      console.log("Usuario creado: ", response.data)
      await loadUsers()
      } catch (err: any) {
        console.error('Error al enviar el Usuario: ', err)
        error.value = err
        alert('Error al crear el Usuario' + (err.message ? ': ' + err.message : ''))
      }
    }

    const submitClientUser = async () => {
      try {
        const newClientUser: UserClientData = {
          name: name.value,
          phone: phone.value,
          email: email.value,
          username: username.value,
          password: password.value,
        }
        const response = await userService.createClientUser(newClientUser)
        console.log(name)
        console.log(phone)
        console.log(email)
        console.log(username)
        console.log(password)
      alert('Usuario creado con éxito')
      console.log("Usuario creado: ", response.data)
      await loadUsers()
      } catch (err: any) {
        console.error('Error al enviar el Usuario: ', err)
        error.value = err
        alert('Error al crear el Usuario' + (err.message ? ': ' + err.message : ''))
      }
    }



  const deleteUserById = async (user: any) => {
    try {
      if (user.admin) {
        await userService.deleteAdminUser(user.id)
      } else if (user.client) {
        await userService.deleteClientUser(user.id)
      } else {
        alert('No se puede determinar el tipo de usuario')
        return
      }

      alert('Usuario eliminado correctamente')
      await loadUsers()
    } catch (err: any) {
      console.error('Error al eliminar usuario:', err)
      alert('Error al eliminar usuario: ' + (err.message || ''))
    }
  }

  onMounted(() => {
    loadUsers()
  })

  return {
    name,
    email,
    username,
    password,
    phone,
    users,
    loading,
    error,
    reload: loadUsers,
    submitAdminUser,
    submitClientUser,
    deleteUserById,
  }
}

