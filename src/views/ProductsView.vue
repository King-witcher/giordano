<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api, brl, type Product } from '../api/fake'

const route = useRoute()
const router = useRouter()

const q = ref(String(route.query.q ?? ''))
const category = ref(String(route.query.category ?? ''))
const products = ref<Product[]>()

watch([q, category], async () => {
  router.replace({ query: { ...(q.value && { q: q.value }), ...(category.value && { category: category.value }) } })
})

watch(
  () => route.query,
  async (query) => {
    products.value = await api.getProducts({ q: String(query.q ?? ''), category: String(query.category ?? '') })
  },
  { immediate: true },
)
</script>

<template>
  <h1>Produtos</h1>
  <div class="toolbar">
    <input v-model.lazy="q" placeholder="Buscar produto… (Enter)" />
    <button :class="{ on: !category }" @click="category = ''">Todos</button>
    <button v-for="c in api.categories" :key="c" :class="{ on: category === c }" @click="category = c">{{ c }}</button>
  </div>

  <p v-if="!products" class="loading">Carregando…</p>
  <p v-else-if="!products.length" class="empty">Nenhum produto encontrado.</p>
  <div v-else class="grid">
    <RouterLink v-for="p in products" :key="p.id" :to="{ name: 'product', params: { id: p.id } }" class="card product">
      <span class="badge">{{ p.category }}</span>
      <h3>{{ p.name }}</h3>
      <strong>{{ brl(p.price) }}</strong>
      <small>★ {{ p.rating }} · {{ p.stock ? `${p.stock} em estoque` : 'Esgotado' }}</small>
    </RouterLink>
  </div>
</template>

<style scoped>
.on { background: var(--accent); color: #fff; border-color: var(--accent); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
.product { display: flex; flex-direction: column; gap: 6px; color: var(--text); }
.product:hover { text-decoration: none; border-color: var(--accent); }
.product .badge { align-self: flex-start; }
.product h3 { margin: 4px 0 0; font-size: 16px; }
.product strong { font-size: 18px; color: var(--text-h); }
.product small { color: var(--muted); }
</style>
