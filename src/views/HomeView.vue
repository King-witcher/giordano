<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api, brl, dateBr } from '../api/fake'
import StatusBadge from '../components/StatusBadge.vue'

const stats = ref<Awaited<ReturnType<typeof api.getStats>>>()

onMounted(async () => {
  stats.value = await api.getStats()
})
</script>

<template>
  <h1>Dashboard</h1>
  <p v-if="!stats" class="loading">Carregando…</p>
  <template v-else>
    <div class="stats">
      <RouterLink to="/usuarios" class="card stat">
        <span>Usuários</span><strong>{{ stats.users }}</strong>
        <small>{{ stats.activeUsers }} ativos</small>
      </RouterLink>
      <RouterLink to="/produtos" class="card stat">
        <span>Produtos</span><strong>{{ stats.products }}</strong>
      </RouterLink>
      <RouterLink to="/pedidos" class="card stat">
        <span>Pedidos</span><strong>{{ stats.orders }}</strong>
      </RouterLink>
      <div class="card stat">
        <span>Faturamento</span><strong>{{ brl(stats.revenue) }}</strong>
        <small>exclui cancelados</small>
      </div>
    </div>

    <h2>Pedidos recentes</h2>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>#</th><th>Cliente</th><th>Data</th><th>Status</th><th class="num">Total</th></tr>
        </thead>
        <tbody>
          <tr v-for="o in stats.recentOrders" :key="o.id">
            <td><RouterLink :to="`/pedidos/${o.id}`">#{{ o.id }}</RouterLink></td>
            <td><RouterLink :to="`/usuarios/${o.userId}`">{{ o.customer }}</RouterLink></td>
            <td>{{ dateBr(o.date) }}</td>
            <td><StatusBadge :status="o.status" /></td>
            <td class="num">{{ brl(o.total) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
</template>

<style scoped>
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 32px; }
.stat { display: flex; flex-direction: column; color: var(--text); }
.stat:hover { text-decoration: none; border-color: var(--accent); }
.stat strong { font-size: 26px; color: var(--text-h); }
.stat small { color: var(--muted); }
</style>
