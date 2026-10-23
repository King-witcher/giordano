<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api, brl, dateBr, type Order, type Page } from '../api/fake'
import AppPager from '../components/AppPager.vue'
import StatusBadge from '../components/StatusBadge.vue'

const route = useRoute()
const router = useRouter()

const status = computed({
  get: () => String(route.query.status ?? ''),
  set: (v) => router.replace({ query: v ? { status: v } : {} }),
})
const result = ref<Page<Order>>()

watch(
  () => route.query,
  async (query) => {
    result.value = await api.getOrders({ status: String(query.status ?? ''), page: Number(query.page ?? 1) })
  },
  { immediate: true },
)

const goPage = (page: number) => router.replace({ query: { ...route.query, page } })
</script>

<template>
  <h1>Pedidos</h1>
  <div class="toolbar">
    <select v-model="status">
      <option value="">Todos os status</option>
      <option v-for="s in api.statuses" :key="s">{{ s }}</option>
    </select>
  </div>

  <p v-if="!result" class="loading">Carregando…</p>
  <template v-else>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>#</th><th>Cliente</th><th>Data</th><th>Itens</th><th>Status</th><th class="num">Total</th></tr>
        </thead>
        <tbody>
          <tr v-for="o in result.items" :key="o.id">
            <td><RouterLink :to="{ name: 'order', params: { id: o.id } }">#{{ o.id }}</RouterLink></td>
            <td><RouterLink :to="{ name: 'user', params: { id: o.userId } }">{{ o.customer }}</RouterLink></td>
            <td>{{ dateBr(o.date) }}</td>
            <td>{{ o.items.reduce((s, i) => s + i.qty, 0) }}</td>
            <td><StatusBadge :status="o.status" /></td>
            <td class="num">{{ brl(o.total) }}</td>
          </tr>
          <tr v-if="!result.items.length"><td colspan="6" class="empty">Nenhum pedido.</td></tr>
        </tbody>
      </table>
    </div>
    <AppPager v-bind="result" @change="goPage" />
  </template>
</template>
