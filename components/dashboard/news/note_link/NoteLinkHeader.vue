<script setup>

import HeaderCommon from "~/components/dashboard/generic/HeaderCommon.vue";
import {useMainStore} from "~/store/index.js";
import {storeToRefs} from "pinia";
import SelectGroup from "~/components/dashboard/common/SelectGroup.vue";
const mainStore = useMainStore()
const { cats, foreign_origin, all_nodes } = storeToRefs(mainStore)
const props = defineProps({
  main: Object,
  collection_data: Object,
  show_details: {
    type: Boolean,
    default: false,
  },
})


const internal_dis_options = [
  {
    value: 'unknown',
    text: 'No estoy seguro',
    icon: 'help',
    color: 'lime'
  },
  {
    value: 'valid',
    text: 'Es válido',
    icon: 'check',
    color: 'success'
  },
  {
    value: 'invalid',
    text: 'No es válido',
    icon: 'close',
    color: 'error'
  },
]

const dont_need = computed(() => {
  const node = all_nodes.value.sources.find(
    d => d.id === `subtype_${props.main.source}`)
  // console.log("node", node)
  if (node){

    console.log("node", node)
    return node.parent.data.name === 'Extranjera'
  }
  else
    return false
  // return 2

})

const internal_dis_obj = computed(() => {
  return internal_dis_options.find((opt) => opt.value === props.main.is_internal_dis)
})

</script>

<template>
  <HeaderCommon
    :main="main"
    :show_details="show_details"
    :collection_data="collection_data"
  >
    <template #details>
<!--      <div style="max-width: 400px;" v-if="dfi_obj">-->
      <div style="max-width: 400px;" class="d-flex">
        <div>
          <v-chip
            v-if="internal_dis_obj"
            :color="internal_dis_obj.color"
            class="mr-2"
            size="small"
            :prepend-icon="internal_dis_obj.icon"
          >
            {{ internal_dis_obj.text }}
          </v-chip>
          <v-chip
            v-else-if="dont_need"
            class="mr-2"
            size="small"
            color="grey"
            label
          >
            No necesario
          </v-chip>
          <v-chip
            v-else
            class="mr-2"
            size="small"
            color="warning"
            label
            prepend-icon="warning"
          >
            No clasificado
          </v-chip>
        </div>

        <div class="d-flex align-center">
          <SelectGroup
            filter_group_name="sources"
            :main_object="main"
            main_collection_name="source"
            is_display
          />
        </div>

      </div>
    </template>
  </HeaderCommon>
</template>

<style scoped>

</style>