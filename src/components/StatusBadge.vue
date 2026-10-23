<script setup lang="ts">
import type { OrderStatus } from '../api/fake'

defineProps<{ status: OrderStatus }>()

const colors: Record<OrderStatus, string> = {
  Pendente: 'yellow',
  Pago: 'blue',
  Enviado: 'purple',
  Entregue: 'green',
  Cancelado: 'red',
}
</script>

<template>
  <span class="badge" :class="colors[status]">{{ status }}</span>
</template>
