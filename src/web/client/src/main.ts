import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { createVuetify } from 'vuetify'
import { createI18n, useI18n } from 'vue-i18n'
import { io } from 'socket.io-client'

import 'unfonts.css'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import messages from './i18n'

const i18n = createI18n({
    legacy: false,
    locale: 'zhHans',
    fallbackLocale: 'en',
    messages,
})

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'system',
    },
    locale: {
        adapter: createVueI18nAdapter({ i18n, useI18n }),
    }
});

const app = createApp(App)

app.use(router)
app.use(vuetify)
app.use(i18n)

app.mount('#app')

export const socket = io('http://localhost:3000', {
    auth: {
        clientType: "human"
    }
})
