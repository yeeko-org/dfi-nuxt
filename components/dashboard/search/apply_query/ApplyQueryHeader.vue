<script setup>

import HeaderCommon from "~/components/dashboard/generic/HeaderCommon.vue";

const props = defineProps({
  main: {
    type: Object,
    required: true,
  },
  show_details: Boolean,
  collection_data: Object,
})

</script>
<template>
  <HeaderCommon
    :main="main"
    :show_details="show_details"
    :collection_data="collection_data"
  >
    <template #title>
      {{ main.from_date }} --> {{ main.to_date }}
    </template>
  </HeaderCommon>
</template>

<style scoped>

</style>