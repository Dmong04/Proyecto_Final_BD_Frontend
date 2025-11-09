import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/components/Login/LoginView.vue'
import ClientHomeView from '@/views/HomeView.vue'
import ListTours from '@/components/Tours/listTours.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true, role: 'ADMIN' }
    },
    {
      path: '/client-home',
      name: 'client-home',
      component: ClientHomeView,
      meta: { requiresAuth: true, role: 'CLIENT' }
    },
    {
      path: '/tours/all',
      name: 'tours',
      component: ListTours,
      meta: { requiresAuth: true, role: 'ADMIN' }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../components/Users/ListUsers.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users/admin/add',
      name: 'addAdminusers',
      component: () => import('../components/Users/Admin/addAdminUser.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users/client/add',
      name: 'addClientUsers',
      component: () => import('../components/Users/Client/addClientUser.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/reservation',
      name: 'reservations',
      component: () => import('../components/Reservations/listReservations.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/reservations/add',
      name: 'addReservation',
      component: () => import('../components/Reservations/Add_reservations/addReservations.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/reservations/edit/:id',
      name: 'EditReservation',
      component: () => import('../components/Reservations/Add_reservations/addReservations.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/tours/add',
      name: 'addTour',
      component: () => import('../components/Tours/addTour.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/extras',
      name: 'extras',
      component: () => import('../components/Extra/listExtra.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/extras/add',
      name: 'addExtra',
      component: () => import('../components/Extra/addExtra.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/detalles_extra',
      name: 'detalles_extra',
      component: () => import('../components/Extra_detail/list_extra_details.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/detalles_extra/add',
      name: 'add_extra_detail',
      component: () => import('../components/Extra_detail/add_extra_detail.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/detalles_extra/edit/:id',
      name: 'edit_extra_detail',
      component: () => import('../components/Extra_detail/add_extra_detail.vue'),
      props: true
    },
    {
      path: '/detalles_extra/next/:reservationId',
      name: 'nextExtra_detail',
      component: () => import('../components/Extra_detail/add_extra_detail.vue'),
      props: true
    },
    {
      path: '/detalles_extra/add/:reservationId',
      name: 'add_extra_detail_reservation',
      component: () => import('../components/Extra_detail/add_extra_detail.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    // Tour Details Routes
    {
      path: '/detalles_tour',
      name: 'detalles_tour',
      component: () => import('../components/TourDetails/list_tour_details.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/detalles_tour/add',
      name: 'add_tour_detail',
      component: () => import('../components/TourDetails/add_tour_detail.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/detalles_tour/edit/:id',
      name: 'edit_tour_detail',
      component: () => import('../components/TourDetails/add_tour_detail.vue'),
      props: true
    },
    {
      path: '/detalles_tour/next/:reservationId/:createdExtraDetailId?',
      name: 'nextTour_detail',
      component: () => import('../components/TourDetails/add_tour_detail.vue'),
      props: true
    },
    {
      path: '/detalles_tour/add/:extraDetailId',
      name: 'add_tour_detail_extradetail',
      component: () => import('../components/TourDetails/add_tour_detail.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/passengers',
      name: 'passengers',
      component: () => import('../components/Passengers/listPassengers.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/passengers/add',
      name: 'addPassenger',
      component: () => import('../components/Passengers/addPassenger.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/passengers/edit/:id',
      name: 'EditPassenger',
      component: () => import('../components/Passengers/addPassenger.vue'),
      props: true
    },
    {
      path: '/passengers/next/:reservationId/:createdTourDetailId?',
      name: 'nextPassenger',
      component: () => import('../components/Passengers/addPassenger.vue'),
      props: true
    }
  ]
})

// Navigation guard mejorado
router.beforeEach((to, from, next) => {
  console.log('=== Router Guard ===')
  console.log('Ruta solicitada:', to.path)
  console.log('Requiere auth:', to.meta.requiresAuth)

  // Obtener token y role directamente de sessionStorage
  const token = sessionStorage.getItem('TOKEN')
  const userRole = sessionStorage.getItem('USER_ROLE')

  console.log('Token existe:', !!token)
  console.log('User Role:', userRole)

  // Si la ruta no requiere autenticación, permitir acceso
  if (!to.meta.requiresAuth) {
    console.log('Ruta pública, acceso permitido')
    next()
    return
  }

  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!token) {
      console.log('No hay token, redirigiendo a login')
      next('/login')
      return
    }

    // Verificar rol si la ruta lo requiere
    if (to.meta.role && to.meta.role !== userRole) {
      console.log('Rol incorrecto. Esperado:', to.meta.role, 'Actual:', userRole)

      // Redirigir según el rol del usuario
      if (userRole === 'ADMIN') {
        next('/home')
      } else if (userRole === 'CLIENT') {
        next('/client-home')
      } else {
        next('/login')
      }
      return
    }

    console.log('utenticación válida, acceso permitido')
    next()
    return
  }

  next()
})

export default router
