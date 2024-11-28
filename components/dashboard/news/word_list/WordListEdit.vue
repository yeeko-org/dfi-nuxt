<script setup>
import SelectGroup from "~/components/dashboard/common/SelectGroup.vue";

const props = defineProps({
  full_main: {
    type: Object,
    required: true,
  },
  is_massive_edit: Boolean,
  is_edit: Boolean,
})
</script>

<template>
  <v-col cols="12" class="d-flex pa-0">
    <SelectGroup
      :main_object="full_main"
      filter_group_name="word_lists"
      main_collection_name="word_list"
      field="cluster"
      forced_level="subtype"
    />
    <v-text-field
      v-model="full_main.main_word"
      label="Palabra principal"
      class="mr-2"
      variant="outlined"
      style="width: 300px;"
    />
  </v-col>
  <v-col cols="12" class="px-0 pb-4 pt-0">
    <v-textarea
      v-model="full_main.alternative_words"
      label="Palabras alternativas"
      class="mr-2"
      variant="outlined"
      rows="1"
      auto-grow
      hint="Separadas por coma"
      persistent-hint
    />
  </v-col>

</template>

<style scoped>

</style>