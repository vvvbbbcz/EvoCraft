import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createVuetify } from 'vuetify'

import 'unfonts.css'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

const app = createApp(App)

app.use(router)

app.use(createVuetify({
    theme: {
        defaultTheme: 'system',
    },
}))

app.mount('#app')
