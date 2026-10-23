<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ page: number; pageSize: number; total: number }>()
const emit = defineEmits<{ change: [page: number] }>()

const pages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
</script>

<template>
  <div class="pager">
    <button :disabled="page <= 1" @click="emit('change', page - 1)">‹ Anterior</button>
    <span>Página {{ page }} de {{ pages }} · {{ total }} registros</span>
    <button :disabled="page >= pages" @click="emit('change', page + 1)">Próxima ›</button>
  </div>
</template>
