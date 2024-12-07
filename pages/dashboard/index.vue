<script setup>
// import {nextTick, onBeforeMount, onMounted, ref, watch} from 'vue'

definePageMeta({
  middleware: 'dashboard',
  layout: 'dashboard',
})

// rewrite the last line in typescript
// const current_filters = ref<Array<{name: string, order: number, init_visible?: boolean, collection?: string, is_collection?: boolean, disabled?: boolean}>>([])


</script>

<template>
  <v-card class="px-3 mt-3" >
    <v-card-title>
      Elige una sección en el menú
    </v-card-title>
  </v-card>
</template>
