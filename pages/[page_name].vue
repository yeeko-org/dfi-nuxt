<script setup>
const { $preview } = useNuxtApp()
const { page_name } = useRoute().params
// const version_sb = process.env.NUXT_PUBLIC_STORYBLOK_VERSION
const version = $preview ? 'draft' : 'published'
const story = await useAsyncStoryblok(
    `${page_name}`,
    { version: version },
{ customParent: 'https://app.storyblok.com' }
)

// console.log('story', story)

// useSeoMeta({
//
// })


</script>

<template>
  <StoryblokComponent
    v-if="story" :blok="story.content"
  />
</template>
