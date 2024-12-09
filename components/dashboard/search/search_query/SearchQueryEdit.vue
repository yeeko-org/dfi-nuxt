<script setup>

import {useMainStore} from '~/store/index.js'
import EditCommon from "~/components/dashboard/common/EditCommon.vue";
import WordListEdit from "~/components/dashboard/search/word_list/WordListEdit.vue";
const mainStore = useMainStore()
const { cats, schemas } = storeToRefs(mainStore)
const { sendQuery, saveSimple, searchApplyQuery } = mainStore
import {example_response} from "~/composables/example.js";

import SelectDate from "~/components/dashboard/common/SelectDate.vue";
import NoteLinkEditFull from "~/components/dashboard/note/note_link/NoteLinkEditFull.vue";

const props = defineProps({
  is_massive_edit: Boolean,
  is_edit: Boolean,
  full_main: {
    type: Object,
    required: true,
  },
})

const words = ["main_words", "complementary_words", "negative_words"]

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
const dialog_edit = ref(false)
const element_to_edit = ref(null)
// const new_apply_query = ref(null)
const edit_type = ref(null)
const result_links = ref([])
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

function saveQuery() {
  const btn_save_id = `save_search_query-${props.full_main.id}`
  const el = document.getElementById(btn_save_id)
  el.click()
}

function saveApplyQuery(send_search=false) {
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
    // new_apply_query.value = response
  })
}


function searchQuery() {
  // console.log("searchQuery")
  saveQuery()
  if (test_query.when === 1){
    result_links.value = example_response
    search_count.value = example_response.length
    exist_links_count.value = 0
    return
  }
  setTimeout(() => {
    sendQuery([props.full_main.id, test_query.value]).then(response => {
      console.log("response", response)
      result_links.value = response.note_links
      search_count.value = response.search_count
      exist_links_count.value = response.exist_links_count
    })
  }, 300)
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

function updateDate(field, date) {
  test_query.value[field] = date
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
      <v-chip
        color="info"
        v-tooltip="cluster.description || 'Ayuda no definida'"
        append-icon="help"
      >
        help
      </v-chip>

    </span>

    <v-chip-group
      v-model="full_main[words[index]]"
      column
      multiple
      selected-class="font-weight-bold text-accent"
    >
      <div v-for="word_list in cluster.word_lists" :key="word_list.id">
        <v-chip
          :value="word_list.id"
          filter
          class="mr-0 ml-2"
        >
          <template v-slot:close v-if="word_list.query_words">
            <v-icon
              v-tooltip="word_list.query_words"
              variant="outlined"
              @click="editWordList(word_list)"
            >
              subject
            </v-icon>
          </template>
          {{word_list.name}}
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
    <v-sheet
      color="grey-lighten-4"
      class="pa-2"
      rounded="lg"
      style="width: 100%;"
    >
      <div class="text-lime-darken-3 text-subtitle-1">
        Consulta (generada automáticamente y solo lectura)
      </div>
      <span class="text-body-1">
        {{full_main.query}}
      </span>
    </v-sheet>
  </v-col>
  <v-col cols="12" class="d-flex pa-0 mt-2">
    <v-sheet
      color="grey-lighten-4"
      class="pa-2"
      rounded="lg"
      style="width: 100%;"
    >
      <div class="text-lime-darken-3 text-subtitle-1">
        Palabras para excluir después de la consulta
      </div>
      <span class="text-body-1">
        {{full_main.query_words_soft}}
      </span>
    </v-sheet>
  </v-col>
  <v-col cols="12" class="pa-0 my-3">
    <v-card variant="outlined" class="pa-3 d-flex" color="secondary">

      <v-switch
        v-model="full_main.use_manual_query"
        label="Usar consulta manual (en lugar de la automática)"
        class="mr-2"
        color="accent"
      />
      <v-textarea
        v-model="full_main.manual_query"
        label="Consulta (manual)"
        class="mr-2"
        color="black"
        bg-color="white"
        rows="2"
        auto-grow
        variant="outlined"
        hide-details
      />
    </v-card>
  </v-col>
  <v-col cols="6" class="mb-2 pl-0">
    <v-card
      variant="outlined"
      class="pa-2 d-flex align-center"
      color="accent"
    >
      <v-row>
        <v-col>
          Expermienta con la consulta
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
          <v-btn
            color="accent"
            variant="outlined"
            @click="searchQuery"
            class="ml-3"
          >
            Traer muestra
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="accent"
            variant="tonal"
            class="ml-2"
            @click="saveQuery"
          >
            Guardar
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

  </v-col>
  <v-col cols="6" class="mb-2 pl-0">
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
          >
            Traer noticias
          </v-btn>
        </v-col>
      </v-row>

    </v-card>
  </v-col>
<!--  <v-col cols="12" class="d-flex pa-0 mt-6" >-->
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
        />
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
img {
  display: none !important;
}
.turn180 {
  transform: rotate(180deg);
}
</style>