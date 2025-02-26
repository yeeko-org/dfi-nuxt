<script setup>
import {computed} from "vue";

const props = defineProps({
  blok: Object,
})

const final_color = computed(() => {
  return props.blok.background_color?.color || 'grey-lighten-5'
})

const background_color = computed(() => {
  if (props.blok.texture_back)
    return null
  if (props.blok.background_color_collection)
    return props.blok.background_color_collection
  return props.blok?.background_color?.color || 'transparent'
})

</script>

<template>

  <v-col cols="12" v-editable="blok" class="px-0 mb-3">
    <v-sheet
      :color="background_color"
      class="pb-4 rounded-0"
      variant="flat"
      :style="{backgroundImage: blok.texture_back ? `url(https://a.storyblok.com/f/327491/2550x3300/3994476a6e/fondo.png)` : ''}"
    >
      <SectionHeader
        v-for="blok in blok?.headers"
        :key="blok._uid"
        :blok="blok"
      />
      <StoryblokComponent
        v-for="comp in blok.components"
        :key="comp._uid"
        :blok="comp"
      />
    </v-sheet>
  </v-col>
</template>

<style scoped lang="scss">

</style>