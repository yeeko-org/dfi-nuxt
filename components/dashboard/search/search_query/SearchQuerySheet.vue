<script setup>

import CalendarDisplay from "~/components/dashboard/search/search_query/CalendarDisplay.vue";
import PanelList from "~/components/dashboard/common/PanelList.vue";
import {useMainStore} from "~/store/index.js";
import {storeToRefs} from "pinia";
import SelectDate from "~/components/dashboard/common/SelectDate.vue";
import {example_response} from "~/composables/example.js";
import NoteLinkEditFull from "~/components/dashboard/note/note_link/NoteLinkEditFull.vue";
const mainStore = useMainStore()
const { schemas } = storeToRefs(mainStore)
const { sendQuery, saveSimple, searchApplyQuery } = mainStore

const props = defineProps({
  full_main: {
    type: Object,
    required: true,
  },
  show_details: Boolean,
  collection_data: Object,
})

const result_links = ref([])
const is_test = ref(false)
const loading = ref(false)
const search_count = ref(0)
const exist_links_count = ref(0)

const test_query = ref({
  when: 1,
  from_date: null,
  to_date: null,
})
const new_apply_query = ref({
  when: null,
  from_date: null,
  to_date: null,
})

const apply_query_collection = computed(() => {
  return schemas.value.collections_dict['apply_query']
})

function searchQuery() {
  is_test.value = true
  // if (test_query.when === 1){
  //   result_links.value = example_response
  //   search_count.value = example_response.length
  //   exist_links_count.value = 0
  //   return
  // }
  setTimeout(() => {
    sendQuery([props.full_main.id, test_query.value]).then(response => {
      console.log("response", response)
      result_links.value = response.note_links
      search_count.value = response.search_count
      exist_links_count.value = response.exist_links_count
    })
  }, 300)
}


function saveApplyQuery(send_search=false) {
  is_test.value = false
  loading.value = true
  search_count.value = 0
  exist_links_count.value = 0
  result_links.value = []
  const data = {
    from_date: new_apply_query.value.from_date,
    to_date: new_apply_query.value.to_date,
    search_query: props.full_main.id,
  }
  saveSimple(['apply_query', data]).then(response => {
    console.log("response saveApplyQuery", response)
    new_apply_query.value = response
    props.full_main.apply_queries.push(response)
    if (send_search)
      sendApplyQuery(response.id)
  })
}

function sendApplyQuery(apply_query_id) {
  searchApplyQuery(apply_query_id).then(response => {
    // console.log("sendApplyQuery", response)
    result_links.value = response.note_links
    search_count.value = response.search_count
    exist_links_count.value = response.exist_links_count
    loading.value = false
    // new_apply_query.value = response
  })
}


// function saveQuery() {
//   const btn_save_id = `save_search_query-${props.full_main.id}`
//   const el = document.getElementById(btn_save_id)
//   el.click()
// }

</script>

<template>

  <v-card class="mb-4" elevation="4" variant="elevated">
    <v-card-text>
      <CalendarDisplay
        v-if="full_main.apply_queries?.length"
        :apply_queries="full_main.apply_queries"
      />
    </v-card-text>
    <v-row class="ml-3 mr-0">
      <v-col cols="5" class="mb-2 pl-0">
        <v-card
          variant="outlined"
          class="pa-2 d-flex align-center"
          color="accent"
        >
          <v-row>
            <v-col>
              Experimenta con la consulta
            </v-col>
            <v-col cols="12" class="d-flex">

              <v-text-field
                v-model="test_query.when"
                label="Días atrás"
                class="mr-2"
                type="number"
                variant="outlined"
                style="max-width: 100px;"
                hide-details
                suffix="días"
              >
              </v-text-field>
              <v-spacer></v-spacer>
              <v-btn
                color="accent"
                variant="outlined"
                @click="searchQuery"
                class="ml-3"
              >
                Traer muestra
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

      </v-col>
      <v-col cols="7" class="mb-2 pl-0">
        <v-card
          variant="outlined"
          class="pa-2 d-flex align-center"
          color="accent"
        >

          <v-row>
            <v-col>
              Una vez definidas las palabras, busca y guarda noticias
            </v-col>
            <v-col cols="12" class="d-flex">
              <SelectDate
                :init_date="new_apply_query.from_date"
                label="Desde"
                class="mr-2"
                hide_details
                @update-date="new_apply_query.from_date = $event"
                required
              />
              <SelectDate
                :init_date="new_apply_query.to_date"
                label="Hasta"
                class="mr-2"
                hide_details
                @update-date="new_apply_query.to_date = $event"
                required
              />
              <v-spacer></v-spacer>
              <v-btn
                color="accent"
                variant="elevated"
                @click="saveApplyQuery(true)"
                :loading="loading"
              >
                Traer noticias
              </v-btn>
            </v-col>
          </v-row>

        </v-card>
      </v-col>
    </v-row>
    <v-card
      class="pa-2"
      color="purple-lighten-4"
      v-if="search_count"
      style="width: 100%;"
    >
      <v-card-title class="text-h6 title-no-wrap">
  <!--      {{search_count}} notas ({{exist_links_count}} previamente guardadas)-->
        {{search_count}} links a notas
      </v-card-title>
      <v-card-text>
        <v-row
          style="max-width: 100%;"
        >
          <NoteLinkEditFull
            v-for="link in result_links"
            :key="link.gnews_id"
            :full_main="link"
            :is_test="is_test"
          />
        </v-row>
      </v-card-text>
    </v-card>
    <v-card-title v-if="full_main.apply_queries?.length">
      Consultas realizadas:
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