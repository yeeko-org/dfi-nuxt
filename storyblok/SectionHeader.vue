<script setup>

import CommonTitle from "../components/web/CommonTitle.vue";
import {resizeImg} from "~/composables/storyblok_images.js";

const props = defineProps({
  blok: Object,
  report_blok: Object,
})

function openDoc(item) {
  console.log('item', item)
  if (!item.file_doc) return
  window.open(item.file_doc.filename, '_blank')
}
</script>

<template>
  <v-col
    v-editable="blok"
    cols="12"
    class="section-header mb-1 pt-2 d-flex justify-space-between"
    :class="{report_block: 'text-center'}"
  >
    <v-sheet
      v-if="report_blok.cover"
      width="290"
      max-height="300"
    >
      <v-img
        :aspect-ratio="1"
        :src="resizeImg(blok.cover, 300)"
        class="mx-3"
      ></v-img>
    </v-sheet>
    <v-spacer v-else></v-spacer>
    <div class="d-flex flex-column">
      <div
        class="text-uppercase text-caption text-grey-darken-2 px-4"
        :class="report_blok ? '' : 'mb-4'"
      >
        {{blok.header}}
      </div>
      <CommonTitle
        :blok="blok"
      />
      <template v-if="blok.explanation">
        <v-divider class="mt-0  mx-auto"/>
        <p
          class="text-h6 font-weight-light mx-4 pb-6"
          style="max-width: 700px;"
          v-text="blok.explanation"
        />
      </template>
<!--      <v-btn-->
<!--        v-if="report_blok"-->
<!--        class="mt-4 mx-4"-->
<!--        color="accent"-->
<!--        variant="tonal"-->
<!--        append-icon="file_download"-->
<!--        v-tooltip="'Descargar'"-->
<!--        @click="openDoc(report_blok)"-->
<!--      >-->
<!--        Descargar-->
<!--      </v-btn>-->
      <v-btn
        v-if="report_blok"
        variant="elevated"
        color="accent"
        size="large"
        class="white-outlined px-5 mx-2"
        v-tooltip="'Descargar'"
        rounded="lg"
        @click="openDoc(report_blok)"
      >
        Descargar
      </v-btn>
    </div>
    <v-spacer></v-spacer>

  </v-col>
</template>

<style lang="scss">
.side-title{
  width: 50px;
  height: 8px;
}

.section-header {
  //font-family: Lato;

  .v-divider {
    border-width: 1px;
    max-width: 50px;
  }

  .poppins {
    //font-family: Poppins !important;
  }
}

.white-outlined {
  border: 3px solid white !important;
}
</style>