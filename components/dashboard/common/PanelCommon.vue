<script setup>
import {ref, computed, nextTick, shallowRef} from 'vue'
import { getElement } from "~/composables/save_elements.js";
import EditCommon from "~/components/dashboard/common/EditCommon.vue";


const props = defineProps({
  main: Object,
  collection_data: {
    type: Object,
    required: true,
  },
  sel: Object,
})

const full_main = ref({})
const edit_component = shallowRef('')
const edit_full_component = shallowRef('')
const route_key = computed(() => props.collection_data.app_label)
const snake_name = computed(() => props.collection_data.snake_name)
const edit_name = computed(() => `${props.collection_data.model_name}Edit`)
const edit_name_full = computed(() => `${props.collection_data.model_name}EditFull`)

const emits = defineEmits(['finish-open', 'item-saved'])

import(`~/components/dashboard/${route_key.value}/${snake_name.value}/${edit_name.value}.vue`)
  .then(module => {
    edit_component.value = module.default
  })
  .catch(e => {
    import(`~/components/dashboard/generic/EditGeneric.vue`).then(module => {
      edit_component.value = module.default
    })
  })


import(`~/components/dashboard/${route_key.value}/${snake_name.value}/${edit_name_full.value}.vue`)
  .then(module => {
    edit_full_component.value = module.default
  })
  .catch(e => {
    edit_full_component.value = null
  })


const openMain = () => {
  // const group = props.group
  // const real_group = group.parent ? `catalogs/${group.key}` : group.key
  const level = props.collection_data.level
  console.log('level', level)
  if (level === 'category_group'){
    emits('finish-open')
    return
  }
  const elem_id = props.main.id ? 'id' : 'key_name'
  getElement(props.collection_data, props.main[elem_id]).then((res) => {
    full_main.value = res
    emits('finish-open')
  })
}

const background_color = computed(() => {
  const coll = props.collection_data
  if (!coll)
    return 'secondary-lighten-5'
  const base_color = coll.color ||
    (coll.parent ? (coll.parent.color || 'blue-grey') : 'blue-grey')
  return `${base_color}-lighten-5`
})

const itemSaved = ({res, is_new}) => {
  full_main.value = res
  emits('item-saved', {res, is_new})
}


</script>

<template>
  <v-expansion-panel class="d-flex">
    <v-sheet
      :color="background_color"
      class="d-flex align-start flex-shrink-0"
    >
      <v-checkbox
        v-if="sel"
        v-model="sel.selected_elems"
        :value="main.id"
        _density="comfortable"
        hide-details
        class="pt-1 pl-1"
      />
      <div v-else style="width: 40px;">

      </div>
    </v-sheet>
    <v-sheet class="flex-grow-1" :color="background_color">
      <slot name="header" :main="main" :openMain="openMain">
        <v-expansion-panel-title>
          Cargando detalles...
        </v-expansion-panel-title>
      </slot>
      <v-expansion-panel-text
        v-if="full_main"
        class="ml-n16 mr-n6"
        :color="background_color"
      >
        <v-sheet
          :color="background_color"
          class="mt-n2 mb-n4 pa-3"
        >
          <component
            v-if="edit_full_component"
            :is="edit_full_component"
            :full_main="full_main"
            @item-saved="itemSaved"
          />

          <EditCommon
            v-else
            :full_main="full_main"
            :collection_data="collection_data"
            @item-saved="itemSaved"
          >
            <template v-slot:edit="{ full_main }">
              <component
                :is="edit_component"
                :full_main="full_main"
                is_edit
              />
            </template>
          </EditCommon>
          <slot name="sheet" :full_main="full_main">
            Contenido genérico 3
          </slot>
        </v-sheet>
      </v-expansion-panel-text>
    </v-sheet>
  </v-expansion-panel>
</template>

<style scoped>

</style>