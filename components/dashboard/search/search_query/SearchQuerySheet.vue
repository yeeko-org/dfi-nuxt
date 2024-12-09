<script setup>

import CalendarDisplay from "~/components/dashboard/search/search_query/CalendarDisplay.vue";
import PanelList from "~/components/dashboard/common/PanelList.vue";
import {useMainStore} from "~/store/index.js";
import {storeToRefs} from "pinia";
const mainStore = useMainStore()
const { schemas } = storeToRefs(mainStore)

const props = defineProps({
  full_main: {
    type: Object,
    required: true,
  },
  show_details: Boolean,
  collection_data: Object,
})

const apply_query_collection = computed(() => {
  return schemas.value.collections_dict['apply_query']
})

</script>

<template>

  <v-card class="mb-4" elevation="4" variant="elevated">
    <v-card-text>
      <CalendarDisplay
        v-if="full_main.apply_queries?.length"
        :apply_queries="full_main.apply_queries"
      />
    </v-card-text>
    <v-card-title>
      ApplyQuery
    </v-card-title>
    <v-card-text>
      <PanelList
        :results="full_main.apply_queries"
        :collection_data="apply_query_collection"
        :show_details="true"
      />
    </v-card-text>

  </v-card>
</template>

<style scoped>

</style>