import api from '@/api/api'

export interface UserAdminData {
  name: string
  email: string
  username: string
  password: string
}

export interface UserClientData {
  name: string
  phone: string
  email: string
  username: string
  password: string
}

export default {
  getusers() {
    return api.get('/user/all')
  },

  findUser(username: string) {
    return api.get(`/user/${username}`)
  },


  createAdminUser(userData: UserAdminData) {
      return api.post('/user/admin', userData)
  },

  updateAdminUser(id: number, updateData: Partial<UserAdminData>) {
    return api.put(`/user/admin/update/${id}`, updateData)
  },

  deleteAdminUser(id: number) {
    return api.delete(`/user/admin/delete/${id}`)
  },


  createClientUser(userData: UserClientData) {
    return api.post('/user/client', userData)
  },

  updateClientUser(id: number, updateData: Partial<UserClientData>) {
    return api.put(`/user/admin/update/${id}`, updateData)
  },

  deleteClientUser(id: number) {
    return api.delete(`/user/client/delete/${id}`)
  }
}
