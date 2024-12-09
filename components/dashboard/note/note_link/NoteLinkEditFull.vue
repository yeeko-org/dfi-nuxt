<script setup>

import dayjs from "dayjs";
import {saveElement} from "~/composables/save_elements.js";

import {useMainStore} from "~/store/index.js";
import {storeToRefs} from "pinia";
import NoteContentSheet from "~/components/dashboard/note/note_content/NoteContentSheet.vue";
import ScrapeableChip from "~/components/dashboard/source/source/ScrapeableChip.vue";
import SourceDetail from "~/components/dashboard/source/source/SourceDetail.vue";
const mainStore = useMainStore()
const { savePreLink } = mainStore
const {
  cats,
  foreign_origin,
  invalid_valid_option
} = storeToRefs(mainStore)

const props = defineProps({
  is_massive_edit: Boolean,
  is_edit: Boolean,
  full_main: {
    type: Object,
    required: true,
  },
  is_test: Boolean,
})

const linkForm = ref(null)
// const note_content = ref(false)
const show_details = ref(false)
const sending_link = ref(false)
const snackbar = ref(false)
const errors = ref(null)

const emits = defineEmits(['item-saved'])

const rules = ref({
  required: value => !!value || "Campo requerido",
  defined: value => value !== undefined || "Debes seleccionar una opción",
})

async function sendLink(){
  errors.value = null
  const { valid } = await linkForm.value.validate()
  if (!valid) return
  sending_link.value = true
  console.log("full_main", props.full_main)
  const elem_id = props.full_main.id ? 'id' : 'key_name'
  const is_new = !Boolean(props.full_main[elem_id])
  const params = {
    "real_url": props.full_main.real_url,
    // "is_internal_dis": props.full_main.is_internal_dis,
    "valid_option": props.full_main.valid_option,
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
  // return props.full_main.is_internal_dis === 'invalid'
  const is_invalid_option = props.full_main.valid_option === invalid_valid_option.value.id
  return is_invalid_option
    ? Boolean(props.full_main.real_url) || 'Se requiere el link final'
    : true
})

const format_date = computed(() => {
  return dayjs(props.full_main.published_at).format("DD/MM/YY")
})

const show_dfi_buttons = computed(() => {
  // full_main.id && (full_main.source.national !== 'For' || show_details)
  const foreign_id = foreign_origin.value.id
  return (props.full_main.id
    && props.full_main.source.source_origin !== foreign_id)
    || show_details
})

const show_actions = computed(() => {
  return !props.full_main.note_contents?.length
    && props.full_main.valid_option
    && props.full_main.valid_option !== invalid_valid_option.value.id
})

const node_source = computed(() => {
  if (props.source_id){
    return all_nodes.value.sources.find(
      d => d.id === `subtype_${props.source_id}`)
  }
  return null
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
          <SourceDetail
            v-if="full_main.id"
            :source_id="full_main.source"
          />
          <SourceDetail
            v-else
            :pre_source="full_main.source_full"
            is_test
          />
<!--          <SourceD-->
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
          v-if="full_main.id && show_dfi_buttons"
        >
          <v-card-text
            v-if="show_dfi_buttons"
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
                v-model="full_main.valid_option"
                label="Válido"
                type="text"
                :rules="[rules.defined]"
              >
                <v-btn-toggle
                  v-model="full_main.valid_option"
                  :rules="[rules.defined]"
                  variant="elevated"
                  border
                  divided
                  color="grey-lighten-3"
                  @update:model-value="sendLink"
                >
                  <v-btn
                    v-for="option in cats.valid_options"
                    :key="option.id"
                    :color="option.color"
                    size="small"
                    :value="option.id"
                    :prepend-icon="option.icon"
                  >
                    {{option.name}}

                  </v-btn>

                </v-btn-toggle>
              </v-input>
              <span class="text-caption text-grey-darken-1">
                Clasificación de Nota si es de Desplazamiento interno
              </span>

            </div>

          </v-card-text>
          <v-card-actions
            v-if="show_actions"
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
            <NoteContentSheet

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