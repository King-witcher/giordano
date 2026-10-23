import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Dashboard' } },
    { path: '/usuarios', name: 'users', component: () => import('../views/UsersView.vue'), meta: { title: 'Usuários' } },
    { path: '/usuarios/:id(\\d+)', name: 'user', component: () => import('../views/UserDetailView.vue'), props: (r) => ({ id: Number(r.params.id) }), meta: { title: 'Usuário' } },
    { path: '/produtos', name: 'products', component: () => import('../views/ProductsView.vue'), meta: { title: 'Produtos' } },
    { path: '/produtos/:id(\\d+)', name: 'product', component: () => import('../views/ProductDetailView.vue'), props: (r) => ({ id: Number(r.params.id) }), meta: { title: 'Produto' } },
    { path: '/pedidos', name: 'orders', component: () => import('../views/OrdersView.vue'), meta: { title: 'Pedidos' } },
    { path: '/pedidos/:id(\\d+)', name: 'order', component: () => import('../views/OrderDetailView.vue'), props: (r) => ({ id: Number(r.params.id) }), meta: { title: 'Pedido' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue'), meta: { title: 'Não encontrado' } },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  document.title = `${to.meta.title ?? ''} · Giordano`
})

export default router
