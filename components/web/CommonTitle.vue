<script setup>

const props = defineProps({
  blok: Object,
})

function orientToAlign(orient) {
  return orient === 'left'
    ? 'start'
    : orient === 'right'
      ? 'end'
      : 'center'
}

const final_align = computed(() => {
  return orientToAlign(props.blok.align_text)
})

const final_sm_align = computed(() => {
  return orientToAlign(props.blok.align_md)
})
</script>

<template>
  <v-card-title
    v-if="blok.subheader"
    class="text-h5 text-sm-h4 font-weight-black d-flex flex-column align-center pt-0"
    :class="`text-${blok.color_title || 'primary'} align-${final_align} align-sm-${final_sm_align}`"
  >
    <span
      class="oswald title-no-wrap font-weight-black"
      v-html="blok.subheader"
    >
    </span>
  </v-card-title>
</template>

<style scoped lang="scss">
.title-no-wrap{
  white-space: normal !important;
}
</style>