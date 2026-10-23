<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api, dateBr, type Page, type User } from '../api/fake'
import AppPager from '../components/AppPager.vue'

const route = useRoute()
const router = useRouter()

// filtros vivem na query string (?q=&role=&page=) para o link ser compartilhável
const q = ref(String(route.query.q ?? ''))
const role = ref(String(route.query.role ?? ''))
const result = ref<Page<User>>()
const loading = ref(false)

function setQuery(patch: Record<string, string | number>) {
  const query = { ...route.query, ...patch }
  for (const k in query) if (query[k] === '' || query[k] === 1) delete query[k]
  router.replace({ query })
}

let timer: ReturnType<typeof setTimeout>
watch(q, (v) => {
  clearTimeout(timer)
  timer = setTimeout(() => setQuery({ q: v, page: 1 }), 300)
})
watch(role, (v) => setQuery({ role: v, page: 1 }))

watch(
  () => route.query,
  async (query) => {
    loading.value = true
    result.value = await api.getUsers({
      q: String(query.q ?? ''),
      role: String(query.role ?? ''),
      page: Number(query.page ?? 1),
    })
    loading.value = false
  },
  { immediate: true },
)
</script>

<template>
  <h1>Usuários</h1>
  <div class="toolbar">
    <input v-model="q" placeholder="Buscar por nome ou e-mail…" />
    <select v-model="role">
      <option value="">Todos os perfis</option>
      <option v-for="r in api.roles" :key="r">{{ r }}</option>
    </select>
  </div>

  <p v-if="!result" class="loading">Carregando…</p>
  <template v-else>
    <div class="table-wrap" :style="{ opacity: loading ? 0.5 : 1 }">
      <table>
        <thead>
          <tr><th>ID</th><th>Nome</th><th>E-mail</th><th>Cidade</th><th>Perfil</th><th>Status</th><th>Cadastro</th></tr>
        </thead>
        <tbody>
          <tr v-for="u in result.items" :key="u.id">
            <td>{{ u.id }}</td>
            <td><RouterLink :to="{ name: 'user', params: { id: u.id } }">{{ u.name }}</RouterLink></td>
            <td>{{ u.email }}</td>
            <td>{{ u.city }}</td>
            <td><span class="badge purple">{{ u.role }}</span></td>
            <td><span class="badge" :class="u.active ? 'green' : 'red'">{{ u.active ? 'Ativo' : 'Inativo' }}</span></td>
            <td>{{ dateBr(u.createdAt) }}</td>
          </tr>
          <tr v-if="!result.items.length"><td colspan="7" class="empty">Nenhum usuário encontrado.</td></tr>
        </tbody>
      </table>
    </div>
    <AppPager v-bind="result" @change="(p) => setQuery({ page: p })" />
  </template>
</template>
