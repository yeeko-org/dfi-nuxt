<script setup>

</script>

<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      flat
      class="mt-n1"
      clipped-left
      height="48"
    >
      <v-toolbar-title class="d-flex align-center">
        <v-icon class="mr-3" color="white">
          dashboard
        </v-icon>
        <span class="text-white">
          Inicio de sesión
        </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <v-container
        class="pt-0"
        width="600"
      >
        <v-layout align-center justify-center >

          <client-only>
            <NuxtPage/>
          </client-only>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>
