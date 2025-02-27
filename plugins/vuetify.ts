// import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import { aliases, md } from 'vuetify/iconsets/md'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { VDateInput } from "vuetify/labs/VDateInput"

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components: {
      VDateInput
    },
    theme: {
      themes: {
        light: {
          dark: false,
          colors: {
            primary: "#671220",
            secondary: "#94607d",
            accent: "#c72d67",
            pinky: "#c72d67",
            pinked: "#f6b6bd",
            choco: "#3A0811",
          }
        }
      }
    },
    icons: {
      defaultSet: 'md',
      aliases,
      sets: {
        md,
      }
    },
    date: {
      locale: {
        'es-MX': {
          firstDayOfWeek: 0,
          masks: {
              input: 'DD/MM/YYYY',
              date: 'DD/MM/YYYY',
              time: 'HH:mm',
              datetime: 'DD/MM/YYYY HH:mm',
          },
        },
      },
    }
  })
  app.vueApp.use(vuetify)
})