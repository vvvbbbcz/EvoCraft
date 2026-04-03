<script setup lang="ts">
import { ref } from 'vue';

const drawer = ref(true);
</script>

<template>
    <v-app>
        <v-navigation-drawer v-model="drawer">
            <v-list-item to="/bots" title="Bots" />
            <v-list-item to="/skills" title="Skills" />
        </v-navigation-drawer>

        <v-app-bar>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        </v-app-bar>

        <v-main>
            <router-view v-slot="{ Component }">
                <v-fade-transition hide-on-leave>
                    <component :is="Component" />
                </v-fade-transition>
            </router-view>
        </v-main>
    </v-app>

    <!-- <header>
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

        <div class="wrapper">
            <HelloWorld msg="You did it!" />

            <nav>
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/about">About</RouterLink>
            </nav>
        </div>
    </header>

    <RouterView /> -->
</template>

<style scoped></style>
