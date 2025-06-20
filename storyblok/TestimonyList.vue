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

import { Navigation, Autoplay, EffectCoverflow } from 'swiper/modules';

const modules = [Navigation, Autoplay, EffectCoverflow];

dayjs.locale('es')
const webStore = useWebStore()
// Store setup and state
const { all_documents } = storeToRefs(webStore)

// Props
const props = defineProps({
  blok: Object,
  init_documents: Array,
})

// Swiper instance reference
const swiperRef = ref(null)

// Navigation methods
const slidePrev = () => {
  if (swiperRef.value) {
    swiperRef.value.slidePrev()
  }
}

const slideNext = () => {
  if (swiperRef.value) {
    swiperRef.value.slideNext()
  }
}

// Handle swiper instance
const onSwiper = (swiper) => {
  swiperRef.value = swiper
}

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
  <div v-editable="blok">
    <div class="mt-n14 float-right">
      <v-btn
        @click="slidePrev"
        icon
        variant="outlined"
        class="mr-6"
      >
        <v-icon>keyboard_arrow_left</v-icon>
      </v-btn>
      <v-btn
        @click="slideNext"
        icon
        variant="outlined"
        class="nav-button ml-2"
      >
        <v-icon>keyboard_arrow_right</v-icon>
      </v-btn>
    </div>
    <Swiper
      @swiper="onSwiper"
      :modules="modules"
      :slides-per-view="smAndUp ? 1.8 : (lgAndUp ? 1.8 : 1.2)"
      :space-between="10"
      :loop="false"
      :navigation="false"
      :pagination="{ clickable: true, bulletActiveClass: 'bg-white' }"
      :autoplay="{ delay: 3000, disableOnInteraction: true }"
      class="my-swiper"
    >
      <SwiperSlide
        v-for="testimony in testimonies"
        :key="testimony._uid"
        v-editable="testimony"
      >
        <v-card
          class="my-2 mx-2"
          variant="text"
        >
          <v-card-text class="text-h6" v-html="testimony.testimony">
          </v-card-text>
          <v-card-text>
            <div class="text-subtitle-1 text-choco oswald font-weight-bold">
              {{ testimony.title }}
            </div>
            <div
              v-if="testimony.subtitle"
              class="text-subtitle-1 text-grey-lighten-2"
            >
              {{ testimony.subtitle }}
            </div>
          </v-card-text>
          <v-card-actions class="px-0">
            <v-btn-text
              _to="`/${item.full_slug}`"
              variant="text"
              color="accent"
              _prepend-icon="visibility"
              _block="!mdAndUp"
              class="pl-3 pr-3"
            >
              Testimonio completo
            </v-btn-text>
          </v-card-actions>

        </v-card>
      </SwiperSlide>
    </Swiper>
  </div>
  <div v-if="false" class="my-swiper" v-editable="blok">
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
          variant="text"
          _style="width: 100%;"
        >
          <v-card-text class="text-h6" v-html="testimony.testimony">

          </v-card-text>
          <v-card-text>
            <div class="text-subtitle-1 text-choco oswald font-weight-bold">
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
