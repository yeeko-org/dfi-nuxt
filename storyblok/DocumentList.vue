<script setup>
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import {useWebStore} from '~/store/web.js'
import {getDocumentType} from "~/composables/documents.js";

import Document from "~/storyblok/Document.vue"

dayjs.locale('es')
const webStore = useWebStore()
// Store setup and state
const { all_documents } = storeToRefs(webStore)

// Props
const props = defineProps({
  blok: Object,
  init_documents: Array,
})

// Data equivalent with refs
const selected_months = ref([])
const selectedDocs = ref([])
const show_all = ref(false)

const final_display = computed(()=>{
  return props.blok
    ? Number(props.blok.init_display || 4)
    : 300
})

// Computed properties
const final_docs = computed(() => {
  // console.log("documents.value", documents.value)
  // return []
  const initialDocs = props.init_documents ||
    props.blok?.body || all_documents.value
  console.log("initialDocs", initialDocs)
  if (!initialDocs)
    return []
  return initialDocs
    .map(doc => {
      // console.log("doc", doc)
      doc.document_type = getDocumentType(doc.type_doc)
      doc.colors = doc.document_type.colors
      const date_start = dayjs(doc.start_date.substr(0, 10))
      doc.date_start = date_start
      doc.year = date_start.year()
      doc.month = date_start.month()
      doc.month_year = date_start.format('MMMM YYYY')
      let date_text = ''
      if (doc.document_type.has_range) {
        date_text = date_start.format('[Del] D [al] ')
        const date_end = dayjs(doc.end_date.substr(0, 10))
        date_text += `${date_end.format('D [de] MMMM [de] YYYY')}`
        doc.created_format = date_start.format('D [de] MMMM [de] YYYY')
      }
      else {
        date_text = date_start.format('D/MMM/YYYY')
        doc.created_format = date_start.format('D [de] MMMM [de] YYYY')
      }
      doc.date_text = date_text
      return doc
    })
    // .sort((x, y) => d3.descending(x.date_start, y.date_start))
})

const all_months = computed(() =>
  final_docs.value.reduce((arr, doc) =>(
    !arr.includes(doc.month_year) ? [...arr, doc.month_year] : arr
  ), [])
)

const all_types = computed(() =>
  final_docs.value.reduce((arr, doc) => (
    !arr.includes(doc.type_doc)
      ? [...arr, doc.type_doc]
      : arr), []
  ).map((type) => {
    const document_type = getDocumentType(type)
    return {
      ...document_type,
      key: type,
    }
    // colors: typeDocuments[type]
  })
)

const filteredDocs = computed(() => {
  const selected_month_list = selected_months.value.length
    ? all_months.value.filter((month, idx) => selected_months.value.includes(idx))
    : all_months.value
  const selectedDocList = selectedDocs.value.length
    ? all_types.value.filter((_, idx) => selectedDocs.value.includes(idx))
    : all_types.value
  let filtered_docs = final_docs.value.filter(
    doc =>
      selectedDocList.some(selDoc => selDoc.key === doc.type_doc) &&
      selected_month_list.includes(doc.month_year)
  )
  console.log('filtered_docs', filtered_docs)
  if (!show_all.value)
    return filtered_docs.slice(0, final_display.value)
  return filtered_docs

})
</script>

<template>
  <SectionHeader
    v-for="blok in blok?.header"
    :key="blok._uid"
    :blok="blok"
    class="px-3"
  />
  <v-card
    v-editable="blok"
    style="width: 100%"
    class="px-3 pb-4"
    variant="flat"
    color="transparent"
  >
<!--    <div-->
<!--      class="d-flex justify-center align-center flex-column flex-md-row"-->
<!--    >-->

<!--      <div-->
<!--        class="mr-2 text-sm-subtitle-1 text-body-1 text-grey-darken-2"-->
<!--        v-if="smAndUp"-->
<!--      >-->
<!--        Filtrar meses:-->
<!--      </div>-->
<!--      <v-chip-group-->
<!--        v-if="smAndUp"-->
<!--        multiple-->
<!--        v-model="selected_months"-->
<!--      >-->
<!--        <v-chip-->
<!--          v-for="month in all_months"-->
<!--          :key="month"-->
<!--          class="mx-1"-->
<!--          filter-->
<!--          variant="outlined"-->
<!--          color="accent"-->
<!--        >-->
<!--          {{ month }}-->
<!--        </v-chip>-->
<!--      </v-chip-group>-->

<!--      <span class="mr-2 text-subtitle-1 ml-4">Filtrar documentos:</span>-->
<!--      <v-chip-group multiple v-model="selectedDocs">-->
<!--        <v-chip-->
<!--          v-for="typeDoc in all_types"-->
<!--          :key="typeDoc.name"-->
<!--          class="mx-1"-->
<!--          filter-->
<!--          variant="outlined"-->
<!--          :color="typeDoc.colors[2]"-->
<!--        >-->
<!--          {{ typeDoc.name }}-->
<!--        </v-chip>-->
<!--      </v-chip-group>-->
<!--    </div>-->
    <v-row class="my-3">
      <v-col
        v-for="(item, idx) in filteredDocs"
        :key="item._uid"
        cols="12"
        md="6"
      >
        <Document
          :item="item"
        />
      </v-col>
    </v-row>
<!--    <template-->
<!--      v-if="!show_all && (blok?.init_display || 999) < final_docs.length"-->
<!--    >-->

      <v-card-actions
        v-if="!show_all && (final_display < final_docs.length)"
      >
        <v-spacer></v-spacer>
        <v-btn-primary
          color="accent"
          variant="outlined"
          append-icon="expand_more"
          @click="show_all = true"
        >
          Mostrar más
        </v-btn-primary>
        <v-spacer></v-spacer>
      </v-card-actions>
<!--    </template>-->
  </v-card>
</template>
