<script setup lang="ts">
import { ref, watch } from 'vue'
import { api, brl, type Product } from '../api/fake'

const props = defineProps<{ id: number }>()
const product = ref<Product | null>()

watch(
  () => props.id,
  async (id) => {
    product.value = undefined
    product.value = await api.getProduct(id)
  },
  { immediate: true },
)
</script>

<template>
  <RouterLink to="/produtos" class="back">‹ Voltar para produtos</RouterLink>
  <p v-if="product === undefined" class="loading">Carregando…</p>
  <p v-else-if="product === null" class="empty">Produto #{{ id }} não encontrado.</p>
  <template v-else>
    <h1>{{ product.name }}</h1>
    <div class="card">
      <dl class="dl">
        <dt>ID</dt><dd>{{ product.id }}</dd>
        <dt>Categoria</dt>
        <dd><RouterLink :to="{ name: 'products', query: { category: product.category } }">{{ product.category }}</RouterLink></dd>
        <dt>Preço</dt><dd>{{ brl(product.price) }}</dd>
        <dt>Estoque</dt>
        <dd><span class="badge" :class="product.stock ? 'green' : 'red'">{{ product.stock || 'Esgotado' }}</span></dd>
        <dt>Avaliação</dt><dd>★ {{ product.rating }}</dd>
      </dl>
    </div>
    <p style="margin-top: 16px">
      <RouterLink :to="{ name: 'product', params: { id: product.id - 1 } }" v-if="product.id > 1">‹ Anterior</RouterLink>
      &nbsp;
      <RouterLink :to="{ name: 'product', params: { id: product.id + 1 } }">Próximo ›</RouterLink>
    </p>
  </template>
</template>
