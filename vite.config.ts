import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
    ],
    root: path.resolve(__dirname, 'src/web/client'),
    build: {
        outDir: path.resolve(__dirname, 'src/web/client/dist'),
        emptyOutDir: true
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('src/web/client/src', import.meta.url))
        },
    },
})
