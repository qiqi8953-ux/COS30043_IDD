import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import HotelsView from '../views/HotelsView.vue'
import HotelDetailView from '../views/HotelDetailView.vue'
import BookingView from '../views/BookingView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import HistoryView from '../views/HistoryView.vue'

const routes = [
  { path: '/', component: HomeView },

  { path: '/hotels', component: HotelsView },

  { path: '/hotel/:id', component: HotelDetailView },

  { path: '/booking/:id', component: BookingView },

  { path: '/login', component: LoginView },

  { path: '/register', component: RegisterView },

  { path: '/dashboard', component: DashboardView },

  { path: '/history', component: HistoryView },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 } 
    }
  }
})


export default router