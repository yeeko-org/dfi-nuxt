<script setup>
import {useWebStore} from '~/store/web.js'
const webStore = useWebStore()
import { storeToRefs } from 'pinia'
const { global_config } = storeToRefs(webStore)

// import { ref } from 'vue'
import { useDisplay } from 'vuetify'
const { xs, mdAndUp, smAndDown } = useDisplay()

const props = defineProps({
  blok: Object,
  is_editable: Boolean,
})

//       logo: null, // require("@/assets/logo.png"),
// const logo = ref(null)
// const menu = ref(false)
// const font_size = computed(() => xs.value ? 12 : 14)

const main_blok = computed(() => {
  if (props.blok) return props.blok
  // console.log('global_config 2', global_config.value)
  const global_c = global_config.value
  console.log('global_c', global_c)
  if (global_c && global_c.header && global_c.header.length > 0)
    return global_c.header[0]
})

const final_buttons = computed(() => {
  if (!main_blok.value) return []
  console.log("main_blok.buttons", main_blok.value.buttons)
  return main_blok.value.buttons || []
})

</script>

<template>
  <v-app-bar
    color="primary"
    height="90"
  >
    <div
      class="app-width2 d-flex align-center px-3"
    >
      <router-link to="/" class="d-flex align-center">
        <span class="text-white oswald text-h4 text-pinked">
          TRAVESÍAS FORZADAS
        </span>
<!--        <v-img-->
<!--          src="~/assets/nuevo_logo.png"-->
<!--          :height="xs ? 64 : 76"-->
<!--          :width="xs ? 64 : 76"-->
<!--        />-->
<!--        <v-img-->
<!--          class="ml-3"-->
<!--          src="~/assets/letras.png"-->
<!--          :height="xs ? 60 : 70"-->
<!--          :width="xs ? 190 : 220"-->
<!--        />-->
      </router-link>
    </div>
    <v-spacer></v-spacer>
    <div v-if="final_buttons.length">

      <StoryblokComponent
        v-for="blok in final_buttons"
        :key="blok._uid"
        :blok="blok"
        fixed_size="default"
        fixed_variant="text"
        fixed_color="white"
      ></StoryblokComponent>
    </div>
  </v-app-bar>
</template>

<style lang="scss">
  .header-xs{
    margin-left: -10px
  }
</style>
