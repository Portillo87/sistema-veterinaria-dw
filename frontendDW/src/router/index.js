import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PropietariosView from '@/views/PropietariosView.vue'
import MascotasView from '@/views/MascotasView.vue'
import MascotaDetalleView from '@/views/MascotaDetalleView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/propietarios', name: 'propietarios', component: PropietariosView },
  { path: '/mascotas', name: 'mascotas', component: MascotasView },
  { path: '/mascotas/:id', name: 'mascota-detalle', component: MascotaDetalleView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
