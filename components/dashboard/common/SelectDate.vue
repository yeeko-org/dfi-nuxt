<script setup>

import dayjs from "dayjs";

const props = defineProps({
  init_date: {
    type: String,
    required: false,
  },
  label: {
    type: String,
    required: false,
    default: 'Fecha de la nota',
  },
  hide_details: Boolean,
  required: Boolean,
})

const rules = computed(() => {
  const rules = []
  if (props.required)
    rules.push(value => !!value || 'Campo requerido')
  return rules
})

const show_menu_date = ref(false)
const emits = defineEmits(['update-date'])

const human_date = computed(() => {
  if (!props.init_date) return ''
  return dayjs(props.init_date).format('DD/MM/YYYY')
})

const getDate = computed(() => {
  if (!props.init_date) return new Date()
  return dayjs(props.init_date).toDate()
})

function editDate(date) {
  console.log("edit date", date)
  // props.full_main.date = dayjs(date).format('YYYY-MM-DD')
  const new_date = dayjs(date).format('YYYY-MM-DD')
  emits('update-date', new_date)
  show_menu_date.value = false
}

</script>

<template>
  <v-menu
    v-model="show_menu_date"
    :nudge-right="40"
    :close-on-content-click="false"
    transition="scale-transition"
    min-width="290px"
    offset-y
  >
    <template v-slot:activator="{ props }">
      <v-text-field
        v-bind="props"
        :model-value="human_date"
        readonly
        :label="label"
        variant="outlined"
        class="mx-2"
        :hide-details="hide_details"
        style="max-width: 180px;"
        :rules="rules"
      >
      </v-text-field>
    </template>
    <v-date-picker
      :modelValue="getDate"
      @update:modelValue="editDate"
      color="accent"
      show-adjacent-months
      cancel-text="Cancelar"
      ok-text="Guardar"
      title="Selecciona una fecha"
    >
    </v-date-picker>
  </v-menu>
</template>

<style scoped>
</style>