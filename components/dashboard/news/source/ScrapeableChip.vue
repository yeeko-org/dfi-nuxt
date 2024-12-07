<script setup>

const props = defineProps({
  main: {
    type: Object,
    required: true,
  },
  is_icon: Boolean,
})

const color_scrapeable = computed(() => {
  return props.main.has_content
    ? 'success'
    : props.main.has_content === false
      ? 'error'
      : 'grey-lighten-1'
})

const text_scrapeable = computed(() => {
  return props.main.has_content
    ? 'Es scrapeable'
    : props.main.has_content === false
      ? 'No es scrapeable'
      : '??'
})

</script>

<template>
  <v-icon
    v-if="is_icon"
    :color="color_scrapeable"
    class="ml-3"
    v-tooltip="text_scrapeable"
  >
    find_in_page
  </v-icon>
  <v-chip
    v-else
    :color="color_scrapeable"
    class="ml-3"
    v-tooltip="text_scrapeable"
  >
    {{ text_scrapeable }}
  </v-chip>
</template>

<style scoped>

</style>