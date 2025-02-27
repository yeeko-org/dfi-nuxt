<script setup>
import { resizeImg, transformImage } from '~/composables/storyblok_images.js'
import dayjs from "dayjs";
const props = defineProps({
  item: Object,
  blok: Object,
})

const color = computed(() => {
  if (!props.item.colors) return 'primary'
  return props.item.colors[0]
})


function openDoc(item) {
  if (!item.file_doc) return
  window.open(item.file_doc.filename, '_blank')
}

</script>

<template>
  <v-card
    v-if="item"
    color="secondary"
    v-editable="item"
    variant="elevated"
    class="rounded-0"
    rounded="xl"
    elevation="4"
  >
    <div class="d-flex flex-no-wrap flex-column flex-sm-row">
      <v-sheet
        color="secondary"
        class="full-height d-flex justify-center align-center pl-2"
        _style="{backgroundImage: `url(https://a.storyblok.com/f/327491/2550x3300/3994476a6e/fondo.png)`}"
      >
        <v-card
          _width="340"
          class="white-outlined _mr-2"
          color="transparent"
          rounded="lg"
        >

          <v-img
            :aspect-ratio="1"
            :src="resizeImg(item.cover, 140)"
            width="130"
            max-height="140"
            class="ma-2"
          ></v-img>
        </v-card>
      </v-sheet>
      <div>
        <v-card-subtitle
          class="text-subtitle-1 title-no-wrap pb-2 pt-3 text-black"
        >
          <v-chip
            v-if="!item.type_doc.includes('quincenal')"
            color="white"
            size="small"
            variant="outlined"
            class="mr-2"
          >
            {{ item.document_type.name }}
          </v-chip>
          <span
            v-if="!item.type_doc.includes('quincenal') && false"
            :class="`text-pinked`"
          >{{ item.type_doc }} |</span>
          <span class="text-white _text-grey-darken-2 montse text-body-2">
            {{ item.date_text }}
          </span>
        </v-card-subtitle>
        <v-card-subtitle
          v-if="item.subtitle"
          class="text-subtitle-1 title-no-wrap pb-0 font-weight-bold montse text-primary"
        >
          {{ item.subtitle }}
        </v-card-subtitle>
        <v-card-title
          class="text-h5 title-no-wrap pt-0 font-weight-bold montse pointer"
        >
          <NuxtLink
            :to="`/${item.full_slug}`"
            class="text-decoration-none text-white"
            _class="`text-${item.colors[2]}`"
          >
            {{ item.name }}
          </NuxtLink>
        </v-card-title>
        <v-card-actions class="px-3">
          <NuxtLink
            :to="`/${item.full_slug}`"
            class="text-decoration-none"
          >
            <v-btn
              rounded="lg"
              variant="elevated"
              color="accent"
              prepend-icon="visibility"
            >
              Visualizar
            </v-btn>
          </NuxtLink>
          <v-spacer></v-spacer>
          <v-btn
            _rounded="lg"
            variant="flat"
            color="accent"
            @click="openDoc(item)"
            icon="file_download"
            v-tooltip="'Decargar documento'"
          ></v-btn>
        </v-card-actions>

      </div>
    </div>
  </v-card>
<!--  <v-card-->
<!--    v-if="item"-->
<!--    :color="item.colors[2]"-->
<!--    v-editable="item"-->
<!--    variant="tonal"-->
<!--    class="rounded-0"-->
<!--    rounded="xl"-->
<!--  >-->
<!--    <div class="d-flex flex-no-wrap flex-column flex-sm-row">-->
<!--      <v-sheet-->
<!--        :color="item.colors[2]"-->
<!--        class="full-height d-flex justify-center align-center px-1"-->
<!--        :style="{backgroundImage: `url(https://a.storyblok.com/f/327491/2550x3300/3994476a6e/fondo.png)`}"-->
<!--      >-->
<!--        <v-card-->
<!--          _width="340"-->
<!--          class="white-outlined _mr-2"-->
<!--          color="transparent"-->
<!--          rounded="lg"-->
<!--        >-->

<!--          <v-img-->
<!--            :aspect-ratio="1"-->
<!--            :src="resizeImg(item.cover, 140)"-->
<!--            width="130"-->
<!--            max-height="140"-->
<!--            class="ma-2"-->
<!--          ></v-img>-->
<!--        </v-card>-->
<!--      </v-sheet>-->
<!--      <div>-->
<!--        <v-card-subtitle-->
<!--          class="text-subtitle-1 title-no-wrap pb-2 pt-3 text-black"-->
<!--        >-->
<!--          <v-chip-->
<!--            v-if="!item.type_doc.includes('quincenal')"-->
<!--            :color="item.colors[2]"-->
<!--            size="small"-->
<!--            class="mr-2"-->
<!--          >-->
<!--            {{ item.type_doc }}-->
<!--          </v-chip>-->
<!--          <span-->
<!--            v-if="!item.type_doc.includes('quincenal') && false"-->
<!--            :class="`text-${item.colors[2]}`"-->
<!--          >{{ item.type_doc }} |</span>-->
<!--          <span class="text-grey-darken-2 montse">-->
<!--            {{ item.date_text }}-->
<!--          </span>-->
<!--        </v-card-subtitle>-->
<!--        <v-card-subtitle-->
<!--          v-if="item.subtitle"-->
<!--          class="text-subtitle-1 title-no-wrap pb-0 font-weight-bold montse text-primary"-->
<!--        >-->
<!--          {{ item.subtitle }}-->
<!--        </v-card-subtitle>-->
<!--        <NuxtLink-->
<!--          :to="`/${item.full_slug}`"-->
<!--          class="text-decoration-none"-->
<!--          :class="`text-${item.colors[2]}`"-->
<!--        >-->
<!--          <v-card-title-->
<!--            class="text-h5 title-no-wrap pt-0 font-weight-bold montse pointer"-->
<!--          >-->
<!--            {{ item.name }}-->
<!--          </v-card-title>-->
<!--        </NuxtLink>-->
<!--        <v-card-actions>-->
<!--          <NuxtLink-->
<!--            :to="`/${item.full_slug}`"-->
<!--            class="text-decoration-none"-->
<!--          >-->
<!--            <v-btn-->
<!--              rounded="lg"-->
<!--              variant="tonal"-->
<!--              color="accent"-->
<!--              prepend-icon="visibility"-->
<!--            >-->
<!--              Visualizar-->
<!--            </v-btn>-->
<!--          </NuxtLink>-->
<!--          <v-spacer></v-spacer>-->
<!--          <v-btn-->
<!--            _rounded="lg"-->
<!--            variant="tonal"-->
<!--            color="accent"-->
<!--            @click="openDoc(item)"-->
<!--            icon="file_download"-->
<!--            v-tooltip="'Decargar documento'"-->
<!--          ></v-btn>-->
<!--        </v-card-actions>-->

<!--      </div>-->
<!--    </div>-->
<!--  </v-card>-->
</template>

<style scoped lang="scss">

.title-no-wrap{
  white-space: normal !important;
}

.white-outlined {
  border: 3px solid white !important;
}
</style>