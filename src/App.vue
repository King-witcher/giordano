<script setup lang="ts">
const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/usuarios', label: 'Usuários' },
  { to: '/produtos', label: 'Produtos' },
  { to: '/pedidos', label: 'Pedidos' },
]
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <RouterLink to="/" class="brand">Giordano</RouterLink>
      <nav>
        <RouterLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          :class="{ active: l.to === '/' ? $route.path === '/' : $route.path.startsWith(l.to) }"
        >
          {{ l.label }}
        </RouterLink>
      </nav>
    </aside>
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>
