<script setup>

import dayjs from "dayjs";
import {saveElement} from "~/composables/save_elements.js";

import {useMainStore} from "~/store/index.js";
import {storeToRefs} from "pinia";
import NoteContentEdit from "~/components/dashboard/news/note_content/NoteContentEdit.vue";
const mainStore = useMainStore()
const { savePreLink } = mainStore
const { schemas, cats, foreign_origin } = storeToRefs(mainStore)

const props = defineProps({
  is_massive_edit: Boolean,
  is_edit: Boolean,
  full_main: {
    type: Object,
    required: true,
  },
})

const linkForm = ref(null)
// const note_content = ref(false)
const show_details = ref(false)
const saving_source = ref(false)
const sending_link = ref(false)
const snackbar = ref(false)
const errors = ref(null)

const origin_choices = computed(() => {
  return cats.value.source_origins.filter(
    origin => origin.name !== 'Desconocido'
  )
})

const emits = defineEmits(['item-saved'])

const rules = ref({
  required: value => !!value || "Campo requerido",
  defined: value => value !== undefined || "Debes seleccionar una opción",
})

async function sendLink(){
  const { valid } = await linkForm.value.validate()
  if (!valid) return
  sending_link.value = true
  console.log("full_main", props.full_main)
  const elem_id = props.full_main.id ? 'id' : 'key_name'
  const is_new = !Boolean(props.full_main[elem_id])
  const params = {
    "real_url": props.full_main.real_url,
    "is_internal_dis": props.full_main.is_internal_dis,
  }
  // console.log("params", params)
  savePreLink([props.full_main.id, params]).then(response => {
    console.log("response", response)
    if (response.errors)
      errors.value = response.errors
    if (response.note_contents){
      // props.full_main.note_contents.concat(response.note_contents)
      response.note_contents.forEach(note_content => {
        props.full_main.note_contents.push(note_content)
      })
    }

    emits('item-saved', {'res': response, is_new})
    sending_link.value = false
    // note_content.value = response
  })
}

const rule_link = computed(() => {
  return props.full_main.is_internal_dis === 'invalid'
    ? true
    : Boolean(props.full_main.real_url) || 'Este campo es requerido'
})

const format_date = computed(() => {
  return dayjs(props.full_main.published_at).format("DD/MM/YY")
})

const source_collection_data = computed(() => {
  return schemas.value.collections_dict['source']
})

// const changeNational = (value) => {
const changeOrigin = (value) => {
  console.log("changeOrigin", value)
  // console.log("result.gnews_source", props.full_main.gnews_source)
  // // const gnews_source = props.full_main.gnews_source
  // console.log("result.source", props.full_main.source)
  const params = {
    // ...{"main_url": gnews_source.href, "name": gnews_source.title},
    ...props.full_main.source,
    source_origin: value,
    // national: value,
  }
  saveElement(source_collection_data.value, params).then((res) => {
    // console.log('res', res)
    // emits('item-saved', {res, is_new})
    snackbar.value = true
    saving_source.value = false
  })
}

const show_dfi_buttons = computed(() => {
  // full_main.id && (full_main.source.national !== 'For' || show_details)
  const foreign_id = foreign_origin.value.id
  return props.full_main.id
    && props.full_main.source.source_origin !== foreign_id
    || show_details
})


</script>

<template>
  <v-col
    v-if="full_main"
    cols="12"
    class="pa-0 pt-0"
  >
    <v-form ref="linkForm">
      <v-card class="pa-2 my-2">
        <v-card-subtitle class="d-flex align-center pb-0 pt-3">
          <span class="text-grey-darken-2 text-caption mr-3">
            {{format_date}}
          </span>
          <template v-if="full_main.source">
            <span class="text-cyan-darken-2 text-subtitle-1 mr-2 font-weight-bold">
              {{full_main.source.name}}
            </span>
            <span class="text-black text-caption">
              ({{full_main.source.main_url}})
            </span>
            <v-btn-toggle
              v-if="full_main.id"
              v-model="full_main.source.source_origin"
              color="accent"
              class="ml-2"
              border
              divided
              density="compact"
              variant="elevated"
              @update:model-value="changeOrigin"
            >
              <v-btn
                v-for="choice in origin_choices"
                :key="choice.id"
                :value="choice.id"
                :color="choice.color"
                :loading="saving_source"
                size="small"
              >
                {{choice.name}}
              </v-btn>
            </v-btn-toggle>

            <v-checkbox
              v-if="false"
              v-model="full_main.source.is_foreign"
              label="Extranjero"
              class="ml-2 text-black"
              base-color="black"
              color="accent"
              hide-details
              variant="elevated"
              indeterminate
            />
          </template>
        </v-card-subtitle>
        <v-card-title class="pt-0">
          <span class="title-no-wrap">
            {{full_main.title}}
          </span>
          <v-btn
            icon
            :href="full_main.gnews_url"
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
        <template
          v-if="show_dfi_buttons"
        >
          <v-card-text
            class="d-flex justify-space-between"
          >
            <v-text-field
              v-model="full_main.real_url"
              label="URL Link final"
              variant="outlined"
              type="url"
              :rules="[rule_link]"
              style="max-width: 600px;"
            />
            <div class="d-flex flex-column ml-2">
              <v-input
                v-model="full_main.is_internal_dis"
                label="Válido"
                type="text"
                :rules="[rules.defined]"
              >
                <v-btn-toggle
                  v-model="full_main.is_internal_dis"
                  :rules="[rules.defined]"
                  variant="elevated"
                  border
                  divided
                  color="grey-lighten-3"
                  @update:model-value="sendLink"
                >
                  <v-btn
                    color="success"
                    size="small"
                    value="valid"
                    prepend-icon="check"
                  >
                    Es válida
                  </v-btn>
                  <v-btn
                    color="error"
                    size="small"
                    value="invalid"
                    prepend-icon="close"
                  >
                    No es válida
                  </v-btn>
                  <v-btn
                    color="lime"
                    size="small"
                    value="unknown"
                    variant="outlined"
                    prepend-icon="help"
                  >
                    No estoy seguro
                  </v-btn>
                </v-btn-toggle>
              </v-input>
              <span class="text-caption text-grey-darken-1">
                Clasificación de Nota si es de Desplazamiento interno
              </span>

            </div>

          </v-card-text>
          <v-card-actions
            v-if="!full_main.note_contents?.length && full_main.is_internal_dis && full_main.is_internal_dis !== 'invalid'"
          >
            <v-spacer></v-spacer>
            <v-btn
              color="accent"
              variant="elevated"
              @click="sendLink(full_main)"
              :loading="sending_link"
            >
              Guardar link
            </v-btn>
          </v-card-actions>
        </template>
        <v-alert type="error" v-if="errors">
          <span
            v-for="error in errors"
            :key="error"
            class="text-caption"
          >
            - {{error}}
          </span>

        </v-alert>
        <div
          v-for="note_content in full_main.note_contents"
          :key="note_content.id"
        >
          <v-row>
            <NoteContentEdit

              :full_main="note_content"
            />
          </v-row>
          <v-card
            v-if="false"
            variant="outlined"
          >
            <v-card-title>
              Nota guardada
            </v-card-title>
            <v-card-text>
              <span v-html="note_content.content_full">
              </span>
            </v-card-text>
          </v-card>
        </div>
      </v-card>
    </v-form>
    <v-snackbar
      v-model="snackbar"
      color="success"
      location="right top"
      location-strategy="connected"
    >
      Se ha guardado la nota o la fuente
      <template v-slot:actions>
        <v-btn
          color="accent"
          variant="text"
          @click="snackbar = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-col>

</template>

<style scoped>
.title-no-wrap{
  white-space: normal !important;
}
</style>