<script setup>
// import { computed, ref, onMounted } from 'vue'
import CommonTitle from "../components/web/CommonTitle.vue";
import {computed} from "vue";

// defineProps({ blok: Object });
const props = defineProps({
  blok: Object,
  columns_together: Boolean,
})

const space_class = computed(() => {
  let final_class = props.columns_together ? 'px-0' : 'px-2 px-sm-3'
  final_class += ` text-${props.blok.align_text || 'left'}`
  // if (props.blok.free_class)
  //   final_class += ` ${props.blok.free_class}`
  return final_class
})

const description3 = computed(() => {
  return renderRichText(props.blok.description2)
})

const description2 = computed(() => {
  let rich_text = renderRichText(props.blok.description2)
  if (!rich_text)
    return null
  rich_text = rich_text.replace(
      /<p>/g, '<p class="mt-2 mt-sm-4 montse">')
  return rich_text
  // return renderRichText(props.blok.text)
})

const color_description = computed(() =>
    props.blok.color_description || 'black')

const variant_card = computed(() => {
  return props.blok.background_color2
    ? props.blok.background_color2 === 'primary'
      ? 'elevated'
      : 'tonal'
    : 'elevated'
})

function orientToAlign(orient) {
  return orient === 'left' ? 'start' : orient === 'right' ? 'end' : 'center'
}

const final_align = computed(() => {
  return orientToAlign(props.blok.align_text)
})

const final_sm_align = computed(() => {
  return orientToAlign(props.blok.align_md)
})

const blok_header = computed(() => {
  return {
    subheader: props.blok.title,
    color_title: props.blok.color_title,
    align_text: props.blok.align_text,
    align_md: props.blok.align_md,
    is_indirect: true,
  }
})

</script>

<template>

  <v-col
    v-editable="blok"
    :cols="blok.cols"
    :sm="blok.sm || blok.md"
    :md="blok.md"
    class="py-0 _py-sm-3"
    :class="space_class"
    :order="blok.order || 1"
    :order-md="blok.order_md || 1"
    :order-sm="blok.order_sm || 1"
  >
    <v-card
      variant="text"
      :class="`${blok.free_class} text-${blok.align_text} text-sm-${blok.align_md}`"
      class="rounded-0 d-flex flex-column justify-center fill-height py-0 _py-sm-4"
      elevation="0"
    >

      <div>
        <CommonTitle
          v-if="blok.title"
          :blok="blok_header"
        />
        <v-card-text v-if="description2" class="py-2 py-sm-4">
          <div
            class="text-text-1 text-sm-subtitle-1 _mt-2 _mt-sm-4 montse"
            v-html="description2"
          ></div>
        </v-card-text>
        <v-card-actions v-if="blok.buttons.length">
          <v-spacer></v-spacer>
          <StoryblokComponent
            v-for="blok in blok.buttons"
            :key="blok._uid"
            :blok="blok"
          ></StoryblokComponent>
          <v-spacer></v-spacer>
        </v-card-actions>
        <v-card-text v-if="blok.contents?.length" class="py-2 py-sm-4">
          <StoryblokComponent
            v-for="blok in blok.contents"
            :key="blok._uid"
            :blok="blok"
          ></StoryblokComponent>
        </v-card-text>
      </div>
    </v-card>
  </v-col>

</template>

<style scoped lang="scss">
.side-title{
  width: 50px;
  height: 8px;
}
.title-no-wrap{
  white-space: normal !important;
}
</style>