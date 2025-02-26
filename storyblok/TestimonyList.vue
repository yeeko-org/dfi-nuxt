<script setup>
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { storeToRefs } from 'pinia'
import {useWebStore} from '~/store/web.js'

import { useDisplay } from 'vuetify'
const { sm, smAndUp, lgAndUp, mobile } = useDisplay()

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';

const modules = [Navigation, Pagination, Autoplay, EffectCoverflow];

dayjs.locale('es')
const webStore = useWebStore()
// Store setup and state
const { all_documents } = storeToRefs(webStore)

// Props
const props = defineProps({
  blok: Object,
  init_documents: Array,
})

onMounted(() => {
  console.log("mobile", mobile.value)
})

const testimonies = computed(() => {
  return props.blok.testimonies.map(testimony => {
    return {
      ...testimony,
      testimony: renderRichText(testimony.testimony),
    }
  })
})

</script>

<template>
  <div class="my-swiper" v-editable="blok">
    <Swiper
      :modules="modules"
      :slides-per-view="smAndUp ? 2.8 : (lgAndUp ? 3.2 : 1.2)"
      :space-between="10"
      :loop="false"
      :navigation="true"
      :pagination="{ clickable: true, bulletActiveClass: 'bg-white' }"
      :autoplay="{ delay: 3000, disableOnInteraction: true }"
    >
      <SwiperSlide
        v-for="testimony in testimonies"
        :key="testimony._uid"
        v-editable="testimony"
      >
        <v-card
          class="my-2 mx-2"
          _style="width: 100%;"
          rounded="xl"
        >
          <v-card-text class="text-body-1" v-html="testimony.testimony">

          </v-card-text>
          <v-card-text class="bg-pinked">
            <div class="text-h6 text-choco montse font-weight-bold">
              {{testimony.title}}
            </div>
            <div
              v-if="testimony.subtitle"
              class="text-subtitle-1 text-grey-lighten-2"
            >
              {{testimony.subtitle}}
            </div>
          </v-card-text>
        </v-card>
      </SwiperSlide>
    </Swiper>
  </div>

</template>

<style scoped>
.carousel-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}
.my-swiper {
  max-width: 100%;
}

@media (max-width: 500px) {
  .my-swiper {
    max-width: 400px;
  }
}
@media (max-width: 600px) {
  .my-swiper {
    max-width: 400px;
  }
}
</style>
