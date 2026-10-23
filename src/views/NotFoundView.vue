<template>
  <div class="empty">
    <h1>404</h1>
    <p>A página <code>{{ $route.fullPath }}</code> não existe.</p>
    <RouterLink to="/">Ir para o Dashboard</RouterLink>
  </div>
</template>
