<script setup>
import { useDisplay } from 'vuetify'
import DocumentList from "~/storyblok/DocumentList.vue";
import MaterialList from "~/storyblok/MaterialList.vue";
import {computed, ref} from "vue";

const { xs } = useDisplay()

const props = defineProps({
  blok: Object
})

const dialog = ref(false)

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

function openDialog() {
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
}

const dialog_text = computed(() => {
  let rich_text = renderRichText(props.blok.dialog_text)
  if (!rich_text)
    return '-'
  rich_text = rich_text.replace(
      /<p>/g, '<p class="mt-2 mt-sm-4 montse">')
  return rich_text
})

const dialog_text_simple = computed(() => {
  return renderRichText(props.blok.dialog_text)
})

</script>

<template>
  <v-btn-primary
    v-if="blok.behavior === 'dialog'"
    :variant="variant"
    color="accent"
    :size="blok.size || 'large'"
    class="mx-2"
    _class="blok.style ? 'text-white px-3' : 'white-outlined px-5'"
    @click="openDialog"
    id="button_new"
    rounded="lg"
  >
    {{blok.button_title}}
    <v-dialog
      v-model="dialog"
      max-width="850"
    >
      <v-card class="_rounded-xl">
        <v-card
          class="rounded-0 d-flex justify-center align-center"
          elevation="6"
          height="80"
          color="choco"
        >

          <div
            class="oswald text-h4 py-2"
          >
            {{ blok.dialog_title || 'Título' }}
          </div>
        </v-card>
        <v-card-text style="min-height: 300px" class="my-3">
<!--          <MaterialList v-if="blok.display_list === 'Materials'" />-->
<!--          <DocumentList v-else-if="blok.display_list === 'OfficialDocs'" />-->
<!--          <FormGossip-->
<!--            v-else-if="blok.display_list === 'FormGossip'"-->
<!--            is_dialog-->
<!--            @close-dialog="closeDialog"-->
<!--          />-->
          <span
            v-html="dialog_text"
            class="montse"
            :class="`text-${blok.align_text}`"
          >

          </span>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-btn-primary>
  <v-btn-menu
    v-else-if="blok.behavior === 'menu'"
    :variant="variant"
    color="secondary"
    size="default"
    :to="blok.to.cached_url || blok.to.url"
    id="button_new"
  >
    {{blok.button_title}}
  </v-btn-menu>
  <v-btn-primary
    v-else
    :variant="variant"
    color="accent"
    :size="blok.size || 'large'"
    class="mx-2"
    :to="blok.to.cached_url || blok.to.url"
    id="button_new"
  >
    {{blok.button_title}}
  </v-btn-primary>
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
.white-outlined {
  border: 3px solid white !important;
}
</style>
