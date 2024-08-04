import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/add-matches',
    name: 'AddMatches',
    component: () => import('@/views/AddMatches.vue') // Ensure the path is correct
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router