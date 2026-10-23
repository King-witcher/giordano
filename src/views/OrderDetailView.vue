<script setup lang="ts">
import { ref, watch } from 'vue'
import { api, brl, dateBr, type Order } from '../api/fake'
import StatusBadge from '../components/StatusBadge.vue'

const props = defineProps<{ id: number }>()
const order = ref<Order | null>()

watch(
  () => props.id,
  async (id) => {
    order.value = undefined
    order.value = await api.getOrder(id)
  },
  { immediate: true },
)
</script>

<template>
  <RouterLink to="/pedidos" class="back">‹ Voltar para pedidos</RouterLink>
  <p v-if="order === undefined" class="loading">Carregando…</p>
  <p v-else-if="order === null" class="empty">Pedido #{{ id }} não encontrado.</p>
  <template v-else>
    <h1>Pedido #{{ order.id }}</h1>
    <div class="card" style="margin-bottom: 24px">
      <dl class="dl">
        <dt>Cliente</dt>
        <dd><RouterLink :to="{ name: 'user', params: { id: order.userId } }">{{ order.customer }}</RouterLink></dd>
        <dt>Data</dt><dd>{{ dateBr(order.date) }}</dd>
        <dt>Status</dt><dd><StatusBadge :status="order.status" /></dd>
      </dl>
    </div>

    <h2>Itens</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Produto</th><th class="num">Qtd</th><th class="num">Preço</th><th class="num">Subtotal</th></tr></thead>
        <tbody>
          <tr v-for="(it, i) in order.items" :key="i">
            <td><RouterLink :to="{ name: 'product', params: { id: it.productId } }">{{ it.name }}</RouterLink></td>
            <td class="num">{{ it.qty }}</td>
            <td class="num">{{ brl(it.price) }}</td>
            <td class="num">{{ brl(it.qty * it.price) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr><th colspan="3">Total</th><th class="num">{{ brl(order.total) }}</th></tr>
        </tfoot>
      </table>
    </div>
  </template>
</template>
