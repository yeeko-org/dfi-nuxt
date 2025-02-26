<script setup>
import { useDisplay } from 'vuetify'

const { xs } = useDisplay()

const props = defineProps({
  blok: Object
})

const size = computed(() =>
  // :x-large="$breakpoint.is.smAndUp && blok.size == 'x-large'"
  // :large="($breakpoint.is.xs && blok.size == 'x-large') || blok.size == 'large'"
  // :small="blok.size == 'x-large'"
  props.blok.size === 'x-large'
    ? (xs.value ? 'x-large' : undefined)
    : 'large'
)
const variant = computed(() =>
  // :outlined="blok.style == 'outlined'"
  // :text="blok.style == 'text'"
  props.blok.style === 'outlined'
    ? 'outlined'
    : props.blok.style === 'text'
    ? 'text'
    : 'elevated'
)

</script>

<template>
  <v-btn
    variant="elevated"
    color="accent"
    :size="blok.size || 'large'"
    class="white-outlined px-5 mx-2"
    :class="blok.style ? '' : 'white--text'"
    :to="blok.to.cached_url || blok.to.url"
    id="button_new"
    rounded="lg"
  >
    {{blok.button_title}}
  </v-btn>
<!--  <v-btn-->
<!--    -->
<!--    :variant="variant"-->
<!--    :color="blok.color || 'black'"-->
<!--    -->
<!--    -->
<!--    -->
<!--    _click="openDialog"-->
<!--    -->
<!--    rounded="xl"-->
<!--  >-->
<!--    {{blok.button_title}}-->
<!--  </v-btn>-->

</template>

<style scoped lang="scss">
|
</style>
