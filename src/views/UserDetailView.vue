<script setup lang="ts">
import { ref, watch } from 'vue'
import { api, brl, dateBr, type Order, type User } from '../api/fake'
import StatusBadge from '../components/StatusBadge.vue'

const props = defineProps<{ id: number }>()

const user = ref<User | null>()
const orders = ref<Order[]>([])

watch(
  () => props.id,
  async (id) => {
    user.value = undefined
    const [u, o] = await Promise.all([api.getUser(id), api.getOrders({ userId: id, pageSize: 100 })])
    user.value = u
    orders.value = o.items
  },
  { immediate: true },
)
</script>

<template>
  <RouterLink to="/usuarios" class="back">‹ Voltar para usuários</RouterLink>
  <p v-if="user === undefined" class="loading">Carregando…</p>
  <p v-else-if="user === null" class="empty">Usuário #{{ id }} não encontrado.</p>
  <template v-else>
    <h1>{{ user.name }}</h1>
    <div class="card" style="margin-bottom: 24px">
      <dl class="dl">
        <dt>ID</dt><dd>{{ user.id }}</dd>
        <dt>E-mail</dt><dd>{{ user.email }}</dd>
        <dt>Cidade</dt><dd>{{ user.city }}</dd>
        <dt>Perfil</dt><dd><span class="badge purple">{{ user.role }}</span></dd>
        <dt>Status</dt><dd><span class="badge" :class="user.active ? 'green' : 'red'">{{ user.active ? 'Ativo' : 'Inativo' }}</span></dd>
        <dt>Cadastro</dt><dd>{{ dateBr(user.createdAt) }}</dd>
      </dl>
    </div>

    <h2>Pedidos ({{ orders.length }})</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>#</th><th>Data</th><th>Itens</th><th>Status</th><th class="num">Total</th></tr></thead>
        <tbody>
          <tr v-for="o in orders" :key="o.id">
            <td><RouterLink :to="`/pedidos/${o.id}`">#{{ o.id }}</RouterLink></td>
            <td>{{ dateBr(o.date) }}</td>
            <td>{{ o.items.length }}</td>
            <td><StatusBadge :status="o.status" /></td>
            <td class="num">{{ brl(o.total) }}</td>
          </tr>
          <tr v-if="!orders.length"><td colspan="5" class="empty">Sem pedidos.</td></tr>
        </tbody>
      </table>
    </div>
  </template>
</template>
