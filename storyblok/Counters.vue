<script setup>

import {useDisplay} from "vuetify";

const { xs } = useDisplay()
const props = defineProps({
  blok: Object
})

const avatar_size = ref('100')

onMounted(() => {
  avatar_size.value = xs.value ? '100' : '140'
})

const offsetFirst = computed(() => {
  const few_counters = props.blok.counters.length <= 3
  return !few_counters ? 'offset-0 offset-sm-2' : ''
})


</script>

<template>
  <v-row class="mt-4 mx-3">
    <v-col
      v-for="(counter, index) in blok.counters"
      :key="counter._uid"
      cols="6"
      sm="4"
      :class="!index ? offsetFirst : ''"
      class="text-center px-6 pb-6"
      v-editable="counter"
    >
      <v-avatar
        :size="avatar_size"
        class="mx-auto"
        color="transparent"
        style="background-color: #fc0a41;"
      >
        <span class="text-h3 text-sm-h1 font-weight-bold text-white montse">
          {{ counter.number }}
        </span>
      </v-avatar>
      <p
        class="text-center font-weight-bold text-h6 text-sm-h5 mt-5 montse"
        :class="`text-${blok.color_title || 'primary'}`"
      >
        {{ counter.title }}
      </p>
    </v-col>
  </v-row>


</template>

<style scoped lang="scss">

</style>