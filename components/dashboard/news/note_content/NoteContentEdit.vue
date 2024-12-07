<script setup>

import {useMainStore} from "~/store/index.js";
const mainStore = useMainStore()

const props = defineProps({
  is_massive_edit: Boolean,
  is_edit: Boolean,
  full_main: {
    type: Object,
    required: true,
  },
})

function getStructuredContent() {
  mainStore.getAdditionalInfo(props.full_main.id).then(response => {
    console.log("response", response)
    props.full_main.structured_content = response.structured_content
  })
}

</script>

<template>
  <v-col cols="6">
    <v-card
      variant="outlined"
    >
      <v-card-title class="title-no-wrap text-h6 font-weight-bold">
        {{full_main.title}}
      </v-card-title>
      <v-card-subtitle
        v-if="full_main.subtitle"
        class="title-no-wrap font-weight-bold"
      >
        {{full_main.subtitle}}
      </v-card-subtitle>
      <v-card-text>
        <span v-html="full_main.content_full">
        </span>
      </v-card-text>
    </v-card>
  </v-col>
  <v-col cols="6">
    <v-card
      variant="outlined"
    >
      <v-card-title class="d-flex text-primary">
        Nota estructurada
        <v-spacer></v-spacer>
        <v-btn
          v-if="!full_main.structured_content"
          @click="getStructuredContent"
          color="accent"
          variant="elevated"
        >
          Obtener
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-textarea
          v-model="full_main.structured_content"
          label="Contenido estructurado"
          rows="20"
          auto-grow
          variant="outlined"
        >
        </v-textarea>
      </v-card-text>
    </v-card>

  </v-col>
</template>

<style scoped>
.title-no-wrap{
  white-space: normal !important;
}
</style>