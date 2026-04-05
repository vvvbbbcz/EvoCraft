import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Vuetify from 'vite-plugin-vuetify'
import Fonts from 'unplugin-fonts/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
        Vuetify(),
        Fonts({
            fontsource: {
                families: [
                    {
                        name: 'Roboto',
                        weights: [100, 300, 400, 500, 700, 900],
                        styles: ['normal', 'italic'],
                    },
                ],
            },
        })
    ],
    root: __dirname,
    build: {
        outDir: path.resolve(__dirname, 'dist'),
        emptyOutDir: true
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('src', import.meta.url))
        },
        extensions: [
            '.js',
            '.json',
            '.jsx',
            '.mjs',
            '.ts',
            '.tsx',
            '.vue',
        ],
    },
    server: {
        port: 8080
    }
})
