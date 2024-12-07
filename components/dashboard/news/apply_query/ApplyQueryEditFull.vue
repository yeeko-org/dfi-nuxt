<script setup >
const props = defineProps({
  is_massive_edit: Boolean,
  is_edit: Boolean,
  full_main: {
    type: Object,
    required: true,
  },
})
</script>

<template>

  <v-card class="mb-3 pa-3">
    <v-card-title>

      {{ full_main.from_date }} --> {{ full_main.to_date }}
    </v-card-title>
    <v-card-text v-if="full_main.has_error">
      <v-alert v-if="full_main.has_error" type="error">
        <span
          v-for="(error, index) in full_main.errors"
          :key="index"
        >
          -{{ error }}
        </span>
      </v-alert>
      <v-code>
        {{ full_main.last_feed }}
      </v-code>
    </v-card-text>
  </v-card>
</template>

<style scoped>

</style>