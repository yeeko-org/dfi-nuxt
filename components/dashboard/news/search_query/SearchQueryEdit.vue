<script setup>

import {useMainStore} from '~/store/index'
import EditCommon from "~/components/dashboard/common/EditCommon.vue";
import WordListEdit from "~/components/dashboard/news/word_list/WordListEdit.vue";
const mainStore = useMainStore()
const { cats, schemas } = storeToRefs(mainStore)
const { getQuery } = mainStore

const props = defineProps({
  is_massive_edit: Boolean,
  is_edit: Boolean,
  full_main: {
    type: Object,
    required: true,
  },
})

const words = ["main_words", "complementary_words", "negative_words"]
const dialog_edit = ref(false)
const element_to_edit = ref(null)
const edit_type = ref(null)
const results = ref([])
const search_count = ref(0)
const exist_links_count = ref(0)

const main_word_lists = computed(() => {
  return cats.value.clusters.map(cluster => {
    const word_lists = cats.value.word_lists.filter(
      word_list => word_list.cluster === cluster.id)
    return {...cluster, word_lists: word_lists}
  })
})

const collection_data_word_list = computed(() => {
  return schemas.value.collections_dict['word_list']
})

function searchQuery() {
  console.log("searchQuery")
  const btn_save_id = `save_search_query-${props.full_main.id}`
  // emulate click in save button
  const el = document.getElementById(btn_save_id)
  el.click()
  getQuery(props.full_main.id).then(response => {
    console.log("response", response)
    results.value = response.search_entitys
    search_count.value = response.search_count
    exist_links_count.value = response.exist_links_count
    // props.full_main.query = response.query
  })
}

function editWordList(word_list) {
  element_to_edit.value = word_list
  edit_type.value = {key: 'edit', title: 'Editar lista de palabras'}
  dialog_edit.value = true
  console.log("editWordList", word_list)
}

function addWordList(cluster) {
  element_to_edit.value = {
    cluster: cluster.id,
  }
  edit_type.value = {key: 'add', title: 'Nueva lista de palabras'}
  dialog_edit.value = true
  console.log("addWordList", cluster)
}

function saveNewElement({res, is_new}) {
  console.log("saveNewElement", res, is_new)
  dialog_edit.value = false
}


</script>

<template>

  <v-col
    v-for="(cluster, index) in main_word_lists"
    cols="12"
    class="pa-0 align-center"
  >
    <span class="text-h6 mr-2 text-primary">
      {{cluster.name}}
    </span>

    <v-chip-group
      v-model="full_main[words[index]]"
      column
      multiple
    >
      <div v-for="word_list in cluster.word_lists" :key="word_list.id">
        <v-chip
          :value="word_list.id"
          filter
          class="mr-0 ml-2"
        >
          <template v-slot:close v-if="word_list.alternative_words">
            <v-icon
              v-tooltip="word_list.alternative_words"
              variant="outlined"
              @click="editWordList(word_list)"
            >
              subject
            </v-icon>
          </template>
          {{word_list.main_word}}
        </v-chip>
        <v-btn
          icon
          @click="editWordList(word_list)"
          size="small"
          class="ml-n2"
          variant="text"
        >
          <v-icon>edit</v-icon>
        </v-btn>
<!--        <span class="mr-2">-->
<!--          edit-->
<!--        </span>-->
      </div>
      <v-btn
        @click="addWordList(cluster)"
        class="align-self-center ml-2"
        color="accent"
        variant="outlined"
        prepend-icon="add"
      >
        Crear nuevo
      </v-btn>
    </v-chip-group>
  </v-col>
  <v-col cols="12" class="d-flex pa-0 mt-6">
    <v-textarea
      v-model="full_main.query"
      label="Consulta (generada automáticamente y solo lectura)"
      readonly
      rows="2"
      auto-grow
      class="mr-2"
      variant="outlined"
    />
  </v-col>
  <v-switch
    v-model="full_main.use_manual_query"
    label="Usar consulta manual (en lugar de la automática)"
    class="mr-2"
    color="accent"
  />
  <v-col cols="12" class="d-flex pa-0">
    <v-textarea
      v-model="full_main.manual_query"
      label="Consulta (manual)"
      class="mr-2"
      rows="2"
      auto-grow
      variant="outlined"
      hide-details
    />
  </v-col>
  <v-col cols="12" class="mb-n16">
    <v-card-actions>
      <v-btn
        color="accent"
        variant="outlined"
        size="large"
        @click="searchQuery"
      >
        Traer resultados
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-col>
<!--  <v-col cols="12" class="d-flex pa-0 mt-6" >-->
    <v-card
      class="pa-2"
      color="purple-lighten-4"
      v-if="search_count"
    >
      <v-card-title class="text-h6 title-no-wrap">
        {{search_count}} notas ({{exist_links_count}} previamente guardadas)
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            v-for="result in results"
            cols="12"
            class="pa-0"
          >
            <v-card class="pa-2 my-2">
              <v-card-subtitle class="d-flex align-center pb-0 pt-3">
                <span class="text-cyan-darken-2 text-subtitle-1 mr-2 font-weight-bold">
                  {{result.source.title}}
                </span>
                <span class="text-black text-caption">
                  ({{result.source.href}})
                </span>
              </v-card-subtitle>
              <v-card-title class="pt-0">
                <span class="title-no-wrap">
                  {{result.title}}
                </span>
                <v-btn
                  icon
                  :href="result.link"
                  target="_blank"
                  variant="tonal"
                  color="accent"
                  size="small"
                  class="ml-2"
                  v-tooltip="'Abrir en nueva pestaña'"
                >
                  <v-icon>open_in_new</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-actions>
                <span class="text-caption text-grey-darken-1">
                  Calificar como:
                </span>
                <v-btn
                  variant="elevated"
                  size="small"
                  color="success"
                >
                  Es válido
                </v-btn>
                <v-btn
                  variant="elevated"
                  size="small"
                  color="error"
                >
                  No es válido
                </v-btn>
                <v-btn
                  variant="elevated"
                  size="small"
                  color="warning"
                >
                  No estoy seguro
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
<!--  </v-col>-->
  <v-dialog
    v-model="dialog_edit"
    max-width="980"
  >
    <v-card v-if="element_to_edit">
      <v-card-title>
        {{edit_type.title}}
      </v-card-title>
      <EditCommon
        :full_main="element_to_edit"
        :collection_data="collection_data_word_list"
        @item-saved="saveNewElement"
      >
        <template v-slot:edit="{ full_main }">
          <WordListEdit
            :full_main="element_to_edit"
          />
        </template>
      </EditCommon>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.title-no-wrap{
  white-space: normal !important;
}
</style>